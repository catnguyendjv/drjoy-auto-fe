/**
 * Example: Issue Dashboard Component
 * Demonstrates how to use Redmine integration in a real component
 */

'use client';

import { useState } from 'react';
import { useIssues } from '@/lib/hooks/useRedmine';
import { ISSUE_STATUSES, TRACKERS, CUSTOM_FIELDS } from '@/lib/redmine-config';
import {
  filterOpenIssues,
  filterOverdueIssues,
  filterByTeam,
  sortByDueDate,
  groupByStatus,
  groupByAssignee,
} from '@/lib/utils/redmine-helpers';
import {
  IssueList,
  IssueTable,
  IssueListSkeleton,
  ErrorMessage,
} from '@/components/ui/redmine';
import { getIssueUrl } from '@/lib/utils/redmine-ui';

export function IssueDashboard() {
  const [viewMode, setViewMode] = useState<'list' | 'table'>('list');
  const [filterTeam, setFilterTeam] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<number | ''>('');
  
  // Fetch issues
  const { data: issues, loading, error, refetch } = useIssues({
    project_id: 1,
    status_id: 'open',
    limit: 100,
    include: 'attachments,relations',
  });
  
  // Filter issues
  const filteredIssues = issues
    .filter((issue) => {
      if (filterTeam && filterTeam !== '') {
        return filterByTeam([issue], filterTeam).length > 0;
      }
      return true;
    })
    .filter((issue) => {
      if (typeof filterStatus === 'number') {
        return issue.status.id === filterStatus;
      }
      return true;
    });
  
  // Get statistics
  const openIssues = filterOpenIssues(issues);
  const overdueIssues = filterOverdueIssues(issues);
  const groupedByStatus = groupByStatus(issues);
  const groupedByAssignee = groupByAssignee(issues);
  
  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Issue Dashboard</h1>
        <IssueListSkeleton count={5} />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Issue Dashboard</h1>
        <ErrorMessage error={error} onRetry={refetch} />
      </div>
    );
  }
  
  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Issue Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Total: {issues.length} issues | Open: {openIssues.length} | Overdue: {overdueIssues.length}
        </p>
      </div>
      
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
            Total Issues
          </h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {issues.length}
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
            Open Issues
          </h3>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {openIssues.length}
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
            Overdue Issues
          </h3>
          <p className="text-3xl font-bold text-red-600 dark:text-red-400">
            {overdueIssues.length}
          </p>
        </div>
      </div>
      
      {/* Filters & Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          {/* Team Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Team
            </label>
            <select
              value={filterTeam}
              onChange={(e) => setFilterTeam(e.target.value)}
              className="block w-48 rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">All Teams</option>
              <option value="コアシステム">コアシステム</option>
              <option value="スマホアプリ">スマホアプリ</option>
              <option value="Web">Web</option>
              <option value="AI">AI</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value ? Number(e.target.value) : '')}
              className="block w-48 rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">All Statuses</option>
              {Object.values(ISSUE_STATUSES).map((status) => (
                <option key={status.id} value={status.id}>
                  {status.name}
                </option>
              ))}
            </select>
          </div>
          
          {/* View Mode Toggle */}
          <div className="ml-auto">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              View
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'list'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                List
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'table'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                Table
              </button>
            </div>
          </div>
          
          {/* Refresh Button */}
          <div className="ml-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              &nbsp;
            </label>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              🔄 Refresh
            </button>
          </div>
        </div>
      </div>
      
      {/* Issues Display */}
      {viewMode === 'list' ? (
        <IssueList
          issues={filteredIssues}
          onIssueClick={(issue) => {
            window.open(getIssueUrl(issue.id), '_blank');
          }}
        />
      ) : (
        <IssueTable
          issues={filteredIssues}
          onIssueClick={(issue) => {
            window.open(getIssueUrl(issue.id), '_blank');
          }}
        />
      )}
    </div>
  );
}

/**
 * Example: Simple Issue List Component
 */
export function SimpleIssueList() {
  const { data: issues, loading, error } = useIssues({
    project_id: 1,
    status_id: 'open',
    limit: 10,
  });
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Open Issues</h2>
      <ul className="space-y-2">
        {issues.map((issue) => (
          <li key={issue.id} className="p-3 bg-white dark:bg-gray-800 rounded shadow">
            <a
              href={getIssueUrl(issue.id)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              #{issue.id} - {issue.subject}
            </a>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Status: {issue.status.name} | Priority: {issue.priority.name}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
