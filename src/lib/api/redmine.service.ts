/**
 * Redmine API Service
 * Service layer for making API calls to Redmine
 */

import { REDMINE_CONFIG } from '../redmine-config';

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

// ==================== API Service ====================

class RedmineApiService {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = REDMINE_CONFIG.baseUrl;
    this.apiKey = REDMINE_CONFIG.apiKey;
  }

  /**
   * Get API headers
   */
  private getHeaders(): HeadersInit {
    return {
      'X-Redmine-API-Key': this.apiKey,
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
    const url = `${this.baseUrl}${endpoint}${queryString}`;

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
    const url = `${this.baseUrl}${endpoint}`;

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
  private async put<T>(endpoint: string, data: any): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Redmine API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Generic DELETE request
   */
  private async delete(endpoint: string): Promise<void> {
    const url = `${this.baseUrl}${endpoint}`;

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
   */
  async getIssues(params?: IssueQueryParams): Promise<RedmineApiResponse<RedmineIssue[]> & { issues: RedmineIssue[] }> {
    return this.get<RedmineApiResponse<RedmineIssue[]> & { issues: RedmineIssue[] }>('/issues.json', params);
  }

  /**
   * Get single issue by ID
   */
  async getIssue(id: number, include?: string): Promise<{ issue: RedmineIssue }> {
    const params = include ? { include } : undefined;
    return this.get<{ issue: RedmineIssue }>(`/issues/${id}.json`, params);
  }

  /**
   * Create new issue
   */
  async createIssue(issueData: Partial<RedmineIssue>): Promise<{ issue: RedmineIssue }> {
    return this.post<{ issue: RedmineIssue }>('/issues.json', { issue: issueData });
  }

  /**
   * Update issue
   */
  async updateIssue(id: number, issueData: Partial<RedmineIssue>): Promise<void> {
    return this.put(`/issues/${id}.json`, { issue: issueData });
  }

  /**
   * Delete issue
   */
  async deleteIssue(id: number): Promise<void> {
    return this.delete(`/issues/${id}.json`);
  }

  // ==================== Projects ====================

  /**
   * Get list of projects
   */
  async getProjects(params?: { limit?: number; offset?: number }): Promise<RedmineApiResponse<RedmineProject[]> & { projects: RedmineProject[] }> {
    return this.get<RedmineApiResponse<RedmineProject[]> & { projects: RedmineProject[] }>('/projects.json', params);
  }

  /**
   * Get single project
   */
  async getProject(id: number | string, include?: string): Promise<{ project: RedmineProject }> {
    const params = include ? { include } : undefined;
    return this.get<{ project: RedmineProject }>(`/projects/${id}.json`, params);
  }

  // ==================== Users ====================

  /**
   * Get list of users
   */
  async getUsers(params?: { limit?: number; offset?: number; status?: number }): Promise<RedmineApiResponse<RedmineUser[]> & { users: RedmineUser[] }> {
    return this.get<RedmineApiResponse<RedmineUser[]> & { users: RedmineUser[] }>('/users.json', params);
  }

  /**
   * Get single user
   */
  async getUser(id: number | 'current', include?: string): Promise<{ user: RedmineUser }> {
    const params = include ? { include } : undefined;
    return this.get<{ user: RedmineUser }>(`/users/${id}.json`, params);
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
   */
  async getVersions(projectId: number | string): Promise<{ versions: RedmineVersion[] }> {
    return this.get<{ versions: RedmineVersion[] }>(`/projects/${projectId}/versions.json`);
  }

  /**
   * Get single version
   */
  async getVersion(id: number): Promise<{ version: RedmineVersion }> {
    return this.get<{ version: RedmineVersion }>(`/versions/${id}.json`);
  }

  // ==================== Time Entries ====================

  /**
   * Get time entries
   */
  async getTimeEntries(params?: {
    issue_id?: number;
    project_id?: number;
    user_id?: number;
    spent_on?: string;
    from?: string;
    to?: string;
    limit?: number;
    offset?: number;
  }): Promise<RedmineApiResponse<any[]> & { time_entries: any[] }> {
    return this.get<RedmineApiResponse<any[]> & { time_entries: any[] }>('/time_entries.json', params);
  }

  /**
   * Create time entry
   */
  async createTimeEntry(data: {
    issue_id?: number;
    project_id?: number;
    spent_on: string;
    hours: number;
    activity_id: number;
    comments?: string;
  }): Promise<{ time_entry: any }> {
    return this.post<{ time_entry: any }>('/time_entries.json', { time_entry: data });
  }
}

// ==================== Export singleton instance ====================
export const redmineApi = new RedmineApiService();
export default redmineApi;
