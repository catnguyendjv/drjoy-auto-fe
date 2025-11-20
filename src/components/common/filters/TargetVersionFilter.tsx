import { useState, useEffect } from 'react';
import { SearchableSelect, Option } from '@/components/ui/SearchableSelect';
import { redmineApi, RedmineVersion } from '@/lib/api/redmine.service';
import { toast } from 'sonner';

interface TargetVersionFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export function TargetVersionFilter({ value, onChange }: TargetVersionFilterProps) {
  const [versions, setVersions] = useState<RedmineVersion[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchVersions = async () => {
      setLoading(true);
      try {
        const response = await redmineApi.getAllVersions({ limit: 100 });
        console.log(response);
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

  const options: Option[] = [
    { value: '', label: 'All Versions' },
    ...versions.map(version => ({
      value: version.name,
      label: version.name,
    })),
  ];

  return (
    <div className="flex items-center space-x-2">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Target Version:
      </label>
      <div className="w-48">
        <SearchableSelect
          options={options}
          value={value}
          onChange={onChange}
          placeholder={loading ? 'Loading...' : 'All Versions'}
          isDisabled={loading}
        />
      </div>
    </div>
  );
}
