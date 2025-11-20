import { Issue } from '@/types/redmine';
import { BugDetailModal } from './BugDetailModal';
import { TaskDetailModal } from './TaskDetailModal';
import { DevDetailModal } from './DevDetailModal';
import { BaseIssueDetailModal } from './BaseIssueDetailModal';

interface IssueDetailModalProps {
    issue: Issue;
    onClose: () => void;
    onSave?: (updatedIssue: Issue) => void;
}

export function IssueDetailModal({ issue, onClose, onSave }: IssueDetailModalProps) {
    const trackerName = issue.tracker.name.toLowerCase();

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
