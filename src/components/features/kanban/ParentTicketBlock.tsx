'use client';

import { Issue, IssueStatus } from '@/types/redmine';
import { KanbanColumn } from './KanbanColumn';
import { useMemo } from 'react';

interface ParentTicketBlockProps {
    parent: Issue;
    children: Issue[];
    statuses: IssueStatus[];
    onIssueClick: (issue: Issue, e: React.MouseEvent) => void;
    onIssueDoubleClick: (issue: Issue, e: React.MouseEvent) => void;
    selectedIssueIds: number[];
}

export function ParentTicketBlock({
    parent,
    children,
    statuses,
    onIssueClick,
    onIssueDoubleClick,
    selectedIssueIds,
}: ParentTicketBlockProps) {
    const priorityColors: Record<string, string> = {
        'Low': 'text-gray-500 dark:text-gray-400',
        'Normal': 'text-blue-600 dark:text-blue-400',
        'High': 'text-orange-600 dark:text-orange-400',
        'Urgent': 'text-red-600 dark:text-red-400',
    };

    const priorityColor = priorityColors[parent.priority.name] || 'text-gray-600';

    // Create modified statuses with unique IDs for this parent
    const parentStatuses = useMemo(() =>
        statuses.map(status => ({
            ...status,
            id: `parent-${parent.id}-status-${status.id}`,
            originalId: status.id
        })),
        [statuses, parent.id]
    );

    return (
        <div className="mb-8 border border-gray-300 dark:border-zinc-700 rounded-lg overflow-hidden bg-white dark:bg-zinc-900">
            {/* Parent Ticket Header */}
            <div 
                className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-zinc-800 dark:to-zinc-800 border-b border-gray-300 dark:border-zinc-700 p-4 cursor-pointer hover:from-blue-100 hover:to-indigo-100 dark:hover:from-zinc-700 dark:hover:to-zinc-700 transition-colors"
                onDoubleClick={(e) => onIssueDoubleClick(parent, e)}
            >
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                                #{parent.id}
                            </span>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                {parent.subject}
                            </h3>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 ml-4">
                        <div className="text-right">
                            <div className="text-xs text-gray-500 dark:text-gray-400">Priority</div>
                            <div className={`text-sm font-semibold ${priorityColor}`}>
                                {parent.priority.name}
                            </div>
                        </div>
                        {parent.due_date && (
                            <div className="text-right">
                                <div className="text-xs text-gray-500 dark:text-gray-400">Due Date</div>
                                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {new Date(parent.due_date).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric'
                                    })}
                                </div>
                            </div>
                        )}
                        <div className="text-right">
                            <div className="text-xs text-gray-500 dark:text-gray-400">Status</div>
                            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {parent.status.name}
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-xs text-gray-500 dark:text-gray-400">Subtasks</div>
                            <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                {children.length}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Child Tickets in Columns */}
            <div className="p-4 bg-gray-50 dark:bg-zinc-950">
                <div className="flex gap-4 overflow-x-auto">
                    {parentStatuses.map((status) => (
                        <KanbanColumn
                            key={status.id}
                            status={status as any}
                            issues={children.filter((i) => i.status.id === (status as any).originalId)}
                            onIssueClick={onIssueClick}
                            onIssueDoubleClick={onIssueDoubleClick}
                            selectedIssueIds={selectedIssueIds}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

