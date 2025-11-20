import React from 'react';
import { BaseFieldProps } from './types';

export function TextAreaField({ field, value, onChange, isEditMode, className }: BaseFieldProps) {
    const inputClassName = className || "w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent";

    if (!isEditMode) {
        return (
            <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">{field.name}</label>
                <div className="font-medium text-gray-900 dark:text-white whitespace-pre-wrap">
                    {value?.toString() || '-'}
                </div>
            </div>
        );
    }

    return (
        <div>
            <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">{field.name}</label>
            <textarea
                value={value?.toString() || ''}
                onChange={(e) => onChange(e.target.value)}
                className={`${inputClassName} min-h-[80px]`}
            />
        </div>
    );
}
