import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Issue } from '@/types/redmine';
import { clsx } from 'clsx';

interface KanbanCardProps {
    issue: Issue;
    onClick?: (e: React.MouseEvent) => void;
    onDoubleClick?: (e: React.MouseEvent) => void;
    isSelected?: boolean;
}

export function KanbanCard({ issue, onClick, onDoubleClick, isSelected }: KanbanCardProps) {
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

    // Extract story points from custom fields
    const storyPointsField = issue.custom_fields?.find(cf => cf.name === 'ストーリーポイント(Story point)');
    const storyPoints = storyPointsField?.value ?? undefined;

    // Format due date
    const formatDate = (dateString?: string | null) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        const now = new Date();
        const isOverdue = date < now;
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return { formatted: `${month}/${day}`, isOverdue };
    };

    const dueDate = formatDate(issue.due_date);
    const startDate = formatDate(issue.start_date);

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={clsx(
                "bg-white dark:bg-zinc-800 p-3 rounded-lg shadow-sm border transition-shadow cursor-grab active:cursor-grabbing hover:shadow-md",
                isSelected 
                    ? "border-blue-500 ring-2 ring-blue-200 dark:ring-blue-900" 
                    : "border-gray-200 dark:border-zinc-700",
                isDragging && "opacity-50"
            )}
            onClick={onClick}
            onDoubleClick={onDoubleClick}
        >
            {/* Header: ID, Tracker, Priority */}
            <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">#{issue.id}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 font-medium">
                        {issue.tracker.name}
                    </span>
                    {storyPoints && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 font-medium">
                            {storyPoints} SP
                        </span>
                    )}
                </div>
                <span className={clsx(
                    "text-[10px] px-1.5 py-0.5 rounded-full whitespace-nowrap",
                    issue.priority.name === 'High' ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" :
                        issue.priority.name === 'Normal' ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" :
                            "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                )}>
                    {issue.priority.name}
                </span>
            </div>

            {/* Subject */}
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                {issue.subject}
            </h3>

            {/* Time Tracking */}
            {/* Time Tracking */}
            <div className="flex gap-3 mb-2 text-[10px] text-gray-500 dark:text-gray-400">
                {issue.estimated_hours ? (
                    <span className="flex items-center gap-1" title="Estimated Time">
                        ⏱️ {issue.estimated_hours}h
                    </span>
                ) : (
                    <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium bg-amber-50 dark:bg-amber-900/20 px-1.5 py-0.5 rounded border border-amber-200 dark:border-amber-800" title="Missing Estimate">
                        ⚠️ No Est.
                    </span>
                )}
                
                {issue.spent_hours && (
                    <span className="flex items-center gap-1" title="Spent Time">
                        ⌛ {issue.spent_hours}h
                    </span>
                )}
            </div>

            {/* Progress Bar */}
            {issue.done_ratio !== undefined && issue.done_ratio > 0 && (
                <div className="mb-2">
                    <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 dark:bg-zinc-700 rounded-full h-1.5 overflow-hidden">
                            <div 
                                className="bg-green-500 dark:bg-green-400 h-full transition-all duration-300"
                                style={{ width: `${issue.done_ratio}%` }}
                            />
                        </div>
                        <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium min-w-[30px] text-right">
                            {issue.done_ratio}%
                        </span>
                    </div>
                </div>
            )}

            {/* Footer: Assignee and Dates */}
            <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                <span className="truncate flex-1 text-[11px]">
                    👤 {issue.assigned_to?.name || 'Unassigned'}
                </span>
                <div className="flex items-center gap-1 ml-2">
                    {startDate && (
                         <span className={clsx(
                            "text-[10px] px-1.5 py-0.5 rounded font-medium",
                            startDate.isOverdue && (issue.done_ratio === 0 || issue.status.name === 'New')
                                ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                                : "bg-gray-100 text-gray-700 dark:bg-zinc-700 dark:text-gray-300"
                         )} title={startDate.isOverdue && (issue.done_ratio === 0 || issue.status.name === 'New') ? "Start Date Overdue!" : "Start Date"}>
                            🚀 {startDate.formatted}
                        </span>
                    )}
                    {dueDate && (
                        <span className={clsx(
                            "text-[10px] px-1.5 py-0.5 rounded font-medium",
                            dueDate.isOverdue && issue.done_ratio < 100 && !issue.status.is_closed
                                ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 border border-red-200 dark:border-red-800 animate-pulse"
                                : "bg-gray-100 text-gray-700 dark:bg-zinc-700 dark:text-gray-300"
                        )} title={dueDate.isOverdue && issue.done_ratio < 100 && !issue.status.is_closed ? "Due Date Overdue!" : "Due Date"}>
                            🏁 {dueDate.formatted}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
