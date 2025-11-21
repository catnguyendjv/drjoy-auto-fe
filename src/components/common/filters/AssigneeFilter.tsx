import { useMemo } from 'react';
import { SearchableSelect, Option } from '@/components/ui/SearchableSelect';
import { REDMINE_USERS } from '@/lib/redmine-users';

interface AssigneeFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export function AssigneeFilter({ value, onChange }: AssigneeFilterProps) {
  const options: Option[] = useMemo(() => [
    { value: '', label: 'All Assignees' },
    ...REDMINE_USERS.map(user => ({
      value: user.id.toString(),
      label: `${user.firstname} ${user.lastname}`,
    })),
  ], []);

  return (
    <div className="flex items-center space-x-2">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Assignee:
      </label>
      <div className="w-48">
        <SearchableSelect
          options={options}
          value={value}
          onChange={onChange}
          placeholder="All Assignees"
        />
      </div>
    </div>
  );
}
