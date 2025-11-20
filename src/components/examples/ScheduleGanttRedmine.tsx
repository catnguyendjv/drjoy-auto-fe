/**
 * ScheduleGantt with Redmine Integration
 * Example of integrating Redmine API with existing ScheduleGantt component
 */

'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { Gantt, Task, ViewMode } from 'gantt-task-react';
import "gantt-task-react/dist/index.css";
import '@/styles/gantt-dark.css';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';
import type { Issue } from '@/types/redmine';
import { KanbanIssueDetailModal } from '../kanban/KanbanIssueDetailModal';
import { LoadingOverlay } from '@/components/ui/LoadingSpinner';

// Redmine integration imports
import { useIssues, useIssueMutations } from '@/lib/hooks/useRedmine';
import {
  openIssuesQuery,
  myIssuesQuery,
  dueThisWeekQuery,
  query,
} from '@/lib/utils/redmine-queries';
import {
  filterByTeam,
  sortByDueDate,
  getProgressPercentage,
  isIssueClosed,
} from '@/lib/utils/redmine-helpers';
import { formatDateForRedmine } from '@/lib/utils/redmine-helpers';

const TASK_STYLES = { progressColor: '#2563eb', progressSelectedColor: '#1d4ed8' };

type QueryPreset = 'all' | 'my' | 'this-week';

export function ScheduleGanttRedmine() {
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.Day);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // Filters
  const [filterStartDate, setFilterStartDate] = useState<string>('');
  const [filterEndDate, setFilterEndDate] = useState<string>('');
  const [filterVersion, setFilterVersion] = useState<string>('');
  const [filterTeam, setFilterTeam] = useState<string>('');
  const [filterAssignee, setFilterAssignee] = useState<string>('');
  const [filterIssueId, setFilterIssueId] = useState<string>('');
  const [queryPreset, setQueryPreset] = useState<QueryPreset>('all');

  // Build query based on preset
  const queryParams = useMemo(() => {
    switch (queryPreset) {
      case 'my':
        return myIssuesQuery(1);
      case 'this-week':
        return dueThisWeekQuery(1);
      default:
        return openIssuesQuery(1);
    }
  }, [queryPreset]);

  // Fetch issues from Redmine API
  const { data: issues, loading, error, refetch } = useIssues(queryParams);
  const { updateIssue: updateIssueApi } = useIssueMutations();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (error) {
      toast.error(`Failed to load issues: ${error.message}`);
    }
  }, [error]);

  // Get unique values for filters
  const versions = useMemo(() => {
    const versionSet = new Set(
      issues.map((i) => i.fixed_version?.name).filter(Boolean)
    );
    return Array.from(versionSet).sort();
  }, [issues]);

  const teams = useMemo(() => {
    const teamSet = new Set(
      issues
        .map((i) => i.custom_fields?.find((cf) => cf.id === 1)?.value)
        .filter(Boolean)
    );
    return Array.from(teamSet).sort();
  }, [issues]);

  const assignees = useMemo(() => {
    const assigneeSet = new Set(
      issues.map((i) => i.assigned_to?.name).filter(Boolean)
    );
    return Array.from(assigneeSet).sort();
  }, [issues]);

  // Filter and convert issues to Gantt tasks
  const tasks: Task[] = useMemo(() => {
    return issues
      .filter((issue) => {
        // Must have dates to display in Gantt
        if (!issue.start_date && !issue.due_date) return false;

        // Filter by assignee
        if (filterAssignee && issue.assigned_to?.name !== filterAssignee)
          return false;

        // Filter by Issue ID
        if (filterIssueId && !issue.id.toString().includes(filterIssueId))
          return false;

        // Filter by version
        if (filterVersion && issue.fixed_version?.name !== filterVersion)
          return false;

        // Filter by team (custom field)
        if (filterTeam) {
          const teamValue = issue.custom_fields?.find((cf) => cf.id === 1)?.value;
          if (teamValue !== filterTeam) return false;
        }

        // Filter by date range
        if (filterStartDate || filterEndDate) {
          const start = issue.start_date
            ? new Date(issue.start_date + 'T00:00:00')
            : new Date(issue.created_on);
          const end = issue.due_date
            ? new Date(issue.due_date + 'T00:00:00')
            : new Date(start.getTime() + 86400000);

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
      .map((issue) => {
        const start = issue.start_date
          ? new Date(issue.start_date + 'T00:00:00')
          : new Date(issue.created_on);
        const end = issue.due_date
          ? new Date(issue.due_date + 'T00:00:00')
          : new Date(start.getTime() + 86400000);

        // Ensure end date is after start date
        if (end <= start) {
          end.setDate(start.getDate() + 1);
        }

        const progress = getProgressPercentage(issue);

        return {
          start,
          end,
          name: issue.subject,
          id: issue.id.toString(),
          type: 'task' as const,
          progress,
          isDisabled: isIssueClosed(issue),
          styles: TASK_STYLES,
        };
      });
  }, [
    issues,
    filterStartDate,
    filterEndDate,
    filterVersion,
    filterTeam,
    filterAssignee,
    filterIssueId,
  ]);

  // Handle task date change - update via Redmine API
  const handleTaskChange = useCallback(
    (task: Task) => {
      const issueId = parseInt(task.id);

      const toLocalDateString = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      const startDate = toLocalDateString(task.start);
      const dueDate = toLocalDateString(task.end);

      return new Promise<void>((resolve, reject) => {
        updateIssueApi(issueId, {
          start_date: startDate,
          due_date: dueDate,
        } as any)
          .then(() => {
            toast.success(`Issue #${issueId} dates updated in Redmine`);
            refetch(); // Refresh data
            resolve();
          })
          .catch((error) => {
            toast.error(`Failed to update issue #${issueId}: ${error.message}`);
            reject(error);
          });
      });
    },
    [updateIssueApi, refetch]
  );

  // Handle task click - show detail modal
  const handleTaskClick = useCallback(
    (task: Task) => {
      const issue = issues.find((i) => i.id === parseInt(task.id));
      if (issue) {
        setSelectedIssue(issue);
      }
    },
    [issues]
  );

  const handleExpanderClick = useCallback((task: Task) => {
    // Handle expander click if needed
  }, []);

  const handleSaveIssue = (updatedIssue: Issue) => {
    updateIssueApi(updatedIssue.id, updatedIssue as any)
      .then(() => {
        toast.success(`Issue #${updatedIssue.id} updated`);
        setSelectedIssue(null);
        refetch();
      })
      .catch((error) => {
        toast.error(`Failed to update issue: ${error.message}`);
      });
  };

  const handleClearFilters = () => {
    setFilterStartDate('');
    setFilterEndDate('');
    setFilterVersion('');
    setFilterTeam('');
    setFilterAssignee('');
    setFilterIssueId('');
  };

  const hasActiveFilters =
    filterStartDate ||
    filterEndDate ||
    filterVersion ||
    filterTeam ||
    filterAssignee ||
    filterIssueId;

  if (!mounted) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  const ganttKey = issues
    .map((i) => `${i.id}:${i.start_date}:${i.due_date}`)
    .join('|');

  return (
    <div className="h-full flex flex-col">
      {/* Header with query presets */}
      <div className="mb-4 flex justify-between items-center">
        <div className="flex gap-2">
          <button
            onClick={() => setQueryPreset('all')}
            className={`px-4 py-2 rounded ${
              queryPreset === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800 dark:bg-zinc-800 dark:text-gray-200'
            }`}
          >
            All Open Issues
          </button>
          <button
            onClick={() => setQueryPreset('my')}
            className={`px-4 py-2 rounded ${
              queryPreset === 'my'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800 dark:bg-zinc-800 dark:text-gray-200'
            }`}
          >
            My Issues
          </button>
          <button
            onClick={() => setQueryPreset('this-week')}
            className={`px-4 py-2 rounded ${
              queryPreset === 'this-week'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800 dark:bg-zinc-800 dark:text-gray-200'
            }`}
          >
            Due This Week
          </button>
        </div>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-gray-200 dark:bg-zinc-800 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-zinc-700"
        >
          🔄 Refresh
        </button>
      </div>

      <div className="flex flex-col gap-4 mb-4">
        {/* First row: Date filters and view mode */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                From:
              </label>
              <input
                type="date"
                value={filterStartDate}
                onChange={(e) => setFilterStartDate(e.target.value)}
                className="px-2 py-1 border rounded text-sm bg-white dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
              />
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                To:
              </label>
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
              className={`px-3 py-1 rounded ${
                viewMode === ViewMode.Day
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-800 dark:bg-zinc-800 dark:text-gray-200'
              }`}
            >
              Day
            </button>
            <button
              onClick={() => setViewMode(ViewMode.Week)}
              className={`px-3 py-1 rounded ${
                viewMode === ViewMode.Week
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-800 dark:bg-zinc-800 dark:text-gray-200'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setViewMode(ViewMode.Month)}
              className={`px-3 py-1 rounded ${
                viewMode === ViewMode.Month
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-800 dark:bg-zinc-800 dark:text-gray-200'
              }`}
            >
              Month
            </button>
          </div>
        </div>

        {/* Second row: Other filters */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Target Version:
            </label>
            <select
              value={filterVersion}
              onChange={(e) => setFilterVersion(e.target.value)}
              className="px-3 py-1 border rounded text-sm bg-white dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
            >
              <option value="">All Versions</option>
              {versions.map((version) => (
                <option key={version} value={version}>
                  {version}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Team:
            </label>
            <select
              value={filterTeam}
              onChange={(e) => setFilterTeam(e.target.value)}
              className="px-3 py-1 border rounded text-sm bg-white dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
            >
              <option value="">All Teams</option>
              {teams.map((team) => (
                <option key={team} value={team}>
                  {team}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Assignee:
            </label>
            <select
              value={filterAssignee}
              onChange={(e) => setFilterAssignee(e.target.value)}
              className="px-3 py-1 border rounded text-sm bg-white dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
            >
              <option value="">All Assignees</option>
              {assignees.map((assignee) => (
                <option key={assignee} value={assignee}>
                  {assignee}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Issue ID:
            </label>
            <input
              type="text"
              value={filterIssueId}
              onChange={(e) => setFilterIssueId(e.target.value)}
              placeholder="Search ID..."
              className="px-3 py-1 border rounded text-sm bg-white dark:bg-zinc-800 dark:border-zinc-700 dark:text-white w-24"
            />
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

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          <span>Total Issues: {issues.length}</span>
          <span>|</span>
          <span>Displayed Tasks: {tasks.length}</span>
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
            {loading
              ? 'Loading issues from Redmine...'
              : 'No tasks found with schedule dates.'}
          </div>
        )}
      </div>

      {selectedIssue && (
        <KanbanIssueDetailModal
          issue={selectedIssue}
          onClose={() => setSelectedIssue(null)}
          onSave={handleSaveIssue}
        />
      )}

      {loading && <LoadingOverlay message="Loading from Redmine..." />}
    </div>
  );
}
