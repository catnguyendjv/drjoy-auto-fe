"use client";

import { Button, Input, Select, SelectItem, type Selection } from "@heroui/react";
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

    const getSingleSelection = (value?: number | null): Selection => (value ? new Set([value.toString()]) : new Set());

    const mapSelectionToNumber = (selection: Selection) => {
        const key = Array.from(selection)[0];
        return key ? Number(key) : null;
    };

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-800 p-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h2>
                <Button variant="flat" size="sm" onPress={onReset}>
                    Reset Filters
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                <Input
                    type="date"
                    label="Start Date"
                    variant="bordered"
                    value={filters.startDate}
                    onChange={(e) => handleChange('startDate', e.target.value)}
                />

                <Input
                    type="date"
                    label="End Date"
                    variant="bordered"
                    value={filters.endDate}
                    onChange={(e) => handleChange('endDate', e.target.value)}
                />

                <Select
                    label="Team"
                    selectionMode="single"
                    selectedKeys={getSingleSelection(filters.teamId)}
                    onSelectionChange={(keys) => handleChange('teamId', mapSelectionToNumber(keys))}
                    variant="bordered"
                >
                    <SelectItem key="" value="">
                        All Teams
                    </SelectItem>
                    {teams.map((team) => (
                        <SelectItem key={team.id.toString()} value={team.id.toString()}>
                            {team.name}
                        </SelectItem>
                    ))}
                </Select>

                <Select
                    label="Target Version"
                    selectionMode="single"
                    selectedKeys={getSingleSelection(filters.versionId)}
                    onSelectionChange={(keys) => handleChange('versionId', mapSelectionToNumber(keys))}
                    variant="bordered"
                >
                    <SelectItem key="" value="">
                        All Versions
                    </SelectItem>
                    {versions.map((version) => (
                        <SelectItem key={version.id.toString()} value={version.id.toString()}>
                            {version.name}
                        </SelectItem>
                    ))}
                </Select>

                <Select
                    label="Member"
                    selectionMode="single"
                    selectedKeys={getSingleSelection(filters.userId)}
                    onSelectionChange={(keys) => handleChange('userId', mapSelectionToNumber(keys))}
                    variant="bordered"
                >
                    <SelectItem key="" value="">
                        All Members
                    </SelectItem>
                    {users.map((user) => (
                        <SelectItem key={user.id.toString()} value={user.id.toString()}>
                            {user.name}
                        </SelectItem>
                    ))}
                </Select>
            </div>
        </div>
    );
}
