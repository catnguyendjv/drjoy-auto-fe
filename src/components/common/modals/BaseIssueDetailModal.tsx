import { Issue, CustomField } from '@/types/redmine';
import { Edit2, Save, X, XCircle } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { MOCK_STATUSES, MOCK_PRIORITIES, MOCK_VERSIONS, MOCK_USERS } from '@/data/mockData';
import { toast } from 'sonner';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { redmineApi } from '@/lib/api/redmine.service';
import { createPartialUpdateRequest } from '@/lib/issue-utils';

export interface CustomFieldsProps {
    issue: Issue;
    isEditMode: boolean;
    onUpdate: (updatedFields: CustomField[]) => void;
}

interface BaseIssueDetailModalProps {
    issue: Issue;
    onClose: () => void;
    onSave?: (updatedIssue: Issue) => void;
    renderCustomFields?: (props: CustomFieldsProps) => React.ReactNode;
}

export function BaseIssueDetailModal({ issue, onClose, onSave, renderCustomFields }: BaseIssueDetailModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editedIssue, setEditedIssue] = useState<Issue>(issue);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if (isEditMode) {
                    handleCancelEdit();
                } else {
                    onClose();
                }
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [onClose, isEditMode]);

    // Close on click outside
    const handleBackdropClick = (e: React.MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
            if (!isEditMode) {
                onClose();
            }
        }
    };

    const handleEdit = () => {
        setIsEditMode(true);
    };

    const handleCancelEdit = () => {
        setEditedIssue(issue);
        setIsEditMode(false);
    };

    const handleSave = async () => {
        // Validation
        if (!editedIssue.subject.trim()) {
            toast.error('Subject cannot be empty');
            return;
        }

        setIsSaving(true);

        try {
            // Convert to update request format (only changed fields)
            const updateRequest = createPartialUpdateRequest(issue, editedIssue);

            // Log for debugging - verify only changed fields are sent
            const changedFieldsCount = Object.keys(updateRequest).length;
            console.log(`[Issue Update] Sending ${changedFieldsCount} changed field(s):`, updateRequest);

            // Call API to update issue
            const response = await redmineApi.updateIssue(editedIssue.id, updateRequest);

            // Update the issue with response from server
            if (onSave && response.issue) {
                onSave(response.issue as any); // Cast to Issue type
            }

            setIsSaving(false);
            setIsEditMode(false);
            toast.success('Issue updated successfully');
        } catch (error) {
            setIsSaving(false);
            const errorMessage = error instanceof Error ? error.message : 'Failed to update issue';
            toast.error(errorMessage);
            console.error('Error updating issue:', error);
        }
    };

    const handleCustomFieldsUpdate = (updatedFields: CustomField[]) => {
        setEditedIssue({ ...editedIssue, custom_fields: updatedFields });
    };

    const inputClassName = "w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent";
    const selectClassName = "w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent";

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={handleBackdropClick}
        >
            <div
                ref={modalRef}
                className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col"
                role="dialog"
                aria-modal="true"
            >
                {/* Header */}
                <div className="flex items-start justify-between p-6 border-b border-gray-200 dark:border-zinc-800">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <span className="text-sm font-mono text-gray-500 dark:text-gray-400">#{issue.id}</span>
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                                {editedIssue.tracker?.name || 'Unknown'}
                            </span>
                            {!isEditMode ? (
                                <>
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium
                                        ${editedIssue.priority?.name === 'High' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                                            editedIssue.priority?.name === 'Urgent' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' :
                                                editedIssue.priority?.name === 'Normal' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                                                    'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                                        }`}>
                                        {editedIssue.priority?.name || 'No Priority'}
                                    </span>
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium 
                                        ${editedIssue.status?.is_closed ? 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300' : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'}`}>
                                        {editedIssue.status?.name || 'No Status'}
                                    </span>
                                </>
                            ) : null}
                        </div>
                        {!isEditMode ? (
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
                                {editedIssue.subject}
                            </h2>
                        ) : (
                            <input
                                type="text"
                                value={editedIssue.subject}
                                onChange={(e) => setEditedIssue({ ...editedIssue, subject: e.target.value })}
                                className="text-xl font-bold w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Issue subject"
                            />
                        )}
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                        {!isEditMode ? (
                            <button
                                onClick={handleEdit}
                                className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                title="Edit issue"
                            >
                                <Edit2 className="w-5 h-5" />
                            </button>
                        ) : null}
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    {/* Description */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-2">
                            Description
                        </h3>
                        {!isEditMode ? (
                            <div className="bg-gray-50 dark:bg-zinc-800/50 rounded-lg p-4 text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                {editedIssue.description || <span className="italic text-gray-400">No description provided.</span>}
                            </div>
                        ) : (
                            <textarea
                                value={editedIssue.description || ''}
                                onChange={(e) => setEditedIssue({ ...editedIssue, description: e.target.value })}
                                className={`${inputClassName} min-h-[120px] resize-y`}
                                placeholder="Enter issue description..."
                            />
                        )}
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left Column - Basic Details */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-3">
                                Basic Details
                            </h3>
                            <div className="space-y-4">
                                {/* Status */}
                                <div>
                                    <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Status</label>
                                    {!isEditMode ? (
                                        <div className="font-medium text-gray-900 dark:text-white">{editedIssue.status?.name || 'No Status'}</div>
                                    ) : (
                                        <select
                                            value={editedIssue.status?.id || ''}
                                            onChange={(e) => {
                                                const status = MOCK_STATUSES.find(s => s.id === Number(e.target.value));
                                                if (status) setEditedIssue({ ...editedIssue, status: { id: status.id, name: status.name, is_closed: status.is_closed } });
                                            }}
                                            className={selectClassName}
                                        >
                                            {MOCK_STATUSES.map(status => (
                                                <option key={status.id} value={status.id}>{status.name}</option>
                                            ))}
                                        </select>
                                    )}
                                </div>

                                {/* Priority */}
                                <div>
                                    <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Priority</label>
                                    {!isEditMode ? (
                                        <div className="font-medium text-gray-900 dark:text-white">{editedIssue.priority?.name || 'No Priority'}</div>
                                    ) : (
                                        <select
                                            value={editedIssue.priority?.id || ''}
                                            onChange={(e) => {
                                                const priority = MOCK_PRIORITIES.find(p => p.id === Number(e.target.value));
                                                if (priority) setEditedIssue({ ...editedIssue, priority });
                                            }}
                                            className={selectClassName}
                                        >
                                            {MOCK_PRIORITIES.map(priority => (
                                                <option key={priority.id} value={priority.id}>{priority.name}</option>
                                            ))}
                                        </select>
                                    )}
                                </div>

                                {/* Assignee */}
                                <div>
                                    <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Assignee</label>
                                    {!isEditMode ? (
                                        <div className="font-medium text-gray-900 dark:text-white">{editedIssue.assigned_to?.name || 'Unassigned'}</div>
                                    ) : (
                                        <select
                                            value={editedIssue.assigned_to?.id || ''}
                                            onChange={(e) => {
                                                const user = MOCK_USERS.find(u => u.id === Number(e.target.value));
                                                setEditedIssue({ ...editedIssue, assigned_to: user });
                                            }}
                                            className={selectClassName}
                                        >
                                            <option value="">Unassigned</option>
                                            {MOCK_USERS.map(user => (
                                                <option key={user.id} value={user.id}>{user.name}</option>
                                            ))}
                                        </select>
                                    )}
                                </div>

                                {/* Project */}
                                <div>
                                    <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Project</label>
                                    <div className="font-medium text-gray-900 dark:text-white">{editedIssue.project?.name || 'Unknown'}</div>
                                </div>

                                {/* Author */}
                                <div>
                                    <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Author</label>
                                    <div className="font-medium text-gray-900 dark:text-white">{editedIssue.author?.name || 'Unknown'}</div>
                                </div>

                                {/* Parent Issue */}
                                {editedIssue.parent && (
                                    <div>
                                        <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Parent Issue</label>
                                        <div className="font-medium text-gray-900 dark:text-white">#{editedIssue.parent.id}</div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Column - Dates & Planning */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-3">
                                Dates & Planning
                            </h3>
                            <div className="space-y-4">
                                {/* Start Date */}
                                <div>
                                    <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Start Date</label>
                                    {!isEditMode ? (
                                        <div className="font-medium text-gray-900 dark:text-white">{editedIssue.start_date || '-'}</div>
                                    ) : (
                                        <input
                                            type="date"
                                            value={editedIssue.start_date || ''}
                                            onChange={(e) => setEditedIssue({ ...editedIssue, start_date: e.target.value })}
                                            className={inputClassName}
                                        />
                                    )}
                                </div>

                                {/* Due Date */}
                                <div>
                                    <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Due Date</label>
                                    {!isEditMode ? (
                                        <div className="font-medium text-gray-900 dark:text-white">{editedIssue.due_date || '-'}</div>
                                    ) : (
                                        <input
                                            type="date"
                                            value={editedIssue.due_date || ''}
                                            onChange={(e) => setEditedIssue({ ...editedIssue, due_date: e.target.value })}
                                            className={inputClassName}
                                        />
                                    )}
                                </div>

                                {/* Fixed Version */}
                                <div>
                                    <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Target Version</label>
                                    {!isEditMode ? (
                                        <div className="font-medium text-gray-900 dark:text-white">{editedIssue.fixed_version?.name || '-'}</div>
                                    ) : (
                                        <select
                                            value={editedIssue.fixed_version?.id || ''}
                                            onChange={(e) => {
                                                const version = MOCK_VERSIONS.find(v => v.id === Number(e.target.value));
                                                setEditedIssue({ ...editedIssue, fixed_version: version });
                                            }}
                                            className={selectClassName}
                                        >
                                            <option value="">None</option>
                                            {MOCK_VERSIONS.map(version => (
                                                <option key={version.id} value={version.id}>{version.name}</option>
                                            ))}
                                        </select>
                                    )}
                                </div>

                                {/* Done Ratio */}
                                <div>
                                    <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Done Ratio</label>
                                    <div className="font-medium text-gray-900 dark:text-white">{editedIssue.done_ratio}%</div>
                                </div>

                                {/* Estimated Hours */}
                                <div>
                                    <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Estimated Hours</label>
                                    <div className="font-medium text-gray-900 dark:text-white">{editedIssue.estimated_hours || '-'}</div>
                                </div>

                                {/* Spent Hours */}
                                <div>
                                    <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Spent Hours</label>
                                    <div className="font-medium text-gray-900 dark:text-white">{editedIssue.spent_hours || 0}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Custom Fields Section */}
                    {renderCustomFields && (
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-3">
                                Custom Fields
                            </h3>
                            {renderCustomFields({
                                issue: editedIssue,
                                isEditMode,
                                onUpdate: handleCustomFieldsUpdate
                            })}
                        </div>
                    )}

                    {/* Timestamps */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-zinc-800">
                        <div>
                            <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Created</label>
                            <div className="font-medium text-gray-900 dark:text-white text-sm">{new Date(editedIssue.created_on).toLocaleString()}</div>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Updated</label>
                            <div className="font-medium text-gray-900 dark:text-white text-sm">{new Date(editedIssue.updated_on).toLocaleString()}</div>
                        </div>
                        {editedIssue.closed_on && (
                            <div>
                                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Closed</label>
                                <div className="font-medium text-gray-900 dark:text-white text-sm">{new Date(editedIssue.closed_on).toLocaleString()}</div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/30 rounded-b-xl flex justify-end gap-3">
                    {isEditMode ? (
                        <>
                            <button
                                onClick={handleCancelEdit}
                                className="px-4 py-2 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors flex items-center gap-2"
                            >
                                <XCircle className="w-4 h-4" />
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                            >
                                {isSaving ? (
                                    <>
                                        <LoadingSpinner size="sm" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors"
                        >
                            Close
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
