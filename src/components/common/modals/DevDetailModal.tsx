
import { BaseIssueDetailModal, CustomFieldsProps } from './BaseIssueDetailModal';
import { CustomFieldRenderer } from './CustomFieldRenderer';
import { CUSTOM_FIELDS, FEATURE_OPTIONS, TEAM_OPTIONS, CATEGORY_OPTIONS, FIXED_MODULE_OPTIONS, CustomFieldValue } from '@/lib/redmine-custom-fields';
import { Issue } from '@/types/redmine';
import { MOCK_USERS } from '@/data/mockData';

interface DevDetailModalProps {
    issue: Issue;
    onClose: () => void;
    onSave?: (updatedIssue: Issue) => void;
}

export function DevDetailModal({ issue, onClose, onSave }: DevDetailModalProps) {
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <CustomFieldRenderer
                        field={CUSTOM_FIELDS.PERSON_IN_CHARGE}
                        value={getFieldValue(CUSTOM_FIELDS.PERSON_IN_CHARGE.id)}
                        onChange={(val) => updateField(CUSTOM_FIELDS.PERSON_IN_CHARGE.id, val)}
                        isEditMode={isEditMode}
                        options={MOCK_USERS.map(u => ({ value: String(u.id), label: u.name }))}
                    />
                    <CustomFieldRenderer
                        field={CUSTOM_FIELDS.STORY_POINT}
                        value={getFieldValue(CUSTOM_FIELDS.STORY_POINT.id)}
                        onChange={(val) => updateField(CUSTOM_FIELDS.STORY_POINT.id, val)}
                        isEditMode={isEditMode}
                    />
                </div>

                {/* Files & Specs */}
                <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-3">
                        Files & Specs
                    </h3>
                    <div className="space-y-4">
                        <CustomFieldRenderer
                            field={CUSTOM_FIELDS.SPEC_TICKET_FILE}
                            value={getFieldValue(CUSTOM_FIELDS.SPEC_TICKET_FILE.id)}
                            onChange={(val) => updateField(CUSTOM_FIELDS.SPEC_TICKET_FILE.id, val)}
                            isEditMode={isEditMode}
                        />
                        <CustomFieldRenderer
                            field={CUSTOM_FIELDS.INVESTIGATION_FILE}
                            value={getFieldValue(CUSTOM_FIELDS.INVESTIGATION_FILE.id)}
                            onChange={(val) => updateField(CUSTOM_FIELDS.INVESTIGATION_FILE.id, val)}
                            isEditMode={isEditMode}
                        />
                        <CustomFieldRenderer
                            field={CUSTOM_FIELDS.TESTCASE_FILE}
                            value={getFieldValue(CUSTOM_FIELDS.TESTCASE_FILE.id)}
                            onChange={(val) => updateField(CUSTOM_FIELDS.TESTCASE_FILE.id, val)}
                            isEditMode={isEditMode}
                        />
                        <CustomFieldRenderer
                            field={CUSTOM_FIELDS.TEST_PLAN}
                            value={getFieldValue(CUSTOM_FIELDS.TEST_PLAN.id)}
                            onChange={(val) => updateField(CUSTOM_FIELDS.TEST_PLAN.id, val)}
                            isEditMode={isEditMode}
                        />
                        <CustomFieldRenderer
                            field={CUSTOM_FIELDS.FILE_SPEC_STUDY}
                            value={getFieldValue(CUSTOM_FIELDS.FILE_SPEC_STUDY.id)}
                            onChange={(val) => updateField(CUSTOM_FIELDS.FILE_SPEC_STUDY.id, val)}
                            isEditMode={isEditMode}
                        />
                    </div>
                </div>

                {/* Implementation */}
                <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-3">
                        Implementation
                    </h3>
                    <div className="space-y-4">
                        <CustomFieldRenderer
                            field={CUSTOM_FIELDS.FIXED_MODULE}
                            value={getFieldValue(CUSTOM_FIELDS.FIXED_MODULE.id)}
                            onChange={(val) => updateField(CUSTOM_FIELDS.FIXED_MODULE.id, val)}
                            isEditMode={isEditMode}
                            options={FIXED_MODULE_OPTIONS}
                        />
                        <CustomFieldRenderer
                            field={CUSTOM_FIELDS.CHANGED_CONTENT}
                            value={getFieldValue(CUSTOM_FIELDS.CHANGED_CONTENT.id)}
                            onChange={(val) => updateField(CUSTOM_FIELDS.CHANGED_CONTENT.id, val)}
                            isEditMode={isEditMode}
                        />
                    </div>
                </div>

                {/* Estimation (Hours) */}
                <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-3">
                        Estimation (Hours)
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <CustomFieldRenderer field={CUSTOM_FIELDS.EST_FE} value={getFieldValue(CUSTOM_FIELDS.EST_FE.id)} onChange={(val) => updateField(CUSTOM_FIELDS.EST_FE.id, val)} isEditMode={isEditMode} />
                        <CustomFieldRenderer field={CUSTOM_FIELDS.ACT_FE} value={getFieldValue(CUSTOM_FIELDS.ACT_FE.id)} onChange={(val) => updateField(CUSTOM_FIELDS.ACT_FE.id, val)} isEditMode={isEditMode} />
                        
                        <CustomFieldRenderer field={CUSTOM_FIELDS.EST_BE} value={getFieldValue(CUSTOM_FIELDS.EST_BE.id)} onChange={(val) => updateField(CUSTOM_FIELDS.EST_BE.id, val)} isEditMode={isEditMode} />
                        <CustomFieldRenderer field={CUSTOM_FIELDS.ACT_BE} value={getFieldValue(CUSTOM_FIELDS.ACT_BE.id)} onChange={(val) => updateField(CUSTOM_FIELDS.ACT_BE.id, val)} isEditMode={isEditMode} />

                        <CustomFieldRenderer field={CUSTOM_FIELDS.EST_IOS} value={getFieldValue(CUSTOM_FIELDS.EST_IOS.id)} onChange={(val) => updateField(CUSTOM_FIELDS.EST_IOS.id, val)} isEditMode={isEditMode} />
                        <CustomFieldRenderer field={CUSTOM_FIELDS.ACT_IOS} value={getFieldValue(CUSTOM_FIELDS.ACT_IOS.id)} onChange={(val) => updateField(CUSTOM_FIELDS.ACT_IOS.id, val)} isEditMode={isEditMode} />

                        <CustomFieldRenderer field={CUSTOM_FIELDS.EST_ANDROID} value={getFieldValue(CUSTOM_FIELDS.EST_ANDROID.id)} onChange={(val) => updateField(CUSTOM_FIELDS.EST_ANDROID.id, val)} isEditMode={isEditMode} />
                        <CustomFieldRenderer field={CUSTOM_FIELDS.ACT_ANDROID} value={getFieldValue(CUSTOM_FIELDS.ACT_ANDROID.id)} onChange={(val) => updateField(CUSTOM_FIELDS.ACT_ANDROID.id, val)} isEditMode={isEditMode} />

                        <CustomFieldRenderer field={CUSTOM_FIELDS.EST_TE} value={getFieldValue(CUSTOM_FIELDS.EST_TE.id)} onChange={(val) => updateField(CUSTOM_FIELDS.EST_TE.id, val)} isEditMode={isEditMode} />
                        <CustomFieldRenderer field={CUSTOM_FIELDS.ACT_TE} value={getFieldValue(CUSTOM_FIELDS.ACT_TE.id)} onChange={(val) => updateField(CUSTOM_FIELDS.ACT_TE.id, val)} isEditMode={isEditMode} />
                    </div>
                </div>

                {/* Flags */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <CustomFieldRenderer
                        field={CUSTOM_FIELDS.MANAGED_TICKET}
                        value={getFieldValue(CUSTOM_FIELDS.MANAGED_TICKET.id)}
                        onChange={(val) => updateField(CUSTOM_FIELDS.MANAGED_TICKET.id, val)}
                        isEditMode={isEditMode}
                    />
                    <CustomFieldRenderer
                        field={CUSTOM_FIELDS.ESTIMATE_REQUEST}
                        value={getFieldValue(CUSTOM_FIELDS.ESTIMATE_REQUEST.id)}
                        onChange={(val) => updateField(CUSTOM_FIELDS.ESTIMATE_REQUEST.id, val)}
                        isEditMode={isEditMode}
                    />
                    <CustomFieldRenderer
                        field={CUSTOM_FIELDS.PROD_RELEASE}
                        value={getFieldValue(CUSTOM_FIELDS.PROD_RELEASE.id)}
                        onChange={(val) => updateField(CUSTOM_FIELDS.PROD_RELEASE.id, val)}
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
