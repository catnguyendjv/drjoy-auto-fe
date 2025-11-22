"use client";

import { useState } from 'react';
import { Pagination, Select, SelectItem, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react";
import { TimeEntry } from '@/types/redmine';

interface TimeLogTableProps {
    entries: TimeEntry[];
}

export function TimeLogTable({ entries }: TimeLogTableProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const [entriesPerPage, setEntriesPerPage] = useState(25);
    const [sortField, setSortField] = useState<keyof TimeEntry>('spent_on');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

    const getFieldValue = (entry: TimeEntry, field: keyof TimeEntry): string | number | undefined => {
        if (field === 'user') return entry.user.name;
        if (field === 'activity') return entry.activity.name;
        if (field === 'issue') return entry.issue?.subject;
        const value = entry[field];
        return typeof value === 'string' || typeof value === 'number' ? value : undefined;
    };

    // Sort entries
    const sortedEntries = [...entries].sort((a, b) => {
        const aValue = getFieldValue(a, sortField);
        const bValue = getFieldValue(b, sortField);

        if (aValue === undefined) return 1;
        if (bValue === undefined) return -1;
        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
    });

    // Pagination
    const indexOfLastEntry = currentPage * entriesPerPage;
    const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
    const currentEntries = sortedEntries.slice(indexOfFirstEntry, indexOfLastEntry);
    const totalPages = Math.ceil(sortedEntries.length / entriesPerPage) || 1;

    const handleSort = (field: keyof TimeEntry) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const renderSortIcon = (field: keyof TimeEntry) =>
        sortField === field ? (sortDirection === 'asc' ? '↑' : '↓') : '↕';

    if (entries.length === 0) {
        return (
            <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-800 p-12 text-center">
                <p className="text-gray-500 dark:text-gray-400">No time entries found matching your filters.</p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-800">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 dark:border-zinc-800">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Time Entries</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Showing {indexOfFirstEntry + 1}-{Math.min(indexOfLastEntry, sortedEntries.length)} of {sortedEntries.length} entries
                </p>
            </div>

            {/* Table */}
            <Table aria-label="Time entries" removeWrapper className="px-4">
                <TableHeader>
                    <TableColumn onClick={() => handleSort('spent_on')} className="cursor-pointer">
                        Date {renderSortIcon('spent_on')}
                    </TableColumn>
                    <TableColumn onClick={() => handleSort('user')} className="cursor-pointer">
                        User {renderSortIcon('user')}
                    </TableColumn>
                    <TableColumn onClick={() => handleSort('issue')} className="cursor-pointer">
                        Issue {renderSortIcon('issue')}
                    </TableColumn>
                    <TableColumn onClick={() => handleSort('activity')} className="cursor-pointer">
                        Activity {renderSortIcon('activity')}
                    </TableColumn>
                    <TableColumn onClick={() => handleSort('hours')} className="cursor-pointer">
                        Hours {renderSortIcon('hours')}
                    </TableColumn>
                    <TableColumn>Comments</TableColumn>
                </TableHeader>
                <TableBody items={currentEntries} emptyContent="No time entries found">
                    {(entry) => (
                        <TableRow key={entry.id}>
                            <TableCell>
                                {new Date(entry.spent_on).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                })}
                            </TableCell>
                            <TableCell>{entry.user.name}</TableCell>
                            <TableCell>
                                {entry.issue ? (
                                    <span className="text-blue-600 dark:text-blue-400">{entry.issue.subject}</span>
                                ) : (
                                    <span className="text-gray-400">No issue</span>
                                )}
                            </TableCell>
                            <TableCell>
                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                    {entry.activity.name}
                                </span>
                            </TableCell>
                            <TableCell>{entry.hours}h</TableCell>
                            <TableCell className="max-w-xs truncate">{entry.comments}</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-gray-200 dark:border-zinc-800 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Select
                    label="Entries per page"
                    size="sm"
                    selectedKeys={new Set([entriesPerPage.toString()])}
                    onSelectionChange={(keys) => {
                        const value = Number(Array.from(keys)[0]);
                        setEntriesPerPage(value);
                        setCurrentPage(1);
                    }}
                    className="w-48"
                    variant="bordered"
                >
                    <SelectItem key="10" value="10">
                        10
                    </SelectItem>
                    <SelectItem key="25" value="25">
                        25
                    </SelectItem>
                    <SelectItem key="50" value="50">
                        50
                    </SelectItem>
                </Select>

                <Pagination
                    page={currentPage}
                    total={totalPages}
                    onChange={setCurrentPage}
                    color="primary"
                    showControls
                    variant="bordered"
                />
            </div>
        </div>
    );
}
