# Redmine API Integration - Hướng Dẫn Sử Dụng

## 📚 Tổng Quan

Package này cung cấp việc tích hợp hoàn chỉnh với Redmine API cho dự án Dr.Joy, bao gồm:

- ✅ Configuration với tất cả statuses, trackers, priorities, custom fields
- ✅ Service layer để gọi API
- ✅ React hooks để sử dụng trong components
- ✅ TypeScript types đầy đủ
- ✅ Static data về projects

## 📁 Cấu Trúc Files

```
src/
├── lib/
│   ├── redmine-config.ts          # Configuration: statuses, trackers, priorities, custom fields
│   ├── redmine-data.ts            # Static data: projects
│   ├── api/
│   │   └── redmine.service.ts     # API service layer
│   ├── hooks/
│   │   └── useRedmine.ts          # React hooks
│   └── utils/
│       ├── redmine-helpers.ts     # Helper utilities for data manipulation
│       └── redmine-ui.ts          # UI utilities (colors, icons, formatting)
├── components/
│   ├── ui/
│   │   └── redmine/
│   │       └── index.tsx          # Reusable UI components
│   └── examples/
│       └── IssueDashboard.tsx     # Example components
├── types/
│   └── redmine.ts                 # TypeScript type definitions
└── redmine-integration.ts         # Central export file
```

## 🚀 Cách Sử Dụng

### 1. Import Configuration

```typescript
import { 
  REDMINE_CONFIG,
  ISSUE_STATUSES,
  TRACKERS,
  PRIORITIES,
  CUSTOM_FIELDS,
  getStatusName,
  isStatusClosed
} from '@/lib/redmine-config';

// Sử dụng constants
const newStatusId = ISSUE_STATUSES.NEW.id; // 1
const bugTrackerId = TRACKERS.BUG.id; // 1
const teamFieldId = CUSTOM_FIELDS.TEAM.id; // 1

// Sử dụng helper functions
const statusName = getStatusName(1); // 'New'
const isClosed = isStatusClosed(5); // true (Closed status)
```

### 2. Sử Dụng API Service

```typescript
import { redmineApi } from '@/lib/api/redmine.service';

// Fetch issues
const fetchIssues = async () => {
  const response = await redmineApi.getIssues({
    project_id: 1,
    status_id: 'open',
    limit: 50,
    offset: 0,
  });
  
  console.log('Total:', response.total_count);
  console.log('Issues:', response.issues);
};

// Fetch single issue
const fetchIssue = async (id: number) => {
  const response = await redmineApi.getIssue(id, 'attachments,relations');
  console.log('Issue:', response.issue);
};

// Create issue
const createIssue = async () => {
  const newIssue = await redmineApi.createIssue({
    project_id: 1,
    tracker_id: TRACKERS.BUG.id,
    status_id: ISSUE_STATUSES.NEW.id,
    priority_id: PRIORITIES.NORMAL.id,
    subject: 'Test issue',
    description: 'This is a test issue',
    assigned_to_id: 123,
  });
  
  console.log('Created:', newIssue.issue);
};

// Update issue
const updateIssue = async (id: number) => {
  await redmineApi.updateIssue(id, {
    status_id: ISSUE_STATUSES.IN_PROGRESS.id,
    done_ratio: 50,
  });
};

// Fetch projects
const fetchProjects = async () => {
  const response = await redmineApi.getProjects();
  console.log('Projects:', response.projects);
};

// Fetch users
const fetchUsers = async () => {
  const response = await redmineApi.getUsers({ limit: 100 });
  console.log('Users:', response.users);
};

// Fetch versions
const fetchVersions = async (projectId: number) => {
  const response = await redmineApi.getVersions(projectId);
  console.log('Versions:', response.versions);
};
```

### 3. Sử Dụng React Hooks

```typescript
import { 
  useIssues,
  useIssue,
  useProjects,
  useUsers,
  useCurrentUser,
  useVersions,
  useIssueMutations
} from '@/lib/hooks/useRedmine';

// Component example
function IssuesList() {
  // Fetch issues với auto-fetch
  const { data: issues, loading, error, refetch } = useIssues({
    project_id: 1,
    status_id: 'open',
    limit: 50,
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <button onClick={refetch}>Refresh</button>
      {issues.map(issue => (
        <div key={issue.id}>
          #{issue.id} - {issue.subject}
        </div>
      ))}
    </div>
  );
}

// Fetch single issue
function IssueDetail({ issueId }: { issueId: number }) {
  const { data: issue, loading } = useIssue(issueId, 'attachments,relations');

  if (loading) return <div>Loading...</div>;
  if (!issue) return <div>Issue not found</div>;

  return (
    <div>
      <h1>{issue.subject}</h1>
      <p>{issue.description}</p>
    </div>
  );
}

// Fetch projects
function ProjectsList() {
  const { data: projects, totalCount } = useProjects();

  return (
    <div>
      <h2>Projects ({totalCount})</h2>
      {projects.map(project => (
        <div key={project.id}>{project.name}</div>
      ))}
    </div>
  );
}

// Fetch users
function UsersList() {
  const { data: users } = useUsers({ limit: 100 });

  return (
    <div>
      {users.map(user => (
        <div key={user.id}>
          {user.firstname} {user.lastname}
        </div>
      ))}
    </div>
  );
}

// Current user
function CurrentUserProfile() {
  const { data: user, loading } = useCurrentUser();

  if (loading) return <div>Loading...</div>;
  if (!user) return null;

  return (
    <div>
      Welcome, {user.firstname} {user.lastname}!
    </div>
  );
}

// Create/Update/Delete issues
function IssueForm() {
  const { createIssue, updateIssue, deleteIssue, loading } = useIssueMutations();

  const handleCreate = async () => {
    try {
      const newIssue = await createIssue({
        project_id: 1,
        tracker_id: TRACKERS.BUG.id,
        subject: 'New bug',
        description: 'Bug description',
      });
      console.log('Created:', newIssue);
    } catch (err) {
      console.error('Failed to create:', err);
    }
  };

  const handleUpdate = async (id: number) => {
    try {
      await updateIssue(id, {
        status_id: ISSUE_STATUSES.RESOLVED.id,
      });
      console.log('Updated successfully');
    } catch (err) {
      console.error('Failed to update:', err);
    }
  };

  return (
    <div>
      <button onClick={handleCreate} disabled={loading}>
        Create Issue
      </button>
    </div>
  );
}
```

### 4. Sử Dụng Static Data

```typescript
import { 
  REDMINE_PROJECTS,
  getProjectName,
  getMainProject,
  getVietnamProject,
  getJapanProject
} from '@/lib/redmine-data';

// Get project name
const projectName = getProjectName(1); // '全体（JP+VN）'

// Get specific projects
const mainProject = getMainProject(); // Project ID 1
const vnProject = getVietnamProject(); // Project ID 37
const jpProject = getJapanProject(); // Project ID 38
```

## 📋 Custom Fields Reference

### General Fields
- `CUSTOM_FIELDS.TEAM` (id: 1) - Team
- `CUSTOM_FIELDS.TICKET_CATEGORY` (id: 40) - Ticket category

### Bug Fields
- `CUSTOM_FIELDS.BUG_LEVEL` (id: 2) - Bug level
- `CUSTOM_FIELDS.BUG_TYPE` (id: 95) - Bug type
- `CUSTOM_FIELDS.BUG_ENV` (id: 14) - Bug environment
- `CUSTOM_FIELDS.BUG_PHASE` (id: 102) - Bug phase
- `CUSTOM_FIELDS.BUG_CAUSE` (id: 103) - Bug cause

### Dev Fields
- `CUSTOM_FIELDS.DEV_CATEGORY` (id: 108) - Dev category
- `CUSTOM_FIELDS.DEV_TYPE` (id: 109) - Dev type
- `CUSTOM_FIELDS.STORY_POINT` (id: 125) - Story point

### Date Fields
- `CUSTOM_FIELDS.RELEASED_DATE` (id: 33) - Released date
- `CUSTOM_FIELDS.START_DATE_ACT` (id: 60) - Start date (Actual)
- `CUSTOM_FIELDS.END_DATE_ACT` (id: 61) - End date (Actual)

### Boolean Fields
- `CUSTOM_FIELDS.EMERGENCY_RELEASE` (id: 120) - Emergency release flag
- `CUSTOM_FIELDS.PROD_RELEASE` (id: 131) - Prod release flag

## 🔧 Advanced Usage

### Filter Issues với Custom Fields

```typescript
const { data: issues } = useIssues({
  project_id: 1,
  status_id: 'open',
  cf_1: 'Web', // Team = Web
  cf_2: '4', // Bug level = 4
});
```

### Include Relations và Attachments

```typescript
const { data: issue } = useIssue(
  123,
  'attachments,relations,children,journals'
);
```

### Pagination

```typescript
const { data: issues, totalCount } = useIssues({
  limit: 25,
  offset: 0, // First page
});

// Next page
const { data: nextPage } = useIssues({
  limit: 25,
  offset: 25, // Second page
});
```

### Sorting

```typescript
const { data: issues } = useIssues({
  sort: 'updated_on:desc', // Sort by updated_on descending
});
```

## 🎯 Best Practices

1. **Sử dụng constants thay vì hard-code IDs**
   ```typescript
   // ✅ Good
   status_id: ISSUE_STATUSES.NEW.id
   
   // ❌ Bad
   status_id: 1
   ```

2. **Sử dụng TypeScript types**
   ```typescript
   import type { RedmineIssue } from '@/lib/api/redmine.service';
   
   const issue: RedmineIssue = { ... };
   ```

3. **Handle errors properly**
   ```typescript
   const { data, error } = useIssues();
   
   if (error) {
     // Show error message to user
     console.error('Failed to fetch issues:', error);
   }
   ```

4. **Use autoFetch wisely**
   ```typescript
   // Auto-fetch on mount
   const { data } = useIssues({ ... }, true);
   
   // Manual fetch (don't auto-fetch)
   const { data, refetch } = useIssues({ ... }, false);
   
   // Call refetch when needed
   useEffect(() => {
     refetch();
   }, [someCondition]);
   ```

## 📝 Available Data

### Issue Statuses (10 total)
- New (1)
- In Progress (2)
- Resolved (3)
- Verified (9)
- Feedback (4)
- WFR (11)
- Closed (5) ✓ closed
- Rejected (6) ✓ closed
- Released (12) ✓ closed
- Pending (13)

### Trackers (15 total)
- Dev (12)
- Bug (1)
- Feature (2)
- Support (3)
- Task (7)
- IT (8)
- Q&A (6)
- và nhiều hơn...

### Priorities (6 total)
- Undefined (38)
- Low (1)
- Normal (2) ⭐ default
- High (3)
- Urgent (4)
- Immediate (5)

### Projects (3 total)
- 全体（JP+VN） (1)
- ベトナム（VN） (37)
- 日本（JP） (38)

## 🔑 API Configuration

API endpoint và key được cấu hình trong `redmine-config.ts`:

```typescript
export const REDMINE_CONFIG = {
  baseUrl: 'https://redmine.famishare.jp',
  apiKey: '93ab302da634135f392e959c4789811857b3e832',
};
```

## 📚 Tài Liệu Tham Khảo

- [Redmine REST API Documentation](https://www.redmine.org/projects/redmine/wiki/Rest_api)
- Redmine Instance: https://redmine.famishare.jp/

---

✨ **Happy Coding!**
