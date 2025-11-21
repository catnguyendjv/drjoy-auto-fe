import { Issue } from '@/types/redmine';
import { BugDetailModal } from './BugDetailModal';
import { TaskDetailModal } from './TaskDetailModal';
import { DevDetailModal } from './DevDetailModal';
import { BaseIssueDetailModal } from './BaseIssueDetailModal';
import { useEffect, useState } from 'react';
import { redmineApi } from '@/lib/api/redmine.service';
import { LoadingSpinner, LoadingOverlay } from '@/components/ui/LoadingSpinner';
import { toast } from 'sonner';

interface IssueDetailModalProps {
    issue?: Issue;
    issueId?: number;
    onClose: () => void;
    onSave?: (updatedIssue: Issue) => void;
}

export function IssueDetailModal({ issue: initialIssue, issueId, onClose, onSave }: IssueDetailModalProps) {
    const [issue, setIssue] = useState<Issue | undefined>(initialIssue);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchIssue = async () => {
            if (!issueId && !initialIssue) return;
            
            // If we have a full issue passed in, use it (unless we specifically want to refresh)
            // For now, if issueId is provided, we fetch to get the latest
            const idToFetch = issueId || initialIssue?.id;
            
            if (!idToFetch) return;

            setIsLoading(true);
            setError(null);
            try {
                const response = await redmineApi.getIssue(idToFetch);
                
                const { issue: fetchedIssue } = response;

                if (fetchedIssue) {
                    setIssue(fetchedIssue);
                } else {
                    console.error('Invalid API response structure:', response);
                    setError('Received invalid data from server');
                }
            } catch (error) {
                console.error('Failed to fetch issue details:', error);
                setError('Failed to load issue details');
                toast.error('Failed to load issue details');
            } finally {
                setIsLoading(false);
            }
        };

        fetchIssue();
    }, [issueId, initialIssue?.id]);

    // Show loading spinner only if we don't have an issue to show yet
    if (isLoading && !issue) {
        return <LoadingOverlay message="Loading issue details..." />;
    }

    // Show error state if we failed to fetch and don't have an issue
    if (error && !issue) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <div className="bg-white dark:bg-zinc-900 p-8 rounded-xl shadow-xl flex flex-col items-center gap-4 max-w-md text-center">
                    <div className="text-red-500 text-xl font-semibold">Error</div>
                    <p className="text-gray-500 dark:text-gray-400">{error}</p>
                    <button 
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-lg text-sm font-medium transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        );
    }

    if (!issue) {
        return null;
    }

    const trackerName = issue.tracker?.name?.toLowerCase() || '';

    if (trackerName === 'bug') {
        return <BugDetailModal issue={issue} onClose={onClose} onSave={onSave} />;
    }

    if (trackerName === 'task') {
        return <TaskDetailModal issue={issue} onClose={onClose} onSave={onSave} />;
    }

    if (trackerName === 'dev') {
        return <DevDetailModal issue={issue} onClose={onClose} onSave={onSave} />;
    }

    // Default fallback
    return <BaseIssueDetailModal issue={issue} onClose={onClose} onSave={onSave} />;
}
