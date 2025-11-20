
import { TextField } from '../fields/TextField';
import { TextAreaField } from '../fields/TextAreaField';
import { CheckboxField } from '../fields/CheckboxField';
import { SelectField } from '../fields/SelectField';
import { BaseFieldProps } from '../fields/types';



interface CustomFieldRendererProps extends BaseFieldProps {}

export function CustomFieldRenderer(props: CustomFieldRendererProps) {
    const { field, options } = props;

    // List & User (Select)
    if ((field.fieldFormat === 'list' || field.fieldFormat === 'user') && options) {
        return <SelectField {...props} />;
    }

    // Text (Textarea)
    if (field.fieldFormat === 'text') {
        return <TextAreaField {...props} />;
    }
    
    // Bool (Checkbox)
    if (field.fieldFormat === 'bool') {
         return <CheckboxField {...props} />;
    }

    // Default (Text, Link, Float, Date)
    return <TextField {...props} />;
}
