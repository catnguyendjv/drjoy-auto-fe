import { BaseIssueDetailModal, CustomFieldsProps } from './BaseIssueDetailModal';
import { CustomFieldRenderer } from './CustomFieldRenderer';
import { CUSTOM_FIELDS, FEATURE_OPTIONS, TEAM_OPTIONS, CATEGORY_OPTIONS, CustomFieldValue } from '@/lib/redmine-custom-fields';
import { Issue } from '@/types/redmine';
import { MOCK_USERS } from '@/data/mockData';

interface TaskDetailModalProps {
    issue: Issue;
    onClose: () => void;
    onSave?: (updatedIssue: Issue) => void;
}

export function TaskDetailModal({ issue, onClose, onSave }: TaskDetailModalProps) {
    const renderCustomFields = ({ issue, isEditMode, onUpdate }: CustomFieldsProps) => {
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
            const currentFields = issue.custom_fields || [];
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
            return issue.custom_fields?.find(f => f.id === fieldId)?.value;
        };

        return (
            <div className="space-y-6">
                {/* Feature & Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <CustomFieldRenderer
                        field={CUSTOM_FIELDS.FEATURE}
                        value={getFieldValue(CUSTOM_FIELDS.FEATURE.id)}
                        onChange={(val) => updateField(CUSTOM_FIELDS.FEATURE.id, val)}
                        isEditMode={isEditMode}
                        options={FEATURE_OPTIONS}
                    />
                    <CustomFieldRenderer
                        field={CUSTOM_FIELDS.CATEGORY}
                        value={getFieldValue(CUSTOM_FIELDS.CATEGORY.id)}
                        onChange={(val) => updateField(CUSTOM_FIELDS.CATEGORY.id, val)}
                        isEditMode={isEditMode}
                        options={CATEGORY_OPTIONS}
                    />
                </div>

                {/* Team & Acceptance */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <CustomFieldRenderer
                        field={CUSTOM_FIELDS.TEAM}
                        value={getFieldValue(CUSTOM_FIELDS.TEAM.id)}
                        onChange={(val) => updateField(CUSTOM_FIELDS.TEAM.id, val)}
                        isEditMode={isEditMode}
                        options={TEAM_OPTIONS}
                    />
                    <CustomFieldRenderer
                        field={CUSTOM_FIELDS.ACCEPTANCE_PERSON}
                        value={getFieldValue(CUSTOM_FIELDS.ACCEPTANCE_PERSON.id)}
                        onChange={(val) => updateField(CUSTOM_FIELDS.ACCEPTANCE_PERSON.id, val)}
                        isEditMode={isEditMode}
                        options={MOCK_USERS.map(u => ({ value: String(u.id), label: u.name }))}
                    />
                </div>

                {/* Story Point */}
                <div>
                    <CustomFieldRenderer
                        field={CUSTOM_FIELDS.STORY_POINT}
                        value={getFieldValue(CUSTOM_FIELDS.STORY_POINT.id)}
                        onChange={(val) => updateField(CUSTOM_FIELDS.STORY_POINT.id, val)}
                        isEditMode={isEditMode}
                    />
                </div>
            </div>
        );
    };

    return (
        <BaseIssueDetailModal
            issue={issue}
            onClose={onClose}
            onSave={onSave}
            renderCustomFields={renderCustomFields}
        />
    );
}
