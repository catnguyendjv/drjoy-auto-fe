"use client";

import { useMemo, useState } from "react";
import { Issue } from "@/types/redmine";
import {
    MOCK_ISSUES,
    MOCK_STATUSES,
    MOCK_TEAMS,
    MOCK_VERSIONS,
    MOCK_PRIORITIES,
} from "@/data/mockData";
import { TicketFilters } from "./TicketFilters";
import { TicketTable } from "./TicketTable";
import { CreateChildTicketModal } from "./modals/CreateChildTicketModal";
import { BulkUpdateBar } from "./components/BulkUpdateBar";

export interface IssueFiltersState {
    query: string;
    teamId: number | null;
    versionId: number | null;
    statusId: number | null;
}

function getTeamId(issue: Issue) {
    if (issue.team?.id) return issue.team.id;

    const teamField = issue.custom_fields?.find((field) => field.name.includes("担当チーム"));
    if (teamField && typeof teamField.value === "string") {
        const matchedTeam = MOCK_TEAMS.find((team) => team.name === teamField.value);
        return matchedTeam?.id ?? null;
    }

    return null;
}

export function IssueManagement() {
    const [tickets, setTickets] = useState<Issue[]>(MOCK_ISSUES);
    const [filters, setFilters] = useState<IssueFiltersState>({
        query: "",
        teamId: null,
        versionId: null,
        statusId: null,
    });
    const [selectedTicketIds, setSelectedTicketIds] = useState<number[]>([]);
    const [childTicketParent, setChildTicketParent] = useState<Issue | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const filteredTickets = useMemo(() => {
        return tickets.filter((ticket) => {
            const matchesQuery = ticket.subject.toLowerCase().includes(filters.query.toLowerCase());
            const matchesVersion = filters.versionId
                ? ticket.fixed_version?.id === filters.versionId
                : true;
            const ticketTeamId = getTeamId(ticket);
            const matchesTeam = filters.teamId ? ticketTeamId === filters.teamId : true;
            const matchesStatus = filters.statusId ? ticket.status.id === filters.statusId : true;

            return matchesQuery && matchesVersion && matchesTeam && matchesStatus;
        });
    }, [filters, tickets]);

    const handleResetFilters = () => {
        setFilters({ query: "", teamId: null, versionId: null, statusId: null });
    };

    const handleBulkUpdate = (statusId: number | null, dueDate: string | null) => {
        if (selectedTicketIds.length === 0) return;

        setTickets((prev) =>
            prev.map((ticket) => {
                if (!selectedTicketIds.includes(ticket.id)) return ticket;

                const status = statusId
                    ? MOCK_STATUSES.find((s) => s.id === statusId) ?? ticket.status
                    : ticket.status;

                return {
                    ...ticket,
                    status,
                    due_date: dueDate ?? ticket.due_date,
                    updated_on: new Date().toISOString(),
                };
            })
        );
        setSelectedTicketIds([]);
    };

    const handleCreateChildTicket = (data: {
        subject: string;
        parentId: number;
        teamId: number | null;
        versionId: number | null;
    }) => {
        const parentTicket = tickets.find((ticket) => ticket.id === data.parentId);
        if (!parentTicket) return;

        const newId = Math.floor(Date.now() / 1000);
        const newTicket: Issue = {
            id: newId,
            subject: data.subject,
            description: "",
            tracker: parentTicket.tracker,
            status: MOCK_STATUSES.find((status) => status.id === 1) ?? parentTicket.status,
            priority: parentTicket.priority ?? MOCK_PRIORITIES[0],
            project: parentTicket.project,
            author: parentTicket.author,
            assigned_to: parentTicket.assigned_to,
            fixed_version: data.versionId
                ? MOCK_VERSIONS.find((version) => version.id === data.versionId)
                : parentTicket.fixed_version,
            team: data.teamId ? MOCK_TEAMS.find((team) => team.id === data.teamId) : parentTicket.team,
            parent: { id: parentTicket.id },
            start_date: null,
            due_date: null,
            done_ratio: 0,
            is_private: false,
            estimated_hours: null,
            total_estimated_hours: null,
            spent_hours: 0,
            total_spent_hours: 0,
            custom_fields: parentTicket.custom_fields,
            created_on: new Date().toISOString(),
            updated_on: new Date().toISOString(),
            closed_on: null,
        };

        setTickets((prev) => [newTicket, ...prev]);
        setIsModalOpen(false);
        setChildTicketParent(null);
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Issue Management</h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Quản lý issues, tạo ticket con và cập nhật đồng loạt theo Target Version, Team hoặc trạng thái.
                </p>
            </div>

            <TicketFilters
                filters={filters}
                onChange={setFilters}
                onReset={handleResetFilters}
                teams={MOCK_TEAMS}
                versions={MOCK_VERSIONS}
                statuses={MOCK_STATUSES}
            />

            <BulkUpdateBar
                disabled={selectedTicketIds.length === 0}
                onApply={handleBulkUpdate}
                statuses={MOCK_STATUSES}
                selectedCount={selectedTicketIds.length}
            />

            <TicketTable
                tickets={filteredTickets}
                teams={MOCK_TEAMS}
                versions={MOCK_VERSIONS}
                selectedIds={selectedTicketIds}
                onSelectionChange={setSelectedTicketIds}
                onCreateChild={(ticket) => {
                    setChildTicketParent(ticket);
                    setIsModalOpen(true);
                }}
            />

            <CreateChildTicketModal
                open={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setChildTicketParent(null);
                }}
                parent={childTicketParent}
                teams={MOCK_TEAMS}
                versions={MOCK_VERSIONS}
                onSubmit={handleCreateChildTicket}
            />
        </div>
    );
}
