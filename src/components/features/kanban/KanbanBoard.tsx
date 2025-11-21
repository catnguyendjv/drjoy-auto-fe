'use client';

import { useEffect, useState, useMemo } from 'react';
import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragOverEvent,
    DragEndEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { KanbanColumn } from './KanbanColumn';
import { KanbanCard } from './KanbanCard';
import { IssueDetailModal } from '@/components/common/modals/IssueDetailModal';
import { ParentTicketBlock } from './ParentTicketBlock';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { updateIssueStatus, setIssues, setStatuses, updateIssue, setLoading } from '@/lib/redux/slices/kanbanSlice';
import { Issue } from '@/types/redmine';
import { toast } from 'sonner';
import { LoadingOverlay } from '@/components/ui/LoadingSpinner';

import { MOCK_ISSUES, MOCK_STATUSES } from '@/data/mockData';
import { KanbanFilters } from '@/components/common/filters/KanbanFilters';

export function KanbanBoard() {
    const dispatch = useAppDispatch();
    const { issues, statuses, loading } = useAppSelector((state) => state.kanban);
    const [activeIssue, setActiveIssue] = useState<Issue | null>(null);
    const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
    const [filterVersion, setFilterVersion] = useState<string>('');
    const [filterTeam, setFilterTeam] = useState<string>('');
    const [filterAssignee, setFilterAssignee] = useState<string>('');
    const [filterIssueId, setFilterIssueId] = useState<string>('');
    const [filterRootIssueId, setFilterRootIssueId] = useState<string>('');

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        // Load mock data on mount
        if (issues.length === 0) {
            dispatch(setLoading(true));
            // Simulate API call delay
            setTimeout(() => {
                dispatch(setStatuses(MOCK_STATUSES));
                dispatch(setIssues(MOCK_ISSUES));
                dispatch(setLoading(false));
                toast.success('Issues loaded successfully');
            }, 800);
        }
    }, [dispatch, issues.length]);



    // Filter issues based on selected filters
    const filteredIssues = useMemo(() => {
        return issues.filter(issue => {
            if (filterVersion && issue.fixed_version?.name !== filterVersion) return false;
            if (filterTeam && issue.team?.name !== filterTeam) return false;
            if (filterAssignee && issue.assigned_to?.name !== filterAssignee) return false;
            if (filterIssueId && !issue.id.toString().includes(filterIssueId)) return false;
            if (filterRootIssueId && !issue.parent_id?.toString().includes(filterRootIssueId)) return false;
            return true;
        });
    }, [issues, filterVersion, filterTeam, filterAssignee, filterIssueId, filterRootIssueId]);

    // Group issues by parent
    const { parentTickets, standaloneIssues } = useMemo(() => {
        const parents: Issue[] = [];
        const standalone: Issue[] = [];
        const parentMap = new Map<number, Issue>();

        // First pass: identify all parent tickets from filteredIssues
        // BUT check if they have children in the FULL issues array
        filteredIssues.forEach(issue => {
            if (!issue.parent_id) {
                // Check if this issue is a parent of other issues in the FULL issues list
                const hasChildren = issues.some(i => i.parent_id === issue.id);
                if (hasChildren) {
                    parents.push(issue);
                    parentMap.set(issue.id, issue);
                } else {
                    standalone.push(issue);
                }
            }
        });

        // Sort parents by ID
        parents.sort((a, b) => a.id - b.id);

        return { parentTickets: parents, standaloneIssues: standalone };
    }, [filteredIssues, issues]);

    // Get children for a parent ticket
    const getChildrenForParent = (parentId: number): Issue[] => {
        return filteredIssues.filter(issue => issue.parent_id === parentId);
    };

    function handleDragStart(event: DragStartEvent) {
        const { active } = event;
        const issue = active.data.current?.issue as Issue;
        setActiveIssue(issue);
    }

    function handleDragOver(event: DragOverEvent) {
        // Optional: Handle drag over logic if needed for visual feedback
    }

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        setActiveIssue(null);

        if (!over) return;

        const issueId = active.id as number;
        const overId = over.id; // This could be a column ID or another card ID

        // Find the issue being dragged
        const issue = issues.find((i) => i.id === issueId);
        if (!issue) return;

        // Determine the new status
        let newStatusId: number | undefined;

        // If dropped on a column, handle both regular and unique IDs
        let overColumn = statuses.find(s => s.id === overId);

        // If not found directly, try to parse from unique ID strings
        if (!overColumn && typeof overId === 'string') {
            const parentMatch = overId.match(/^parent-\d+-status-(\d+)$/);
            const standaloneMatch = overId.match(/^standalone-status-(\d+)$/);
            let statusIdFromOver: number | null = null;

            if (parentMatch) {
                statusIdFromOver = parseInt(parentMatch[1], 10);
            } else if (standaloneMatch) {
                statusIdFromOver = parseInt(standaloneMatch[1], 10);
            }

            if (statusIdFromOver) {
                overColumn = statuses.find(s => s.id === statusIdFromOver);
            }
        }

        if (overColumn) {
            newStatusId = overColumn.id;
        } else {
            // If dropped on another card, find that card's status
            const overIssue = issues.find(i => i.id === overId);
            if (overIssue) {
                newStatusId = overIssue.status.id;
            }
        }

        if (newStatusId && newStatusId !== issue.status.id) {
            const statusName = statuses.find(s => s.id === newStatusId)?.name || '';

            try {
                dispatch(updateIssueStatus({ issueId, statusId: newStatusId!, statusName }));
                toast.success(`Issue #${issueId} moved to ${statusName}`);
            } catch (error) {
                toast.error('Failed to update issue status');
            }
        }
    }

    function handleIssueClick(issue: Issue) {
        setSelectedIssue(issue);
    }

    function handleSaveIssue(updatedIssue: Issue) {
        dispatch(updateIssue(updatedIssue));
        setSelectedIssue(null);
    }

    const handleClearFilters = () => {
        setFilterVersion('');
        setFilterTeam('');
        setFilterAssignee('');
        setFilterIssueId('');
        setFilterRootIssueId('');
    };

    const hasActiveFilters = !!(filterVersion || filterTeam || filterAssignee || filterIssueId || filterRootIssueId);

    return (
        <>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                <div className="flex flex-col">
                    <KanbanFilters
                        filterVersion={filterVersion}
                        setFilterVersion={setFilterVersion}
                        filterTeam={filterTeam}
                        setFilterTeam={setFilterTeam}
                        filterAssignee={filterAssignee}
                        setFilterAssignee={setFilterAssignee}
                        filterIssueId={filterIssueId}
                        setFilterIssueId={setFilterIssueId}
                        filterRootIssueId={filterRootIssueId}
                        setFilterRootIssueId={setFilterRootIssueId}
                        onClearFilters={handleClearFilters}
                        hasActiveFilters={hasActiveFilters}
                    />

                    {/* Parent Ticket Blocks */}
                    <div className="space-y-6">
                        {parentTickets.map((parent) => (
                            <ParentTicketBlock
                                key={parent.id}
                                parent={parent}
                                children={getChildrenForParent(parent.id)}
                                statuses={statuses}
                                onIssueClick={handleIssueClick}
                            />
                        ))}

                        {/* Standalone Issues Section */}
                        {standaloneIssues.length > 0 && (
                            <div className="border border-gray-300 dark:border-zinc-700 rounded-lg overflow-hidden bg-white dark:bg-zinc-900">
                                <div className="bg-gray-100 dark:bg-zinc-800 border-b border-gray-300 dark:border-zinc-700 p-3">
                                    <h3 className="text-md font-semibold text-gray-700 dark:text-gray-300">
                                        Standalone Issues
                                    </h3>
                                </div>
                                <div className="p-4 bg-gray-50 dark:bg-zinc-950">
                                    <div className="flex gap-4 overflow-x-auto">
                                        {statuses.map((status) => (
                                            <KanbanColumn
                                                key={`standalone-${status.id}`}
                                                status={{
                                                    ...status,
                                                    id: `standalone-status-${status.id}`,
                                                } as any}
                                                issues={standaloneIssues.filter((i) => i.status.id === status.id)}
                                                onIssueClick={handleIssueClick}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <DragOverlay>
                    {activeIssue ? <KanbanCard issue={activeIssue} /> : null}
                </DragOverlay>
            </DndContext>

            {selectedIssue && (
                <IssueDetailModal
                    issue={selectedIssue}
                    onClose={() => setSelectedIssue(null)}
                    onSave={handleSaveIssue}
                />
            )}

            {loading && <LoadingOverlay message="Processing..." />}
        </>
    );
}
