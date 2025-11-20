export interface Issue {
    id: number;
    subject: string;
    description: string;
    status: {
        id: number;
        name: string;
    };
    priority: {
        id: number;
        name: string;
    };
    assigned_to?: {
        id: number;
        name: string;
    };
    project: {
        id: number;
        name: string;
    };
    author?: {
        id: number;
        name: string;
    };
    fixed_version?: {
        id: number;
        name: string;
    };
    team?: {
        id: number;
        name: string;
    };
    parent_id?: number;
    children?: Issue[];
    start_date?: string;
    due_date?: string;
    created_on: string;
    updated_on: string;
}

export interface IssueStatus {
    id: number;
    name: string;
    is_closed: boolean;
}

export interface Project {
    id: number;
    name: string;
    identifier: string;
    description: string;
}

export interface Activity {
    id: number;
    name: string;
}

export interface TimeEntry {
    id: number;
    issue?: {
        id: number;
        subject: string;
    };
    user: {
        id: number;
        name: string;
    };
    activity: Activity;
    hours: number;
    comments: string;
    spent_on: string; // Date in YYYY-MM-DD format
    created_on: string;
    updated_on: string;
    project?: {
        id: number;
        name: string;
    };
}
