import { useMemo } from 'react';
import { SearchableSelect, Option } from '@/components/ui/SearchableSelect';
import { REDMINE_USERS } from '@/lib/redmine-users';

interface AssigneeSelectFieldProps {
  value?: number | string;
  onChange: (value: number | null) => void;
  isEditMode: boolean;
  label?: string;
}

export function AssigneeSelectField({ value, onChange, isEditMode, label = 'Assignee' }: AssigneeSelectFieldProps) {
  const options: Option[] = useMemo(() => [
    { value: '', label: 'Unassigned' },
    ...REDMINE_USERS.map(user => ({
      value: user.id.toString(),
      label: `${user.firstname} ${user.lastname}`,
    })),
  ], []);

  const selectedUser = useMemo(() => {
    if (!value) return null;
    const userId = typeof value === 'number' ? value : parseInt(value);
    const user = REDMINE_USERS.find(u => u.id === userId);
    return user ? `${user.firstname} ${user.lastname}` : 'Unknown';
  }, [value]);

  if (!isEditMode) {
    return (
      <div>
        <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
          {label}
        </label>
        <div className="font-medium text-gray-900 dark:text-white">
          {selectedUser || 'Unassigned'}
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
        placeholder="Select assignee"
      />
    </div>
  );
}
