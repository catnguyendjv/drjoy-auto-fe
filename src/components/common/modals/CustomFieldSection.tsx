import React from 'react';
import { CustomFieldRenderer } from './CustomFieldRenderer';
import { CustomFieldDefinition, CustomFieldValue } from '@/lib/redmine-custom-fields';

interface FieldConfig {
    field: CustomFieldDefinition;
    options?: readonly { value: string; label: string }[];
}

interface CustomFieldSectionProps {
    fields: FieldConfig[];
    getFieldValue: (fieldId: number) => string | string[] | null | undefined;
    onFieldChange: (fieldId: number, value: CustomFieldValue) => void;
    isEditMode: boolean;
    layout?: 'single' | 'grid-2' | 'grid-3' | 'grid-4';
}

export function CustomFieldSection({
    fields,
    getFieldValue,
    onFieldChange,
    isEditMode,
    layout = 'single'
}: CustomFieldSectionProps) {
    const getGridClassName = () => {
        switch (layout) {
            case 'grid-2':
                return 'grid grid-cols-1 md:grid-cols-2 gap-4';
            case 'grid-3':
                return 'grid grid-cols-1 md:grid-cols-3 gap-4';
            case 'grid-4':
                return 'grid grid-cols-2 md:grid-cols-4 gap-4';
            default:
                return 'space-y-4';
        }
    };

    return (
        <div className={getGridClassName()}>
            {fields.map(({ field, options }) => (
                <CustomFieldRenderer
                    key={field.id}
                    field={field}
                    value={getFieldValue(field.id)}
                    onChange={(val) => onFieldChange(field.id, val)}
                    isEditMode={isEditMode}
                    options={options}
                />
            ))}
        </div>
    );
}
