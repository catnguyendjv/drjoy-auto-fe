/**
 * Redmine Validation Utilities
 * Validation functions for Redmine data
 */

import type { Issue } from '@/types/redmine';
import { ISSUE_STATUSES, TRACKERS, PRIORITIES } from '../redmine-config';

// ==================== Validation Results ====================

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export interface FieldValidation {
  field: string;
  valid: boolean;
  message?: string;
}

// ==================== Issue Validation ====================

/**
 * Validate issue has required fields
 */
export function validateIssue(issue: Partial<Issue>): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Required fields
  if (!issue.subject || issue.subject.trim() === '') {
    errors.push('Subject is required');
  }

  if (!issue.project || !issue.project.id) {
    errors.push('Project is required');
  }

  if (!issue.tracker || !issue.tracker.id) {
    errors.push('Tracker is required');
  }

  if (!issue.status || !issue.status.id) {
    errors.push('Status is required');
  }

  if (!issue.priority || !issue.priority.id) {
    errors.push('Priority is required');
  }

  // Warnings
  if (!issue.description || issue.description.trim() === '') {
    warnings.push('Description is recommended');
  }

  if (!issue.assigned_to) {
    warnings.push('Issue is not assigned to anyone');
  }

  if (!issue.due_date) {
    warnings.push('Due date is not set');
  }

  if (!issue.start_date) {
    warnings.push('Start date is not set');
  }

  if (issue.estimated_hours === undefined || issue.estimated_hours === null) {
    warnings.push('Estimated hours not set');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate issue subject
 */
export function validateSubject(subject: string): FieldValidation {
  if (!subject || subject.trim() === '') {
    return {
      field: 'subject',
      valid: false,
      message: 'Subject cannot be empty',
    };
  }

  if (subject.length < 3) {
    return {
      field: 'subject',
      valid: false,
      message: 'Subject must be at least 3 characters',
    };
  }

  if (subject.length > 255) {
    return {
      field: 'subject',
      valid: false,
      message: 'Subject must be less than 255 characters',
    };
  }

  return { field: 'subject', valid: true };
}

/**
 * Validate date range
 */
export function validateDateRange(
  startDate: string | null,
  dueDate: string | null
): FieldValidation {
  if (!startDate || !dueDate) {
    return { field: 'dates', valid: true }; // Optional fields
  }

  const start = new Date(startDate);
  const due = new Date(dueDate);

  if (start > due) {
    return {
      field: 'dates',
      valid: false,
      message: 'Start date must be before due date',
    };
  }

  return { field: 'dates', valid: true };
}

/**
 * Validate estimated hours
 */
export function validateEstimatedHours(hours: number | null): FieldValidation {
  if (hours === null || hours === undefined) {
    return { field: 'estimated_hours', valid: true }; // Optional
  }

  if (hours < 0) {
    return {
      field: 'estimated_hours',
      valid: false,
      message: 'Estimated hours cannot be negative',
    };
  }

  if (hours > 1000) {
    return {
      field: 'estimated_hours',
      valid: false,
      message: 'Estimated hours seems too large (>1000)',
    };
  }

  return { field: 'estimated_hours', valid: true };
}

/**
 * Validate done ratio (0-100)
 */
export function validateDoneRatio(ratio: number): FieldValidation {
  if (ratio < 0 || ratio > 100) {
    return {
      field: 'done_ratio',
      valid: false,
      message: 'Done ratio must be between 0 and 100',
    };
  }

  return { field: 'done_ratio', valid: true };
}

// ==================== Business Logic Validation ====================

/**
 * Validate if issue can be closed
 */
export function canCloseIssue(issue: Issue): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check if all children are closed
  if (issue.children && issue.children.length > 0) {
    const openChildren = issue.children.filter(
      (child) => !child.status.is_closed
    );
    if (openChildren.length > 0) {
      errors.push(
        `Cannot close: ${openChildren.length} child issue(s) still open`
      );
    }
  }

  // Check completion
  if (issue.done_ratio < 100) {
    warnings.push('Issue is not 100% complete');
  }

  // Check spent time vs estimated
  if (issue.estimated_hours && issue.spent_hours) {
    if (issue.spent_hours < issue.estimated_hours * 0.5) {
      warnings.push('Spent time is significantly less than estimated');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate if issue can be deleted
 */
export function canDeleteIssue(issue: Issue): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check if has children
  if (issue.children && issue.children.length > 0) {
    errors.push(`Cannot delete: Issue has ${issue.children.length} child issue(s)`);
  }

  // Check if has time entries
  if (issue.spent_hours && issue.spent_hours > 0) {
    warnings.push('Issue has logged time entries');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate if issue can start (status change to In Progress)
 */
export function canStartIssue(issue: Issue): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check if already started
  if (issue.status.id === ISSUE_STATUSES.IN_PROGRESS.id) {
    errors.push('Issue is already in progress');
  }

  // Check if closed
  if (issue.status.is_closed) {
    errors.push('Cannot start a closed issue');
  }

  // Warnings
  if (!issue.assigned_to) {
    warnings.push('Issue is not assigned to anyone');
  }

  if (!issue.start_date) {
    warnings.push('Start date is not set');
  }

  if (!issue.estimated_hours) {
    warnings.push('Estimated hours not set');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate parent-child relationship
 */
export function validateParentChild(
  parentId: number,
  childId: number
): FieldValidation {
  if (parentId === childId) {
    return {
      field: 'parent',
      valid: false,
      message: 'Issue cannot be parent of itself',
    };
  }

  return { field: 'parent', valid: true };
}

// ==================== Batch Validation ====================

/**
 * Validate multiple issues
 */
export function validateIssues(issues: Partial<Issue>[]): {
  valid: boolean;
  results: { index: number; result: ValidationResult }[];
} {
  const results = issues.map((issue, index) => ({
    index,
    result: validateIssue(issue),
  }));

  const valid = results.every((r) => r.result.valid);

  return { valid, results };
}

/**
 * Get validation summary
 */
export function getValidationSummary(results: ValidationResult[]): {
  totalValid: number;
  totalInvalid: number;
  totalErrors: number;
  totalWarnings: number;
} {
  return {
    totalValid: results.filter((r) => r.valid).length,
    totalInvalid: results.filter((r) => !r.valid).length,
    totalErrors: results.reduce((sum, r) => sum + r.errors.length, 0),
    totalWarnings: results.reduce((sum, r) => sum + r.warnings.length, 0),
  };
}

// ==================== Input Sanitization ====================

/**
 * Sanitize issue subject (remove special chars, trim)
 */
export function sanitizeSubject(subject: string): string {
  return subject
    .trim()
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .substring(0, 255); // Max length
}

/**
 * Sanitize description
 */
export function sanitizeDescription(description: string): string {
  return description
    .trim()
    .replace(/\r\n/g, '\n') // Normalize line endings
    .replace(/\n{3,}/g, '\n\n'); // Max 2 consecutive newlines
}

/**
 * Normalize done ratio (ensure 0-100, round to nearest 10)
 */
export function normalizeDoneRatio(ratio: number): number {
  const clamped = Math.max(0, Math.min(100, ratio));
  return Math.round(clamped / 10) * 10;
}

/**
 * Normalize estimated hours (round to 0.5)
 */
export function normalizeEstimatedHours(hours: number): number {
  return Math.round(hours * 2) / 2;
}
