import { TargetVersionFilter } from './TargetVersionFilter';
import { TeamFilter } from './TeamFilter';
import { AssigneeFilter } from './AssigneeFilter';
import { IssueIdFilter } from './IssueIdFilter';

interface KanbanFiltersProps {
  filterVersion: string;
  setFilterVersion: (value: string) => void;
  filterTeam: string;
  setFilterTeam: (value: string) => void;
  filterAssignee: string;
  setFilterAssignee: (value: string) => void;
  filterIssueId: string;
  setFilterIssueId: (value: string) => void;
  filterRootIssueId: string;
  setFilterRootIssueId: (value: string) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export function KanbanFilters({
  filterVersion,
  setFilterVersion,
  filterTeam,
  setFilterTeam,
  filterAssignee,
  setFilterAssignee,
  filterIssueId,
  setFilterIssueId,
  filterRootIssueId,
  setFilterRootIssueId,
  onClearFilters,
  hasActiveFilters,
}: KanbanFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-4 mb-6">
      <TargetVersionFilter value={filterVersion} onChange={setFilterVersion} />
      <TeamFilter value={filterTeam} onChange={setFilterTeam} />
      <AssigneeFilter value={filterAssignee} onChange={setFilterAssignee} />
      <IssueIdFilter value={filterIssueId} onChange={setFilterIssueId} />
      <IssueIdFilter value={filterRootIssueId} onChange={setFilterRootIssueId} label="Root Issue ID:" />
      
      {hasActiveFilters && (
        <button
          onClick={onClearFilters}
          className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          Clear All Filters
        </button>
      )}
    </div>
  );
}
