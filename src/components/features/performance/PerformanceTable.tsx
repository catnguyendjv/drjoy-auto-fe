"use client";

import { useState, Fragment } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { PerformanceMetric } from './types';

interface PerformanceTableProps {
    metrics: PerformanceMetric[];
}

interface AggregatedMetric {
    userId: number;
    userName: string;
    teamName: string;
    totalLOC: number;
    totalBugs: number;
    totalLateArrivals: number;
    bugsByEnvironment: {
        jackfruit: number;
        develop: number;
        staging: number;
        master: number;
    };
}

export function PerformanceTable({ metrics }: PerformanceTableProps) {
    const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
    const [sortColumn, setSortColumn] = useState<'userName' | 'totalLOC' | 'totalBugs' | 'totalLateArrivals'>('totalLOC');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

    // Aggregate metrics by user
    const aggregatedMetrics: AggregatedMetric[] = Object.values(
        metrics.reduce((acc, metric) => {
            if (!acc[metric.userId]) {
                acc[metric.userId] = {
                    userId: metric.userId,
                    userName: metric.userName,
                    teamName: metric.teamName,
                    totalLOC: 0,
                    totalBugs: 0,
                    totalLateArrivals: 0,
                    bugsByEnvironment: {
                        jackfruit: 0,
                        develop: 0,
                        staging: 0,
                        master: 0,
                    },
                };
            }

            acc[metric.userId].totalLOC += metric.linesOfCode;
            acc[metric.userId].totalBugs +=
                metric.bugsByEnvironment.jackfruit +
                metric.bugsByEnvironment.develop +
                metric.bugsByEnvironment.staging +
                metric.bugsByEnvironment.master;
            acc[metric.userId].totalLateArrivals += metric.lateArrivals;
            acc[metric.userId].bugsByEnvironment.jackfruit += metric.bugsByEnvironment.jackfruit;
            acc[metric.userId].bugsByEnvironment.develop += metric.bugsByEnvironment.develop;
            acc[metric.userId].bugsByEnvironment.staging += metric.bugsByEnvironment.staging;
            acc[metric.userId].bugsByEnvironment.master += metric.bugsByEnvironment.master;

            return acc;
        }, {} as Record<number, AggregatedMetric>)
    );

    // Sort data
    const sortedMetrics = [...aggregatedMetrics].sort((a, b) => {
        let aValue = a[sortColumn];
        let bValue = b[sortColumn];

        if (typeof aValue === 'string') {
            return sortDirection === 'asc'
                ? aValue.localeCompare(bValue as string)
                : (bValue as string).localeCompare(aValue);
        }

        return sortDirection === 'asc'
            ? (aValue as number) - (bValue as number)
            : (bValue as number) - (aValue as number);
    });

    const toggleRow = (userId: number) => {
        const newExpanded = new Set(expandedRows);
        if (newExpanded.has(userId)) {
            newExpanded.delete(userId);
        } else {
            newExpanded.add(userId);
        }
        setExpandedRows(newExpanded);
    };

    const handleSort = (column: typeof sortColumn) => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortDirection('desc');
        }
    };

    const SortIcon = ({ column }: { column: typeof sortColumn }) => {
        if (sortColumn !== column) return null;
        return sortDirection === 'asc' ? (
            <ChevronUp className="inline w-4 h-4 ml-1" />
        ) : (
            <ChevronDown className="inline w-4 h-4 ml-1" />
        );
    };

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-800 overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-zinc-800">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Performance Table</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Click on a row to see detailed bug breakdown by environment
                </p>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-800">
                    <thead className="bg-gray-50 dark:bg-zinc-800">
                        <tr>
                            <th scope="col" className="w-12 px-6 py-3"></th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-700"
                                onClick={() => handleSort('userName')}
                            >
                                Member <SortIcon column="userName" />
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Team
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-700"
                                onClick={() => handleSort('totalLOC')}
                            >
                                Total LOC <SortIcon column="totalLOC" />
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-700"
                                onClick={() => handleSort('totalBugs')}
                            >
                                Total Bugs <SortIcon column="totalBugs" />
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-700"
                                onClick={() => handleSort('totalLateArrivals')}
                            >
                                Late Arrivals <SortIcon column="totalLateArrivals" />
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-zinc-900 divide-y divide-gray-200 dark:divide-zinc-800">
                        {sortedMetrics.map((metric) => (
                            <Fragment key={metric.userId}>
                                <tr
                                    className="hover:bg-gray-50 dark:hover:bg-zinc-800 cursor-pointer transition-colors"
                                    onClick={() => toggleRow(metric.userId)}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                        {expandedRows.has(metric.userId) ? (
                                            <ChevronUp className="w-5 h-5 text-gray-400" />
                                        ) : (
                                            <ChevronDown className="w-5 h-5 text-gray-400" />
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                                            {metric.userName}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-600 dark:text-gray-400">
                                            {metric.teamName}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                                            {metric.totalLOC.toLocaleString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-semibold text-red-600 dark:text-red-400">
                                            {metric.totalBugs}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-semibold text-orange-600 dark:text-orange-400">
                                            {metric.totalLateArrivals}
                                        </div>
                                    </td>
                                </tr>
                                {expandedRows.has(metric.userId) && (
                                    <tr className="bg-gray-50 dark:bg-zinc-800/50">
                                        <td colSpan={6} className="px-6 py-4">
                                            <div className="ml-12">
                                                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                                                    Bug Breakdown by Environment
                                                </h4>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                    <div className="bg-white dark:bg-zinc-900 rounded-md p-3 border border-gray-200 dark:border-zinc-700">
                                                        <div className="text-xs text-gray-500 dark:text-gray-400">Jackfruit</div>
                                                        <div className="text-lg font-bold text-red-600 dark:text-red-400 mt-1">
                                                            {metric.bugsByEnvironment.jackfruit}
                                                        </div>
                                                    </div>
                                                    <div className="bg-white dark:bg-zinc-900 rounded-md p-3 border border-gray-200 dark:border-zinc-700">
                                                        <div className="text-xs text-gray-500 dark:text-gray-400">Develop</div>
                                                        <div className="text-lg font-bold text-orange-600 dark:text-orange-400 mt-1">
                                                            {metric.bugsByEnvironment.develop}
                                                        </div>
                                                    </div>
                                                    <div className="bg-white dark:bg-zinc-900 rounded-md p-3 border border-gray-200 dark:border-zinc-700">
                                                        <div className="text-xs text-gray-500 dark:text-gray-400">Staging</div>
                                                        <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400 mt-1">
                                                            {metric.bugsByEnvironment.staging}
                                                        </div>
                                                    </div>
                                                    <div className="bg-white dark:bg-zinc-900 rounded-md p-3 border border-gray-200 dark:border-zinc-700">
                                                        <div className="text-xs text-gray-500 dark:text-gray-400">Master</div>
                                                        <div className="text-lg font-bold text-purple-600 dark:text-purple-400 mt-1">
                                                            {metric.bugsByEnvironment.master}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </Fragment>
                        ))}
                    </tbody>
                </table>
            </div>

            {sortedMetrics.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400">No performance data available for the selected filters.</p>
                </div>
            )}
        </div>
    );
}
