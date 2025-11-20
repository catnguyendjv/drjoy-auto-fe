"use client";

import {
    BarChart,
    Bar,
    PieChart,
    Pie,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell,
} from 'recharts';
import { useTheme } from 'next-themes';

interface AnalyticsData {
    totalHours: number;
    totalEntries: number;
    avgHours: number;
    hoursByUser: Record<string, number>;
    hoursByActivity: Record<string, number>;
    hoursByDate: Record<string, number>;
}

interface TimeLogChartsProps {
    analyticsData: AnalyticsData;
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'];

export function TimeLogCharts({ analyticsData }: TimeLogChartsProps) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    // Prepare data for charts
    const userChartData = Object.entries(analyticsData.hoursByUser).map(([name, hours]) => ({
        name,
        hours: Number(hours.toFixed(1)),
    }));

    const activityChartData = Object.entries(analyticsData.hoursByActivity).map(([name, hours]) => ({
        name,
        value: Number(hours.toFixed(1)),
    }));

    const timelineData = Object.entries(analyticsData.hoursByDate)
        .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
        .map(([date, hours]) => ({
            date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            hours: Number(hours.toFixed(1)),
        }));

    // Chart colors based on theme
    const textColor = isDark ? '#e5e7eb' : '#374151';
    const gridColor = isDark ? '#374151' : '#e5e7eb';

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-800 p-6">
                    <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Hours</h3>
                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">
                        {analyticsData.totalHours.toFixed(1)}
                    </p>
                </div>
                <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-800 p-6">
                    <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Entries</h3>
                    <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">
                        {analyticsData.totalEntries}
                    </p>
                </div>
                <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-800 p-6">
                    <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Average Hours/Entry</h3>
                    <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 mt-2">
                        {analyticsData.avgHours.toFixed(1)}
                    </p>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Hours by User Bar Chart */}
                <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-800 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Hours by User</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={userChartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                            <XAxis dataKey="name" stroke={textColor} />
                            <YAxis stroke={textColor} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: isDark ? '#18181b' : '#ffffff',
                                    border: `1px solid ${gridColor}`,
                                    color: textColor,
                                }}
                            />
                            <Legend />
                            <Bar dataKey="hours" fill="#3B82F6" name="Hours" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Hours by Activity Pie Chart */}
                <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-800 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Hours by Activity</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={activityChartData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {activityChartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: isDark ? '#18181b' : '#ffffff',
                                    border: `1px solid ${gridColor}`,
                                    color: textColor,
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Hours Over Time Line Chart */}
            <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-800 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Hours Over Time</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={timelineData}>
                        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                        <XAxis dataKey="date" stroke={textColor} />
                        <YAxis stroke={textColor} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: isDark ? '#18181b' : '#ffffff',
                                border: `1px solid ${gridColor}`,
                                color: textColor,
                            }}
                        />
                        <Legend />
                        <Line type="monotone" dataKey="hours" stroke="#10B981" strokeWidth={2} name="Hours" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
