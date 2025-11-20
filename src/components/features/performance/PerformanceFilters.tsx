"use client";

import { PerformanceFilterState } from './types';

interface PerformanceFiltersProps {
    filters: PerformanceFilterState;
    onFilterChange: (filters: PerformanceFilterState) => void;
    onReset: () => void;
    users: Array<{ id: number; name: string }>;
    teams: Array<{ id: number; name: string }>;
    versions: Array<{ id: number; name: string }>;
}

export function PerformanceFilters({
    filters,
    onFilterChange,
    onReset,
    users,
    teams,
    versions,
}: PerformanceFiltersProps) {
    const handleChange = (key: keyof PerformanceFilterState, value: string | number | null) => {
        onFilterChange({ ...filters, [key]: value });
    };

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-800 p-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h2>
                <button
                    onClick={onReset}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-md transition-colors"
                >
                    Reset Filters
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {/* Start Date */}
                <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Start Date
                    </label>
                    <input
                        type="date"
                        id="startDate"
                        value={filters.startDate}
                        onChange={(e) => handleChange('startDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:text-white"
                    />
                </div>

                {/* End Date */}
                <div>
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        End Date
                    </label>
                    <input
                        type="date"
                        id="endDate"
                        value={filters.endDate}
                        onChange={(e) => handleChange('endDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:text-white"
                    />
                </div>

                {/* Team */}
                <div>
                    <label htmlFor="team" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Team
                    </label>
                    <select
                        id="team"
                        value={filters.teamId || ''}
                        onChange={(e) => handleChange('teamId', e.target.value ? Number(e.target.value) : null)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:text-white"
                    >
                        <option value="">All Teams</option>
                        {teams.map((team) => (
                            <option key={team.id} value={team.id}>
                                {team.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Version */}
                <div>
                    <label htmlFor="version" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Target Version
                    </label>
                    <select
                        id="version"
                        value={filters.versionId || ''}
                        onChange={(e) => handleChange('versionId', e.target.value ? Number(e.target.value) : null)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:text-white"
                    >
                        <option value="">All Versions</option>
                        {versions.map((version) => (
                            <option key={version.id} value={version.id}>
                                {version.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Member */}
                <div>
                    <label htmlFor="member" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Member
                    </label>
                    <select
                        id="member"
                        value={filters.userId || ''}
                        onChange={(e) => handleChange('userId', e.target.value ? Number(e.target.value) : null)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:text-white"
                    >
                        <option value="">All Members</option>
                        {users.map((user) => (
                            <option key={user.id} value={user.id}>
                                {user.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
}
