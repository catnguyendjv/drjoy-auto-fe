
import { useState } from 'react';
import { BaseIssueDetailModal, CustomFieldsProps } from './BaseIssueDetailModal';
import { useCustomFieldManager } from './CustomFieldManager';
import { CustomFieldSection } from './CustomFieldSection';
import { ModalSection } from './ModalSection';
import { CUSTOM_FIELDS, FEATURE_OPTIONS, TEAM_OPTIONS, CATEGORY_OPTIONS, SEVERITY_OPTIONS, ENVIRONMENT_OPTIONS, CAUSE_CLASSIFICATION_OPTIONS, OS_BROWSER_OPTIONS, FIXED_MODULE_OPTIONS } from '@/lib/redmine-custom-fields';
import { Issue } from '@/types/redmine';

interface BugDetailModalProps {
    issue: Issue;
    onClose: () => void;
    onSave?: (updatedIssue: Issue) => void;
}

export function BugDetailModal({ issue, onClose, onSave }: BugDetailModalProps) {
    const [showAllFields, setShowAllFields] = useState(false);

    const renderCustomFields = ({ issue, isEditMode, onUpdate }: CustomFieldsProps) => {
        const { updateField, getFieldValue } = useCustomFieldManager(issue.custom_fields, onUpdate);

        return (
            <div className="space-y-6">
                {/* Severity, Feature & Category */}
                <ModalSection>
                    <CustomFieldSection
                        fields={[
                            { field: CUSTOM_FIELDS.SEVERITY, options: SEVERITY_OPTIONS },
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
                            { field: CUSTOM_FIELDS.ACCEPTANCE_PERSON },
                            { field: CUSTOM_FIELDS.PERSON_IN_CHARGE }
                        ]}
                        getFieldValue={getFieldValue}
                        onFieldChange={updateField}
                        isEditMode={isEditMode}
                        layout="grid-2"
                    />
                </ModalSection>

                {/* Bug Details */}
                <ModalSection title="Bug Details">
                    <CustomFieldSection
                        fields={[
                            { field: CUSTOM_FIELDS.OCCURRENCE_TIME },
                            { field: CUSTOM_FIELDS.BUG_REPORT_LINK }
                        ]}
                        getFieldValue={getFieldValue}
                        onFieldChange={updateField}
                        isEditMode={isEditMode}
                        layout="grid-2"
                    />
                    <CustomFieldSection
                        fields={[
                            { field: CUSTOM_FIELDS.STEPS_TO_REPRO },
                            { field: CUSTOM_FIELDS.EXPECTED_RESULT },
                            { field: CUSTOM_FIELDS.RESULT }
                        ]}
                        getFieldValue={getFieldValue}
                        onFieldChange={updateField}
                        isEditMode={isEditMode}
                        layout="single"
                    />
                    <CustomFieldSection
                        fields={[
                            { field: CUSTOM_FIELDS.ENVIRONMENT, options: ENVIRONMENT_OPTIONS },
                            { field: CUSTOM_FIELDS.OS_BROWSER, options: OS_BROWSER_OPTIONS }
                        ]}
                        getFieldValue={getFieldValue}
                        onFieldChange={updateField}
                        isEditMode={isEditMode}
                        layout="grid-2"
                    />
                </ModalSection>

                {/* Toggle for advanced fields */}
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
                        {/* Analysis & Fix */}
                        <ModalSection title="Analysis & Fix">
                            <CustomFieldSection
                                fields={[
                                    { field: CUSTOM_FIELDS.CAUSE_CLASSIFICATION, options: CAUSE_CLASSIFICATION_OPTIONS },
                                    { field: CUSTOM_FIELDS.CAUSE_EXPLANATION },
                                    { field: CUSTOM_FIELDS.FIX_PLAN },
                                    { field: CUSTOM_FIELDS.SCOPE_OF_IMPACT }
                                ]}
                                getFieldValue={getFieldValue}
                                onFieldChange={updateField}
                                isEditMode={isEditMode}
                                layout="single"
                            />
                        </ModalSection>

                        {/* Recovery & Provisional */}
                        <ModalSection title="Recovery & Provisional">
                            <CustomFieldSection
                                fields={[
                                    { field: CUSTOM_FIELDS.WORKAROUND },
                                    { field: CUSTOM_FIELDS.RECOVERY_CONTENT }
                                ]}
                                getFieldValue={getFieldValue}
                                onFieldChange={updateField}
                                isEditMode={isEditMode}
                                layout="single"
                            />
                            <CustomFieldSection
                                fields={[
                                    { field: CUSTOM_FIELDS.RECOVERY_DATE },
                                    { field: CUSTOM_FIELDS.RECOVERY_COMPLETED }
                                ]}
                                getFieldValue={getFieldValue}
                                onFieldChange={updateField}
                                isEditMode={isEditMode}
                                layout="grid-2"
                            />
                            <CustomFieldSection
                                fields={[
                                    { field: CUSTOM_FIELDS.PROVISIONAL_HANDLING_CONTENT }
                                ]}
                                getFieldValue={getFieldValue}
                                onFieldChange={updateField}
                                isEditMode={isEditMode}
                                layout="single"
                            />
                            <CustomFieldSection
                                fields={[
                                    { field: CUSTOM_FIELDS.PROVISIONAL_HANDLING_DATE },
                                    { field: CUSTOM_FIELDS.PROVISIONAL_HANDLING_COMPLETED_DATE },
                                    { field: CUSTOM_FIELDS.PROVISIONAL_HANDLING_IS_COMPLETED }
                                ]}
                                getFieldValue={getFieldValue}
                                onFieldChange={updateField}
                                isEditMode={isEditMode}
                                layout="grid-3"
                            />
                        </ModalSection>

                        {/* Permanent Solution */}
                        <ModalSection title="Permanent Solution">
                            <CustomFieldSection
                                fields={[
                                    { field: CUSTOM_FIELDS.PERMANENT_SOLUTION_CONTENT }
                                ]}
                                getFieldValue={getFieldValue}
                                onFieldChange={updateField}
                                isEditMode={isEditMode}
                                layout="single"
                            />
                            <CustomFieldSection
                                fields={[
                                    { field: CUSTOM_FIELDS.PERMANENT_SOLUTION_PLANNED_DATE },
                                    { field: CUSTOM_FIELDS.PERMANENT_SOLUTION_COMPLETED_DATE }
                                ]}
                                getFieldValue={getFieldValue}
                                onFieldChange={updateField}
                                isEditMode={isEditMode}
                                layout="grid-2"
                            />
                        </ModalSection>

                        {/* Implementation */}
                        <ModalSection title="Implementation">
                            <CustomFieldSection
                                fields={[
                                    { field: CUSTOM_FIELDS.FIXED_MODULE, options: FIXED_MODULE_OPTIONS },
                                    { field: CUSTOM_FIELDS.CHANGED_CONTENT }
                                ]}
                                getFieldValue={getFieldValue}
                                onFieldChange={updateField}
                                isEditMode={isEditMode}
                                layout="single"
                            />
                        </ModalSection>

                        {/* Estimation (Hours) */}
                        <ModalSection title="Estimation (Hours)">
                            <CustomFieldSection
                                fields={[
                                    { field: CUSTOM_FIELDS.EST_FE },
                                    { field: CUSTOM_FIELDS.ACT_FE },
                                    { field: CUSTOM_FIELDS.EST_BE },
                                    { field: CUSTOM_FIELDS.ACT_BE },
                                    { field: CUSTOM_FIELDS.EST_IOS },
                                    { field: CUSTOM_FIELDS.ACT_IOS },
                                    { field: CUSTOM_FIELDS.EST_ANDROID },
                                    { field: CUSTOM_FIELDS.ACT_ANDROID },
                                    { field: CUSTOM_FIELDS.EST_TE },
                                    { field: CUSTOM_FIELDS.ACT_TE }
                                ]}
                                getFieldValue={getFieldValue}
                                onFieldChange={updateField}
                                isEditMode={isEditMode}
                                layout="grid-4"
                            />
                        </ModalSection>

                        {/* Flags */}
                        <ModalSection>
                            <CustomFieldSection
                                fields={[
                                    { field: CUSTOM_FIELDS.MANAGED_TICKET },
                                    { field: CUSTOM_FIELDS.EMERGENCY_RELEASE },
                                    { field: CUSTOM_FIELDS.PAID_FUNCTION },
                                    { field: CUSTOM_FIELDS.PROD_RELEASE }
                                ]}
                                getFieldValue={getFieldValue}
                                onFieldChange={updateField}
                                isEditMode={isEditMode}
                                layout="grid-3"
                            />
                        </ModalSection>
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
