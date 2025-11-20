import { Issue, IssueStatus } from '@/types/redmine';

export const MOCK_STATUSES: IssueStatus[] = [
    { id: 1, name: 'New', is_closed: false },
    { id: 2, name: 'In Progress', is_closed: false },
    { id: 3, name: 'Resolved', is_closed: false },
    { id: 4, name: 'Feedback', is_closed: false },
    { id: 5, name: 'Closed', is_closed: true },
];

export const MOCK_PRIORITIES = [
    { id: 1, name: 'Normal' },
    { id: 2, name: 'High' },
    { id: 3, name: 'Urgent' },
    { id: 4, name: 'Low' },
];

export const MOCK_VERSIONS = [
    { id: 1, name: 'v1.0.0' },
    { id: 2, name: 'v1.1.0' },
    { id: 3, name: 'v2.0.0' },
];

export const MOCK_TEAMS = [
    { id: 1, name: 'Frontend Team' },
    { id: 2, name: 'Backend Team' },
    { id: 3, name: 'QA Team' },
];

export const MOCK_USERS = [
    { id: 1, name: 'Me' },
    { id: 2, name: 'Backend Dev' },
    { id: 3, name: 'QA Engineer' },
    { id: 4, name: 'Designer' },
];

export const MOCK_ISSUES: Issue[] = [
    {
        id: 101,
        subject: 'Design System Implementation',
        description: 'Create a comprehensive design system for the application including colors, typography, and components.',
        status: { id: 2, name: 'In Progress' },
        priority: { id: 2, name: 'High' },
        project: { id: 1, name: 'Dr.Joy Auto' },
        created_on: '2023-11-01',
        updated_on: '2023-11-05',
        start_date: '2023-11-20',
        due_date: '2023-11-25',
        assigned_to: { id: 1, name: 'Me' },
        fixed_version: { id: 1, name: 'v1.0.0' },
        team: { id: 1, name: 'Frontend Team' }
    },
    {
        id: 102,
        subject: 'Authentication Flow',
        description: 'Implement login, registration, and password recovery flows.',
        status: { id: 1, name: 'New' },
        priority: { id: 3, name: 'Urgent' },
        project: { id: 1, name: 'Dr.Joy Auto' },
        created_on: '2023-11-02',
        updated_on: '2023-11-02',
        start_date: '2023-11-26',
        due_date: '2023-11-30',
        assigned_to: { id: 1, name: 'Me' },
        fixed_version: { id: 1, name: 'v1.0.0' },
        team: { id: 1, name: 'Frontend Team' }
    },
    {
        id: 103,
        subject: 'Dashboard Layout',
        description: 'Create the main dashboard layout with sidebar and header.',
        status: { id: 5, name: 'Closed' },
        priority: { id: 1, name: 'Normal' },
        project: { id: 1, name: 'Dr.Joy Auto' },
        created_on: '2023-10-25',
        updated_on: '2023-10-30',
        start_date: '2023-11-15',
        due_date: '2023-11-18',
        assigned_to: { id: 1, name: 'Me' },
        fixed_version: { id: 1, name: 'v1.0.0' },
        team: { id: 1, name: 'Frontend Team' }
    },
    {
        id: 104,
        subject: 'API Integration',
        description: 'Integrate with the backend API for data fetching.',
        status: { id: 2, name: 'In Progress' },
        priority: { id: 2, name: 'High' },
        project: { id: 1, name: 'Dr.Joy Auto' },
        created_on: '2023-11-05',
        updated_on: '2023-11-06',
        start_date: '2023-11-22',
        due_date: '2023-12-05',
        assigned_to: { id: 1, name: 'Me' },
        fixed_version: { id: 2, name: 'v1.1.0' },
        team: { id: 2, name: 'Backend Team' }
    },
    {
        id: 105,
        subject: 'User Profile Page',
        description: 'Create a page for users to manage their profile settings.',
        status: { id: 1, name: 'New' },
        priority: { id: 1, name: 'Normal' },
        project: { id: 1, name: 'Dr.Joy Auto' },
        created_on: '2023-11-10',
        updated_on: '2023-11-10',
        start_date: '2023-12-01',
        due_date: '2023-12-05',
        assigned_to: { id: 1, name: 'Me' },
        fixed_version: { id: 2, name: 'v1.1.0' },
        team: { id: 1, name: 'Frontend Team' }
    },
    {
        id: 106,
        subject: 'Backend Setup',
        description: 'Setup the backend server and database.',
        status: { id: 2, name: 'In Progress' },
        priority: { id: 2, name: 'High' },
        project: { id: 1, name: 'Dr.Joy Auto' },
        created_on: '2023-11-01',
        updated_on: '2023-11-05',
        start_date: '2023-11-20',
        due_date: '2023-11-30',
        assigned_to: { id: 2, name: 'Backend Dev' },
        fixed_version: { id: 1, name: 'v1.0.0' },
        team: { id: 2, name: 'Backend Team' }
    },
    {
        id: 107,
        subject: 'Testing Phase 1',
        description: 'Execute first round of QA testing.',
        status: { id: 1, name: 'New' },
        priority: { id: 1, name: 'Normal' },
        project: { id: 1, name: 'Dr.Joy Auto' },
        created_on: '2023-11-15',
        updated_on: '2023-11-15',
        start_date: '2023-12-10',
        due_date: '2023-12-20',
        assigned_to: { id: 1, name: 'Me' },
        fixed_version: { id: 3, name: 'v2.0.0' },
        team: { id: 3, name: 'QA Team' }
    },
    {
        id: 108,
        subject: 'Documentation',
        description: 'Write technical documentation for the project.',
        status: { id: 4, name: 'Feedback' },
        priority: { id: 1, name: 'Normal' },
        project: { id: 1, name: 'Dr.Joy Auto' },
        created_on: '2023-11-12',
        updated_on: '2023-11-14',
        start_date: '2023-11-25',
        due_date: '2023-11-28',
        assigned_to: { id: 1, name: 'Me' },
        fixed_version: { id: 1, name: 'v1.0.0' },
        team: { id: 1, name: 'Frontend Team' }
    }
];
