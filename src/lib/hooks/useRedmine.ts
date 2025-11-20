/**
 * Redmine API React Hooks
 * Custom hooks for fetching and managing Redmine data
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { redmineApi, RedmineIssue, RedmineProject, RedmineUser, RedmineVersion, IssueQueryParams } from '../api/redmine.service';

// ==================== Types ====================

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

interface UseApiListState<T> {
  data: T[];
  totalCount: number;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

// ==================== Issues Hooks ====================

/**
 * Hook to fetch issues list
 */
export function useIssues(params?: IssueQueryParams, autoFetch = true): UseApiListState<RedmineIssue> {
  const [data, setData] = useState<RedmineIssue[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchIssues = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await redmineApi.getIssues(params);
      setData(response.issues);
      setTotalCount(response.total_count);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch issues'));
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    if (autoFetch) {
      fetchIssues();
    }
  }, [autoFetch, fetchIssues]);

  return { data, totalCount, loading, error, refetch: fetchIssues };
}

/**
 * Hook to fetch single issue
 */
export function useIssue(id: number | null, include?: string, autoFetch = true): UseApiState<RedmineIssue> {
  const [data, setData] = useState<RedmineIssue | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchIssue = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);
      const response = await redmineApi.getIssue(id, include);
      setData(response.issue);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch issue'));
    } finally {
      setLoading(false);
    }
  }, [id, include]);

  useEffect(() => {
    if (autoFetch && id) {
      fetchIssue();
    }
  }, [autoFetch, id, fetchIssue]);

  return { data, loading, error, refetch: fetchIssue };
}

// ==================== Projects Hooks ====================

/**
 * Hook to fetch projects list
 */
export function useProjects(params?: { limit?: number; offset?: number }, autoFetch = true): UseApiListState<RedmineProject> {
  const [data, setData] = useState<RedmineProject[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await redmineApi.getProjects(params);
      setData(response.projects);
      setTotalCount(response.total_count);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch projects'));
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    if (autoFetch) {
      fetchProjects();
    }
  }, [autoFetch, fetchProjects]);

  return { data, totalCount, loading, error, refetch: fetchProjects };
}

/**
 * Hook to fetch single project
 */
export function useProject(id: number | string | null, include?: string, autoFetch = true): UseApiState<RedmineProject> {
  const [data, setData] = useState<RedmineProject | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchProject = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);
      const response = await redmineApi.getProject(id, include);
      setData(response.project);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch project'));
    } finally {
      setLoading(false);
    }
  }, [id, include]);

  useEffect(() => {
    if (autoFetch && id) {
      fetchProject();
    }
  }, [autoFetch, id, fetchProject]);

  return { data, loading, error, refetch: fetchProject };
}

// ==================== Users Hooks ====================

/**
 * Hook to fetch users list
 */
export function useUsers(params?: { limit?: number; offset?: number; status?: number }, autoFetch = true): UseApiListState<RedmineUser> {
  const [data, setData] = useState<RedmineUser[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await redmineApi.getUsers(params);
      setData(response.users);
      setTotalCount(response.total_count);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch users'));
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    if (autoFetch) {
      fetchUsers();
    }
  }, [autoFetch, fetchUsers]);

  return { data, totalCount, loading, error, refetch: fetchUsers };
}

/**
 * Hook to fetch current user
 */
export function useCurrentUser(autoFetch = true): UseApiState<RedmineUser> {
  const [data, setData] = useState<RedmineUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchCurrentUser = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await redmineApi.getCurrentUser();
      setData(response.user);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch current user'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchCurrentUser();
    }
  }, [autoFetch, fetchCurrentUser]);

  return { data, loading, error, refetch: fetchCurrentUser };
}

// ==================== Versions Hooks ====================

/**
 * Hook to fetch versions for a project
 */
export function useVersions(projectId: number | string | null, autoFetch = true): UseApiListState<RedmineVersion> {
  const [data, setData] = useState<RedmineVersion[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchVersions = useCallback(async () => {
    if (!projectId) return;

    try {
      setLoading(true);
      setError(null);
      const response = await redmineApi.getVersions(projectId);
      setData(response.versions);
      setTotalCount(response.versions.length);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch versions'));
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    if (autoFetch && projectId) {
      fetchVersions();
    }
  }, [autoFetch, projectId, fetchVersions]);

  return { data, totalCount, loading, error, refetch: fetchVersions };
}

// ==================== Mutation Hooks ====================

/**
 * Hook for creating/updating/deleting issues
 */
export function useIssueMutations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createIssue = useCallback(async (issueData: Partial<RedmineIssue>) => {
    try {
      setLoading(true);
      setError(null);
      const response = await redmineApi.createIssue(issueData);
      return response.issue;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to create issue');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateIssue = useCallback(async (id: number, issueData: Partial<RedmineIssue>) => {
    try {
      setLoading(true);
      setError(null);
      await redmineApi.updateIssue(id, issueData);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update issue');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteIssue = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      await redmineApi.deleteIssue(id);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to delete issue');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    createIssue,
    updateIssue,
    deleteIssue,
    loading,
    error,
  };
}
