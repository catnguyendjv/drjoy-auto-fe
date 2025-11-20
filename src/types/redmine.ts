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
