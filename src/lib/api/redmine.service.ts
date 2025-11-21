/**
 * Redmine API Service
 * Service layer for making API calls to Redmine via Proxy
 */

import { REDMINE_CONFIG, TRACKERS } from '../redmine-config';

// ==================== Types ====================

export interface RedmineIssue {
  id: number;
  project: {
    id: number;
    name: string;
  };
  tracker: {
    id: number;
    name: string;
  };
  status: {
    id: number;
    name: string;
    is_closed?: boolean;
  };
  priority: {
    id: number;
    name: string;
  };
  author: {
    id: number;
    name: string;
  };
  assigned_to?: {
    id: number;
    name: string;
  };
  parent?: {
    id: number;
  };
  subject: string;
  description: string;
  start_date?: string;
  due_date?: string;
  done_ratio: number;
  is_private: boolean;
  estimated_hours?: number;
  total_estimated_hours?: number;
  spent_hours?: number;
  total_spent_hours?: number;
  custom_fields?: Array<{
    id: number;
    name: string;
    value: any;
  }>;
  created_on: string;
  updated_on: string;
  closed_on?: string;
  fixed_version?: {
    id: number;
    name: string;
  };
}

export interface RedmineProject {
  id: number;
  name: string;
  identifier: string;
  description: string;
  homepage: string;
  status: number;
  is_public: boolean;
  inherit_members: boolean;
  created_on: string;
  updated_on: string;
  parent?: {
    id: number;
    name: string;
  };
}

export interface RedmineUser {
  id: number;
  login: string;
  admin: boolean;
  firstname: string;
  lastname: string;
  mail: string;
  created_on: string;
  updated_on: string;
  last_login_on?: string;
  passwd_changed_on?: string;
  twofa_scheme?: string | null;
  custom_fields?: Array<{
    id: number;
    name: string;
    value: string;
  }>;
}

export interface RedmineVersion {
  id: number;
  project: {
    id: number;
    name: string;
  };
  name: string;
  description: string;
  status: string;
  due_date?: string;
  sharing: string;
  created_on: string;
  updated_on: string;
  wiki_page_title?: string;
}

export interface IssueQueryParams {
  project_id?: number;
  tracker_id?: number;
  status_id?: number | string; // can be 'open', 'closed', '*', or number
  assigned_to_id?: number | string; // can be 'me' or number
  fixed_version_id?: number;
  parent_id?: number | string;
  limit?: number;
  offset?: number;
  sort?: string;
  include?: string; // e.g., 'attachments,relations,children,journals'
  updated_on?: string; // e.g., '>=2023-01-01'
  cf_1?: string; // Team custom field
  cf_2?: string; // Bug level custom field
  [key: string]: any;
}

export interface RedmineApiResponse<T> {
  total_count: number;
  offset: number;
  limit: number;
  [key: string]: any;
}

export interface UpdateIssueRequest {
  project_id?: number;
  tracker_id?: number;
  status_id?: number;
  priority_id?: number;
  subject?: string;
  description?: string;
  assigned_to_id?: number;
  parent_issue_id?: number;
  start_date?: string;
  due_date?: string;
  estimated_hours?: number;
  done_ratio?: number;
  is_private?: boolean;
  fixed_version_id?: number;
  custom_fields?: Array<{
    id: number;
    value: string | number | boolean | string[];
  }>;
  notes?: string;
}

export interface BatchUpdateIssueRequest {
  updates: Array<{
    id: number;
    issue: UpdateIssueRequest;
  }>;
}

// ==================== API Service ====================

class RedmineApiService {
  private baseUrl: string;

  constructor() {
    // Base URL from environment config only
    this.baseUrl = REDMINE_CONFIG.baseUrl;
  }

  /**
   * Get API key from localStorage (user settings)
   */
  private getApiKey(): string {
    if (typeof window === 'undefined') {
      return '';
    }
    // Client-side: get from localStorage
    return localStorage.getItem('redmine_api_key') || '';
  }

  /**
   * Get API headers
   */
  private getHeaders(): HeadersInit {
    return {
      'X-Redmine-API-Key': this.getApiKey(),
      'Content-Type': 'application/json',
    };
  }

  /**
   * Build query string from params
   */
  private buildQueryString(params: Record<string, any>): string {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        query.append(key, String(value));
      }
    });
    return query.toString();
  }

  /**
   * Generic GET request
   */
  private async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const queryString = params ? `?${this.buildQueryString(params)}` : '';
    // Ensure no double slashes if baseUrl ends with / and endpoint starts with /
    const baseUrl = this.baseUrl.endsWith('/') ? this.baseUrl.slice(0, -1) : this.baseUrl;
    const finalEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${baseUrl}${finalEndpoint}${queryString}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Redmine API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Generic POST request
   */
  private async post<T>(endpoint: string, data: any): Promise<T> {
    const baseUrl = this.baseUrl.endsWith('/') ? this.baseUrl.slice(0, -1) : this.baseUrl;
    const finalEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${baseUrl}${finalEndpoint}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Redmine API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Generic PUT request
   */
  private async put<T>(endpoint: string, data: any): Promise<any> {
    const baseUrl = this.baseUrl.endsWith('/') ? this.baseUrl.slice(0, -1) : this.baseUrl;
    const finalEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${baseUrl}${finalEndpoint}`;

    console.log(url, data);
    const response = await fetch(url, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Redmine API error: ${response.status} ${response.statusText}`);
    }

    return response;
  }

  /**
   * Generic DELETE request
   */
  private async delete(endpoint: string): Promise<void> {
    const baseUrl = this.baseUrl.endsWith('/') ? this.baseUrl.slice(0, -1) : this.baseUrl;
    const finalEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${baseUrl}${finalEndpoint}`;

    const response = await fetch(url, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Redmine API error: ${response.status} ${response.statusText}`);
    }
  }

  // ==================== Issues ====================

  /**
   * Get list of issues
   * Mapped to: GET /redmine/issues/query-by-filters
   */
  async getIssues(params?: IssueQueryParams): Promise<RedmineApiResponse<RedmineIssue[]> & { issues: RedmineIssue[] }> {
    return this.get<RedmineApiResponse<RedmineIssue[]> & { issues: RedmineIssue[] }>('/issues/query-by-filters', params);
  }

  /**
   * Get sprint issues
   * Mapped to: GET /redmine/issues/sprint-issues
   */
  async getSprintIssues(params: { fixed_version_id?: number; team?: string; }): Promise<RedmineApiResponse<RedmineIssue[]> & { issues: RedmineIssue[] }> {
    return this.get<RedmineApiResponse<RedmineIssue[]> & { issues: RedmineIssue[] }>('/issues/sprint-issues', params);
  }

  /**
   * Get single issue by ID
   * Mapped to: GET /redmine/issues/detail/:id
   */
  async getIssue(id: number, include?: string): Promise<{ issue: RedmineIssue }> {
    const params = include ? { include } : undefined;
    const response = await this.get<any>(`/issues/${id}`, params);

    // Normalize response: if API returns the issue directly, wrap it
    if (response && response.issue) {
      return response;
    }
    return { issue: response };
  }

  /**
   * Create new issue
   * Mapped to:
   * - POST /redmine/issues/task
   * - POST /redmine/issues/bug
   * - POST /redmine/issues/dev
   */
  async createIssue(issueData: Partial<RedmineIssue>): Promise<{ issue: RedmineIssue }> {
    let endpoint = '/issues/task'; // Default to task

    if (issueData.tracker) {
      const trackerId = typeof issueData.tracker === 'object' ? issueData.tracker.id : issueData.tracker;

      if (trackerId === TRACKERS.BUG.id) {
        endpoint = '/issues/bug';
      } else if (trackerId === TRACKERS.DEV.id) {
        endpoint = '/issues/dev';
      }
    }

    return this.post<{ issue: RedmineIssue }>(endpoint, issueData);
  }

  /**
   * Update issue
   * Mapped to: PUT /redmine/issues/:id
   */
  async updateIssue(id: number, updateData: UpdateIssueRequest): Promise<{ issue: RedmineIssue }> {
    console.log(updateData)
    return this.put<{ issue: RedmineIssue }>(`/issues/${id}`, updateData);
  }

  /**
   * Batch update issues
   * Mapped to: POST /redmine/issues/batch-update
   */
  async batchUpdateIssues(batchRequest: BatchUpdateIssueRequest): Promise<any[]> {
    return this.post<any[]>('/issues/batch-update', batchRequest);
  }

  /**
   * Delete issue
   * Mapped to: DELETE /redmine/issues/:id (Assuming standard REST pattern as it's not explicitly in redmine.md)
   */
  async deleteIssue(id: number): Promise<void> {
    return this.delete(`/issues/${id}`);
  }

  // ==================== Projects ====================

  /**
   * Get list of projects
   * Mapped to: GET /redmine/project/info
   */
  async getProjects(params?: { limit?: number; offset?: number }): Promise<RedmineApiResponse<RedmineProject[]> & { projects: RedmineProject[] }> {
    return this.get<RedmineApiResponse<RedmineProject[]> & { projects: RedmineProject[] }>('/project/info', params);
  }

  /**
   * Get single project
   * Mapped to: GET /redmine/project/info
   */
  async getProject(id: number | string, include?: string): Promise<{ project: RedmineProject }> {
    const params = include ? { include } : undefined;
    return this.get<{ project: RedmineProject }>('/project/info', params);
  }

  // ==================== Users ====================

  /**
   * Get list of users
   * Mapped to: GET /redmine/project/users
   */
  async getUsers(params?: { limit?: number; offset?: number; status?: number }): Promise<RedmineApiResponse<RedmineUser[]> & { users: RedmineUser[] }> {
    return this.get<RedmineApiResponse<RedmineUser[]> & { users: RedmineUser[] }>('/project/users', params);
  }

  /**
   * Get single user
   * Mapped to: GET /redmine/project/users
   */
  async getUser(id: number | 'current', include?: string): Promise<{ user: RedmineUser }> {
    const response = await this.get<any>('/project/users', { id });
    if (response.users && response.users.length > 0) {
      return { user: response.users[0] };
    }
    throw new Error('User not found');
  }

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<{ user: RedmineUser }> {
    return this.getUser('current');
  }

  // ==================== Versions ====================

  /**
   * Get versions for a project
   * Mapped to: GET /redmine/project/fixed-versions
   */
  async getVersions(projectId: number | string): Promise<{ versions: RedmineVersion[] }> {
    const versions = await this.get<RedmineVersion[]>('/project/fixed-versions');
    return { versions };
  }

  /**
   * Get single version
   * Not in redmine.md.
   */
  async getVersion(id: number): Promise<{ version: RedmineVersion }> {
    throw new Error('getVersion not supported by proxy');
  }

  /**
   * Get all versions across projects
   * Mapped to: GET /redmine/project/fixed-versions
   */
  async getAllVersions(params?: { limit?: number; offset?: number }): Promise<RedmineVersion[]> {
    return this.get<RedmineVersion[]>('/project/fixed-versions', params);
  }

  // ==================== Time Entries ====================

  /**
   * Get time entries
   * Not in redmine.md.
   */
  async getTimeEntries(params?: any): Promise<RedmineApiResponse<any[]> & { time_entries: any[] }> {
    return this.get<RedmineApiResponse<any[]> & { time_entries: any[] }>('/time_entries', params);
  }

  /**
   * Create time entry
   * Not in redmine.md.
   */
  async createTimeEntry(data: any): Promise<{ time_entry: any }> {
    return this.post<{ time_entry: any }>('/time_entries', { time_entry: data });
  }
}

// ==================== Export singleton instance ====================
export const redmineApi = new RedmineApiService();
export default redmineApi;
