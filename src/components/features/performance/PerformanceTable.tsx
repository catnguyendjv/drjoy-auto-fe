import { Fragment, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react";
import { PerformanceMetric } from './types';

interface PerformanceTableProps {
    metrics: PerformanceMetric[];
}

export function PerformanceTable({ metrics }: PerformanceTableProps) {
    const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
    const [sortColumn, setSortColumn] = useState<'userName' | 'totalLOC' | 'totalBugs' | 'totalLateArrivals'>('totalBugs');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

    const sortedMetrics = [...metrics].sort((a, b) => {
        let aValue: string | number = '';
        let bValue: string | number = '';

        switch (sortColumn) {
            case 'userName':
                aValue = a.userName;
                bValue = b.userName;
                break;
            case 'totalLOC':
                aValue = a.totalLOC;
                bValue = b.totalLOC;
                break;
            case 'totalBugs':
                aValue = a.totalBugs;
                bValue = b.totalBugs;
                break;
            case 'totalLateArrivals':
                aValue = a.totalLateArrivals;
                bValue = b.totalLateArrivals;
                break;
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

    const renderSortIcon = (column: typeof sortColumn) =>
        sortColumn === column ? (sortDirection === 'asc' ? <ChevronUp className="inline w-4 h-4 ml-1" /> : <ChevronDown className="inline w-4 h-4 ml-1" />) : null;

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-800 overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-zinc-800">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Performance Table</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Click on a row to see detailed bug breakdown by environment
                </p>
            </div>

            <Table aria-label="Performance metrics" removeWrapper className="px-4">
                <TableHeader>
                    <TableColumn className="w-12" />
                    <TableColumn onClick={() => handleSort('userName')} className="cursor-pointer">
                        Member {renderSortIcon('userName')}
                    </TableColumn>
                    <TableColumn>Team</TableColumn>
                    <TableColumn onClick={() => handleSort('totalLOC')} className="cursor-pointer">
                        Total LOC {renderSortIcon('totalLOC')}
                    </TableColumn>
                    <TableColumn onClick={() => handleSort('totalBugs')} className="cursor-pointer">
                        Total Bugs {renderSortIcon('totalBugs')}
                    </TableColumn>
                    <TableColumn onClick={() => handleSort('totalLateArrivals')} className="cursor-pointer">
                        Late Arrivals {renderSortIcon('totalLateArrivals')}
                    </TableColumn>
                </TableHeader>
                <TableBody emptyContent="No performance data available for the selected filters." items={sortedMetrics}>
                    {(metric) => (
                        <Fragment key={metric.userId}>
                            <TableRow className="cursor-pointer" onClick={() => toggleRow(metric.userId)}>
                                <TableCell>
                                    {expandedRows.has(metric.userId) ? (
                                        <ChevronUp className="w-5 h-5 text-gray-400" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5 text-gray-400" />
                                    )}
                                </TableCell>
                                <TableCell>
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">{metric.userName}</div>
                                </TableCell>
                                <TableCell>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">{metric.teamName}</div>
                                </TableCell>
                                <TableCell>
                                    <div className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                                        {metric.totalLOC.toLocaleString()}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="text-sm font-semibold text-red-600 dark:text-red-400">{metric.totalBugs}</div>
                                </TableCell>
                                <TableCell>
                                    <div className="text-sm font-semibold text-orange-600 dark:text-orange-400">{metric.totalLateArrivals}</div>
                                </TableCell>
                            </TableRow>
                            {expandedRows.has(metric.userId) && (
                                <TableRow key={`details-${metric.userId}`}>
                                    <TableCell colSpan={6}>
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
                                    </TableCell>
                                </TableRow>
                            )}
                        </Fragment>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
