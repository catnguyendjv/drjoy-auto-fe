import { CustomField } from '@/types/redmine';
import { CUSTOM_FIELDS, CustomFieldValue } from '@/lib/redmine-custom-fields';

/**
 * Hook for managing custom field updates
 */
export function useCustomFieldManager(
    customFields: CustomField[] | undefined,
    onUpdate: (updatedFields: CustomField[]) => void
) {
    const updateField = (fieldId: number, value: CustomFieldValue) => {
        let processedValue: string | string[] | null = null;
        
        if (value === undefined) {
            processedValue = null;
        } else if (typeof value === 'number') {
            processedValue = String(value);
        } else if (typeof value === 'boolean') {
            processedValue = value ? '1' : '0';
        } else {
            processedValue = value;
        }

        let fieldExists = false;
        const currentFields = customFields || [];
        const newFields = currentFields.map(f => {
            if (f.id === fieldId) {
                fieldExists = true;
                return { ...f, value: processedValue };
            }
            return f;
        });

        if (!fieldExists) {
            const fieldDef = Object.values(CUSTOM_FIELDS).find(f => f.id === fieldId);
            if (fieldDef) {
                newFields.push({
                    id: fieldId,
                    name: fieldDef.name,
                    value: processedValue,
                    multiple: fieldDef.multiple
                });
            }
        }
        
        onUpdate(newFields);
    };

    const getFieldValue = (fieldId: number) => {
        return customFields?.find(f => f.id === fieldId)?.value;
    };

    return { updateField, getFieldValue };
}
