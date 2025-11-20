import React from 'react';
import { BaseFieldProps } from './types';

export function CheckboxField({ field, value, onChange, isEditMode }: BaseFieldProps) {
    const checkboxClassName = "h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded";

    const isChecked = value === '1' || value === 1 || value === true || value === 'true';

    if (!isEditMode) {
        return (
            <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">{field.name}</label>
                <div className="font-medium text-gray-900 dark:text-white whitespace-pre-wrap">
                    {isChecked ? 'Yes' : 'No'}
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center pt-6">
            <input
                type="checkbox"
                checked={isChecked}
                onChange={(e) => onChange(e.target.checked ? '1' : '0')}
                className={checkboxClassName}
                id={`cf-${field.id}`}
            />
            <label htmlFor={`cf-${field.id}`} className="ml-2 block text-sm text-gray-900 dark:text-white cursor-pointer">
                {field.name}
            </label>
        </div>
    );
}
