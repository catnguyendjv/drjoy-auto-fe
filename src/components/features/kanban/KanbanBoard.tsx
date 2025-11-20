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
import { KanbanIssueDetailModal } from './KanbanIssueDetailModal';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { updateIssueStatus, setIssues, setStatuses, updateIssue, setLoading } from '@/lib/redux/slices/kanbanSlice';
import { Issue } from '@/types/redmine';
import { toast } from 'sonner';
import { LoadingOverlay } from '@/components/ui/LoadingSpinner';

import { MOCK_ISSUES, MOCK_STATUSES } from '@/data/mockData';

export function KanbanBoard() {
    const dispatch = useAppDispatch();
    const { issues, statuses, loading } = useAppSelector((state) => state.kanban);
    const [activeIssue, setActiveIssue] = useState<Issue | null>(null);
    const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
    const [filterVersion, setFilterVersion] = useState<string>('');
    const [filterTeam, setFilterTeam] = useState<string>('');

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

    // Get unique versions and teams from issues
    const versions = useMemo(() => {
        const versionSet = new Set(issues.map(i => i.fixed_version?.name).filter(Boolean));
        return Array.from(versionSet).sort();
    }, [issues]);

    const teams = useMemo(() => {
        const teamSet = new Set(issues.map(i => i.team?.name).filter(Boolean));
        return Array.from(teamSet).sort();
    }, [issues]);

    // Filter issues based on selected filters
    const filteredIssues = useMemo(() => {
        return issues.filter(issue => {
            if (filterVersion && issue.fixed_version?.name !== filterVersion) return false;
            if (filterTeam && issue.team?.name !== filterTeam) return false;
            return true;
        });
    }, [issues, filterVersion, filterTeam]);

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

        // If dropped on a column
        const overColumn = statuses.find(s => s.id === overId);
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

            // Simulate API call with loading
            dispatch(setLoading(true));

            // Simulate API delay
            setTimeout(() => {
                try {
                    dispatch(updateIssueStatus({ issueId, statusId: newStatusId!, statusName }));
                    dispatch(setLoading(false));
                    toast.success(`Issue #${issueId} moved to ${statusName}`);
                } catch (error) {
                    dispatch(setLoading(false));
                    toast.error('Failed to update issue status');
                }
            }, 500);
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
    };

    const hasActiveFilters = filterVersion || filterTeam;

    return (
        <>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                {/* Filter controls */}
                <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center space-x-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Target Version:</label>
                        <select
                            value={filterVersion}
                            onChange={(e) => setFilterVersion(e.target.value)}
                            className="px-3 py-1 border rounded text-sm bg-white dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                        >
                            <option value="">All Versions</option>
                            {versions.map(version => (
                                <option key={version} value={version}>{version}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-center space-x-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Team:</label>
                        <select
                            value={filterTeam}
                            onChange={(e) => setFilterTeam(e.target.value)}
                            className="px-3 py-1 border rounded text-sm bg-white dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                        >
                            <option value="">All Teams</option>
                            {teams.map(team => (
                                <option key={team} value={team}>{team}</option>
                            ))}
                        </select>
                    </div>
                    {hasActiveFilters && (
                        <button
                            onClick={handleClearFilters}
                            className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                            Clear All Filters
                        </button>
                    )}
                </div>

                <div className="flex h-full gap-6 overflow-x-auto pb-4">
                    {statuses.map((status) => (
                        <KanbanColumn
                            key={status.id}
                            status={status}
                            issues={filteredIssues.filter((i) => i.status.id === status.id)}
                            onIssueClick={handleIssueClick}
                        />
                    ))}
                </div>

                <DragOverlay>
                    {activeIssue ? <KanbanCard issue={activeIssue} /> : null}
                </DragOverlay>
            </DndContext>

            {selectedIssue && (
                <KanbanIssueDetailModal
                    issue={selectedIssue}
                    onClose={() => setSelectedIssue(null)}
                    onSave={handleSaveIssue}
                />
            )}

            {loading && <LoadingOverlay message="Processing..." />}
        </>
    );
}
