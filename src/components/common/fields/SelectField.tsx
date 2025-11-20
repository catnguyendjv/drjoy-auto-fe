import React from 'react';
import { BaseFieldProps } from './types';

export function SelectField({ field, value, onChange, isEditMode, options, className }: BaseFieldProps) {
    const inputClassName = className || "w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent";

    if (!isEditMode) {
        let displayValue: React.ReactNode = value;
        if (Array.isArray(value)) {
            displayValue = value.join(', ');
        }
        
        return (
            <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">{field.name}</label>
                <div className="font-medium text-gray-900 dark:text-white whitespace-pre-wrap">
                    {displayValue || '-'}
                </div>
            </div>
        );
    }

    if (!options) {
        return null;
    }

    return (
        <div>
            <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">{field.name}</label>
            <select
                value={field.multiple ? (Array.isArray(value) ? value : []) : (value?.toString() || '')}
                onChange={(e) => {
                    if (field.multiple) {
                        const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                        onChange(selectedOptions);
                    } else {
                        onChange(e.target.value);
                    }
                }}
                className={`${inputClassName} ${field.multiple ? 'h-32' : ''}`}
                multiple={field.multiple}
            >
                {!field.multiple && <option value="">Select...</option>}
                {options.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
        </div>
    );
}
