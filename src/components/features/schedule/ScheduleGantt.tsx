'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { Gantt, Task, ViewMode } from 'gantt-task-react';
import "gantt-task-react/dist/index.css";
import '@/styles/gantt-dark.css';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setIssues, setStatuses, updateIssueDates, updateIssue, setLoading } from '@/lib/redux/slices/kanbanSlice';
import { Issue } from '@/types/redmine';
import { IssueDetailModal } from '@/components/common/modals/IssueDetailModal';
import { MOCK_ISSUES, MOCK_STATUSES } from '@/data/mockData';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';
import { LoadingOverlay } from '@/components/ui/LoadingSpinner';
import { TargetVersionFilter } from '@/components/common/filters/TargetVersionFilter';
import { TeamFilter } from '@/components/common/filters/TeamFilter';
import { AssigneeFilter } from '@/components/common/filters/AssigneeFilter';
import { IssueIdFilter } from '@/components/common/filters/IssueIdFilter';

// Mock current user ID
const CURRENT_USER_ID = 1;

const TASK_STYLES = { progressColor: '#2563eb', progressSelectedColor: '#1d4ed8' };

export function ScheduleGantt() {
    const dispatch = useAppDispatch();
    const { issues, statuses, loading } = useAppSelector((state) => state.kanban);
    const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
    const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.Day);
    const { resolvedTheme } = useTheme();
    const [filterStartDate, setFilterStartDate] = useState<string>('');
    const [filterEndDate, setFilterEndDate] = useState<string>('');
    const [filterVersion, setFilterVersion] = useState<string>('');
    const [filterTeam, setFilterTeam] = useState<string>('');
    const [filterAssignee, setFilterAssignee] = useState<string>('');
    const [filterIssueId, setFilterIssueId] = useState<string>('');
    const [filterRootIssueId, setFilterRootIssueId] = useState<string>('');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        // Load mock data on mount if empty
        if (issues.length === 0) {
            dispatch(setLoading(true));
            setTimeout(() => {
                dispatch(setStatuses(MOCK_STATUSES));
                dispatch(setIssues(MOCK_ISSUES));
                dispatch(setLoading(false));
                toast.success('Schedule loaded successfully');
            }, 800);
        }
    }, [dispatch, issues.length]);


    const tasks: Task[] = useMemo(() => {
        return issues
            .filter(issue => {
                // Filter by assignee
                if (filterAssignee && issue.assigned_to?.name !== filterAssignee) return false;

                // Filter by Issue ID
                if (filterIssueId && !issue.id.toString().includes(filterIssueId)) return false;

                // Filter by Root Issue ID (parent_id)
                if (filterRootIssueId && !issue.parent_id?.toString().includes(filterRootIssueId)) return false;

                // Filter by version
                if (filterVersion && issue.fixed_version?.name !== filterVersion) return false;

                // Filter by team
                if (filterTeam && issue.team?.name !== filterTeam) return false;

                if (filterStartDate || filterEndDate) {
                    // Use local time for comparison to match visualization
                    const start = issue.start_date ? new Date(issue.start_date + 'T00:00:00') : new Date(issue.created_on);
                    const end = issue.due_date ? new Date(issue.due_date + 'T00:00:00') : new Date(start.getTime() + 86400000);

                    if (end <= start) {
                        end.setDate(start.getDate() + 1);
                    }

                    if (filterStartDate) {
                        const fStart = new Date(filterStartDate + 'T00:00:00');
                        if (end < fStart) return false;
                    }

                    if (filterEndDate) {
                        const fEnd = new Date(filterEndDate + 'T00:00:00');
                        fEnd.setHours(23, 59, 59, 999);
                        if (start > fEnd) return false;
                    }
                }

                return true;
            })
            .map(issue => {
                // Parse dates as local time to match Gantt's internal handling and avoid timezone shifts
                const start = issue.start_date ? new Date(issue.start_date + 'T00:00:00') : new Date(issue.created_on);
                // Default 1 day duration if no due date
                const end = issue.due_date ? new Date(issue.due_date + 'T00:00:00') : new Date(start.getTime() + 86400000);

                // Ensure end date is after start date
                if (end <= start) {
                    end.setDate(start.getDate() + 1);
                }

                const statusObj = statuses.find(s => s.id === issue.status.id);
                const isClosed = statusObj?.is_closed || false;

                return {
                    start,
                    end,
                    name: issue.subject,
                    id: issue.id.toString(),
                    type: 'task',
                    progress: isClosed ? 100 : 0, // Simple progress based on closed status
                    isDisabled: false,
                    styles: TASK_STYLES,
                };
            });
    }, [issues, statuses, filterStartDate, filterEndDate, filterVersion, filterTeam, filterAssignee, filterIssueId, filterRootIssueId]);

    const handleTaskChange = useCallback((task: Task) => {
        const issueId = parseInt(task.id);
        console.log("handleTaskChange called for task:", issueId);

        // Helper to format date as YYYY-MM-DD in local time
        const toLocalDateString = (date: Date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        const startDate = toLocalDateString(task.start);
        const dueDate = toLocalDateString(task.end);

        // Return a promise to let the Gantt component handle the async state
        return new Promise<void>((resolve, reject) => {
            setTimeout(() => {
                try {
                    dispatch(updateIssueDates({ issueId, startDate, dueDate }));
                    toast.success(`Issue #${issueId} dates updated`);
                    resolve();
                } catch (error) {
                    toast.error('Failed to update issue dates');
                    reject(error);
                }
            }, 500);
        });
    }, [dispatch]);

    const handleTaskClick = useCallback((task: Task) => {
        const issue = issues.find(i => i.id === parseInt(task.id));
        if (issue) {
            setSelectedIssue(issue);
        }
    }, [issues]);

    const handleExpanderClick = useCallback((task: Task) => {
        // Handle expander click if needed
    }, []);

    const handleSaveIssue = (updatedIssue: Issue) => {
        dispatch(updateIssue(updatedIssue));
        setSelectedIssue(null);
    };

    const handleClearFilters = () => {
        setFilterStartDate('');
        setFilterEndDate('');
        setFilterVersion('');
        setFilterTeam('');
        setFilterAssignee('');
        setFilterIssueId('');
        setFilterRootIssueId('');
    };

    const hasActiveFilters = filterStartDate || filterEndDate || filterVersion || filterTeam || filterAssignee || filterIssueId || filterRootIssueId;

    if (!mounted) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="text-gray-500">Loading...</div>
            </div>
        );
    }

    // Generate a unique key for the Gantt component based on issue dates to force remount on updates
    const ganttKey = issues.map(i => `${i.id}:${i.start_date}:${i.due_date}`).join('|');

    return (
        <div className="h-full flex flex-col">
            <div className="flex flex-col gap-4 mb-4">
                {/* First row: Date filters and view mode */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">From:</label>
                            <input
                                type="date"
                                value={filterStartDate}
                                onChange={(e) => setFilterStartDate(e.target.value)}
                                className="px-2 py-1 border rounded text-sm bg-white dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                            />
                        </div>
                        <div className="flex items-center space-x-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">To:</label>
                            <input
                                type="date"
                                value={filterEndDate}
                                onChange={(e) => setFilterEndDate(e.target.value)}
                                className="px-2 py-1 border rounded text-sm bg-white dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                            />
                        </div>
                    </div>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => setViewMode(ViewMode.Day)}
                            className={`px-3 py-1 rounded ${viewMode === ViewMode.Day ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800 dark:bg-zinc-800 dark:text-gray-200'}`}
                        >
                            Day
                        </button>
                        <button
                            onClick={() => setViewMode(ViewMode.Week)}
                            className={`px-3 py-1 rounded ${viewMode === ViewMode.Week ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800 dark:bg-zinc-800 dark:text-gray-200'}`}
                        >
                            Week
                        </button>
                        <button
                            onClick={() => setViewMode(ViewMode.Month)}
                            className={`px-3 py-1 rounded ${viewMode === ViewMode.Month ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800 dark:bg-zinc-800 dark:text-gray-200'}`}
                        >
                            Month
                        </button>
                    </div>
                </div>

                {/* Second row: Version, Team, Assignee, and Issue ID filters */}
                <div className="flex items-center space-x-4">
                    <TargetVersionFilter value={filterVersion} onChange={setFilterVersion} />
                    <TeamFilter value={filterTeam} onChange={setFilterTeam} />
                    <AssigneeFilter value={filterAssignee} onChange={setFilterAssignee} />
                    <IssueIdFilter value={filterIssueId} onChange={setFilterIssueId} />
                    <IssueIdFilter value={filterRootIssueId} onChange={setFilterRootIssueId} label="Root Issue ID:" />
                    {hasActiveFilters && (
                        <button
                            onClick={handleClearFilters}
                            className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                            Clear All Filters
                        </button>
                    )}
                </div>
            </div>

            <div className="flex-1 overflow-auto bg-white dark:bg-zinc-900 rounded-lg shadow">
                {tasks.length > 0 ? (
                    <Gantt
                        key={ganttKey}
                        tasks={tasks}
                        viewMode={viewMode}
                        onDateChange={handleTaskChange}
                        onDoubleClick={handleTaskClick}
                        onExpanderClick={handleExpanderClick}
                        listCellWidth="155px"
                        columnWidth={viewMode === ViewMode.Month ? 300 : 65}
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        No tasks assigned to you with schedule dates.
                    </div>
                )}
            </div>

            {selectedIssue && (
                <IssueDetailModal
                    issue={selectedIssue}
                    onClose={() => setSelectedIssue(null)}
                    onSave={handleSaveIssue}
                />
            )}

            {loading && <LoadingOverlay message="Processing..." />}
        </div>
    );
}
