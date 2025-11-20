/**
 * Redmine Query Presets
 * Pre-configured queries for common use cases
 */

import type { IssueQueryParams } from '../api/redmine.service';
import { ISSUE_STATUSES, TRACKERS, PRIORITIES, CUSTOM_FIELDS, LEGACY_CUSTOM_FIELDS } from '../redmine-config';

// ==================== Common Query Presets ====================

/**
 * Get all open issues
 */
export function openIssuesQuery(projectId?: number): IssueQueryParams {
  return {
    project_id: projectId,
    status_id: 'open',
    limit: 100,
    sort: 'priority:desc,updated_on:desc',
  };
}

/**
 * Get all closed issues
 */
export function closedIssuesQuery(projectId?: number): IssueQueryParams {
  return {
    project_id: projectId,
    status_id: 'closed',
    limit: 100,
    sort: 'updated_on:desc',
  };
}

/**
 * Get issues assigned to current user
 */
export function myIssuesQuery(projectId?: number): IssueQueryParams {
  return {
    project_id: projectId,
    assigned_to_id: 'me',
    status_id: 'open',
    limit: 100,
    sort: 'priority:desc,due_date:asc',
  };
}

/**
 * Get unassigned issues
 */
export function unassignedIssuesQuery(projectId?: number): IssueQueryParams {
  return {
    project_id: projectId,
    assigned_to_id: '!*', // Not assigned
    status_id: 'open',
    limit: 100,
    sort: 'priority:desc,created_on:desc',
  };
}

/**
 * Get overdue issues
 */
export function overdueIssuesQuery(projectId?: number): IssueQueryParams {
  const today = new Date().toISOString().split('T')[0];
  return {
    project_id: projectId,
    status_id: 'open',
    due_date: `<=${today}`,
    limit: 100,
    sort: 'due_date:asc',
  };
}

/**
 * Get issues due this week
 */
export function dueThisWeekQuery(projectId?: number): IssueQueryParams {
  const today = new Date();
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);

  return {
    project_id: projectId,
    status_id: 'open',
    due_date: `><${today.toISOString().split('T')[0]}|${nextWeek.toISOString().split('T')[0]}`,
    limit: 100,
    sort: 'due_date:asc',
  };
}

/**
 * Get recently updated issues
 */
export function recentlyUpdatedQuery(projectId?: number, days = 7): IssueQueryParams {
  const date = new Date();
  date.setDate(date.getDate() - days);
  const dateStr = date.toISOString().split('T')[0];

  return {
    project_id: projectId,
    updated_on: `>=${dateStr}`,
    limit: 100,
    sort: 'updated_on:desc',
  };
}

/**
 * Get recently created issues
 */
export function recentlyCreatedQuery(projectId?: number, days = 7): IssueQueryParams {
  const date = new Date();
  date.setDate(date.getDate() - days);
  const dateStr = date.toISOString().split('T')[0];

  return {
    project_id: projectId,
    created_on: `>=${dateStr}`,
    limit: 100,
    sort: 'created_on:desc',
  };
}

// ==================== Tracker-Specific Queries ====================

/**
 * Get all bugs
 */
export function bugsQuery(projectId?: number): IssueQueryParams {
  return {
    project_id: projectId,
    tracker_id: TRACKERS.BUG.id,
    status_id: 'open',
    limit: 100,
    sort: 'priority:desc,updated_on:desc',
  };
}

/**
 * Get all dev tasks
 */
export function devTasksQuery(projectId?: number): IssueQueryParams {
  return {
    project_id: projectId,
    tracker_id: TRACKERS.DEV.id,
    status_id: 'open',
    limit: 100,
    sort: 'priority:desc,due_date:asc',
  };
}

/**
 * Get all features
 */
export function featuresQuery(projectId?: number): IssueQueryParams {
  return {
    project_id: projectId,
    tracker_id: TRACKERS.FEATURE.id,
    status_id: 'open',
    limit: 100,
    sort: 'priority:desc,created_on:desc',
  };
}

// ==================== Priority-Specific Queries ====================

/**
 * Get high priority issues
 */
export function highPriorityQuery(projectId?: number): IssueQueryParams {
  return {
    project_id: projectId,
    priority_id: PRIORITIES.HIGH.id,
    status_id: 'open',
    limit: 100,
    sort: 'due_date:asc,updated_on:desc',
  };
}

/**
 * Get urgent issues
 */
export function urgentIssuesQuery(projectId?: number): IssueQueryParams {
  return {
    project_id: projectId,
    priority_id: `>=${PRIORITIES.URGENT.id}`, // Urgent and Immediate
    status_id: 'open',
    limit: 100,
    sort: 'priority:desc,created_on:desc',
  };
}

// ==================== Status-Specific Queries ====================

/**
 * Get issues in progress
 */
export function inProgressQuery(projectId?: number): IssueQueryParams {
  return {
    project_id: projectId,
    status_id: ISSUE_STATUSES.IN_PROGRESS.id,
    limit: 100,
    sort: 'updated_on:desc',
  };
}

/**
 * Get issues waiting for review (WFR)
 */
export function waitingForReviewQuery(projectId?: number): IssueQueryParams {
  return {
    project_id: projectId,
    status_id: ISSUE_STATUSES.WFR.id,
    limit: 100,
    sort: 'updated_on:asc', // Oldest first
  };
}

/**
 * Get resolved issues (not yet closed)
 */
export function resolvedIssuesQuery(projectId?: number): IssueQueryParams {
  return {
    project_id: projectId,
    status_id: ISSUE_STATUSES.RESOLVED.id,
    limit: 100,
    sort: 'updated_on:desc',
  };
}

// ==================== Custom Field Queries ====================

/**
 * Get issues by team
 */
export function teamIssuesQuery(team: string, projectId?: number): IssueQueryParams {
  return {
    project_id: projectId,
    [`cf_${CUSTOM_FIELDS.TEAM.id}`]: team,
    status_id: 'open',
    limit: 100,
    sort: 'priority:desc,due_date:asc',
  };
}

/**
 * Get issues with prod release flag
 */
export function prodReleaseQuery(projectId?: number): IssueQueryParams {
  return {
    project_id: projectId,
    [`cf_${CUSTOM_FIELDS.PROD_RELEASE.id}`]: '1',
    status_id: 'open',
    limit: 100,
    sort: 'due_date:asc',
  };
}

/**
 * Get emergency release issues
 */
export function emergencyReleaseQuery(projectId?: number): IssueQueryParams {
  return {
    project_id: projectId,
    [`cf_${CUSTOM_FIELDS.EMERGENCY_RELEASE.id}`]: '1',
    status_id: 'open',
    limit: 100,
    sort: 'created_on:desc',
  };
}

/**
 * Get bugs by level
 */
export function bugsByLevelQuery(
  level: string,
  projectId?: number
): IssueQueryParams {
  return {
    project_id: projectId,
    tracker_id: TRACKERS.BUG.id,
    [`cf_${LEGACY_CUSTOM_FIELDS.BUG_LEVEL.id}`]: level,
    status_id: 'open',
    limit: 100,
    sort: 'created_on:desc',
  };
}

/**
 * Get critical bugs (level 4-5)
 */
export function criticalBugsQuery(projectId?: number): IssueQueryParams {
  return {
    project_id: projectId,
    tracker_id: TRACKERS.BUG.id,
    [`cf_${LEGACY_CUSTOM_FIELDS.BUG_LEVEL.id}`]: '4|5', // Level 4 or 5
    status_id: 'open',
    limit: 100,
    sort: 'created_on:desc',
  };
}

// ==================== Version-Specific Queries ====================

/**
 * Get issues for specific version
 */
export function versionIssuesQuery(
  versionId: number,
  projectId?: number
): IssueQueryParams {
  return {
    project_id: projectId,
    fixed_version_id: versionId,
    limit: 100,
    sort: 'status:asc,priority:desc',
  };
}

/**
 * Get issues without version
 */
export function noVersionQuery(projectId?: number): IssueQueryParams {
  return {
    project_id: projectId,
    fixed_version_id: '!*' as any, // No version set (special Redmine syntax)
    status_id: 'open',
    limit: 100,
    sort: 'priority:desc,created_on:desc',
  };
}

// ==================== Advanced Queries ====================

/**
 * Get parent issues only (no subtasks)
 */
export function parentIssuesQuery(projectId?: number): IssueQueryParams {
  return {
    project_id: projectId,
    parent_id: '!*', // No parent
    status_id: 'open',
    limit: 100,
    sort: 'priority:desc,updated_on:desc',
  };
}

/**
 * Get issues with children
 */
export function issuesWithChildrenQuery(projectId?: number): IssueQueryParams {
  return {
    project_id: projectId,
    parent_id: '!*',
    status_id: 'open',
    include: 'children',
    limit: 100,
    sort: 'priority:desc,updated_on:desc',
  };
}

/**
 * Get stale issues (not updated in X days)
 */
export function staleIssuesQuery(projectId?: number, days = 30): IssueQueryParams {
  const date = new Date();
  date.setDate(date.getDate() - days);
  const dateStr = date.toISOString().split('T')[0];

  return {
    project_id: projectId,
    updated_on: `<=${dateStr}`,
    status_id: 'open',
    limit: 100,
    sort: 'updated_on:asc', // Oldest first
  };
}

/**
 * Get issues with time logged
 */
export function issuesWithTimeQuery(projectId?: number): IssueQueryParams {
  return {
    project_id: projectId,
    status_id: 'open',
    limit: 100,
    sort: 'spent_hours:desc',
  };
}

// ==================== Report Queries ====================

/**
 * Get issues for sprint/iteration
 */
export function sprintIssuesQuery(
  startDate: string,
  endDate: string,
  projectId?: number
): IssueQueryParams {
  return {
    project_id: projectId,
    due_date: `><${startDate}|${endDate}`,
    status_id: 'open',
    limit: 100,
    sort: 'priority:desc,due_date:asc',
  };
}

/**
 * Get completed issues in date range
 */
export function completedInRangeQuery(
  startDate: string,
  endDate: string,
  projectId?: number
): IssueQueryParams {
  return {
    project_id: projectId,
    closed_on: `><${startDate}|${endDate}`,
    status_id: 'closed',
    limit: 100,
    sort: 'closed_on:desc',
  };
}

// ==================== Query Builder ====================

/**
 * Build custom query
 */
export class QueryBuilder {
  private params: IssueQueryParams = {};

  project(id: number): this {
    this.params.project_id = id;
    return this;
  }

  status(id: number | string): this {
    this.params.status_id = id;
    return this;
  }

  tracker(id: number): this {
    this.params.tracker_id = id;
    return this;
  }

  priority(id: number): this {
    this.params.priority_id = id;
    return this;
  }

  assignedTo(id: number | string): this {
    this.params.assigned_to_id = id;
    return this;
  }

  version(id: number): this {
    this.params.fixed_version_id = id;
    return this;
  }

  limit(count: number): this {
    this.params.limit = count;
    return this;
  }

  offset(count: number): this {
    this.params.offset = count;
    return this;
  }

  sort(field: string): this {
    this.params.sort = field;
    return this;
  }

  include(fields: string): this {
    this.params.include = fields;
    return this;
  }

  customField(fieldId: number, value: string): this {
    this.params[`cf_${fieldId}`] = value;
    return this;
  }

  build(): IssueQueryParams {
    return { ...this.params };
  }
}

/**
 * Create query builder instance
 */
export function query(): QueryBuilder {
  return new QueryBuilder();
}
