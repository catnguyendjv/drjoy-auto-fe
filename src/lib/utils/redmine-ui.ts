/**
 * Redmine UI Utilities
 * Helper functions for displaying Redmine data in UI
 */

import type { Issue } from '@/types/redmine';
import {
  ISSUE_STATUSES,
  TRACKERS,
  PRIORITIES,
  getStatusName,
  getTrackerName,
  getPriorityName,
} from '../redmine-config';

// ==================== Color Helpers ====================

/**
 * Get color for issue status
 */
export function getStatusColor(statusId: number): string {
  switch (statusId) {
    case ISSUE_STATUSES.NEW.id:
      return 'blue';
    case ISSUE_STATUSES.IN_PROGRESS.id:
      return 'yellow';
    case ISSUE_STATUSES.RESOLVED.id:
      return 'purple';
    case ISSUE_STATUSES.VERIFIED.id:
      return 'green';
    case ISSUE_STATUSES.FEEDBACK.id:
      return 'orange';
    case ISSUE_STATUSES.WFR.id:
      return 'cyan';
    case ISSUE_STATUSES.CLOSED.id:
      return 'gray';
    case ISSUE_STATUSES.REJECTED.id:
      return 'red';
    case ISSUE_STATUSES.RELEASED.id:
      return 'emerald';
    case ISSUE_STATUSES.PENDING.id:
      return 'amber';
    default:
      return 'slate';
  }
}

/**
 * Get Tailwind CSS class for status badge
 */
export function getStatusBadgeClass(statusId: number): string {
  const color = getStatusColor(statusId);
  return `bg-${color}-100 text-${color}-800 dark:bg-${color}-900 dark:text-${color}-300`;
}

/**
 * Get color for priority
 */
export function getPriorityColor(priorityId: number): string {
  switch (priorityId) {
    case PRIORITIES.IMMEDIATE.id:
    case PRIORITIES.URGENT.id:
      return 'red';
    case PRIORITIES.HIGH.id:
      return 'orange';
    case PRIORITIES.NORMAL.id:
      return 'blue';
    case PRIORITIES.LOW.id:
      return 'gray';
    default:
      return 'slate';
  }
}

/**
 * Get Tailwind CSS class for priority badge
 */
export function getPriorityBadgeClass(priorityId: number): string {
  const color = getPriorityColor(priorityId);
  return `bg-${color}-100 text-${color}-800 dark:bg-${color}-900 dark:text-${color}-300`;
}

/**
 * Get color for tracker
 */
export function getTrackerColor(trackerId: number): string {
  switch (trackerId) {
    case TRACKERS.BUG.id:
      return 'red';
    case TRACKERS.DEV.id:
      return 'blue';
    case TRACKERS.FEATURE.id:
      return 'green';
    case TRACKERS.TASK.id:
      return 'yellow';
    case TRACKERS.SUPPORT.id:
      return 'purple';
    default:
      return 'gray';
  }
}

/**
 * Get Tailwind CSS class for tracker badge
 */
export function getTrackerBadgeClass(trackerId: number): string {
  const color = getTrackerColor(trackerId);
  return `bg-${color}-100 text-${color}-800 dark:bg-${color}-900 dark:text-${color}-300`;
}

/**
 * Get color for progress percentage
 */
export function getProgressColor(percentage: number): string {
  if (percentage === 0) return 'gray';
  if (percentage < 30) return 'red';
  if (percentage < 60) return 'yellow';
  if (percentage < 100) return 'blue';
  return 'green';
}

// ==================== Icon Helpers ====================

/**
 * Get icon name for tracker (for icon libraries like Lucide React)
 */
export function getTrackerIcon(trackerId: number): string {
  switch (trackerId) {
    case TRACKERS.BUG.id:
      return 'Bug';
    case TRACKERS.DEV.id:
      return 'Code';
    case TRACKERS.FEATURE.id:
      return 'Sparkles';
    case TRACKERS.TASK.id:
      return 'CheckSquare';
    case TRACKERS.SUPPORT.id:
      return 'HelpCircle';
    case TRACKERS.IT.id:
      return 'Server';
    case TRACKERS.QA.id:
      return 'MessageSquare';
    default:
      return 'FileText';
  }
}

/**
 * Get icon name for priority
 */
export function getPriorityIcon(priorityId: number): string {
  switch (priorityId) {
    case PRIORITIES.IMMEDIATE.id:
      return 'AlertTriangle';
    case PRIORITIES.URGENT.id:
      return 'AlertCircle';
    case PRIORITIES.HIGH.id:
      return 'ArrowUp';
    case PRIORITIES.NORMAL.id:
      return 'Minus';
    case PRIORITIES.LOW.id:
      return 'ArrowDown';
    default:
      return 'Circle';
  }
}

/**
 * Get icon name for status
 */
export function getStatusIcon(statusId: number): string {
  switch (statusId) {
    case ISSUE_STATUSES.NEW.id:
      return 'Plus';
    case ISSUE_STATUSES.IN_PROGRESS.id:
      return 'Play';
    case ISSUE_STATUSES.RESOLVED.id:
      return 'CheckCircle';
    case ISSUE_STATUSES.VERIFIED.id:
      return 'CheckCheck';
    case ISSUE_STATUSES.FEEDBACK.id:
      return 'MessageCircle';
    case ISSUE_STATUSES.WFR.id:
      return 'Clock';
    case ISSUE_STATUSES.CLOSED.id:
      return 'XCircle';
    case ISSUE_STATUSES.REJECTED.id:
      return 'XOctagon';
    case ISSUE_STATUSES.RELEASED.id:
      return 'Rocket';
    case ISSUE_STATUSES.PENDING.id:
      return 'Pause';
    default:
      return 'Circle';
  }
}

// ==================== Formatting Helpers ====================

/**
 * Format issue number (e.g., #123)
 */
export function formatIssueNumber(issue: Issue): string {
  return `#${issue.id}`;
}

/**
 * Format issue title with number (e.g., "#123 - Issue Title")
 */
export function formatIssueTitle(issue: Issue): string {
  return `${formatIssueNumber(issue)} - ${issue.subject}`;
}

/**
 * Format date for display
 */
export function formatDate(dateString: string | null): string {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

/**
 * Format datetime for display
 */
export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Format time duration (hours to human readable)
 */
export function formatDuration(hours: number): string {
  if (hours === 0) return '0h';
  if (hours < 1) return `${Math.round(hours * 60)}m`;
  if (hours < 8) return `${hours.toFixed(1)}h`;
  
  const days = Math.floor(hours / 8);
  const remainingHours = hours % 8;
  
  if (remainingHours === 0) return `${days}d`;
  return `${days}d ${remainingHours.toFixed(1)}h`;
}

/**
 * Format progress percentage
 */
export function formatProgress(percentage: number): string {
  return `${percentage}%`;
}

/**
 * Get relative time (e.g., "2 days ago")
 */
export function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 30) return `${diffDays}d ago`;
  
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) return `${diffMonths}mo ago`;
  
  const diffYears = Math.floor(diffDays / 365);
  return `${diffYears}y ago`;
}

/**
 * Get due date status text
 */
export function getDueDateStatus(issue: Issue): string {
  if (!issue.due_date) return 'No due date';
  
  const dueDate = new Date(issue.due_date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const diffTime = dueDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return `Overdue by ${Math.abs(diffDays)} days`;
  if (diffDays === 0) return 'Due today';
  if (diffDays === 1) return 'Due tomorrow';
  if (diffDays <= 7) return `Due in ${diffDays} days`;
  
  return `Due ${formatDate(issue.due_date)}`;
}

// ==================== URL Helpers ====================

/**
 * Get Redmine issue URL
 */
export function getIssueUrl(issueId: number, baseUrl = 'https://redmine.famishare.jp'): string {
  return `${baseUrl}/issues/${issueId}`;
}

/**
 * Get Redmine project URL
 */
export function getProjectUrl(projectIdentifier: string, baseUrl = 'https://redmine.famishare.jp'): string {
  return `${baseUrl}/projects/${projectIdentifier}`;
}

/**
 * Get Redmine user URL
 */
export function getUserUrl(userId: number, baseUrl = 'https://redmine.famishare.jp'): string {
  return `${baseUrl}/users/${userId}`;
}

// ==================== Display Text Helpers ====================

/**
 * Get status display text with emoji
 */
export function getStatusDisplayText(statusId: number): string {
  const name = getStatusName(statusId);
  const emoji = getStatusEmoji(statusId);
  return `${emoji} ${name}`;
}

/**
 * Get priority display text with emoji
 */
export function getPriorityDisplayText(priorityId: number): string {
  const name = getPriorityName(priorityId);
  const emoji = getPriorityEmoji(priorityId);
  return `${emoji} ${name}`;
}

/**
 * Get tracker display text with emoji
 */
export function getTrackerDisplayText(trackerId: number): string {
  const name = getTrackerName(trackerId);
  const emoji = getTrackerEmoji(trackerId);
  return `${emoji} ${name}`;
}

/**
 * Get status emoji
 */
function getStatusEmoji(statusId: number): string {
  switch (statusId) {
    case ISSUE_STATUSES.NEW.id: return '🆕';
    case ISSUE_STATUSES.IN_PROGRESS.id: return '🔄';
    case ISSUE_STATUSES.RESOLVED.id: return '✅';
    case ISSUE_STATUSES.VERIFIED.id: return '✔️';
    case ISSUE_STATUSES.FEEDBACK.id: return '💬';
    case ISSUE_STATUSES.WFR.id: return '⏳';
    case ISSUE_STATUSES.CLOSED.id: return '🔒';
    case ISSUE_STATUSES.REJECTED.id: return '❌';
    case ISSUE_STATUSES.RELEASED.id: return '🚀';
    case ISSUE_STATUSES.PENDING.id: return '⏸️';
    default: return '⚪';
  }
}

/**
 * Get priority emoji
 */
function getPriorityEmoji(priorityId: number): string {
  switch (priorityId) {
    case PRIORITIES.IMMEDIATE.id: return '🔴';
    case PRIORITIES.URGENT.id: return '🟠';
    case PRIORITIES.HIGH.id: return '🟡';
    case PRIORITIES.NORMAL.id: return '🔵';
    case PRIORITIES.LOW.id: return '⚪';
    default: return '⚫';
  }
}

/**
 * Get tracker emoji
 */
function getTrackerEmoji(trackerId: number): string {
  switch (trackerId) {
    case TRACKERS.BUG.id: return '🐛';
    case TRACKERS.DEV.id: return '💻';
    case TRACKERS.FEATURE.id: return '✨';
    case TRACKERS.TASK.id: return '📋';
    case TRACKERS.SUPPORT.id: return '🆘';
    case TRACKERS.IT.id: return '🖥️';
    case TRACKERS.QA.id: return '❓';
    default: return '📄';
  }
}

// ==================== Truncate Helpers ====================

/**
 * Truncate text to specified length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/**
 * Truncate issue subject
 */
export function truncateSubject(issue: Issue, maxLength = 50): string {
  return truncateText(issue.subject, maxLength);
}

/**
 * Truncate issue description
 */
export function truncateDescription(issue: Issue, maxLength = 100): string {
  return truncateText(issue.description || '', maxLength);
}
