/**
 * Test/Demo file to verify that only changed fields are sent in update requests
 */

import { Issue } from '@/types/redmine';
import { createPartialUpdateRequest } from '@/lib/issue-utils';

// Original issue from backend
const originalIssue: Issue = {
  id: 123,
  subject: 'Original bug title',
  description: 'Original description',
  tracker: { id: 1, name: 'Bug' },
  status: { id: 1, name: 'New' },
  priority: { id: 2, name: 'Normal' },
  project: { id: 5, name: 'Test Project' },
  assigned_to: { id: 10, name: 'John Doe' },
  start_date: '2025-01-01',
  due_date: '2025-01-31',
  done_ratio: 0,
  is_private: false,
  estimated_hours: 10,
  created_on: '2025-01-01T00:00:00Z',
  updated_on: '2025-01-01T00:00:00Z',
  custom_fields: [
    { id: 1, name: 'Team', value: 'Team A' },
    { id: 2, name: 'Severity', value: 'Critical' }
  ]
};

// User edited issue - only changed a few fields
const editedIssue: Issue = {
  ...originalIssue,
  subject: 'Updated bug title', // CHANGED
  status: { id: 2, name: 'In Progress' }, // CHANGED
  priority: { id: 3, name: 'High' }, // CHANGED
  // description, dates, etc. remain unchanged
};

// Create update request - should only contain changed fields
const updateRequest = createPartialUpdateRequest(originalIssue, editedIssue);

console.log('=== UPDATE REQUEST PAYLOAD ===');
console.log(JSON.stringify(updateRequest, null, 2));
console.log('\n=== EXPECTED OUTPUT ===');
console.log(`{
  "subject": "Updated bug title",
  "status_id": 2,
  "priority_id": 3
}`);
console.log('\n✅ Notice: Only 3 fields are sent, not all fields!');

// Example 2: User clears a date field
const editedIssue2: Issue = {
  ...originalIssue,
  due_date: '', // CLEARED
};

const updateRequest2 = createPartialUpdateRequest(originalIssue, editedIssue2);
console.log('\n=== UPDATE REQUEST (CLEARING DATE) ===');
console.log(JSON.stringify(updateRequest2, null, 2));
console.log('Expected: { "due_date": "" }');

// Example 3: User updates custom fields
const editedIssue3: Issue = {
  ...originalIssue,
  custom_fields: [
    { id: 1, name: 'Team', value: 'Team B' }, // CHANGED
    { id: 2, name: 'Severity', value: 'Critical' } // UNCHANGED
  ]
};

const updateRequest3 = createPartialUpdateRequest(originalIssue, editedIssue3);
console.log('\n=== UPDATE REQUEST (CUSTOM FIELDS) ===');
console.log(JSON.stringify(updateRequest3, null, 2));

// Example 4: No changes
const updateRequest4 = createPartialUpdateRequest(originalIssue, originalIssue);
console.log('\n=== UPDATE REQUEST (NO CHANGES) ===');
console.log(JSON.stringify(updateRequest4, null, 2));
console.log('Expected: {} (empty object - nothing to update)');

/**
 * HOW TO RUN THIS TEST:
 * 
 * 1. In terminal, run:
 *    npx tsx src/lib/__tests__/issue-update-test.ts
 * 
 * 2. Or add to package.json scripts:
 *    "test:issue-update": "tsx src/lib/__tests__/issue-update-test.ts"
 *    Then run: pnpm test:issue-update
 */
