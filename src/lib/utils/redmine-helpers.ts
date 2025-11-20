/**
 * Redmine Helper Utilities
 * Helper functions for working with Redmine data
 */

import type { Issue, CustomField } from '@/types/redmine';
import { CUSTOM_FIELDS, ISSUE_STATUSES } from '../redmine-config';

// ==================== Custom Field Helpers ====================

/**
 * Get custom field value by field ID
 */
export function getCustomFieldValue(
  issue: Issue,
  fieldId: number
): string | string[] | null {
  const field = issue.custom_fields?.find((cf) => cf.id === fieldId);
  return field?.value ?? null;
}

/**
 * Get custom field value by field name
 */
export function getCustomFieldValueByName(
  issue: Issue,
  fieldName: string
): string | string[] | null {
  const field = issue.custom_fields?.find((cf) => cf.name === fieldName);
  return field?.value ?? null;
}

/**
 * Get Team custom field value
 */
export function getTeam(issue: Issue): string | null {
  const value = getCustomFieldValue(issue, CUSTOM_FIELDS.TEAM.id);
  return typeof value === 'string' ? value : null;
}

/**
 * Get Bug Level custom field value
 */
export function getBugLevel(issue: Issue): string | null {
  const value = getCustomFieldValue(issue, CUSTOM_FIELDS.BUG_LEVEL.id);
  return typeof value === 'string' ? value : null;
}

/**
 * Get Bug Type custom field value
 */
export function getBugType(issue: Issue): string | null {
  const value = getCustomFieldValue(issue, CUSTOM_FIELDS.BUG_TYPE.id);
  return typeof value === 'string' ? value : null;
}

/**
 * Get Bug Environment custom field value
 */
export function getBugEnv(issue: Issue): string | null {
  const value = getCustomFieldValue(issue, CUSTOM_FIELDS.BUG_ENV.id);
  return typeof value === 'string' ? value : null;
}

/**
 * Get Story Point custom field value
 */
export function getStoryPoint(issue: Issue): number | null {
  const value = getCustomFieldValue(issue, CUSTOM_FIELDS.STORY_POINT.id);
  return value ? parseFloat(value as string) : null;
}

/**
 * Get Released Date custom field value
 */
export function getReleasedDate(issue: Issue): string | null {
  const value = getCustomFieldValue(issue, CUSTOM_FIELDS.RELEASED_DATE.id);
  return typeof value === 'string' ? value : null;
}

/**
 * Get Prod Release flag
 */
export function isProdRelease(issue: Issue): boolean {
  const value = getCustomFieldValue(issue, CUSTOM_FIELDS.PROD_RELEASE.id);
  return value === '1' || value === 'true';
}

/**
 * Get Emergency Release flag
 */
export function isEmergencyRelease(issue: Issue): boolean {
  const value = getCustomFieldValue(issue, CUSTOM_FIELDS.EMERGENCY_RELEASE.id);
  return value === '1' || value === 'true';
}

/**
 * Set custom field value
 */
export function setCustomFieldValue(
  customFields: CustomField[] | undefined,
  fieldId: number,
  value: string | string[] | null
): CustomField[] {
  const fields = customFields || [];
  const existingIndex = fields.findIndex((cf) => cf.id === fieldId);

  if (existingIndex >= 0) {
    // Update existing field
    const updated = [...fields];
    updated[existingIndex] = { ...updated[existingIndex], value };
    return updated;
  } else {
    // Add new field
    return [...fields, { id: fieldId, name: '', value }];
  }
}

// ==================== Issue Status Helpers ====================

/**
 * Check if issue is closed
 */
export function isIssueClosed(issue: Issue): boolean {
  return issue.status.is_closed ?? false;
}

/**
 * Check if issue is open
 */
export function isIssueOpen(issue: Issue): boolean {
  return !isIssueClosed(issue);
}

/**
 * Check if issue is in specific status
 */
export function isIssueInStatus(issue: Issue, statusId: number): boolean {
  return issue.status.id === statusId;
}

/**
 * Check if issue is new
 */
export function isIssueNew(issue: Issue): boolean {
  return isIssueInStatus(issue, ISSUE_STATUSES.NEW.id);
}

/**
 * Check if issue is in progress
 */
export function isIssueInProgress(issue: Issue): boolean {
  return isIssueInStatus(issue, ISSUE_STATUSES.IN_PROGRESS.id);
}

/**
 * Check if issue is resolved
 */
export function isIssueResolved(issue: Issue): boolean {
  return isIssueInStatus(issue, ISSUE_STATUSES.RESOLVED.id);
}

/**
 * Check if issue is verified
 */
export function isIssueVerified(issue: Issue): boolean {
  return isIssueInStatus(issue, ISSUE_STATUSES.VERIFIED.id);
}

// ==================== Date Helpers ====================

/**
 * Check if issue is overdue
 */
export function isIssueOverdue(issue: Issue): boolean {
  if (!issue.due_date || isIssueClosed(issue)) {
    return false;
  }
  const dueDate = new Date(issue.due_date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return dueDate < today;
}

/**
 * Get days until due date
 */
export function getDaysUntilDue(issue: Issue): number | null {
  if (!issue.due_date) {
    return null;
  }
  const dueDate = new Date(issue.due_date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffTime = dueDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * Get duration in days
 */
export function getIssueDuration(issue: Issue): number | null {
  if (!issue.start_date || !issue.due_date) {
    return null;
  }
  const startDate = new Date(issue.start_date);
  const dueDate = new Date(issue.due_date);
  const diffTime = dueDate.getTime() - startDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return diffDays;
}

/**
 * Format date to YYYY-MM-DD
 */
export function formatDateForRedmine(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Parse Redmine date string to Date object
 */
export function parseRedmineDate(dateString: string | null): Date | null {
  if (!dateString) {
    return null;
  }
  return new Date(dateString);
}

// ==================== Assignment Helpers ====================

/**
 * Check if issue is assigned
 */
export function isIssueAssigned(issue: Issue): boolean {
  return !!issue.assigned_to;
}

/**
 * Check if issue is assigned to specific user
 */
export function isIssueAssignedTo(issue: Issue, userId: number): boolean {
  return issue.assigned_to?.id === userId;
}

/**
 * Get assignee name
 */
export function getAssigneeName(issue: Issue): string | null {
  return issue.assigned_to?.name ?? null;
}

// ==================== Progress Helpers ====================

/**
 * Get progress percentage (0-100)
 */
export function getProgressPercentage(issue: Issue): number {
  return issue.done_ratio;
}

/**
 * Check if issue is completed (100%)
 */
export function isIssueCompleted(issue: Issue): boolean {
  return issue.done_ratio === 100;
}

/**
 * Get progress status text
 */
export function getProgressStatus(issue: Issue): string {
  const ratio = issue.done_ratio;
  if (ratio === 0) return 'Not Started';
  if (ratio === 100) return 'Completed';
  return 'In Progress';
}

// ==================== Time Tracking Helpers ====================

/**
 * Get time spent in hours
 */
export function getTimeSpent(issue: Issue): number {
  return issue.spent_hours ?? 0;
}

/**
 * Get estimated time in hours
 */
export function getEstimatedTime(issue: Issue): number {
  return issue.estimated_hours ?? 0;
}

/**
 * Get remaining time in hours
 */
export function getRemainingTime(issue: Issue): number {
  const estimated = getEstimatedTime(issue);
  const spent = getTimeSpent(issue);
  return Math.max(0, estimated - spent);
}

/**
 * Check if over budget (spent more than estimated)
 */
export function isOverBudget(issue: Issue): boolean {
  const estimated = getEstimatedTime(issue);
  const spent = getTimeSpent(issue);
  return estimated > 0 && spent > estimated;
}

/**
 * Get time spent percentage
 */
export function getTimeSpentPercentage(issue: Issue): number {
  const estimated = getEstimatedTime(issue);
  const spent = getTimeSpent(issue);
  if (estimated === 0) return 0;
  return Math.round((spent / estimated) * 100);
}

// ==================== Hierarchy Helpers ====================

/**
 * Check if issue has parent
 */
export function hasParent(issue: Issue): boolean {
  return !!issue.parent || !!issue.parent_id;
}

/**
 * Check if issue has children
 */
export function hasChildren(issue: Issue): boolean {
  return !!issue.children && issue.children.length > 0;
}

/**
 * Get parent ID
 */
export function getParentId(issue: Issue): number | null {
  return issue.parent?.id ?? issue.parent_id ?? null;
}

/**
 * Get number of children
 */
export function getChildrenCount(issue: Issue): number {
  return issue.children?.length ?? 0;
}

/**
 * Check if issue is parent (has children)
 */
export function isParentIssue(issue: Issue): boolean {
  return hasChildren(issue);
}

/**
 * Check if issue is child (has parent)
 */
export function isChildIssue(issue: Issue): boolean {
  return hasParent(issue);
}

// ==================== Filtering Helpers ====================

/**
 * Filter issues by status
 */
export function filterByStatus(issues: Issue[], statusId: number): Issue[] {
  return issues.filter((issue) => issue.status.id === statusId);
}

/**
 * Filter open issues
 */
export function filterOpenIssues(issues: Issue[]): Issue[] {
  return issues.filter(isIssueOpen);
}

/**
 * Filter closed issues
 */
export function filterClosedIssues(issues: Issue[]): Issue[] {
  return issues.filter(isIssueClosed);
}

/**
 * Filter issues by assignee
 */
export function filterByAssignee(issues: Issue[], userId: number): Issue[] {
  return issues.filter((issue) => isIssueAssignedTo(issue, userId));
}

/**
 * Filter unassigned issues
 */
export function filterUnassignedIssues(issues: Issue[]): Issue[] {
  return issues.filter((issue) => !isIssueAssigned(issue));
}

/**
 * Filter overdue issues
 */
export function filterOverdueIssues(issues: Issue[]): Issue[] {
  return issues.filter(isIssueOverdue);
}

/**
 * Filter issues by tracker
 */
export function filterByTracker(issues: Issue[], trackerId: number): Issue[] {
  return issues.filter((issue) => issue.tracker.id === trackerId);
}

/**
 * Filter issues by team
 */
export function filterByTeam(issues: Issue[], team: string): Issue[] {
  return issues.filter((issue) => getTeam(issue) === team);
}

// ==================== Sorting Helpers ====================

/**
 * Sort issues by due date (ascending)
 */
export function sortByDueDate(issues: Issue[]): Issue[] {
  return [...issues].sort((a, b) => {
    if (!a.due_date) return 1;
    if (!b.due_date) return -1;
    return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
  });
}

/**
 * Sort issues by priority (descending - highest first)
 */
export function sortByPriority(issues: Issue[]): Issue[] {
  return [...issues].sort((a, b) => b.priority.id - a.priority.id);
}

/**
 * Sort issues by updated date (descending - newest first)
 */
export function sortByUpdatedDate(issues: Issue[]): Issue[] {
  return [...issues].sort((a, b) => {
    return new Date(b.updated_on).getTime() - new Date(a.updated_on).getTime();
  });
}

/**
 * Sort issues by ID (ascending)
 */
export function sortById(issues: Issue[]): Issue[] {
  return [...issues].sort((a, b) => a.id - b.id);
}

// ==================== Grouping Helpers ====================

/**
 * Group issues by status
 */
export function groupByStatus(issues: Issue[]): Map<number, Issue[]> {
  const grouped = new Map<number, Issue[]>();
  issues.forEach((issue) => {
    const statusId = issue.status.id;
    if (!grouped.has(statusId)) {
      grouped.set(statusId, []);
    }
    grouped.get(statusId)!.push(issue);
  });
  return grouped;
}

/**
 * Group issues by assignee
 */
export function groupByAssignee(issues: Issue[]): Map<number | null, Issue[]> {
  const grouped = new Map<number | null, Issue[]>();
  issues.forEach((issue) => {
    const assigneeId = issue.assigned_to?.id ?? null;
    if (!grouped.has(assigneeId)) {
      grouped.set(assigneeId, []);
    }
    grouped.get(assigneeId)!.push(issue);
  });
  return grouped;
}

/**
 * Group issues by team
 */
export function groupByTeam(issues: Issue[]): Map<string | null, Issue[]> {
  const grouped = new Map<string | null, Issue[]>();
  issues.forEach((issue) => {
    const team = getTeam(issue);
    if (!grouped.has(team)) {
      grouped.set(team, []);
    }
    grouped.get(team)!.push(issue);
  });
  return grouped;
}

/**
 * Group issues by tracker
 */
export function groupByTracker(issues: Issue[]): Map<number, Issue[]> {
  const grouped = new Map<number, Issue[]>();
  issues.forEach((issue) => {
    const trackerId = issue.tracker.id;
    if (!grouped.has(trackerId)) {
      grouped.set(trackerId, []);
    }
    grouped.get(trackerId)!.push(issue);
  });
  return grouped;
}
