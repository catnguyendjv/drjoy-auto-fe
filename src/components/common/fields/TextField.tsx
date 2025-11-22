import React from 'react';
import { Input } from "@heroui/react";
import { BaseFieldProps } from './types';

export function TextField({ field, value, onChange, isEditMode }: BaseFieldProps) {
    if (!isEditMode) {
        if (field.fieldFormat === 'link' && value && typeof value === 'string') {
            return (
                <div>
                    <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">{field.name}</label>
                    <div className="font-medium text-gray-900 dark:text-white whitespace-pre-wrap">
                        <a
                            href={value}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline break-all"
                        >
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

    const inputType = field.fieldFormat === 'float' ? 'number' : field.fieldFormat === 'date' ? 'date' : field.fieldFormat;

    return (
        <Input
            type={inputType === 'link' ? 'url' : inputType === 'float' ? 'number' : inputType || 'text'}
            label={field.name}
            variant="bordered"
            value={value?.toString() || ''}
            onChange={(e) => onChange(e.target.value)}
            labelPlacement="outside"
            step={field.fieldFormat === 'float' ? 'any' : undefined}
            placeholder={field.fieldFormat === 'link' ? 'https://...' : undefined}
        />
    );
}
