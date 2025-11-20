import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Issue, IssueStatus } from '@/types/redmine';

interface KanbanState {
    issues: Issue[];
    statuses: IssueStatus[];
    loading: boolean;
    error: string | null;
}

const initialState: KanbanState = {
    issues: [],
    statuses: [],
    loading: false,
    error: null,
};

const kanbanSlice = createSlice({
    name: 'kanban',
    initialState,
    reducers: {
        setIssues(state, action: PayloadAction<Issue[]>) {
            state.issues = action.payload;
        },
        setStatuses(state, action: PayloadAction<IssueStatus[]>) {
            state.statuses = action.payload;
        },
        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },
        setError(state, action: PayloadAction<string | null>) {
            state.error = action.payload;
        },
        updateIssueStatus(state, action: PayloadAction<{ issueId: number; statusId: number; statusName: string }>) {
            const { issueId, statusId, statusName } = action.payload;
            const issue = state.issues.find((i) => i.id === issueId);
            if (issue) {
                issue.status = { id: statusId, name: statusName };
            }
        },
        updateIssueDates(state, action: PayloadAction<{ issueId: number; startDate: string; dueDate: string }>) {
            const { issueId, startDate, dueDate } = action.payload;
            const issue = state.issues.find((i) => i.id === issueId);
            if (issue) {
                issue.start_date = startDate;
                issue.due_date = dueDate;
            }
        },
        updateIssue(state, action: PayloadAction<Issue>) {
            const updatedIssue = action.payload;
            const index = state.issues.findIndex((i) => i.id === updatedIssue.id);
            if (index !== -1) {
                state.issues[index] = { ...updatedIssue, updated_on: new Date().toISOString() };
            }
        },

    },
});

export const { setIssues, setStatuses, setLoading, setError, updateIssueStatus, updateIssueDates, updateIssue } = kanbanSlice.actions;
export default kanbanSlice.reducer;
