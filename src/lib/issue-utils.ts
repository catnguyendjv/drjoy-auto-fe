/**
 * Utility functions for converting between frontend Issue type and backend API request types
 */

import { Issue, CustomField } from '@/types/redmine';
import { UpdateIssueRequest } from './api/redmine.service';

/**
 * Convert frontend Issue object to backend UpdateIssueRequest format
 * Only includes fields that have been modified (non-undefined values)
 */
export function issueToUpdateRequest(issue: Issue, includeCustomFields: boolean = true): UpdateIssueRequest {
  const request: UpdateIssueRequest = {};

  // Basic fields
  if (issue.subject !== undefined) {
    request.subject = issue.subject;
  }

  if (issue.description !== undefined) {
    request.description = issue.description;
  }

  // ID fields - extract IDs from nested objects
  if (issue.project?.id !== undefined) {
    request.project_id = issue.project.id;
  }

  if (issue.tracker?.id !== undefined) {
    request.tracker_id = issue.tracker.id;
  }

  if (issue.status?.id !== undefined) {
    request.status_id = issue.status.id;
  }

  if (issue.priority?.id !== undefined) {
    request.priority_id = issue.priority.id;
  }

  if (issue.assigned_to?.id !== undefined) {
    request.assigned_to_id = issue.assigned_to.id;
  }

  if (issue.parent?.id !== undefined) {
    request.parent_issue_id = issue.parent.id;
  } else if (issue.parent_id !== undefined) {
    request.parent_issue_id = issue.parent_id;
  }

  // Date fields
  if (issue.start_date !== undefined && issue.start_date !== null) {
    request.start_date = issue.start_date;
  }

  if (issue.due_date !== undefined && issue.due_date !== null) {
    request.due_date = issue.due_date;
  }

  // Numeric fields
  if (issue.estimated_hours !== undefined && issue.estimated_hours !== null) {
    request.estimated_hours = issue.estimated_hours;
  }

  if (issue.done_ratio !== undefined) {
    request.done_ratio = issue.done_ratio;
  }

  // Boolean fields
  if (issue.is_private !== undefined) {
    request.is_private = issue.is_private;
  }

  // Fixed version
  if (issue.fixed_version?.id !== undefined) {
    request.fixed_version_id = issue.fixed_version.id;
  }

  // Custom fields
  if (includeCustomFields && issue.custom_fields && issue.custom_fields.length > 0) {
    request.custom_fields = convertCustomFields(issue.custom_fields);
  }

  return request;
}

/**
 * Convert frontend CustomField array to backend format
 */
export function convertCustomFields(customFields: CustomField[]): Array<{
  id: number;
  value: string | number | boolean | string[];
}> {
  return customFields
    .filter(field => field.value !== null && field.value !== undefined)
    .map(field => ({
      id: field.id,
      value: field.value as string | number | boolean | string[],
    }));
}

/**
 * Normalize description for comparison
 * Handles null/undefined/empty string and line ending differences
 */
function normalizeDescription(description: string | null | undefined): string {
  if (description === null || description === undefined) {
    return '';
  }
  // Normalize line endings to \n and trim
  return description.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
}

/**
 * Create a partial update request with only the changed fields
 * Compares original and updated issues to determine which fields changed
 */
export function createPartialUpdateRequest(
  originalIssue: Issue,
  updatedIssue: Issue,
  includeCustomFields: boolean = true
): UpdateIssueRequest {
  const request: UpdateIssueRequest = {};

  // Compare and add only changed fields
  if (updatedIssue.subject !== originalIssue.subject) {
    request.subject = updatedIssue.subject;
  }

  // Normalize descriptions before comparing to handle line ending differences
  const normalizedOriginalDesc = normalizeDescription(originalIssue.description);
  const normalizedUpdatedDesc = normalizeDescription(updatedIssue.description);

  if (normalizedUpdatedDesc !== normalizedOriginalDesc) {
    request.description = updatedIssue.description;
  }

  // ID fields - only add if changed and has valid value
  if (updatedIssue.project?.id !== originalIssue.project?.id) {
    if (updatedIssue.project?.id !== undefined) {
      request.project_id = updatedIssue.project.id;
    }
  }

  if (updatedIssue.tracker?.id !== originalIssue.tracker?.id) {
    if (updatedIssue.tracker?.id !== undefined) {
      request.tracker_id = updatedIssue.tracker.id;
    }
  }

  if (updatedIssue.status?.id !== originalIssue.status?.id) {
    if (updatedIssue.status?.id !== undefined) {
      request.status_id = updatedIssue.status.id;
    }
  }

  if (updatedIssue.priority?.id !== originalIssue.priority?.id) {
    if (updatedIssue.priority?.id !== undefined) {
      request.priority_id = updatedIssue.priority.id;
    }
  }

  if (updatedIssue.assigned_to?.id !== originalIssue.assigned_to?.id) {
    // Allow setting to undefined (unassign)
    request.assigned_to_id = updatedIssue.assigned_to?.id;
  }

  if (updatedIssue.fixed_version?.id !== originalIssue.fixed_version?.id) {
    // Allow setting to undefined (clear version)
    request.fixed_version_id = updatedIssue.fixed_version?.id;
  }

  if (updatedIssue.parent?.id !== originalIssue.parent?.id) {
    if (updatedIssue.parent?.id !== undefined) {
      request.parent_issue_id = updatedIssue.parent.id;
    }
  } else if (updatedIssue.parent_id !== originalIssue.parent_id) {
    if (updatedIssue.parent_id !== undefined) {
      request.parent_issue_id = updatedIssue.parent_id;
    }
  }

  // Date fields - only add if changed
  if (updatedIssue.start_date !== originalIssue.start_date) {
    // Allow empty string or valid date
    if (updatedIssue.start_date !== null && updatedIssue.start_date !== undefined) {
      request.start_date = updatedIssue.start_date;
    } else if (updatedIssue.start_date === null || updatedIssue.start_date === '') {
      // Allow clearing the date
      request.start_date = '';
    }
  }

  if (updatedIssue.due_date !== originalIssue.due_date) {
    // Allow empty string or valid date
    if (updatedIssue.due_date !== null && updatedIssue.due_date !== undefined) {
      request.due_date = updatedIssue.due_date;
    } else if (updatedIssue.due_date === null || updatedIssue.due_date === '') {
      // Allow clearing the date
      request.due_date = '';
    }
  }

  // Numeric fields
  if (updatedIssue.estimated_hours !== originalIssue.estimated_hours) {
    if (updatedIssue.estimated_hours !== null && updatedIssue.estimated_hours !== undefined) {
      request.estimated_hours = updatedIssue.estimated_hours;
    }
  }

  if (updatedIssue.done_ratio !== originalIssue.done_ratio) {
    request.done_ratio = updatedIssue.done_ratio;
  }

  if (updatedIssue.is_private !== originalIssue.is_private) {
    request.is_private = updatedIssue.is_private;
  }

  // Custom fields - only send fields that actually changed
  if (includeCustomFields && updatedIssue.custom_fields && originalIssue.custom_fields) {
    const changedCustomFields: Array<{ id: number; value: string | number | boolean | string[] }> = [];

    updatedIssue.custom_fields.forEach(updatedField => {
      const originalField = originalIssue.custom_fields?.find(f => f.id === updatedField.id);

      // Check if field value has changed
      const hasChanged = !originalField ||
        JSON.stringify(originalField.value) !== JSON.stringify(updatedField.value);

      if (hasChanged && updatedField.value !== null && updatedField.value !== undefined) {
        changedCustomFields.push({
          id: updatedField.id,
          value: updatedField.value as string | number | boolean | string[],
        });
      }
    });

    // Only add custom_fields to request if there are actual changes
    if (changedCustomFields.length > 0) {
      request.custom_fields = changedCustomFields;
    }
  }

  return request;
}
