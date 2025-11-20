import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Issue } from '@/types/redmine';
import { clsx } from 'clsx';

interface KanbanCardProps {
    issue: Issue;
    onClick?: () => void;
}

export function KanbanCard({ issue, onClick }: KanbanCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: issue.id,
        data: {
            type: 'Issue',
            issue,
        },
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={clsx(
                "bg-white dark:bg-zinc-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-700 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow",
                isDragging && "opacity-50"
            )}
            onClick={onClick}
        >
            <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">#{issue.id}</span>
                <span className={clsx(
                    "text-xs px-2 py-1 rounded-full",
                    issue.priority.name === 'High' ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" :
                        issue.priority.name === 'Normal' ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" :
                            "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                )}>
                    {issue.priority.name}
                </span>
            </div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                {issue.subject}
            </h3>
            <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                <span>{issue.assigned_to?.name || 'Unassigned'}</span>
            </div>
        </div>
    );
}
