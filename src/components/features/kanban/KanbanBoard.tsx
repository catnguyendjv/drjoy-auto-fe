'use client';

import { useEffect, useState, useMemo } from 'react';
import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragOverEvent,
    DragEndEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { ChevronsDown, ChevronsRight, PlusCircle } from 'lucide-react';
import { KanbanColumn } from './KanbanColumn';
import { KanbanCard } from './KanbanCard';
import { IssueDetailModal } from '@/components/common/modals/IssueDetailModal';
import { ParentTicketBlock } from './ParentTicketBlock';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { updateIssueStatus, setIssues, setStatuses, updateIssue, setLoading } from '@/lib/redux/slices/kanbanSlice';
import { Issue, IssueStatus } from '@/types/redmine';
import { toast } from 'sonner';
import { LoadingOverlay } from '@/components/ui/LoadingSpinner';

import { KanbanFilters } from '@/components/common/filters/KanbanFilters';
import { redmineApi, RedmineIssue, BatchUpdateIssueRequest } from '@/lib/api/redmine.service';
import { CUSTOM_FIELDS, ISSUE_STATUSES } from '@/lib/redmine-config';
import { QuickIssueCreateModal } from '@/components/common/modals/QuickIssueCreateModal';

export function KanbanBoard() {
    const dispatch = useAppDispatch();
    const { issues, statuses, loading } = useAppSelector((state) => state.kanban);
    const [activeIssue, setActiveIssue] = useState<Issue | null>(null);
    const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
    const [selectedIssueIds, setSelectedIssueIds] = useState<number[]>([]);
    const [filterVersion, setFilterVersion] = useState<string>('');
    const [filterTeam, setFilterTeam] = useState<string>('DEV06：カット');
    const [filterAssignee, setFilterAssignee] = useState<string>('');
    const [filterIssueId, setFilterIssueId] = useState<string>('');
    const [filterRootIssueId, setFilterRootIssueId] = useState<string>('');
    const [filterStartDateFrom, setFilterStartDateFrom] = useState<string>('');
    const [filterStartDateTo, setFilterStartDateTo] = useState<string>('');
    const [filterDueDateFrom, setFilterDueDateFrom] = useState<string>('');
    const [filterDueDateTo, setFilterDueDateTo] = useState<string>('');
    const [targetVersionId, setTargetVersionId] = useState<number | null>(null);
    const [collapsedParentIds, setCollapsedParentIds] = useState<Set<number>>(new Set());
    const [isQuickCreateOpen, setIsQuickCreateOpen] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        const loadIssues = async () => {
            console.log('🎯 Current targetVersionId:', targetVersionId);
            
            // Only fetch if we have a target version ID
            if (!targetVersionId) {
                console.warn('⚠️ No targetVersionId, skipping fetch');
                return;
            }

            dispatch(setLoading(true));
            try {
                console.log('🔍 Fetching sprint issues with params:', { 
                    fixed_version_id: targetVersionId, 
                    team: filterTeam 
                });
                
                const response = await redmineApi.getSprintIssues({
                    fixed_version_id: targetVersionId,
                    team: filterTeam || undefined,
                });
                
                console.log('📦 API Response:', response);
                
                if (response && response) {
                    console.log('✅ Issues received:', response.length);
                    
                    // Convert RedmineIssue to Issue type for kanban
                    // We need to flatten both parent issues and their children
                    const kanbanIssues: Issue[] = [];
                    
                    const processedIds = new Set<number>();
                    
                    response.forEach((issue: RedmineIssue & { children?: RedmineIssue[] }) => {
                        // Helper function to convert RedmineIssue to Issue
                        const convertToIssue = (redmineIssue: RedmineIssue, parentId?: number): Issue | null => {
                            // Check for required fields
                            if (!redmineIssue.status || !redmineIssue.priority || !redmineIssue.project || !redmineIssue.tracker) {
                                console.warn(`⚠️ Issue #${redmineIssue.id} is missing required fields (status, priority, project, or tracker). Skipping.`, redmineIssue);
                                return null;
                            }

                            const teamField = redmineIssue.custom_fields?.find(cf => cf.name === CUSTOM_FIELDS.TEAM.name);
                            
                            return {
                                id: redmineIssue.id,
                                subject: redmineIssue.subject,
                                status: {
                                    id: redmineIssue.status.id,
                                    name: redmineIssue.status.name,
                                    is_closed: redmineIssue.status.is_closed ?? false,
                                },
                                priority: redmineIssue.priority,
                                assigned_to: redmineIssue.assigned_to,
                                tracker: redmineIssue.tracker,
                                project: redmineIssue.project,
                                description: redmineIssue.description || '',
                                due_date: redmineIssue.due_date,
                                start_date: redmineIssue.start_date,
                                done_ratio: redmineIssue.done_ratio,
                                is_private: redmineIssue.is_private,
                                estimated_hours: redmineIssue.estimated_hours,
                                spent_hours: redmineIssue.spent_hours,
                                created_on: redmineIssue.created_on,
                                updated_on: redmineIssue.updated_on,
                                custom_fields: redmineIssue.custom_fields || [],
                                parent_id: parentId ?? redmineIssue.parent?.id,
                                fixed_version: redmineIssue.fixed_version,
                                team: teamField ? {
                                    id: teamField.id,
                                    name: teamField.value as string
                                } : undefined,
                            };
                        };

                        // Add parent issue
                        if (!processedIds.has(issue.id)) {
                            const converted = convertToIssue(issue);
                            if (converted) {
                                kanbanIssues.push(converted);
                                processedIds.add(issue.id);
                            }
                        }
                        
                        // Add children issues if they exist
                        if (issue.children && Array.isArray(issue.children)) {
                            console.log(`👶 Issue #${issue.id} has ${issue.children.length} children`);
                            issue.children.forEach((child: RedmineIssue) => {
                                if (!processedIds.has(child.id)) {
                                    const converted = convertToIssue(child, issue.id);
                                    if (converted) {
                                        kanbanIssues.push(converted);
                                        processedIds.add(child.id);
                                    }
                                }
                            });
                        }
                    });

                    console.log('🎯 Total kanban issues (parent + children):', kanbanIssues.length);
                    console.log('🎯 Kanban Issues:', kanbanIssues);

                    dispatch(setIssues(kanbanIssues));
                    
                    // Use fixed statuses: New -> In Progress -> Resolved -> Close
                    const fixedStatuses: IssueStatus[] = [
                        { id: ISSUE_STATUSES.NEW.id, name: ISSUE_STATUSES.NEW.name, is_closed: ISSUE_STATUSES.NEW.isClosed },
                        { id: ISSUE_STATUSES.IN_PROGRESS.id, name: ISSUE_STATUSES.IN_PROGRESS.name, is_closed: ISSUE_STATUSES.IN_PROGRESS.isClosed },
                        { id: ISSUE_STATUSES.RESOLVED.id, name: ISSUE_STATUSES.RESOLVED.name, is_closed: ISSUE_STATUSES.RESOLVED.isClosed },
                        { id: ISSUE_STATUSES.CLOSED.id, name: ISSUE_STATUSES.CLOSED.name, is_closed: ISSUE_STATUSES.CLOSED.isClosed },
                    ];
                    
                    dispatch(setStatuses(fixedStatuses));
                    
                    toast.success(`Loaded ${kanbanIssues.length} issues`);
                } else {
                    console.warn('⚠️ No issues in response');
                }
            } catch (error) {
                console.error('❌ Failed to fetch sprint issues:', error);
                toast.error('Failed to load sprint issues');
            } finally {
                dispatch(setLoading(false));
            }
        };

        loadIssues();
    }, [dispatch, targetVersionId, filterTeam]);

    const handleVersionIdChange = (versionId: number | null) => {
        setTargetVersionId(versionId);
    };



    // Filter issues based on selected filters
    const filteredIssues = useMemo(() => {
        const filtered = issues.filter(issue => {
            // Version filter - exact match
            if (filterVersion && issue.fixed_version?.name !== filterVersion) return false;
            
            // Team filter - exact match on team name
            if (filterTeam) {
                const issueTeamName = issue.team?.name;
                if (issueTeamName !== filterTeam) {
                    console.log(`🔍 Team filter mismatch: "${issueTeamName}" !== "${filterTeam}"`);
                    return false;
                }
            }
            
            // Assignee filter - exact match on assigned_to ID
            if (filterAssignee) {
                const issueAssigneeId = issue.assigned_to?.id?.toString();
                // console.log(`Checking assignee: Issue ${issue.id}, AssigneeId: ${issueAssigneeId}, Filter: ${filterAssignee}`);
                if (issueAssigneeId !== filterAssignee) {
                    return false;
                }
            }
            
            // Issue ID filter - partial match (contains)
            if (filterIssueId) {
                const searchId = filterIssueId.trim();
                if (searchId && !issue.id.toString().includes(searchId)) {
                    return false;
                }
            }
            
            // Root Issue ID filter - partial match on parent_id (contains) OR self ID if it's a root
            if (filterRootIssueId) {
                const searchParentId = filterRootIssueId.trim();
                if (searchParentId) {
                    // If issue has a parent, check if parent_id matches
                    if (issue.parent_id) {
                        if (!issue.parent_id.toString().includes(searchParentId)) {
                            return false;
                        }
                    } else {
                        // If issue is a root (no parent), check if its OWN id matches
                        // This allows the root ticket itself to be visible when searching for it
                        if (!issue.id.toString().includes(searchParentId)) {
                            return false;
                        }
                    }
                }
            }
            
            // Filter by start date
            if (filterStartDateFrom && issue.start_date && issue.start_date < filterStartDateFrom) return false;
            if (filterStartDateTo && issue.start_date && issue.start_date > filterStartDateTo) return false;
            
            // Filter by due date
            if (filterDueDateFrom && issue.due_date && issue.due_date < filterDueDateFrom) return false;
            if (filterDueDateTo && issue.due_date && issue.due_date > filterDueDateTo) return false;
            
            return true;
        });
        
        console.log('🔍 Filtered issues:', filtered.length, 'from', issues.length, 'total');
        console.log('🔍 Active filters:', {
            filterVersion,
            filterTeam,
            filterAssignee,
            filterIssueId,
            filterRootIssueId,
        });
        
        // Debug: Show sample issue data for the first issue
        if (issues.length > 0 && (filterTeam || filterAssignee)) {
            const sampleIssue = issues[0];
            console.log('🔍 Sample issue data:', {
                id: sampleIssue.id,
                team: sampleIssue.team,
                assigned_to: sampleIssue.assigned_to,
            });
        }
        
        return filtered;
    }, [issues, filterVersion, filterTeam, filterAssignee, filterIssueId, filterRootIssueId, filterStartDateFrom, filterStartDateTo, filterDueDateFrom, filterDueDateTo]);

    // Group issues by parent
    const { parentTickets, standaloneIssues } = useMemo(() => {
        const parents: Issue[] = [];
        const standalone: Issue[] = [];
        const parentMap = new Map<number, Issue>();

        filteredIssues.forEach(issue => {
            if (issue.parent_id) {
                // It's a child issue. Ensure its parent is added to parents list.
                if (!parentMap.has(issue.parent_id)) {
                    const parent = issues.find(i => i.id === issue.parent_id);
                    if (parent) {
                        parents.push(parent);
                        parentMap.set(parent.id, parent);
                    }
                }
            } else {
                // It's a root issue.
                // Check if it has children in the FULL issues list
                const hasChildren = issues.some(i => i.parent_id === issue.id);
                
                if (hasChildren) {
                    // It's a parent ticket
                    if (!parentMap.has(issue.id)) {
                        parents.push(issue);
                        parentMap.set(issue.id, issue);
                    }
                } else {
                    // It's a standalone issue
                    standalone.push(issue);
                }
            }
        });

        // Sort parents by ID
        parents.sort((a, b) => a.id - b.id);
        
        console.log('👨‍👩‍👧‍👦 Parent tickets:', parents.length);
        console.log('🧍 Standalone issues:', standalone.length);

        return { parentTickets: parents, standaloneIssues: standalone };
    }, [filteredIssues, issues]);

    // Get children for a parent ticket
    const getChildrenForParent = (parentId: number): Issue[] => {
        return filteredIssues.filter(issue => issue.parent_id === parentId);
    };

    const toggleParentCollapse = (parentId: number) => {
        setCollapsedParentIds(prev => {
            const next = new Set(prev);
            if (next.has(parentId)) {
                next.delete(parentId);
            } else {
                next.add(parentId);
            }
            return next;
        });
    };

    const handleCollapseAll = () => {
        const allParentIds = parentTickets.map(p => p.id);
        setCollapsedParentIds(new Set(allParentIds));
    };

    const handleExpandAll = () => {
        setCollapsedParentIds(new Set());
    };

    function handleDragStart(event: DragStartEvent) {
        const { active } = event;
        const issue = active.data.current?.issue as Issue;
        setActiveIssue(issue);

        // If dragging an item that is NOT selected, clear selection and select only this one
        // unless we want to allow adding to selection by dragging (unusual)
        if (!selectedIssueIds.includes(issue.id)) {
            setSelectedIssueIds([issue.id]);
        }
    }

    function handleDragOver(event: DragOverEvent) {
        // Optional: Handle drag over logic if needed for visual feedback
    }

    async function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        setActiveIssue(null);

        if (!over) return;

        const issueId = active.id as number;
        const overId = over.id; // This could be a column ID or another card ID

        // Find the issue being dragged
        const issue = issues.find((i) => i.id === issueId);
        if (!issue) return;

        // Determine the new status
        let newStatusId: number | undefined;

        // If dropped on a column, handle both regular and unique IDs
        let overColumn = statuses.find(s => s.id === overId);

        // If not found directly, try to parse from unique ID strings
        if (!overColumn && typeof overId === 'string') {
            const parentMatch = overId.match(/^parent-\d+-status-(\d+)$/);
            const standaloneMatch = overId.match(/^standalone-status-(\d+)$/);
            let statusIdFromOver: number | null = null;

            if (parentMatch) {
                statusIdFromOver = parseInt(parentMatch[1], 10);
            } else if (standaloneMatch) {
                statusIdFromOver = parseInt(standaloneMatch[1], 10);
            }

            if (statusIdFromOver) {
                overColumn = statuses.find(s => s.id === statusIdFromOver);
            }
        }

        if (overColumn) {
            newStatusId = overColumn.id;
        } else {
            // If dropped on another card, find that card's status
            const overIssue = issues.find(i => i.id === overId);
            if (overIssue) {
                newStatusId = overIssue.status.id;
            }
        }

        if (newStatusId) {
            const statusName = statuses.find(s => s.id === newStatusId)?.name || '';
            const issuesToMoveIds = selectedIssueIds.includes(issueId) ? selectedIssueIds : [issueId];
            
            // Filter out issues that are already in the target status
            const issuesToUpdate = issuesToMoveIds.filter(id => {
                const i = issues.find(issue => issue.id === id);
                return i && i.status.id !== newStatusId;
            });

            if (issuesToUpdate.length > 0) {
                try {
                    // Call batch update API
                    const batchRequest: BatchUpdateIssueRequest = {
                        updates: issuesToUpdate.map(id => ({
                            id,
                            issue: {
                                status_id: newStatusId!
                            }
                        }))
                    };

                    await redmineApi.batchUpdateIssues(batchRequest);

                    // Update local state
                    issuesToUpdate.forEach(id => {
                        dispatch(updateIssueStatus({ issueId: id, statusId: newStatusId!, statusName }));
                    });
                    
                    if (issuesToUpdate.length === 1) {
                        toast.success(`Issue #${issuesToUpdate[0]} moved to ${statusName}`);
                    } else {
                        toast.success(`${issuesToUpdate.length} issues moved to ${statusName}`);
                    }
                } catch (error) {
                    console.error('Failed to update issues:', error);
                    toast.error('Failed to update issue status');
                }
            }
        }
        
        // Clear selection after move
        setSelectedIssueIds([]);
    }

    function handleIssueClick(issue: Issue, e: React.MouseEvent) {
        if (e.ctrlKey || e.metaKey) {
            // Toggle selection
            setSelectedIssueIds(prev => {
                if (prev.includes(issue.id)) {
                    return prev.filter(id => id !== issue.id);
                } else {
                    return [...prev, issue.id];
                }
            });
        } else {
            // Exclusive selection
            setSelectedIssueIds([issue.id]);
        }
    }

    function handleIssueDoubleClick(issue: Issue) {
        setSelectedIssue(issue);
    }

    function handleSaveIssue(updatedIssue: Issue) {
        dispatch(updateIssue(updatedIssue));
        setSelectedIssue(null);
    }

    const handleIssuesCreated = (newIssues: Issue[]) => {
        const mergedIssues = [...issues];

        newIssues.forEach((issue) => {
            const existingIndex = mergedIssues.findIndex((item) => item.id === issue.id);
            if (existingIndex >= 0) {
                mergedIssues[existingIndex] = issue;
            } else {
                mergedIssues.push(issue);
            }
        });

        dispatch(setIssues(mergedIssues));
    };

    const handleClearFilters = () => {
        // Do not clear filterVersion as it's now a required field
        setFilterTeam('');
        setFilterAssignee('');
        setFilterIssueId('');
        setFilterRootIssueId('');
        setFilterStartDateFrom('');
        setFilterStartDateTo('');
        setFilterDueDateFrom('');
        setFilterDueDateTo('');
    };

    const hasActiveFilters = !!(filterTeam || filterAssignee || filterIssueId || filterRootIssueId || filterStartDateFrom || filterStartDateTo || filterDueDateFrom || filterDueDateTo);

    return (
        <>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                <div className="flex flex-col">
                    <KanbanFilters
                        filterVersion={filterVersion}
                        setFilterVersion={setFilterVersion}
                        onVersionIdChange={handleVersionIdChange}
                        filterTeam={filterTeam}
                        setFilterTeam={setFilterTeam}
                        filterAssignee={filterAssignee}
                        setFilterAssignee={setFilterAssignee}
                        filterIssueId={filterIssueId}
                        setFilterIssueId={setFilterIssueId}
                        filterRootIssueId={filterRootIssueId}
                        setFilterRootIssueId={setFilterRootIssueId}
                        filterStartDateFrom={filterStartDateFrom}
                        setFilterStartDateFrom={setFilterStartDateFrom}
                        filterStartDateTo={filterStartDateTo}
                        setFilterStartDateTo={setFilterStartDateTo}
                        filterDueDateFrom={filterDueDateFrom}
                        setFilterDueDateFrom={setFilterDueDateFrom}
                        filterDueDateTo={filterDueDateTo}
                        setFilterDueDateTo={setFilterDueDateTo}
                    onClearFilters={handleClearFilters}
                    hasActiveFilters={hasActiveFilters}
                />

                    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                        <div className="flex gap-2">
                            <button
                                onClick={handleExpandAll}
                                className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-zinc-800 dark:border-zinc-700 dark:text-gray-300 dark:hover:bg-zinc-700 transition-colors"
                            >
                                <ChevronsDown className="w-4 h-4" />
                                Expand All
                            </button>
                            <button
                                onClick={handleCollapseAll}
                                className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-zinc-800 dark:border-zinc-700 dark:text-gray-300 dark:hover:bg-zinc-700 transition-colors"
                            >
                                <ChevronsRight className="w-4 h-4" />
                                Collapse All
                            </button>
                        </div>

                        <button
                            onClick={() => setIsQuickCreateOpen(true)}
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            <PlusCircle className="w-4 h-4" />
                            Quick Create Issues
                        </button>
                    </div>

                    {/* Parent Ticket Blocks */}
                    <div className="space-y-6">
                        {parentTickets.map((parent) => (
                            <ParentTicketBlock
                                key={parent.id}
                                parent={parent}
                                children={getChildrenForParent(parent.id)}
                                statuses={statuses}
                                onIssueClick={handleIssueClick}
                                onIssueDoubleClick={handleIssueDoubleClick}
                                selectedIssueIds={selectedIssueIds}
                                isCollapsed={collapsedParentIds.has(parent.id)}
                                onToggleCollapse={() => toggleParentCollapse(parent.id)}
                            />
                        ))}

                        {/* Standalone Issues Section */}
                        {standaloneIssues.length > 0 && (
                            <div className="border border-gray-300 dark:border-zinc-700 rounded-lg overflow-hidden bg-white dark:bg-zinc-900">
                                <div className="bg-gray-100 dark:bg-zinc-800 border-b border-gray-300 dark:border-zinc-700 p-3">
                                    <h3 className="text-md font-semibold text-gray-700 dark:text-gray-300">
                                        Standalone Issues
                                    </h3>
                                </div>
                                <div className="p-4 bg-gray-50 dark:bg-zinc-950">
                                    <div className="flex gap-4 overflow-x-auto">
                                        {statuses.map((status) => (
                                            <KanbanColumn
                                                key={`standalone-${status.id}`}
                                                status={{
                                                    ...status,
                                                    id: `standalone-status-${status.id}`,
                                                } as any}
                                                issues={standaloneIssues.filter((i) => i.status.id === status.id)}
                                                onIssueClick={handleIssueClick}
                                                onIssueDoubleClick={handleIssueDoubleClick}
                                                selectedIssueIds={selectedIssueIds}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <DragOverlay>
                    {activeIssue ? (
                        <div className="relative">
                            <KanbanCard issue={activeIssue} isSelected={true} />
                            {selectedIssueIds.length > 1 && selectedIssueIds.includes(activeIssue.id) && (
                                <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-md border-2 border-white dark:border-zinc-800">
                                    {selectedIssueIds.length}
                                </div>
                            )}
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>

            <QuickIssueCreateModal
                isOpen={isQuickCreateOpen}
                onClose={() => setIsQuickCreateOpen(false)}
                defaultVersionId={targetVersionId}
                defaultTeamName={filterTeam}
                onCreated={handleIssuesCreated}
            />

            {selectedIssue && (
                <IssueDetailModal
                    issue={selectedIssue}
                    onClose={() => setSelectedIssue(null)}
                    onSave={handleSaveIssue}
                />
            )}

            {loading && <LoadingOverlay message="Processing..." />}
        </>
    );
}
