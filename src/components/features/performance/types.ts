export interface BugByEnvironment {
    jackfruit: number;
    develop: number;
    staging: number;
    master: number;
}

export interface PerformanceMetric {
    id: number;
    userId: number;
    userName: string;
    teamId: number;
    teamName: string;
    versionId?: number;
    versionName?: string;
    date: string; // YYYY-MM-DD format
    linesOfCode: number;
    bugsByEnvironment: BugByEnvironment;
    lateArrivals: number;
}

export interface TeamPerformance {
    teamId: number;
    teamName: string;
    totalLOC: number;
    totalBugs: number;
    totalLateArrivals: number;
    avgLOCPerMember: number;
    avgBugsPerMember: number;
    memberCount: number;
}

export interface PerformanceFilterState {
    startDate: string;
    endDate: string;
    teamId: number | null;
    versionId: number | null;
    userId: number | null;
}
