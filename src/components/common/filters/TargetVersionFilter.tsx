import { useState, useEffect } from 'react';
import { SearchableSelect, Option } from '@/components/ui/SearchableSelect';
import { redmineApi, RedmineVersion } from '@/lib/api/redmine.service';
import { toast } from 'sonner';

interface TargetVersionFilterProps {
  value: string;
  onChange: (value: string) => void;
  onVersionIdChange?: (versionId: number | null) => void;
}

export function TargetVersionFilter({ value, onChange, onVersionIdChange }: TargetVersionFilterProps) {
  const [versions, setVersions] = useState<RedmineVersion[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchVersions = async () => {
      setLoading(true);
      try {
        const response = await redmineApi.getAllVersions({ limit: 100 });
        console.log(response);
        if (response) {
          // Sort versions: 
          // 1. Status: Open first, Closed last
          // 2. Due Date: Ascending (Earliest first)
          const sortedVersions = response.sort((a, b) => {
            // Status Priority
            const getStatusPriority = (status: string) => {
              if (status === 'open') return 0;
              if (status === 'closed') return 2;
              return 1;
            };

            const priorityA = getStatusPriority(a.status);
            const priorityB = getStatusPriority(b.status);

            if (priorityA !== priorityB) {
              return priorityA - priorityB;
            }

            // Due Date Priority (Ascending)
            if (a.due_date && b.due_date) {
              return a.due_date.localeCompare(b.due_date);
            }
            // Versions with due_date come before those without
            if (a.due_date) return -1;
            if (b.due_date) return 1;

            return 0;
          });
          
          setVersions(sortedVersions);
          
          // Auto-select version based on most recent past release
          if (!value) {
            console.log('🔍 Auto-selecting version from', response.length, 'total versions');
            const now = new Date();
            
            // Step 1: Find all versions with "定期リリース" in description that have past due_dates
            const pastReleases = response.filter(version => {
              const hasTargetDescription = version.description?.includes('定期リリース');
              if (!hasTargetDescription || !version.due_date) return false;
              
              const dueDate = new Date(version.due_date);
              return dueDate < now; // Only past dates
            });
            
            console.log('📅 Past releases found:', pastReleases.length);
            
            // Step 2: Find the most recent past release (latest past due_date)
            let latestPastRelease: RedmineVersion | null = null;
            if (pastReleases.length > 0) {
              latestPastRelease = pastReleases.reduce((latest, current) => {
                const latestDate = new Date(latest.due_date!);
                const currentDate = new Date(current.due_date!);
                return currentDate > latestDate ? current : latest;
              });
              console.log('✅ Latest past release:', latestPastRelease?.name);
            }
            
            // Step 3: Find open versions with "定期リリース" that have future due_dates
            const eligibleVersions = response.filter(version => {
              const isOpen = version.status === 'open';
              const hasTargetDescription = version.description?.includes('定期リリース');
              const hasDueDate = !!version.due_date;
              
              if (!isOpen || !hasTargetDescription || !hasDueDate) return false;
              
              // Optional: could also check if due_date is in the future
              // const dueDate = new Date(version.due_date);
              // return dueDate >= now;
              
              return true;
            });
            
            console.log('✅ Eligible open versions:', eligibleVersions.length);
            
            // Step 4: Select the version with due_date nearest to the latest past release
            if (eligibleVersions.length > 0) {
              let defaultVersion: RedmineVersion;
              
              if (latestPastRelease) {
                // Find the next upcoming release AFTER the latest past release
                const referenceDate = new Date(latestPastRelease.due_date!);
                
                // Filter for versions with due_date AFTER the latest past release
                const futureVersions = eligibleVersions.filter(version => {
                  const versionDate = new Date(version.due_date!);
                  return versionDate > referenceDate;
                });
                
                if (futureVersions.length > 0) {
                  // Select the earliest future release (soonest after the past release)
                  defaultVersion = futureVersions.reduce((earliest, current) => {
                    const earliestDate = new Date(earliest.due_date!);
                    const currentDate = new Date(current.due_date!);
                    return currentDate < earliestDate ? current : earliest;
                  });
                } else {
                  // No future releases found, fallback to earliest open version
                  defaultVersion = eligibleVersions.reduce((earliest, current) => {
                    const earliestDate = new Date(earliest.due_date!);
                    const currentDate = new Date(current.due_date!);
                    return currentDate < earliestDate ? current : earliest;
                  });
                }
              } else {
                // No past release found, just pick the earliest open version
                defaultVersion = eligibleVersions.reduce((earliest, current) => {
                  const earliestDate = new Date(earliest.due_date!);
                  const currentDate = new Date(current.due_date!);
                  return currentDate < earliestDate ? current : earliest;
                });
              }
              
              console.log('🎯 Auto-selected version:', defaultVersion.name, 'ID:', defaultVersion.id);
              onChange(defaultVersion.name);
              if (onVersionIdChange) {
                onVersionIdChange(defaultVersion.id);
              }
            } else {
              console.warn('⚠️ No eligible versions found for auto-selection');
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch versions:', error);
        toast.error('Failed to load target versions');
        setVersions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVersions();
  }, [value, onChange, onVersionIdChange]);

  const options: Option[] = versions.map(version => ({
    value: version.name,
    label: version.name,
  }));

  const handleChange = (newValue: string) => {
    onChange(newValue);
    
    // Find the version and notify parent of the ID
    if (onVersionIdChange) {
      if (newValue === '') {
        onVersionIdChange(null);
      } else {
        const selectedVersion = versions.find(v => v.name === newValue);
        if (selectedVersion) {
          onVersionIdChange(selectedVersion.id);
        }
      }
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Target Version:
      </label>
      <div className="w-48">
        <SearchableSelect
          options={options}
          value={value}
          onChange={handleChange}
          placeholder={loading ? 'Loading...' : 'Select a version'}
          isDisabled={loading}
        />
      </div>
    </div>
  );
}
