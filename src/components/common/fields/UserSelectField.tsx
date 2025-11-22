import { useMemo } from 'react';
import { SearchableSelect, Option } from '@/components/ui/SearchableSelect';
import { REDMINE_USERS } from '@/lib/redmine-users';
import { BaseFieldProps } from '../fields/types';

interface UserSelectFieldProps extends BaseFieldProps {
  allowEmpty?: boolean;
  emptyLabel?: string;
}

export function UserSelectField({ 
  field, 
  value, 
  onChange, 
  isEditMode, 
  allowEmpty = true,
  emptyLabel = 'None'
}: UserSelectFieldProps) {
  const options: Option[] = useMemo(() => {
    const userOptions = REDMINE_USERS.map(user => ({
      value: user.id.toString(),
      label: `${user.firstname} ${user.lastname}`,
    }));
    
    return allowEmpty 
      ? [{ value: '', label: emptyLabel }, ...userOptions]
      : userOptions;
  }, [allowEmpty, emptyLabel]);

  const selectedUser = useMemo(() => {
    if (!value) return null;
    const userId = typeof value === 'number' ? value : parseInt(String(value));
    const user = REDMINE_USERS.find(u => u.id === userId);
    return user ? `${user.firstname} ${user.lastname}` : 'Unknown';
  }, [value]);

  if (!isEditMode) {
    return (
      <div>
        <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
          {field.name}
        </label>
        <div className="font-medium text-gray-900 dark:text-white">
          {selectedUser || emptyLabel}
        </div>
      </div>
    );
  }

  return (
    <div>
      <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
        {field.name}
      </label>
      <SearchableSelect
        options={options}
        value={String(value || '')}
        onChange={(val) => onChange(val)}
        placeholder={`Select ${field.name.toLowerCase()}`}
      />
    </div>
  );
}
