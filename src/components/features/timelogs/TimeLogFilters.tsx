"use client";

import { Button, Input, Select, SelectItem, type Selection } from "@heroui/react";
import { FilterState } from './types';

interface TimeLogFiltersProps {
    filters: FilterState;
    onFilterChange: (filters: FilterState) => void;
    onReset: () => void;
    users: Array<{ id: number; name: string }>;
    activities: Array<{ id: number; name: string }>;
    teams: Array<{ id: number; name: string }>;
    versions: Array<{ id: number; name: string }>;
}

export function TimeLogFilters({
    filters,
    onFilterChange,
    onReset,
    users,
    activities,
    teams,
    versions,
}: TimeLogFiltersProps) {
    const handleChange = (key: keyof FilterState, value: string | number | null) => {
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                    label="User"
                    selectionMode="single"
                    selectedKeys={getSingleSelection(filters.userId)}
                    onSelectionChange={(keys) => handleChange('userId', mapSelectionToNumber(keys))}
                    variant="bordered"
                >
                    <SelectItem key="" value="">
                        All Users
                    </SelectItem>
                    {users.map((user) => (
                        <SelectItem key={user.id.toString()} value={user.id.toString()}>
                            {user.name}
                        </SelectItem>
                    ))}
                </Select>

                <Select
                    label="Activity"
                    selectionMode="single"
                    selectedKeys={getSingleSelection(filters.activityId)}
                    onSelectionChange={(keys) => handleChange('activityId', mapSelectionToNumber(keys))}
                    variant="bordered"
                >
                    <SelectItem key="" value="">
                        All Activities
                    </SelectItem>
                    {activities.map((activity) => (
                        <SelectItem key={activity.id.toString()} value={activity.id.toString()}>
                            {activity.name}
                        </SelectItem>
                    ))}
                </Select>

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
            </div>
        </div>
    );
}
