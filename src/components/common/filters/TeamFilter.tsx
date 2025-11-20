import { useMemo } from 'react';
import { SearchableSelect, Option } from '@/components/ui/SearchableSelect';

import { TEAM_OPTIONS } from '@/lib/redmine-custom-fields';

interface TeamFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export function TeamFilter({ value, onChange }: TeamFilterProps) {
  const options: Option[] = useMemo(() => [
    { value: '', label: 'All Teams' },
    ...TEAM_OPTIONS.filter(opt => opt.value !== '未選択').map(team => ({
      value: team.value,
      label: team.label,
    })),
  ], []);

  return (
    <div className="flex items-center space-x-2">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Team:
      </label>
      <div className="w-48">
        <SearchableSelect
          options={options}
          value={value}
          onChange={onChange}
          placeholder="All Teams"
        />
      </div>
    </div>
  );
}
