import React from 'react';
import { Checkbox } from "@heroui/react";
import { BaseFieldProps } from './types';

export function CheckboxField({ field, value, onChange, isEditMode }: BaseFieldProps) {
    const isChecked = value === '1' || value === 1 || value === true || value === 'true';

    if (!isEditMode) {
        return (
            <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">{field.name}</label>
                <div className="font-medium text-gray-900 dark:text-white whitespace-pre-wrap">{isChecked ? 'Yes' : 'No'}</div>
            </div>
        );
    }

    return (
        <Checkbox
            isSelected={isChecked}
            onValueChange={(checked) => onChange(checked ? '1' : '0')}
            className="pt-6"
        >
            {field.name}
        </Checkbox>
    );
}
