"use client";

import { useState, useMemo } from 'react';
import { MOCK_PERFORMANCE_METRICS, MOCK_USERS, MOCK_TEAMS, MOCK_VERSIONS } from '@/data/mockDataNew';
import { PerformanceFilters } from './PerformanceFilters';
import { PerformanceCharts } from './PerformanceCharts';
import { PerformanceTable } from './PerformanceTable';
import { PerformanceFilterState } from './types';

export function PerformanceManagement() {
    const [filters, setFilters] = useState<PerformanceFilterState>({
        startDate: '',
        endDate: '',
        teamId: null,
        versionId: null,
        userId: null,
    });

    // Filter performance metrics based on selected filters
    const filteredMetrics = useMemo(() => {
        return MOCK_PERFORMANCE_METRICS.filter((metric) => {
            // Date range filter
            if (filters.startDate && metric.date < filters.startDate) return false;
            if (filters.endDate && metric.date > filters.endDate) return false;

            // Team filter
            if (filters.teamId && metric.teamId !== filters.teamId) return false;

            // Version filter
            if (filters.versionId && metric.versionId !== filters.versionId) return false;

            // User filter
            if (filters.userId && metric.userId !== filters.userId) return false;

            return true;
        });
    }, [filters]);

    // Calculate analytics data
    const analyticsData = useMemo(() => {
        const totalLOC = filteredMetrics.reduce((sum, metric) => sum + metric.linesOfCode, 0);

        const totalBugs = filteredMetrics.reduce((sum, metric) =>
            sum + metric.bugsByEnvironment.jackfruit +
            metric.bugsByEnvironment.develop +
            metric.bugsByEnvironment.staging +
            metric.bugsByEnvironment.master, 0
        );

        const totalLateArrivals = filteredMetrics.reduce((sum, metric) => sum + metric.lateArrivals, 0);

        // Get unique members count
        const uniqueMembers = new Set(filteredMetrics.map(m => m.userId)).size;
        const avgLOCPerMember = uniqueMembers > 0 ? totalLOC / uniqueMembers : 0;

        // LOC by member
        const locByMember = filteredMetrics.reduce((acc, metric) => {
            acc[metric.userName] = (acc[metric.userName] || 0) + metric.linesOfCode;
            return acc;
        }, {} as Record<string, number>);

        // Bugs by member
        const bugsByMember = filteredMetrics.reduce((acc, metric) => {
            const totalMemberBugs =
                metric.bugsByEnvironment.jackfruit +
                metric.bugsByEnvironment.develop +
                metric.bugsByEnvironment.staging +
                metric.bugsByEnvironment.master;
            acc[metric.userName] = (acc[metric.userName] || 0) + totalMemberBugs;
            return acc;
        }, {} as Record<string, number>);

        // Bugs by environment
        const bugsByEnvironment = filteredMetrics.reduce((acc, metric) => {
            acc['Jackfruit'] = (acc['Jackfruit'] || 0) + metric.bugsByEnvironment.jackfruit;
            acc['Develop'] = (acc['Develop'] || 0) + metric.bugsByEnvironment.develop;
            acc['Staging'] = (acc['Staging'] || 0) + metric.bugsByEnvironment.staging;
            acc['Master'] = (acc['Master'] || 0) + metric.bugsByEnvironment.master;
            return acc;
        }, {} as Record<string, number>);

        // LOC over time (daily)
        const locOverTime = filteredMetrics.reduce((acc, metric) => {
            acc[metric.date] = (acc[metric.date] || 0) + metric.linesOfCode;
            return acc;
        }, {} as Record<string, number>);

        return {
            totalLOC,
            totalBugs,
            totalLateArrivals,
            avgLOCPerMember,
            locByMember,
            bugsByMember,
            bugsByEnvironment,
            locOverTime,
        };
    }, [filteredMetrics]);

    const handleResetFilters = () => {
        setFilters({
            startDate: '',
            endDate: '',
            teamId: null,
            versionId: null,
            userId: null,
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Team Performance Statistics</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Track team and individual performance metrics including LOC, bugs, and attendance
                    </p>
                </div>

                {/* Filters */}
                <PerformanceFilters
                    filters={filters}
                    onFilterChange={setFilters}
                    onReset={handleResetFilters}
                    users={MOCK_USERS}
                    teams={MOCK_TEAMS}
                    versions={MOCK_VERSIONS}
                />

                {/* Charts */}
                <PerformanceCharts analyticsData={analyticsData} />

                {/* Table */}
                <PerformanceTable metrics={filteredMetrics} />
            </div>
        </div>
    );
}
