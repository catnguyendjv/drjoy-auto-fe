"use client";

import { useState, useMemo } from 'react';
import { MOCK_TIME_ENTRIES, MOCK_USERS, MOCK_ACTIVITIES, MOCK_TEAMS, MOCK_VERSIONS } from '@/data/mockData';
import { TimeEntry } from '@/types/redmine';
import { TimeLogFilters } from './TimeLogFilters';
import { TimeLogCharts } from './TimeLogCharts';
import { TimeLogTable } from './TimeLogTable';
import { FilterState } from './types';



export function TimeLogManagement() {
    const [filters, setFilters] = useState<FilterState>({
        startDate: '',
        endDate: '',
        userId: null,
        activityId: null,
        teamId: null,
        versionId: null,
    });

    // Filter time entries based on selected filters
    const filteredEntries = useMemo(() => {
        return MOCK_TIME_ENTRIES.filter((entry) => {
            // Date range filter
            if (filters.startDate && entry.spent_on < filters.startDate) return false;
            if (filters.endDate && entry.spent_on > filters.endDate) return false;

            // User filter
            if (filters.userId && entry.user.id !== filters.userId) return false;

            // Activity filter
            if (filters.activityId && entry.activity.id !== filters.activityId) return false;

            // Team filter (requires looking up issue to get team)
            if (filters.teamId) {
                // For entries without issues (e.g., meetings), skip team filtering
                if (!entry.issue) return true;

                // This is simplified - in reality you'd need to join with issues data
                // For now, we'll just skip team filtering for entries with issues
                // In a real implementation, you'd look up the issue and check its team
            }

            // Version filter (similar to team filter)
            if (filters.versionId) {
                if (!entry.issue) return true;
            }

            return true;
        });
    }, [filters]);

    // Calculate analytics data
    const analyticsData = useMemo(() => {
        const totalHours = filteredEntries.reduce((sum, entry) => sum + entry.hours, 0);
        const totalEntries = filteredEntries.length;
        const avgHours = totalEntries > 0 ? totalHours / totalEntries : 0;

        // Hours by user
        const hoursByUser = filteredEntries.reduce((acc, entry) => {
            const userName = entry.user.name;
            acc[userName] = (acc[userName] || 0) + entry.hours;
            return acc;
        }, {} as Record<string, number>);

        // Hours by activity
        const hoursByActivity = filteredEntries.reduce((acc, entry) => {
            const activityName = entry.activity.name;
            acc[activityName] = (acc[activityName] || 0) + entry.hours;
            return acc;
        }, {} as Record<string, number>);

        // Hours over time (daily)
        const hoursByDate = filteredEntries.reduce((acc, entry) => {
            acc[entry.spent_on] = (acc[entry.spent_on] || 0) + entry.hours;
            return acc;
        }, {} as Record<string, number>);

        return {
            totalHours,
            totalEntries,
            avgHours,
            hoursByUser,
            hoursByActivity,
            hoursByDate,
        };
    }, [filteredEntries]);

    const handleResetFilters = () => {
        setFilters({
            startDate: '',
            endDate: '',
            userId: null,
            activityId: null,
            teamId: null,
            versionId: null,
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Time Log Management</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Analyze and manage time logs from Redmine activities
                    </p>
                </div>

                {/* Filters */}
                <TimeLogFilters
                    filters={filters}
                    onFilterChange={setFilters}
                    onReset={handleResetFilters}
                    users={MOCK_USERS}
                    activities={MOCK_ACTIVITIES}
                    teams={MOCK_TEAMS}
                    versions={MOCK_VERSIONS}
                />

                {/* Charts */}
                <TimeLogCharts analyticsData={analyticsData} />

                {/* Table */}
                <TimeLogTable entries={filteredEntries} />
            </div>
        </div>
    );
}
