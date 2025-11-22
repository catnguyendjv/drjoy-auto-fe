import { useState, useEffect, useMemo } from 'react';
import { SearchableSelect, Option } from '@/components/ui/SearchableSelect';
import { redmineApi, RedmineVersion } from '@/lib/api/redmine.service';
import { toast } from 'sonner';

interface TargetVersionSelectFieldProps {
  value?: number | string;
  onChange: (versionId: number | null) => void;
  isEditMode: boolean;
  label?: string;
}

export function TargetVersionSelectField({ value, onChange, isEditMode, label = 'Target Version' }: TargetVersionSelectFieldProps) {
  const [versions, setVersions] = useState<RedmineVersion[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchVersions = async () => {
      setLoading(true);
      try {
        const response = await redmineApi.getAllVersions({ limit: 100 });
        if (response) {
          setVersions(response);
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
  }, []);

  const options: Option[] = useMemo(() => [
    { value: '', label: 'None' },
    ...versions.map(version => ({
      value: version.id.toString(),
      label: version.name,
    }))
  ], [versions]);

  const selectedVersion = useMemo(() => {
    if (!value) return null;
    const versionId = typeof value === 'number' ? value : parseInt(value);
    const version = versions.find(v => v.id === versionId);
    return version?.name || 'Unknown';
  }, [value, versions]);

  if (!isEditMode) {
    return (
      <div>
        <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
          {label}
        </label>
        <div className="font-medium text-gray-900 dark:text-white">
          {selectedVersion || 'None'}
        </div>
      </div>
    );
  }

  return (
    <div>
      <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
        {label}
      </label>
      <SearchableSelect
        options={options}
        value={value?.toString() || ''}
        onChange={(val) => {
          if (val === '') {
            onChange(null);
          } else {
            onChange(parseInt(val));
          }
        }}
        placeholder={loading ? 'Loading...' : 'Select a version'}
        isDisabled={loading}
      />
    </div>
  );
}
