/**
 * Redmine Static Data
 * Pre-fetched data from Redmine API for quick access
 */

// ==================== Projects ====================
export const REDMINE_PROJECTS = [
  {
    id: 1,
    name: '全体（JP+VN）',
    identifier: 'dev',
    description: 'Dr.JOY Development Project',
  },
  {
    id: 37,
    name: 'ベトナム（VN）',
    identifier: 'drjoy_vn',
    description: 'Dr.JOY Vietnamの開発',
    parentId: 1,
    parentName: '全体（JP+VN）',
  },
  {
    id: 38,
    name: '日本（JP）',
    identifier: 'drjoy_jp',
    description: 'Dr.JOY 日本の開発',
    parentId: 1,
    parentName: '全体（JP+VN）',
  },
] as const;

// ==================== Helper Functions for Projects ====================

/**
 * Get project name by ID
 */
export const getProjectName = (id: number): string | undefined => {
  return REDMINE_PROJECTS.find(project => project.id === id)?.name;
};

/**
 * Get project by identifier
 */
export const getProjectByIdentifier = (identifier: string) => {
  return REDMINE_PROJECTS.find(project => project.identifier === identifier);
};

/**
 * Get main project (全体)
 */
export const getMainProject = () => {
  return REDMINE_PROJECTS.find(project => project.id === 1);
};

/**
 * Get Vietnam project
 */
export const getVietnamProject = () => {
  return REDMINE_PROJECTS.find(project => project.id === 37);
};

/**
 * Get Japan project
 */
export const getJapanProject = () => {
  return REDMINE_PROJECTS.find(project => project.id === 38);
};

// ==================== Type Definitions ====================
export type ProjectId = typeof REDMINE_PROJECTS[number]['id'];
export type ProjectIdentifier = typeof REDMINE_PROJECTS[number]['identifier'];
