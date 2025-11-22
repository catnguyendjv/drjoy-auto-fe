/**
 * Redmine UI Components
 * Reusable React components for displaying Redmine data
 */

'use client';

import type { Issue } from '@/types/redmine';
import {
  getStatusBadgeClass,
  getPriorityBadgeClass,
  getTrackerBadgeClass,
  formatIssueNumber,
  formatDate,
  formatProgress,
  getDueDateStatus,
  getProgressColor,
  truncateText,
} from '@/lib/utils/redmine-ui';
import {
  isIssueOverdue,
  isIssueClosed,
  getProgressPercentage,
} from '@/lib/utils/redmine-helpers';
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react";

// ==================== Badge Components ====================

interface StatusBadgeProps {
  status: { id: number; name: string };
  className?: string;
}

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const badgeClass = getStatusBadgeClass(status.id);
  
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeClass} ${className}`}
    >
      {status.name}
    </span>
  );
}

interface PriorityBadgeProps {
  priority: { id: number; name: string };
  className?: string;
}

export function PriorityBadge({ priority, className = '' }: PriorityBadgeProps) {
  const badgeClass = getPriorityBadgeClass(priority.id);
  
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeClass} ${className}`}
    >
      {priority.name}
    </span>
  );
}

interface TrackerBadgeProps {
  tracker: { id: number; name: string };
  className?: string;
}

export function TrackerBadge({ tracker, className = '' }: TrackerBadgeProps) {
  const badgeClass = getTrackerBadgeClass(tracker.id);
  
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeClass} ${className}`}
    >
      {tracker.name}
    </span>
  );
}

// ==================== Progress Components ====================

interface ProgressBarProps {
  percentage: number;
  showLabel?: boolean;
  className?: string;
}

export function ProgressBar({ percentage, showLabel = true, className = '' }: ProgressBarProps) {
  const color = getProgressColor(percentage);
  const bgColorClass = `bg-${color}-500`;
  
  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between mb-1">
        {showLabel && (
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
            {formatProgress(percentage)}
          </span>
        )}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
        <div
          className={`h-2 rounded-full transition-all ${bgColorClass}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

interface IssueProgressProps {
  issue: Issue;
  showLabel?: boolean;
  className?: string;
}

export function IssueProgress({ issue, showLabel = true, className = '' }: IssueProgressProps) {
  const percentage = getProgressPercentage(issue);
  return <ProgressBar percentage={percentage} showLabel={showLabel} className={className} />;
}

// ==================== Issue Card Components ====================

interface IssueCardProps {
  issue: Issue;
  onClick?: (issue: Issue) => void;
  className?: string;
  compact?: boolean;
}

export function IssueCard({ issue, onClick, className = '', compact = false }: IssueCardProps) {
  const isOverdue = isIssueOverdue(issue);
  const isClosed = isIssueClosed(issue);
  
  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow p-4 cursor-pointer ${className}`}
      onClick={() => onClick?.(issue)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-mono text-gray-500 dark:text-gray-400">
            {formatIssueNumber(issue)}
          </span>
          <TrackerBadge tracker={issue.tracker} />
        </div>
        <PriorityBadge priority={issue.priority} />
      </div>
      
      {/* Title */}
      <h3 className="text-base font-medium text-gray-900 dark:text-gray-100 mb-2">
        {compact ? truncateText(issue.subject, 60) : issue.subject}
      </h3>
      
      {/* Description */}
      {!compact && issue.description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
          {truncateText(issue.description, 150)}
        </p>
      )}
      
      {/* Meta Info */}
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
        <div className="flex items-center gap-3">
          <StatusBadge status={issue.status} />
          {issue.assigned_to && (
            <span className="flex items-center gap-1">
              <span>👤</span>
              {issue.assigned_to.name}
            </span>
          )}
        </div>
        
        {issue.due_date && (
          <span className={isOverdue && !isClosed ? 'text-red-600 dark:text-red-400 font-medium' : ''}>
            {getDueDateStatus(issue)}
          </span>
        )}
      </div>
      
      {/* Progress */}
      <IssueProgress issue={issue} showLabel={false} />
    </div>
  );
}

// ==================== Issue List Components ====================

interface IssueListProps {
  issues: Issue[];
  onIssueClick?: (issue: Issue) => void;
  className?: string;
  emptyMessage?: string;
}

export function IssueList({ 
  issues, 
  onIssueClick, 
  className = '',
  emptyMessage = 'No issues found'
}: IssueListProps) {
  if (issues.length === 0) {
    return (
      <div className={`text-center py-8 text-gray-500 dark:text-gray-400 ${className}`}>
        {emptyMessage}
      </div>
    );
  }
  
  return (
    <div className={`space-y-3 ${className}`}>
      {issues.map((issue) => (
        <IssueCard
          key={issue.id}
          issue={issue}
          onClick={onIssueClick}
          compact
        />
      ))}
    </div>
  );
}

// ==================== Issue Table Components ====================

interface IssueTableProps {
  issues: Issue[];
  onIssueClick?: (issue: Issue) => void;
  className?: string;
}

export function IssueTable({ issues, onIssueClick, className = '' }: IssueTableProps) {
  if (issues.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        No issues found
      </div>
    );
  }

  return (
    <Table aria-label="Issues" removeWrapper className={`px-2 ${className}`}>
      <TableHeader>
        <TableColumn>Issue</TableColumn>
        <TableColumn>Tracker</TableColumn>
        <TableColumn>Status</TableColumn>
        <TableColumn>Priority</TableColumn>
        <TableColumn>Assignee</TableColumn>
        <TableColumn>Due Date</TableColumn>
        <TableColumn>Progress</TableColumn>
      </TableHeader>
      <TableBody items={issues} emptyContent="No issues found">
        {(issue) => (
          <TableRow
            key={issue.id}
            className="cursor-pointer"
            onClick={() => onIssueClick?.(issue)}
          >
            <TableCell>
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {formatIssueNumber(issue)}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {truncateText(issue.subject, 50)}
              </div>
            </TableCell>
            <TableCell>
              <TrackerBadge tracker={issue.tracker} />
            </TableCell>
            <TableCell>
              <StatusBadge status={issue.status} />
            </TableCell>
            <TableCell>
              <PriorityBadge priority={issue.priority} />
            </TableCell>
            <TableCell className="text-sm text-gray-500 dark:text-gray-400">
              {issue.assigned_to?.name || '-'}
            </TableCell>
            <TableCell className="text-sm text-gray-500 dark:text-gray-400">
              {issue.due_date ? formatDate(issue.due_date) : '-'}
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <ProgressBar percentage={issue.done_ratio} showLabel={false} className="w-20" />
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {formatProgress(issue.done_ratio)}
                </span>
              </div>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

// ==================== Loading & Error Components ====================

export function IssueListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 animate-pulse">
          <div className="flex items-center justify-between mb-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20" />
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16" />
          </div>
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-3" />
          <div className="flex items-center justify-between mb-2">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32" />
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-full" />
        </div>
      ))}
    </div>
  );
}

interface ErrorMessageProps {
  error: Error;
  onRetry?: () => void;
  className?: string;
}

export function ErrorMessage({ error, onRetry, className = '' }: ErrorMessageProps) {
  return (
    <div className={`bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 ${className}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <span className="text-red-600 dark:text-red-400 text-xl">⚠️</span>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
            Error loading data
          </h3>
          <p className="mt-1 text-sm text-red-700 dark:text-red-300">
            {error.message}
          </p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-3 text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300"
            >
              Try again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
