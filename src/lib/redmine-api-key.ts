/**
 * Utility functions for Redmine API configuration
 */

const REDMINE_API_KEY_STORAGE_KEY = 'redmine_api_key';

/**
 * Get Redmine API key from localStorage
 */
export function getRedmineApiKey(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }
  return localStorage.getItem(REDMINE_API_KEY_STORAGE_KEY);
}

/**
 * Set Redmine API key to localStorage
 */
export function setRedmineApiKey(apiKey: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(REDMINE_API_KEY_STORAGE_KEY, apiKey);
  }
}

/**
 * Remove Redmine API key from localStorage
 */
export function removeRedmineApiKey(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(REDMINE_API_KEY_STORAGE_KEY);
  }
}

/**
 * Check if Redmine API key is configured
 */
export function hasRedmineApiKey(): boolean {
  const apiKey = getRedmineApiKey();
  return apiKey !== null && apiKey.trim() !== '';
}

/**
 * Validate Redmine API key format (40 hex characters)
 */
export function isValidRedmineApiKey(apiKey: string): boolean {
  // Redmine API keys are typically 40 character hex strings
  const hexPattern = /^[a-f0-9]{40}$/i;
  return hexPattern.test(apiKey);
}
