import { IssueFiltersState } from "./IssueManagement";

interface TicketFiltersProps {
    filters: IssueFiltersState;
    teams: Array<{ id: number; name: string }>;
    versions: Array<{ id: number; name: string }>;
    statuses: Array<{ id: number; name: string }>;
    onChange: (filters: IssueFiltersState) => void;
    onReset: () => void;
}

export function TicketFilters({ filters, teams, versions, statuses, onChange, onReset }: TicketFiltersProps) {
    const handleChange = (key: keyof IssueFiltersState, value: string | number | null) => {
        onChange({ ...filters, [key]: value });
    };

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-800 p-6 space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Bộ lọc</h2>
                <button
                    onClick={onReset}
                    className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-md transition-colors"
                >
                    Đặt lại
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tìm kiếm</label>
                    <input
                        type="text"
                        value={filters.query}
                        onChange={(e) => handleChange("query", e.target.value)}
                        placeholder="Nhập tiêu đề hoặc mã ticket"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:text-white"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Target Version</label>
                    <select
                        value={filters.versionId ?? ""}
                        onChange={(e) => handleChange("versionId", e.target.value ? Number(e.target.value) : null)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:text-white"
                    >
                        <option value="">Tất cả</option>
                        {versions.map((version) => (
                            <option key={version.id} value={version.id}>
                                {version.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Team</label>
                    <select
                        value={filters.teamId ?? ""}
                        onChange={(e) => handleChange("teamId", e.target.value ? Number(e.target.value) : null)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:text-white"
                    >
                        <option value="">Tất cả</option>
                        {teams.map((team) => (
                            <option key={team.id} value={team.id}>
                                {team.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Trạng thái</label>
                    <select
                        value={filters.statusId ?? ""}
                        onChange={(e) => handleChange("statusId", e.target.value ? Number(e.target.value) : null)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:text-white"
                    >
                        <option value="">Tất cả</option>
                        {statuses.map((status) => (
                            <option key={status.id} value={status.id}>
                                {status.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
}
