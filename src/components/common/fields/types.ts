import { CustomFieldDefinition, CustomFieldValue } from '@/lib/redmine-custom-fields';

export interface BaseFieldProps {
    field: {
        id: number | string;
        name: string;
        fieldFormat: string;
        multiple?: boolean;
    };
    value: CustomFieldValue;
    onChange: (value: CustomFieldValue) => void;
    isEditMode: boolean;
    options?: { value: string; label: string }[] | readonly { value: string; label: string }[];
    className?: string;
}
