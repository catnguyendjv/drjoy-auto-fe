/**
 * Redmine Integration - Main Export
 * Central export file for all Redmine integration modules
 */

// ==================== Configuration ====================
export {
  REDMINE_CONFIG,
  ISSUE_STATUSES,
  ISSUE_STATUSES_ARRAY,
  TRACKERS,
  TRACKERS_ARRAY,
  PRIORITIES,
  PRIORITIES_ARRAY,
  CUSTOM_FIELDS,
  TEAM_OPTIONS,
  BUG_LEVEL_OPTIONS,
  BUG_TYPE_OPTIONS,
  BUG_ENV_OPTIONS,
  BUG_PHASE_OPTIONS,
  BUG_CAUSE_OPTIONS,
  BUG_CULPRIT_OPTIONS,
  COUNTER_MEASURES_OPTIONS,
  OCCURRENCE_OPTIONS,
  DEV_CATEGORY_OPTIONS,
  DEV_TYPE_OPTIONS,
  RELEASE_ENV_OPTIONS,
  TICKET_CATEGORY_OPTIONS,
  getStatusName,
  getTrackerName,
  getPriorityName,
  isStatusClosed,
  getDefaultPriority,
} from './lib/redmine-config';

export type {
  IssueStatusId,
  IssueStatusName,
  TrackerId,
  TrackerName,
  PriorityId,
  PriorityName,
  CustomFieldId,
} from './lib/redmine-config';

// ==================== Static Data ====================
export {
  REDMINE_PROJECTS,
  getProjectName,
  getProjectByIdentifier,
  getMainProject,
  getVietnamProject,
  getJapanProject,
} from './lib/redmine-data';

export type {
  ProjectId,
  ProjectIdentifier,
} from './lib/redmine-data';

// ==================== API Service ====================
export {
  redmineApi,
  default as RedmineApiService,
} from './lib/api/redmine.service';

export type {
  RedmineIssue,
  RedmineProject,
  RedmineUser,
  RedmineVersion,
  IssueQueryParams,
  RedmineApiResponse,
} from './lib/api/redmine.service';

// ==================== React Hooks ====================
export {
  useIssues,
  useIssue,
  useProjects,
  useProject,
  useUsers,
  useCurrentUser,
  useVersions,
  useIssueMutations,
} from './lib/hooks/useRedmine';

// ==================== Helper Utilities ====================
export {
  // Custom Field Helpers
  getCustomFieldValue,
  getCustomFieldValueByName,
  getTeam,
  getBugLevel,
  getBugType,
  getBugEnv,
  getStoryPoint,
  getReleasedDate,
  isProdRelease,
  isEmergencyRelease,
  setCustomFieldValue,
  
  // Issue Status Helpers
  isIssueClosed,
  isIssueOpen,
  isIssueInStatus,
  isIssueNew,
  isIssueInProgress,
  isIssueResolved,
  isIssueVerified,
  
  // Date Helpers
  isIssueOverdue,
  getDaysUntilDue,
  getIssueDuration,
  formatDateForRedmine,
  parseRedmineDate,
  
  // Assignment Helpers
  isIssueAssigned,
  isIssueAssignedTo,
  getAssigneeName,
  
  // Progress Helpers
  getProgressPercentage,
  isIssueCompleted,
  getProgressStatus,
  
  // Time Tracking Helpers
  getTimeSpent,
  getEstimatedTime,
  getRemainingTime,
  isOverBudget,
  getTimeSpentPercentage,
  
  // Hierarchy Helpers
  hasParent,
  hasChildren,
  getParentId,
  getChildrenCount,
  isParentIssue,
  isChildIssue,
  
  // Filtering Helpers
  filterByStatus,
  filterOpenIssues,
  filterClosedIssues,
  filterByAssignee,
  filterUnassignedIssues,
  filterOverdueIssues,
  filterByTracker,
  filterByTeam,
  
  // Sorting Helpers
  sortByDueDate,
  sortByPriority,
  sortByUpdatedDate,
  sortById,
  
  // Grouping Helpers
  groupByStatus,
  groupByAssignee,
  groupByTeam,
  groupByTracker,
} from './lib/utils/redmine-helpers';

// ==================== Validation Utilities ====================
export {
  // Validation Functions
  validateIssue,
  validateSubject,
  validateDateRange,
  validateEstimatedHours,
  validateDoneRatio,
  
  // Business Logic Validation
  canCloseIssue,
  canDeleteIssue,
  canStartIssue,
  validateParentChild,
  
  // Batch Validation
  validateIssues,
  getValidationSummary,
  
  // Sanitization
  sanitizeSubject,
  sanitizeDescription,
  normalizeDoneRatio,
  normalizeEstimatedHours,
} from './lib/utils/redmine-validation';

export type {
  ValidationResult,
  FieldValidation,
} from './lib/utils/redmine-validation';

// ==================== Query Presets ====================
export {
  // Common Queries
  openIssuesQuery,
  closedIssuesQuery,
  myIssuesQuery,
  unassignedIssuesQuery,
  overdueIssuesQuery,
  dueThisWeekQuery,
  recentlyUpdatedQuery,
  recentlyCreatedQuery,
  
  // Tracker-Specific
  bugsQuery,
  devTasksQuery,
  featuresQuery,
  
  // Priority-Specific
  highPriorityQuery,
  urgentIssuesQuery,
  
  // Status-Specific
  inProgressQuery,
  waitingForReviewQuery,
  resolvedIssuesQuery,
  
  // Custom Field Queries
  teamIssuesQuery,
  prodReleaseQuery,
  emergencyReleaseQuery,
  bugsByLevelQuery,
  criticalBugsQuery,
  
  // Version Queries
  versionIssuesQuery,
  noVersionQuery,
  
  // Advanced Queries
  parentIssuesQuery,
  issuesWithChildrenQuery,
  staleIssuesQuery,
  issuesWithTimeQuery,
  
  // Report Queries
  sprintIssuesQuery,
  completedInRangeQuery,
  
  // Query Builder
  QueryBuilder,
  query,
} from './lib/utils/redmine-queries';


// ==================== UI Utilities ====================
export {
  // Color Helpers
  getStatusColor,
  getStatusBadgeClass,
  getPriorityColor,
  getPriorityBadgeClass,
  getTrackerColor,
  getTrackerBadgeClass,
  getProgressColor,
  
  // Icon Helpers
  getTrackerIcon,
  getPriorityIcon,
  getStatusIcon,
  
  // Formatting Helpers
  formatIssueNumber,
  formatIssueTitle,
  formatDate,
  formatDateTime,
  formatDuration,
  formatProgress,
  getRelativeTime,
  getDueDateStatus,
  
  // URL Helpers
  getIssueUrl,
  getProjectUrl,
  getUserUrl,
  
  // Display Text Helpers
  getStatusDisplayText,
  getPriorityDisplayText,
  getTrackerDisplayText,
  
  // Truncate Helpers
  truncateText,
  truncateSubject,
  truncateDescription,
} from './lib/utils/redmine-ui';

// ==================== UI Components ====================
export {
  StatusBadge,
  PriorityBadge,
  TrackerBadge,
  ProgressBar,
  IssueProgress,
  IssueCard,
  IssueList,
  IssueTable,
  IssueListSkeleton,
  ErrorMessage,
} from './components/ui/redmine';

// ==================== Example Components ====================
export {
  IssueDashboard,
  SimpleIssueList,
} from './components/examples/IssueDashboard';

export {
  ScheduleGanttRedmine,
} from './components/examples/ScheduleGanttRedmine';

