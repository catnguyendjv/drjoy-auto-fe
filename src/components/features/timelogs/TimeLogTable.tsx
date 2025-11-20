"use client";

import { useState } from 'react';
import { TimeEntry } from '@/types/redmine';

interface TimeLogTableProps {
    entries: TimeEntry[];
}

export function TimeLogTable({ entries }: TimeLogTableProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const [entriesPerPage, setEntriesPerPage] = useState(25);
    const [sortField, setSortField] = useState<keyof TimeEntry>('spent_on');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

    // Sort entries
    const sortedEntries = [...entries].sort((a, b) => {
        let aValue: any = a[sortField];
        let bValue: any = b[sortField];

        // Handle nested objects
        if (sortField === 'user') {
            aValue = a.user.name;
            bValue = b.user.name;
        } else if (sortField === 'activity') {
            aValue = a.activity.name;
            bValue = b.activity.name;
        } else if (sortField === 'issue' && a.issue && b.issue) {
            aValue = a.issue.subject;
            bValue = b.issue.subject;
        }

        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
    });

    // Pagination
    const indexOfLastEntry = currentPage * entriesPerPage;
    const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
    const currentEntries = sortedEntries.slice(indexOfFirstEntry, indexOfLastEntry);
    const totalPages = Math.ceil(sortedEntries.length / entriesPerPage);

    const handleSort = (field: keyof TimeEntry) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const SortIcon = ({ field }: { field: keyof TimeEntry }) => {
        if (sortField !== field) {
            return <span className="text-gray-400">↕</span>;
        }
        return <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>;
    };

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
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-zinc-800">
                        <tr>
                            <th
                                onClick={() => handleSort('spent_on')}
                                className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-700"
                            >
                                Date <SortIcon field="spent_on" />
                            </th>
                            <th
                                onClick={() => handleSort('user')}
                                className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-700"
                            >
                                User <SortIcon field="user" />
                            </th>
                            <th
                                onClick={() => handleSort('issue')}
                                className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-700"
                            >
                                Issue <SortIcon field="issue" />
                            </th>
                            <th
                                onClick={() => handleSort('activity')}
                                className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-700"
                            >
                                Activity <SortIcon field="activity" />
                            </th>
                            <th
                                onClick={() => handleSort('hours')}
                                className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-700"
                            >
                                Hours <SortIcon field="hours" />
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                Comments
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-zinc-900 divide-y divide-gray-200 dark:divide-zinc-800">
                        {currentEntries.map((entry) => (
                            <tr key={entry.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                    {new Date(entry.spent_on).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                    })}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                    {entry.user.name}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                                    {entry.issue ? (
                                        <span className="text-blue-600 dark:text-blue-400">{entry.issue.subject}</span>
                                    ) : (
                                        <span className="text-gray-400">No issue</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                        {entry.activity.name}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                                    {entry.hours}h
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate">
                                    {entry.comments}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-gray-200 dark:border-zinc-800 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <label htmlFor="entriesPerPage" className="text-sm text-gray-700 dark:text-gray-300">
                        Entries per page:
                    </label>
                    <select
                        id="entriesPerPage"
                        value={entriesPerPage}
                        onChange={(e) => {
                            setEntriesPerPage(Number(e.target.value));
                            setCurrentPage(1);
                        }}
                        className="px-3 py-1 border border-gray-300 dark:border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:text-white text-sm"
                    >
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                    </select>
                </div>

                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-md hover:bg-gray-50 dark:hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Previous
                    </button>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-md hover:bg-gray-50 dark:hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}
