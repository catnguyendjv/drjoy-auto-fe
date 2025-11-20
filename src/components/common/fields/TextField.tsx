import React from 'react';
import { BaseFieldProps } from './types';

export function TextField({ field, value, onChange, isEditMode, className }: BaseFieldProps) {
    const inputClassName = className || "w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent";

    if (!isEditMode) {
        if (field.fieldFormat === 'link' && value && typeof value === 'string') {
            return (
                <div>
                    <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">{field.name}</label>
                    <div className="font-medium text-gray-900 dark:text-white whitespace-pre-wrap">
                        <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
                            {value}
                        </a>
                    </div>
                </div>
            );
        }
        return (
            <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">{field.name}</label>
                <div className="font-medium text-gray-900 dark:text-white whitespace-pre-wrap">
                    {value?.toString() || '-'}
                </div>
            </div>
        );
    }

    // Edit Mode
    if (field.fieldFormat === 'link') {
        return (
            <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">{field.name}</label>
                <input
                    type="url"
                    value={value?.toString() || ''}
                    onChange={(e) => onChange(e.target.value)}
                    className={inputClassName}
                    placeholder="https://..."
                />
            </div>
        );
    }

    if (field.fieldFormat === 'float') {
        return (
            <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">{field.name}</label>
                <input
                    type="number"
                    step="any"
                    value={value?.toString() || ''}
                    onChange={(e) => onChange(e.target.value)}
                    className={inputClassName}
                />
            </div>
        );
    }

    // Default (Text/Date)
    return (
        <div>
            <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">{field.name}</label>
            <input
                type={field.fieldFormat === 'date' ? 'date' : 'text'}
                value={value?.toString() || ''}
                onChange={(e) => onChange(e.target.value)}
                className={inputClassName}
            />
        </div>
    );
}
