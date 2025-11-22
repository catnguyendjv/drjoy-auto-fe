import { BaseIssueDetailModal, CustomFieldsProps } from './BaseIssueDetailModal';
import { useCustomFieldManager } from './CustomFieldManager';
import { CustomFieldSection } from './CustomFieldSection';
import { ModalSection } from './ModalSection';
import { CUSTOM_FIELDS, FEATURE_OPTIONS, TEAM_OPTIONS, CATEGORY_OPTIONS } from '@/lib/redmine-custom-fields';
import { Issue } from '@/types/redmine';

interface TaskDetailModalProps {
    issue: Issue;
    onClose: () => void;
    onSave?: (updatedIssue: Issue) => void;
}

export function TaskDetailModal({ issue, onClose, onSave }: TaskDetailModalProps) {
    const renderCustomFields = ({ issue, isEditMode, onUpdate }: CustomFieldsProps) => {
        const { updateField, getFieldValue } = useCustomFieldManager(issue.custom_fields, onUpdate);

        return (
            <div className="space-y-6">
                {/* Feature & Category */}
                <ModalSection>
                    <CustomFieldSection
                        fields={[
                            { field: CUSTOM_FIELDS.FEATURE, options: FEATURE_OPTIONS },
                            { field: CUSTOM_FIELDS.CATEGORY, options: CATEGORY_OPTIONS }
                        ]}
                        getFieldValue={getFieldValue}
                        onFieldChange={updateField}
                        isEditMode={isEditMode}
                        layout="grid-2"
                    />
                </ModalSection>

                {/* Team & Acceptance */}
                <ModalSection>
                    <CustomFieldSection
                        fields={[
                            { field: CUSTOM_FIELDS.TEAM, options: TEAM_OPTIONS },
                            { field: CUSTOM_FIELDS.ACCEPTANCE_PERSON }
                        ]}
                        getFieldValue={getFieldValue}
                        onFieldChange={updateField}
                        isEditMode={isEditMode}
                        layout="grid-2"
                    />
                </ModalSection>

                {/* Story Point */}
                <ModalSection>
                    <CustomFieldSection
                        fields={[
                            { field: CUSTOM_FIELDS.STORY_POINT }
                        ]}
                        getFieldValue={getFieldValue}
                        onFieldChange={updateField}
                        isEditMode={isEditMode}
                        layout="single"
                    />
                </ModalSection>
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
