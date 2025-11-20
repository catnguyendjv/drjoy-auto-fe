import { Issue, IssueStatus, Activity, TimeEntry } from '@/types/redmine';

// Helper function to create a properly formatted issue
function createIssue(data: Partial<Issue> & { id: number; subject: string; description: string }): Issue {
    return {
        tracker: { id: 7, name: 'Task' },
        status: { id: 1, name: 'New' },
        priority: { id: 1, name: 'Normal' },
        project: { id: 1, name: 'Dr.Joy Auto' },
        done_ratio: 0,
        is_private: false,
        created_on: new Date().toISOString(),
        updated_on: new Date().toISOString(),
        ...data
    } as Issue;
}

export const MOCK_STATUSES: IssueStatus[] = [
    { id: 1, name: 'New', is_closed: false },
    { id: 2, name: 'In Progress', is_closed: false },
    { id: 3, name: 'Resolved', is_closed: false },
    { id: 4, name: 'Feedback', is_closed: false },
    { id: 5, name: 'Closed', is_closed: true },
    { id: 12, name: 'Released', is_closed: true },
];

export const MOCK_PRIORITIES = [
    { id: 1, name: 'Low' },
    { id: 2, name: 'Normal' },
    { id: 3, name: 'High' },
    { id: 4, name: 'Urgent' },
];

export const MOCK_TRACKERS = [
    { id: 1, name: 'Bug' },
    { id: 7, name: 'Task' },
    { id: 12, name: 'Dev' },
];

export const MOCK_VERSIONS = [
    { id: 1, name: 'v1.0.0' },
    { id: 2, name: 'v1.1.0' },
    { id: 3, name: 'v2.0.0' },
    { id: 220, name: '250822' },
];

export const MOCK_TEAMS = [
    { id: 1, name: 'Frontend Team' },
    { id: 2, name: 'Backend Team' },
    { id: 3, name: 'QA Team' },
    { id: 4, name: 'DEV05：チュンハイ' },
];

export const MOCK_USERS = [
    { id: 1, name: 'Me' },
    { id: 2, name: 'Backend Dev' },
    { id: 3, name: 'QA Engineer' },
    { id: 4, name: 'Designer' },
];

export const MOCK_ISSUES: Issue[] = [
    // Parent Ticket 1: User Authentication Feature
    createIssue({
        id: 100,
        subject: 'User Authentication Feature',
        description: 'Complete user authentication system including login, registration, and password recovery.',
        tracker: { id: 7, name: 'Task' },
        status: { id: 2, name: 'In Progress' },
        priority: { id: 3, name: 'High' },
        assigned_to: { id: 1, name: 'Me' },
        fixed_version: { id: 1, name: 'v1.0.0' },
        team: { id: 1, name: 'Frontend Team' },
        start_date: '2023-11-20',
        due_date: '2023-11-30',
        done_ratio: 60,
        created_on: '2023-11-01',
        updated_on: '2023-11-05'
    }),
    createIssue({
        id: 101,
        subject: 'Login UI Component',
        description: 'Create login page with email/password inputs and validation.',
        tracker: { id: 7, name: 'Task' },
        status: { id: 5, name: 'Closed', is_closed: true },
        priority: { id: 2, name: 'Normal' },
        assigned_to: { id: 1, name: 'Me' },
        fixed_version: { id: 1, name: 'v1.0.0' },
        team: { id: 1, name: 'Frontend Team' },
        start_date: '2023-11-20',
        due_date: '2023-11-22',
        done_ratio: 100,
        parent_id: 100,
        created_on: '2023-11-01',
        updated_on: '2023-11-05',
        closed_on: '2023-11-22'
    }),
    createIssue({
        id: 102,
        subject: 'Registration Form',
        description: 'Implement registration form with validation and error handling.',
        tracker: { id: 7, name: 'Task' },
        status: { id: 2, name: 'In Progress' },
        priority: { id: 2, name: 'Normal' },
        assigned_to: { id: 1, name: 'Me' },
        fixed_version: { id: 1, name: 'v1.0.0' },
        team: { id: 1, name: 'Frontend Team' },
        start_date: '2023-11-23',
        due_date: '2023-11-25',
        done_ratio: 50,
        parent_id: 100,
        created_on: '2023-11-02',
        updated_on: '2023-11-06'
    }),
];

export const MOCK_ACTIVITIES: Activity[] = [
    { id: 1, name: 'Development' },
    { id: 2, name: 'Design' },
    { id: 3, name: 'Testing' },
    { id: 4, name: 'Code Review' },
    { id: 5, name: 'Documentation' },
    { id: 6, name: 'Meeting' },
    { id: 7, name: 'Bug Fixing' },
    { id: 8, name: 'Research' },
];

// Helper function to generate date strings
const getDateString = (daysAgo: number): string => {
    const date = new Date('2023-11-20');
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString().split('T')[0];
};

export const MOCK_TIME_ENTRIES: TimeEntry[] = [
    {
        id: 1,
        issue: { id: 101, subject: 'Login UI Component' },
        user: { id: 1, name: 'Me' },
        activity: { id: 1, name: 'Development' },
        hours: 6.5,
        comments: 'Implemented login form with validation',
        spent_on: getDateString(0),
        created_on: getDateString(0),
        updated_on: getDateString(0),
        project: { id: 1, name: 'Dr.Joy Auto' }
    },
];

// Performance Metrics Mock Data
export const MOCK_PERFORMANCE_METRICS = [
    // Current Week - Me
    {
        id: 1,
        userId: 1,
        userName: 'Me',
        teamId: 1,
        teamName: 'Frontend Team',
        versionId: 1,
        versionName: 'v1.0.0',
        date: getDateString(0),
        linesOfCode: 450,
        bugsByEnvironment: {
            jackfruit: 2,
            develop: 1,
            staging: 0,
            master: 0
        },
        lateArrivals: 0
    },
    {
        id: 2,
        userId: 1,
        userName: 'Me',
        teamId: 1,
        teamName: 'Frontend Team',
        versionId: 1,
        versionName: 'v1.0.0',
        date: getDateString(1),
        linesOfCode: 380,
        bugsByEnvironment: {
            jackfruit: 1,
            develop: 0,
            staging: 1,
            master: 0
        },
        lateArrivals: 1
    },
    {
        id: 3,
        userId: 1,
        userName: 'Me',
        teamId: 1,
        teamName: 'Frontend Team',
        versionId: 1,
        versionName: 'v1.0.0',
        date: getDateString(2),
        linesOfCode: 520,
        bugsByEnvironment: {
            jackfruit: 0,
            develop: 2,
            staging: 0,
            master: 0
        },
        lateArrivals: 0
    },
    // Backend Dev
    {
        id: 4,
        userId: 2,
        userName: 'Backend Dev',
        teamId: 2,
        teamName: 'Backend Team',
        versionId: 1,
        versionName: 'v1.0.0',
        date: getDateString(0),
        linesOfCode: 680,
        bugsByEnvironment: {
            jackfruit: 3,
            develop: 2,
            staging: 1,
            master: 0
        },
        lateArrivals: 0
    },
    {
        id: 5,
        userId: 2,
        userName: 'Backend Dev',
        teamId: 2,
        teamName: 'Backend Team',
        versionId: 1,
        versionName: 'v1.0.0',
        date: getDateString(1),
        linesOfCode: 590,
        bugsByEnvironment: {
            jackfruit: 1,
            develop: 1,
            staging: 0,
            master: 0
        },
        lateArrivals: 0
    },
    {
        id: 6,
        userId: 2,
        userName: 'Backend Dev',
        teamId: 2,
        teamName: 'Backend Team',
        versionId: 2,
        versionName: 'v1.1.0',
        date: getDateString(2),
        linesOfCode: 720,
        bugsByEnvironment: {
            jackfruit: 2,
            develop: 1,
            staging: 1,
            master: 1
        },
        lateArrivals: 1
    },
    // QA Engineer
    {
        id: 7,
        userId: 3,
        userName: 'QA Engineer',
        teamId: 3,
        teamName: 'QA Team',
        versionId: 1,
        versionName: 'v1.0.0',
        date: getDateString(0),
        linesOfCode: 120,
        bugsByEnvironment: {
            jackfruit: 0,
            develop: 0,
            staging: 0,
            master: 0
        },
        lateArrivals: 0
    },
    {
        id: 8,
        userId: 3,
        userName: 'QA Engineer',
        teamId: 3,
        teamName: 'QA Team',
        versionId: 1,
        versionName: 'v1.0.0',
        date: getDateString(1),
        linesOfCode: 150,
        bugsByEnvironment: {
            jackfruit: 0,
            develop: 0,
            staging: 0,
            master: 0
        },
        lateArrivals: 0
    },
    {
        id: 9,
        userId: 3,
        userName: 'QA Engineer',
        teamId: 3,
        teamName: 'QA Team',
        versionId: 2,
        versionName: 'v1.1.0',
        date: getDateString(2),
        linesOfCode: 180,
        bugsByEnvironment: {
            jackfruit: 0,
            develop: 0,
            staging: 0,
            master: 0
        },
        lateArrivals: 2
    },
    // Designer
    {
        id: 10,
        userId: 4,
        userName: 'Designer',
        teamId: 1,
        teamName: 'Frontend Team',
        versionId: 1,
        versionName: 'v1.0.0',
        date: getDateString(0),
        linesOfCode: 200,
        bugsByEnvironment: {
            jackfruit: 1,
            develop: 0,
            staging: 0,
            master: 0
        },
        lateArrivals: 0
    },
    {
        id: 11,
        userId: 4,
        userName: 'Designer',
        teamId: 1,
        teamName: 'Frontend Team',
        versionId: 1,
        versionName: 'v1.0.0',
        date: getDateString(1),
        linesOfCode: 190,
        bugsByEnvironment: {
            jackfruit: 0,
            develop: 1,
            staging: 0,
            master: 0
        },
        lateArrivals: 1
    },
    {
        id: 12,
        userId: 4,
        userName: 'Designer',
        teamId: 1,
        teamName: 'Frontend Team',
        versionId: 2,
        versionName: 'v1.1.0',
        date: getDateString(2),
        linesOfCode: 230,
        bugsByEnvironment: {
            jackfruit: 0,
            develop: 0,
            staging: 1,
            master: 0
        },
        lateArrivals: 0
    },
    // Additional past week data for trends
    {
        id: 13,
        userId: 1,
        userName: 'Me',
        teamId: 1,
        teamName: 'Frontend Team',
        versionId: 1,
        versionName: 'v1.0.0',
        date: getDateString(5),
        linesOfCode: 410,
        bugsByEnvironment: {
            jackfruit: 1,
            develop: 1,
            staging: 0,
            master: 0
        },
        lateArrivals: 0
    },
    {
        id: 14,
        userId: 2,
        userName: 'Backend Dev',
        teamId: 2,
        teamName: 'Backend Team',
        versionId: 1,
        versionName: 'v1.0.0',
        date: getDateString(5),
        linesOfCode: 650,
        bugsByEnvironment: {
            jackfruit: 2,
            develop: 1,
            staging: 0,
            master: 0
        },
        lateArrivals: 0
    },
];
