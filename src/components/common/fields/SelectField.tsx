import React from 'react';
import { Select, SelectItem, type Selection } from "@heroui/react";
import { BaseFieldProps } from './types';

export function SelectField({ field, value, onChange, isEditMode, options }: BaseFieldProps) {
    if (!isEditMode) {
        let displayValue: React.ReactNode = value;
        if (Array.isArray(value)) {
            displayValue = value.join(', ');
        }

        return (
            <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">{field.name}</label>
                <div className="font-medium text-gray-900 dark:text-white whitespace-pre-wrap">{displayValue || '-'}</div>
            </div>
        );
    }

    if (!options) {
        return null;
    }

    const selectedKeys: Selection = field.multiple
        ? new Set(Array.isArray(value) ? (value as string[]) : [])
        : value
            ? new Set([value.toString()])
            : new Set();

    const handleSelectionChange = (keys: Selection) => {
        const parsedKeys = Array.from(keys);
        if (field.multiple) {
            onChange(parsedKeys);
        } else {
            onChange(parsedKeys[0] || '');
        }
    };

    return (
        <Select
            label={field.name}
            selectionMode={field.multiple ? 'multiple' : 'single'}
            selectedKeys={selectedKeys}
            onSelectionChange={handleSelectionChange}
            variant="bordered"
            labelPlacement="outside"
            items={options}
        >
            {(opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                </SelectItem>
            )}
        </Select>
    );
}
