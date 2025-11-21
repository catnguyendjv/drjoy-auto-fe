import { TargetVersionFilter } from './TargetVersionFilter';
import { TeamFilter } from './TeamFilter';
import { AssigneeFilter } from './AssigneeFilter';
import { IssueIdFilter } from './IssueIdFilter';
import { DateRangeFilter } from './DateRangeFilter';

interface KanbanFiltersProps {
  filterVersion: string;
  setFilterVersion: (value: string) => void;
  onVersionIdChange?: (versionId: number | null) => void;
  filterTeam: string;
  setFilterTeam: (value: string) => void;
  filterAssignee: string;
  setFilterAssignee: (value: string) => void;
  filterIssueId: string;
  setFilterIssueId: (value: string) => void;
  filterRootIssueId: string;
  setFilterRootIssueId: (value: string) => void;
  filterStartDateFrom: string;
  setFilterStartDateFrom: (value: string) => void;
  filterStartDateTo: string;
  setFilterStartDateTo: (value: string) => void;
  filterDueDateFrom: string;
  setFilterDueDateFrom: (value: string) => void;
  filterDueDateTo: string;
  setFilterDueDateTo: (value: string) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export function KanbanFilters({
  filterVersion,
  setFilterVersion,
  onVersionIdChange,
  filterTeam,
  setFilterTeam,
  filterAssignee,
  setFilterAssignee,
  filterIssueId,
  setFilterIssueId,
  filterRootIssueId,
  setFilterRootIssueId,
  filterStartDateFrom,
  setFilterStartDateFrom,
  filterStartDateTo,
  setFilterStartDateTo,
  filterDueDateFrom,
  setFilterDueDateFrom,
  filterDueDateTo,
  setFilterDueDateTo,
  onClearFilters,
  hasActiveFilters,
}: KanbanFiltersProps) {
  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex flex-wrap items-center gap-4">
        <TargetVersionFilter value={filterVersion} onChange={setFilterVersion} onVersionIdChange={onVersionIdChange} />
        <TeamFilter value={filterTeam} onChange={setFilterTeam} />
        <AssigneeFilter value={filterAssignee} onChange={setFilterAssignee} />
        <IssueIdFilter value={filterIssueId} onChange={setFilterIssueId} />
        <IssueIdFilter value={filterRootIssueId} onChange={setFilterRootIssueId} label="Root Issue ID:" />
      </div>
      
      <div className="flex flex-wrap items-center gap-4">
        <DateRangeFilter
          label="Start Date:"
          fromDate={filterStartDateFrom}
          toDate={filterStartDateTo}
          onFromDateChange={setFilterStartDateFrom}
          onToDateChange={setFilterStartDateTo}
        />
        <DateRangeFilter
          label="Due Date:"
          fromDate={filterDueDateFrom}
          toDate={filterDueDateTo}
          onFromDateChange={setFilterDueDateFrom}
          onToDateChange={setFilterDueDateTo}
        />
      </div>

      {hasActiveFilters && (
        <button
          onClick={onClearFilters}
          className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 self-start"
        >
          Clear All Filters
        </button>
      )}
    </div>
  );
}
