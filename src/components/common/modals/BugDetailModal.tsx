
import { useState } from 'react';
import { BaseIssueDetailModal, CustomFieldsProps } from './BaseIssueDetailModal';
import { CustomFieldRenderer } from './CustomFieldRenderer';
import { CUSTOM_FIELDS, FEATURE_OPTIONS, TEAM_OPTIONS, CATEGORY_OPTIONS, SEVERITY_OPTIONS, ENVIRONMENT_OPTIONS, CAUSE_CLASSIFICATION_OPTIONS, OS_BROWSER_OPTIONS, FIXED_MODULE_OPTIONS, CustomFieldValue } from '@/lib/redmine-custom-fields';
import { Issue } from '@/types/redmine';
import { MOCK_USERS } from '@/data/mockData';

interface BugDetailModalProps {
    issue: Issue;
    onClose: () => void;
    onSave?: (updatedIssue: Issue) => void;
}

export function BugDetailModal({ issue, onClose, onSave }: BugDetailModalProps) {
    const [showAllFields, setShowAllFields] = useState(false);

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
                        field={CUSTOM_FIELDS.SEVERITY}
                        value={getFieldValue(CUSTOM_FIELDS.SEVERITY.id)}
                        onChange={(val) => updateField(CUSTOM_FIELDS.SEVERITY.id, val)}
                        isEditMode={isEditMode}
                        options={SEVERITY_OPTIONS}
                    />
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
                </div>

                {/* Bug Details */}
                <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-3">
                        Bug Details
                    </h3>
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <CustomFieldRenderer
                                field={CUSTOM_FIELDS.OCCURRENCE_TIME}
                                value={getFieldValue(CUSTOM_FIELDS.OCCURRENCE_TIME.id)}
                                onChange={(val) => updateField(CUSTOM_FIELDS.OCCURRENCE_TIME.id, val)}
                                isEditMode={isEditMode}
                            />
                            <CustomFieldRenderer
                                field={CUSTOM_FIELDS.BUG_REPORT_LINK}
                                value={getFieldValue(CUSTOM_FIELDS.BUG_REPORT_LINK.id)}
                                onChange={(val) => updateField(CUSTOM_FIELDS.BUG_REPORT_LINK.id, val)}
                                isEditMode={isEditMode}
                            />
                        </div>
                        <CustomFieldRenderer
                            field={CUSTOM_FIELDS.STEPS_TO_REPRO}
                            value={getFieldValue(CUSTOM_FIELDS.STEPS_TO_REPRO.id)}
                            onChange={(val) => updateField(CUSTOM_FIELDS.STEPS_TO_REPRO.id, val)}
                            isEditMode={isEditMode}
                        />
                        <CustomFieldRenderer
                            field={CUSTOM_FIELDS.EXPECTED_RESULT}
                            value={getFieldValue(CUSTOM_FIELDS.EXPECTED_RESULT.id)}
                            onChange={(val) => updateField(CUSTOM_FIELDS.EXPECTED_RESULT.id, val)}
                            isEditMode={isEditMode}
                        />
                        <CustomFieldRenderer
                            field={CUSTOM_FIELDS.RESULT}
                            value={getFieldValue(CUSTOM_FIELDS.RESULT.id)}
                            onChange={(val) => updateField(CUSTOM_FIELDS.RESULT.id, val)}
                            isEditMode={isEditMode}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <CustomFieldRenderer
                                field={CUSTOM_FIELDS.ENVIRONMENT}
                                value={getFieldValue(CUSTOM_FIELDS.ENVIRONMENT.id)}
                                onChange={(val) => updateField(CUSTOM_FIELDS.ENVIRONMENT.id, val)}
                                isEditMode={isEditMode}
                                options={ENVIRONMENT_OPTIONS}
                            />
                            <CustomFieldRenderer
                                field={CUSTOM_FIELDS.OS_BROWSER}
                                value={getFieldValue(CUSTOM_FIELDS.OS_BROWSER.id)}
                                onChange={(val) => updateField(CUSTOM_FIELDS.OS_BROWSER.id, val)}
                                isEditMode={isEditMode}
                                options={OS_BROWSER_OPTIONS}
                            />
                        </div>
                    </div>
                </div>

                {/* Analysis & Fix */}
                <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-4">
                    <button
                        type="button"
                        onClick={() => setShowAllFields(!showAllFields)}
                        className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 focus:outline-none"
                    >
                        {showAllFields ? (
                            <>
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                </svg>
                                Show Less Fields
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                                Show More Fields
                            </>
                        )}
                    </button>
                </div>

                {showAllFields && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-3">
                                Analysis & Fix
                            </h3>
                    <div className="space-y-4">
                        <CustomFieldRenderer
                            field={CUSTOM_FIELDS.CAUSE_CLASSIFICATION}
                            value={getFieldValue(CUSTOM_FIELDS.CAUSE_CLASSIFICATION.id)}
                            onChange={(val) => updateField(CUSTOM_FIELDS.CAUSE_CLASSIFICATION.id, val)}
                            isEditMode={isEditMode}
                            options={CAUSE_CLASSIFICATION_OPTIONS}
                        />
                        <CustomFieldRenderer
                            field={CUSTOM_FIELDS.CAUSE_EXPLANATION}
                            value={getFieldValue(CUSTOM_FIELDS.CAUSE_EXPLANATION.id)}
                            onChange={(val) => updateField(CUSTOM_FIELDS.CAUSE_EXPLANATION.id, val)}
                            isEditMode={isEditMode}
                        />
                        <CustomFieldRenderer
                            field={CUSTOM_FIELDS.FIX_PLAN}
                            value={getFieldValue(CUSTOM_FIELDS.FIX_PLAN.id)}
                            onChange={(val) => updateField(CUSTOM_FIELDS.FIX_PLAN.id, val)}
                            isEditMode={isEditMode}
                        />
                        <CustomFieldRenderer
                            field={CUSTOM_FIELDS.SCOPE_OF_IMPACT}
                            value={getFieldValue(CUSTOM_FIELDS.SCOPE_OF_IMPACT.id)}
                            onChange={(val) => updateField(CUSTOM_FIELDS.SCOPE_OF_IMPACT.id, val)}
                            isEditMode={isEditMode}
                        />
                    </div>
                </div>

                {/* Recovery & Provisional */}
                <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-3">
                        Recovery & Provisional
                    </h3>
                    <div className="space-y-4">
                        <CustomFieldRenderer
                            field={CUSTOM_FIELDS.WORKAROUND}
                            value={getFieldValue(CUSTOM_FIELDS.WORKAROUND.id)}
                            onChange={(val) => updateField(CUSTOM_FIELDS.WORKAROUND.id, val)}
                            isEditMode={isEditMode}
                        />
                        <CustomFieldRenderer
                            field={CUSTOM_FIELDS.RECOVERY_CONTENT}
                            value={getFieldValue(CUSTOM_FIELDS.RECOVERY_CONTENT.id)}
                            onChange={(val) => updateField(CUSTOM_FIELDS.RECOVERY_CONTENT.id, val)}
                            isEditMode={isEditMode}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <CustomFieldRenderer
                                field={CUSTOM_FIELDS.RECOVERY_DATE}
                                value={getFieldValue(CUSTOM_FIELDS.RECOVERY_DATE.id)}
                                onChange={(val) => updateField(CUSTOM_FIELDS.RECOVERY_DATE.id, val)}
                                isEditMode={isEditMode}
                            />
                            <CustomFieldRenderer
                                field={CUSTOM_FIELDS.RECOVERY_COMPLETED}
                                value={getFieldValue(CUSTOM_FIELDS.RECOVERY_COMPLETED.id)}
                                onChange={(val) => updateField(CUSTOM_FIELDS.RECOVERY_COMPLETED.id, val)}
                                isEditMode={isEditMode}
                            />
                        </div>
                        <CustomFieldRenderer
                            field={CUSTOM_FIELDS.PROVISIONAL_HANDLING_CONTENT}
                            value={getFieldValue(CUSTOM_FIELDS.PROVISIONAL_HANDLING_CONTENT.id)}
                            onChange={(val) => updateField(CUSTOM_FIELDS.PROVISIONAL_HANDLING_CONTENT.id, val)}
                            isEditMode={isEditMode}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <CustomFieldRenderer
                                field={CUSTOM_FIELDS.PROVISIONAL_HANDLING_DATE}
                                value={getFieldValue(CUSTOM_FIELDS.PROVISIONAL_HANDLING_DATE.id)}
                                onChange={(val) => updateField(CUSTOM_FIELDS.PROVISIONAL_HANDLING_DATE.id, val)}
                                isEditMode={isEditMode}
                            />
                            <CustomFieldRenderer
                                field={CUSTOM_FIELDS.PROVISIONAL_HANDLING_COMPLETED_DATE}
                                value={getFieldValue(CUSTOM_FIELDS.PROVISIONAL_HANDLING_COMPLETED_DATE.id)}
                                onChange={(val) => updateField(CUSTOM_FIELDS.PROVISIONAL_HANDLING_COMPLETED_DATE.id, val)}
                                isEditMode={isEditMode}
                            />
                            <CustomFieldRenderer
                                field={CUSTOM_FIELDS.PROVISIONAL_HANDLING_IS_COMPLETED}
                                value={getFieldValue(CUSTOM_FIELDS.PROVISIONAL_HANDLING_IS_COMPLETED.id)}
                                onChange={(val) => updateField(CUSTOM_FIELDS.PROVISIONAL_HANDLING_IS_COMPLETED.id, val)}
                                isEditMode={isEditMode}
                            />
                        </div>
                    </div>
                </div>

                {/* Permanent Solution */}
                <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-3">
                        Permanent Solution
                    </h3>
                    <div className="space-y-4">
                        <CustomFieldRenderer
                            field={CUSTOM_FIELDS.PERMANENT_SOLUTION_CONTENT}
                            value={getFieldValue(CUSTOM_FIELDS.PERMANENT_SOLUTION_CONTENT.id)}
                            onChange={(val) => updateField(CUSTOM_FIELDS.PERMANENT_SOLUTION_CONTENT.id, val)}
                            isEditMode={isEditMode}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <CustomFieldRenderer
                                field={CUSTOM_FIELDS.PERMANENT_SOLUTION_PLANNED_DATE}
                                value={getFieldValue(CUSTOM_FIELDS.PERMANENT_SOLUTION_PLANNED_DATE.id)}
                                onChange={(val) => updateField(CUSTOM_FIELDS.PERMANENT_SOLUTION_PLANNED_DATE.id, val)}
                                isEditMode={isEditMode}
                            />
                            <CustomFieldRenderer
                                field={CUSTOM_FIELDS.PERMANENT_SOLUTION_COMPLETED_DATE}
                                value={getFieldValue(CUSTOM_FIELDS.PERMANENT_SOLUTION_COMPLETED_DATE.id)}
                                onChange={(val) => updateField(CUSTOM_FIELDS.PERMANENT_SOLUTION_COMPLETED_DATE.id, val)}
                                isEditMode={isEditMode}
                            />
                        </div>
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
                        field={CUSTOM_FIELDS.EMERGENCY_RELEASE}
                        value={getFieldValue(CUSTOM_FIELDS.EMERGENCY_RELEASE.id)}
                        onChange={(val) => updateField(CUSTOM_FIELDS.EMERGENCY_RELEASE.id, val)}
                        isEditMode={isEditMode}
                    />
                    <CustomFieldRenderer
                        field={CUSTOM_FIELDS.PAID_FUNCTION}
                        value={getFieldValue(CUSTOM_FIELDS.PAID_FUNCTION.id)}
                        onChange={(val) => updateField(CUSTOM_FIELDS.PAID_FUNCTION.id, val)}
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
                )}
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
