import { Issue } from "@/types/redmine";

interface TicketTableProps {
    tickets: Issue[];
    teams: Array<{ id: number; name: string }>;
    versions: Array<{ id: number; name: string }>;
    selectedIds: number[];
    onSelectionChange: (ids: number[]) => void;
    onCreateChild: (ticket: Issue) => void;
}

function getTeamName(ticket: Issue, teams: Array<{ id: number; name: string }>) {
    if (ticket.team?.name) return ticket.team.name;

    const teamField = ticket.custom_fields?.find((field) => field.name.includes("担当チーム"));
    if (teamField && typeof teamField.value === "string") return teamField.value;

    if (teamField && Array.isArray(teamField.value)) return teamField.value.join(", ");

    const mappedTeam = ticket.team?.id ? teams.find((team) => team.id === ticket.team?.id) : null;
    return mappedTeam?.name ?? "-";
}

function getVersionName(ticket: Issue, versions: Array<{ id: number; name: string }>) {
    if (ticket.fixed_version?.name) return ticket.fixed_version.name;
    const matched = ticket.fixed_version?.id
        ? versions.find((version) => version.id === ticket.fixed_version?.id)
        : null;
    return matched?.name ?? "-";
}

export function TicketTable({ tickets, teams, versions, selectedIds, onSelectionChange, onCreateChild }: TicketTableProps) {
    const toggleSelection = (id: number) => {
        if (selectedIds.includes(id)) {
            onSelectionChange(selectedIds.filter((selected) => selected !== id));
        } else {
            onSelectionChange([...selectedIds, id]);
        }
    };

    const toggleAll = (checked: boolean) => {
        onSelectionChange(checked ? tickets.map((ticket) => ticket.id) : []);
    };

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-800">
                    <thead className="bg-gray-50 dark:bg-zinc-800/70">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                <input
                                    type="checkbox"
                                    checked={tickets.length > 0 && selectedIds.length === tickets.length}
                                    onChange={(e) => toggleAll(e.target.checked)}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Ticket</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Assignee</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Target Version</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Team</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Due</th>
                            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-zinc-800">
                        {tickets.map((ticket) => (
                            <tr key={ticket.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50">
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.includes(ticket.id)}
                                        onChange={() => toggleSelection(ticket.id)}
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                </td>
                                <td className="px-4 py-3">
                                    <div className="text-sm font-semibold text-gray-900 dark:text-white">#{ticket.id}</div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">{ticket.subject}</div>
                                    {ticket.parent?.id && (
                                        <div className="text-xs text-gray-500 dark:text-gray-500">Child of #{ticket.parent.id}</div>
                                    )}
                                </td>
                                <td className="px-4 py-3">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                        {ticket.status.name}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">
                                    {ticket.assigned_to?.name ?? "-"}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">
                                    {getVersionName(ticket, versions)}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">
                                    {getTeamName(ticket, teams)}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">
                                    {ticket.due_date ?? "-"}
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <button
                                        onClick={() => onCreateChild(ticket)}
                                        className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                                    >
                                        Tạo ticket con
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
