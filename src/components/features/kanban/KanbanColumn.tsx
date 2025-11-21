import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Issue, IssueStatus } from '@/types/redmine';
import { KanbanCard } from './KanbanCard';
import { clsx } from 'clsx';

interface KanbanColumnProps {
    status: IssueStatus;
    issues: Issue[];
    onIssueClick?: (issue: Issue, e: React.MouseEvent) => void;
    onIssueDoubleClick?: (issue: Issue, e: React.MouseEvent) => void;
    selectedIssueIds?: number[];
}

export function KanbanColumn({ status, issues, onIssueClick, onIssueDoubleClick, selectedIssueIds = [] }: KanbanColumnProps) {
    const { setNodeRef } = useDroppable({
        id: status.id,
        data: {
            type: 'Column',
            status,
        },
    });

    return (
        <div className="flex flex-col w-80 shrink-0">
            <div className="flex items-center justify-between mb-4 px-1">
                <h2 className="font-semibold text-gray-700 dark:text-gray-200">
                    {status.name}
                </h2>
                <span className="bg-gray-200 dark:bg-zinc-700 text-gray-600 dark:text-gray-300 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {issues.length}
                </span>
            </div>

            <div
                ref={setNodeRef}
                className={clsx(
                    "flex-1 rounded-xl p-4 space-y-3 min-h-[500px]",
                    "bg-gray-50 dark:bg-zinc-900/50",
                    "border-2 border-gray-200 dark:border-zinc-800"
                )}
            >
                <SortableContext items={issues.map(i => i.id)} strategy={verticalListSortingStrategy}>
                    {issues.map((issue) => (
                        <KanbanCard 
                            key={issue.id} 
                            issue={issue} 
                            onClick={(e) => onIssueClick?.(issue, e)}
                            onDoubleClick={(e) => onIssueDoubleClick?.(issue, e)}
                            isSelected={selectedIssueIds.includes(issue.id)}
                        />
                    ))}
                </SortableContext>
            </div>
        </div>
    );
}
