import React from 'react';
import { Edit2, Save, X, XCircle } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Issue } from '@/types/redmine';

interface ModalHeaderProps {
    issue: Issue;
    isEditMode: boolean;
    onEdit: () => void;
    onClose: () => void;
    children?: React.ReactNode;
}

export function ModalHeader({ 
    issue, 
    isEditMode, 
    onEdit, 
    onClose,
    children
}: ModalHeaderProps) {
    return (
        <div className="flex items-start justify-between p-6 border-b border-gray-200 dark:border-zinc-800">
            <div className="flex-1">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <span className="text-sm font-mono text-gray-500 dark:text-gray-400">#{issue.id}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                        {issue.tracker?.name || 'Unknown'}
                    </span>
                    {!isEditMode && (
                        <>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium
                                ${issue.priority?.name === 'High' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                                    issue.priority?.name === 'Urgent' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' :
                                        issue.priority?.name === 'Normal' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                                            'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                                }`}>
                                {issue.priority?.name || 'No Priority'}
                            </span>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium 
                                ${issue.status?.is_closed ? 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300' : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'}`}>
                                {issue.status?.name || 'No Status'}
                            </span>
                        </>
                    )}
                </div>
                {children}
            </div>
            <div className="flex items-center gap-2 ml-4">
                {!isEditMode && (
                    <button
                        onClick={onEdit}
                        className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        title="Edit issue"
                    >
                        <Edit2 className="w-5 h-5" />
                    </button>
                )}
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
}

interface ModalFooterProps {
    isEditMode: boolean;
    isSaving: boolean;
    hasChanges: boolean;
    onSave: () => void;
    onCancel: () => void;
    onClose: () => void;
}

export function ModalFooter({
    isEditMode,
    isSaving,
    hasChanges,
    onSave,
    onCancel,
    onClose
}: ModalFooterProps) {
    return (
        <div className="p-6 border-t border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/30 rounded-b-xl flex justify-end gap-3">
            {isEditMode ? (
                <>
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors flex items-center gap-2"
                    >
                        <XCircle className="w-4 h-4" />
                        Cancel
                    </button>
                    <button
                        onClick={onSave}
                        disabled={isSaving || !hasChanges}
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
    );
}
