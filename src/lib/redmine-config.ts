/**
 * Redmine API Configuration
 * Generated from: https://redmine.famishare.jp/
 * API Key: 93ab302da634135f392e959c4789811857b3e832
 */

// ==================== API Configuration ====================
export const REDMINE_CONFIG = {
  baseUrl: 'https://redmine.famishare.jp',
  apiKey: '93ab302da634135f392e959c4789811857b3e832',
} as const;

// ==================== Issue Statuses ====================
export const ISSUE_STATUSES = {
  NEW: { id: 1, name: 'New', isClosed: false },
  IN_PROGRESS: { id: 2, name: 'In Progress', isClosed: false },
  RESOLVED: { id: 3, name: 'Resolved', isClosed: false },
  VERIFIED: { id: 9, name: 'Verified', isClosed: false },
  FEEDBACK: { id: 4, name: 'Feedback', isClosed: false },
  WFR: { id: 11, name: 'WFR', isClosed: false },
  CLOSED: { id: 5, name: 'Closed', isClosed: true },
  REJECTED: { id: 6, name: 'Rejected', isClosed: true },
  RELEASED: { id: 12, name: 'Released', isClosed: true },
  PENDING: { id: 13, name: 'Pending', isClosed: false },
} as const;

export const ISSUE_STATUSES_ARRAY = [
  { id: 1, name: 'New', isClosed: false, description: null },
  { id: 2, name: 'In Progress', isClosed: false, description: null },
  { id: 3, name: 'Resolved', isClosed: false, description: null },
  { id: 9, name: 'Verified', isClosed: false, description: null },
  { id: 4, name: 'Feedback', isClosed: false, description: null },
  { id: 11, name: 'WFR', isClosed: false, description: null },
  { id: 5, name: 'Closed', isClosed: true, description: null },
  { id: 6, name: 'Rejected', isClosed: true, description: null },
  { id: 12, name: 'Released', isClosed: true, description: null },
  { id: 13, name: 'Pending', isClosed: false, description: '' },
] as const;

// ==================== Trackers ====================
export const TRACKERS = {
  DEV: { id: 12, name: 'Dev' },
  BUG: { id: 1, name: 'Bug' },
  FEATURE: { id: 2, name: 'Feature' },
  SUPPORT: { id: 3, name: 'Support' },
  IMPLEMENT: { id: 4, name: 'Implement' },
  UT: { id: 5, name: 'UT' },
  QA: { id: 6, name: 'Q&A' },
  TASK: { id: 7, name: 'Task' },
  IT: { id: 8, name: 'IT' },
  SPEC: { id: 10, name: 'Spec' },
  PHASE: { id: 11, name: 'Phase' },
  PROPOSAL: { id: 14, name: 'Proposal' },
  RELEASE: { id: 15, name: 'Release' },
  ENV_REQ: { id: 16, name: 'EnvReq' },
  MAINTENANCE: { id: 17, name: 'Maintenance' },
} as const;

export const TRACKERS_ARRAY = [
  { id: 12, name: 'Dev' },
  { id: 1, name: 'Bug' },
  { id: 2, name: 'Feature' },
  { id: 3, name: 'Support' },
  { id: 4, name: 'Implement' },
  { id: 5, name: 'UT' },
  { id: 6, name: 'Q&A' },
  { id: 7, name: 'Task' },
  { id: 8, name: 'IT' },
  { id: 10, name: 'Spec' },
  { id: 11, name: 'Phase' },
  { id: 14, name: 'Proposal' },
  { id: 15, name: 'Release' },
  { id: 16, name: 'EnvReq' },
  { id: 17, name: 'Maintenance' },
] as const;

// ==================== Priorities ====================
export const PRIORITIES = {
  UNDEFINED: { id: 38, name: 'Undefined', isDefault: false },
  LOW: { id: 1, name: 'Low', isDefault: false },
  NORMAL: { id: 2, name: 'Normal', isDefault: true },
  HIGH: { id: 3, name: 'High', isDefault: false },
  URGENT: { id: 4, name: 'Urgent', isDefault: false },
  IMMEDIATE: { id: 5, name: 'Immediate', isDefault: false },
} as const;

export const PRIORITIES_ARRAY = [
  { id: 38, name: 'Undefined', isDefault: false, active: true },
  { id: 1, name: 'Low', isDefault: false, active: true },
  { id: 2, name: 'Normal', isDefault: true, active: true },
  { id: 3, name: 'High', isDefault: false, active: true },
  { id: 4, name: 'Urgent', isDefault: false, active: true },
  { id: 5, name: 'Immediate', isDefault: false, active: true },
] as const;

// ==================== Custom Fields ====================
export const CUSTOM_FIELDS = {
  // General Fields
  TEAM: { id: 1, name: 'Team', fieldFormat: 'list' },
  TEST_CASE_TYPE: { id: 10, name: 'Test case type', fieldFormat: 'list' },
  TICKET_CATEGORY: { id: 40, name: 'Ticket category', fieldFormat: 'list' },
  REFACTORING_PROGRESS: { id: 45, name: 'Refactoring progress', fieldFormat: 'list' },
  LATE_ARRIVAL_COUNT: { id: 46, name: 'Late arrival count (late for DAILY)', fieldFormat: 'list' },
  
  // Bug-specific Fields
  BUG_LEVEL: { id: 2, name: 'Bug level (Mức độ)', fieldFormat: 'list' },
  BUG_TYPE: { id: 95, name: 'Bug type (Loại bug)', fieldFormat: 'list' },
  BUG_CATEGORY: { id: 81, name: 'Bug category (Chủ đề)', fieldFormat: 'list' },
  BUG_ENV: { id: 14, name: 'Bug env (Môi trường)', fieldFormat: 'list' },
  BUG_PHASE: { id: 102, name: 'Bug phase (Giai đoạn phát sinh bug)', fieldFormat: 'list' },
  BUG_CAUSE: { id: 103, name: 'Bug cause (Nguyên nhân)', fieldFormat: 'list' },
  BUG_CULPRIT: { id: 104, name: 'Bug factor (Hành động gây ra bug)', fieldFormat: 'list' },
  COUNTER_MEASURES: { id: 105, name: 'Counter Measures (Đối sách)', fieldFormat: 'list' },
  OCCURRENCE: { id: 106, name: 'Occurrence/再現率', fieldFormat: 'list' },
  
  // Dev-specific Fields
  DEV_CATEGORY: { id: 108, name: 'Dev category (Chủ đề)', fieldFormat: 'list' },
  DEV_TYPE: { id: 109, name: 'Dev type (種類)', fieldFormat: 'list' },
  RELEASE_ENV: { id: 31, name: 'リリース先環境', fieldFormat: 'list' },
  
  // Date Fields
  RELEASED_DATE: { id: 33, name: 'Released date', fieldFormat: 'date' },
  START_DATE_ACT: { id: 60, name: 'Start date (Act)', fieldFormat: 'date' },
  END_DATE_ACT: { id: 61, name: 'End date (Act)', fieldFormat: 'date' },
  ESTIMATE_DATE_REQUEST: { id: 62, name: 'Estimate date (Request)', fieldFormat: 'date' },
  ESTIMATED_DATE_ANSWER: { id: 63, name: 'Estimated date (Answer)', fieldFormat: 'date' },
  PROVISIONAL_HANDLING_DATE: { id: 114, name: '暫定対応予定日(PHD)', fieldFormat: 'date' },
  PROVISIONAL_HANDLING_COMPLETED_DATE: { id: 115, name: '暫定対応完了日(PHCD)', fieldFormat: 'date' },
  PERMANENT_SOLUTION_PLANNED_DATE: { id: 118, name: '恒久対応予定日(PSPD)', fieldFormat: 'date' },
  PERMANENT_SOLUTION_COMPLETED_DATE: { id: 119, name: '恒久対応完了日(PSCD)', fieldFormat: 'date' },
  
  // Text Fields
  REFERENCE: { id: 9, name: 'Reference', fieldFormat: 'text' },
  SPEC_CONTENT: { id: 24, name: 'Spec content', fieldFormat: 'text' },
  DESIGN_CONTENT: { id: 32, name: 'Design content', fieldFormat: 'text' },
  TEST_CONTENT: { id: 35, name: 'Test content', fieldFormat: 'text' },
  OTHER_CONTENT: { id: 36, name: 'Other content', fieldFormat: 'text' },
  DETAILED_PROBLEM: { id: 110, name: '不具合詳細(Desc)', fieldFormat: 'text' },
  INVESTIGATION_CONTENT: { id: 111, name: '調査内容(Investigation)', fieldFormat: 'text' },
  BUG_CAUSE_DESC: { id: 112, name: 'バグ原因(Cause)', fieldFormat: 'text' },
  RECOVERY_CONTENT: { id: 113, name: 'リカバリー内容(Recovery content)', fieldFormat: 'text' },
  PROVISIONAL_HANDLING_CONTENT: { id: 117, name: '恒久対応内容(PSC)', fieldFormat: 'text' },
  PREVENTION_MEASURES: { id: 123, name: '再発防止策(Prevention measures)', fieldFormat: 'text' },
  
  // String Fields
  RELEASE_URL: { id: 28, name: 'Release URL', fieldFormat: 'string' },
  RELEASED_TAG: { id: 29, name: 'Released tag', fieldFormat: 'string' },
  CREATED_BY_FAMISHARE: { id: 58, name: 'Created by Famishare (Người yêu cầu)', fieldFormat: 'string' },
  LOC: { id: 59, name: 'LOC', fieldFormat: 'string' },
  ORIGINAL_TICKET: { id: 127, name: '発生元チケット', fieldFormat: 'string' },
  
  // Link Fields
  SPEC_TICKET_FILE: { id: 124, name: 'チケット仕様書ファイル（Spec Ticket file）', fieldFormat: 'link' },
  FILE_SPEC_STUDY: { id: 128, name: '仕様検討ファイル (FileSpecStudy)', fieldFormat: 'link' },
  
  // User Fields
  REVIEWER: { id: 122, name: 'レビュー者(Reviewer)', fieldFormat: 'user' },
  
  // Float Fields
  STORY_POINT: { id: 125, name: 'ストーリーポイント(Story point)', fieldFormat: 'float' },
  
  // Boolean Fields
  PROVISIONAL_HANDLING_IS_COMPLETED: { id: 116, name: '暫定対応完了(PHIC)', fieldFormat: 'bool' },
  EMERGENCY_RELEASE: { id: 120, name: '緊急リリースフラグ(Emergency release)', fieldFormat: 'bool' },
  PAID_FUNCTION: { id: 121, name: '有償／無償(Paid function)', fieldFormat: 'bool' },
  ESTIMATE_REQUEST: { id: 126, name: '見積依頼', fieldFormat: 'bool' },
  PROD_RELEASE: { id: 131, name: 'Prod Release (本番反映)', fieldFormat: 'bool' },
} as const;

// ==================== Custom Field Options ====================

// Team options
export const TEAM_OPTIONS = [
  { value: 'コアシステム', label: 'コアシステム' },
  { value: 'スマホアプリ', label: 'スマホアプリ' },
  { value: 'Web', label: 'Web' },
  { value: 'AI', label: 'AI' },
  { value: 'Other', label: 'Other' },
] as const;

// Bug Level options
export const BUG_LEVEL_OPTIONS = [
  { value: '1', label: '1 - マスタ/DB関連の不具合' },
  { value: '2', label: '2 - 特定操作によって発生する不具合' },
  { value: '3', label: '3 - すぐに修正が必要な不具合' },
  { value: '4', label: '4 - 致命的な不具合（すぐに緊急リリースが必要）' },
  { value: '5', label: '5 - 本番運用に影響がある不具合（サーバダウン、DBエラーなど）' },
] as const;

// Bug Type options
export const BUG_TYPE_OPTIONS = [
  { value: '1', label: '1 - Mismatch specification' },
  { value: '2', label: '2 - Error by server' },
  { value: '3', label: '3 - Function does not work properly' },
  { value: '4', label: '4 - Logic mistake' },
  { value: '5', label: '5 - Unreasonable specification' },
  { value: '6', label: '6 - Display/UI fault' },
  { value: '7', label: '7 - Other' },
] as const;

// Bug Environment options
export const BUG_ENV_OPTIONS = [
  { value: 'Staging', label: 'Staging' },
  { value: 'Production', label: 'Production' },
  { value: 'Local', label: 'Local' },
] as const;

// Bug Phase options
export const BUG_PHASE_OPTIONS = [
  { value: '1', label: '1 - 現行システムで確認済みの不具合' },
  { value: '2', label: '2 - 仕様' },
  { value: '3', label: '3 - 設計' },
  { value: '4', label: '4 - 実装' },
  { value: '5', label: '5 - コードレビュー' },
  { value: '6', label: '6 - 試験準備' },
  { value: '7', label: '7 - 単体試験' },
  { value: '8', label: '8 - 統合試験/運用試験' },
  { value: '9', label: '9 - リリース作業' },
  { value: '10', label: '10 - 本番運用' },
  { value: '11', label: '11 - その他' },
] as const;

// Bug Cause options
export const BUG_CAUSE_OPTIONS = [
  { value: '1', label: '1 - Không đúng Spec' },
  { value: '2', label: '2 - Quên implement' },
  { value: '3', label: '3 - Lỗi 3rd party/tool' },
  { value: '4', label: '4 - Ảnh hưởng từ chỗ khác' },
  { value: '5', label: '5 - Lỗi kỹ thuật' },
  { value: '6', label: '6 - Chưa được xác nhận' },
  { value: '7', label: '7 - Spec không rõ ràng' },
  { value: '8', label: '8 - Thiếu test case' },
  { value: '9', label: '9 - Lỗi do thay đổi môi trường' },
  { value: '10', label: '10 - Other' },
] as const;

// Bug Culprit/Factor options
export const BUG_CULPRIT_OPTIONS = [
  { value: '1', label: '1 - Sai logic' },
  { value: '2', label: '2 - Thiếu kiểm tra điều kiện' },
  { value: '3', label: '3 - Lỗi copy/paste' },
  { value: '4', label: '4 - Lỗi do refactor code' },
  { value: '5', label: '5 - Lỗi do merge code' },
  { value: '6', label: '6 - Hiểu sai Spec' },
  { value: '7', label: '7 - Lỗi thiết kế' },
  { value: '8', label: '8 - Không được review' },
  { value: '9', label: '9 - Thiếu test' },
  { value: '10', label: '10 - Other' },
] as const;

// Counter Measures options
export const COUNTER_MEASURES_OPTIONS = [
  { value: '1', label: '1 - Thiết kế lại' },
  { value: '2', label: '2 - Review kỹ hơn' },
  { value: '3', label: '3 - Code cẩn thận hơn' },
  { value: '4', label: '4 - Test kỹ hơn' },
  { value: '5', label: '5 - Thêm unit test' },
  { value: '6', label: '6 - Thêm intergration test' },
  { value: '7', label: '7 - Thêm document' },
  { value: '8', label: '8 - Thêm vào checklist' },
  { value: '9', label: '9 - Other' },
] as const;

// Occurrence options
export const OCCURRENCE_OPTIONS = [
  { value: '1', label: '1 - Always' },
  { value: '2', label: '2 - Often' },
  { value: '3', label: '3 - Sometimes' },
  { value: '4', label: '4 - Rarely' },
] as const;

// Dev Category options
export const DEV_CATEGORY_OPTIONS = [
  { value: '仕様', label: '仕様' },
  { value: '設計', label: '設計' },
  { value: '実装', label: '実装' },
  { value: '試験', label: '試験' },
  { value: 'その他', label: 'その他' },
] as const;

// Dev Type options
export const DEV_TYPE_OPTIONS = [
  { value: '新規', label: '新規' },
  { value: '改修', label: '改修' },
  { value: '調査', label: '調査' },
] as const;

// Release Environment options
export const RELEASE_ENV_OPTIONS = [
  { value: 'Staging', label: 'Staging' },
  { value: 'Production', label: 'Production' },
] as const;

// Ticket Category options
export const TICKET_CATEGORY_OPTIONS = [
  { value: 'Backend', label: 'Backend' },
  { value: 'Frontend', label: 'Frontend' },
  { value: 'FullStack', label: 'FullStack' },
  { value: 'DevOps', label: 'DevOps' },
  { value: 'Other', label: 'Other' },
] as const;

// ==================== Type Definitions ====================
export type IssueStatusId = typeof ISSUE_STATUSES_ARRAY[number]['id'];
export type IssueStatusName = typeof ISSUE_STATUSES_ARRAY[number]['name'];

export type TrackerId = typeof TRACKERS_ARRAY[number]['id'];
export type TrackerName = typeof TRACKERS_ARRAY[number]['name'];

export type PriorityId = typeof PRIORITIES_ARRAY[number]['id'];
export type PriorityName = typeof PRIORITIES_ARRAY[number]['name'];

export type CustomFieldId = typeof CUSTOM_FIELDS[keyof typeof CUSTOM_FIELDS]['id'];

// ==================== Helper Functions ====================

/**
 * Get status name by ID
 */
export const getStatusName = (id: number): string | undefined => {
  return ISSUE_STATUSES_ARRAY.find(status => status.id === id)?.name;
};

/**
 * Get tracker name by ID
 */
export const getTrackerName = (id: number): string | undefined => {
  return TRACKERS_ARRAY.find(tracker => tracker.id === id)?.name;
};

/**
 * Get priority name by ID
 */
export const getPriorityName = (id: number): string | undefined => {
  return PRIORITIES_ARRAY.find(priority => priority.id === id)?.name;
};

/**
 * Check if status is closed
 */
export const isStatusClosed = (id: number): boolean => {
  return ISSUE_STATUSES_ARRAY.find(status => status.id === id)?.isClosed ?? false;
};

/**
 * Get default priority
 */
export const getDefaultPriority = () => {
  return PRIORITIES_ARRAY.find(priority => priority.isDefault);
};
