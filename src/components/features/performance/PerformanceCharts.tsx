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
    totalLOC: number;
    totalBugs: number;
    totalLateArrivals: number;
    avgLOCPerMember: number;
    locByMember: Record<string, number>;
    bugsByEnvironment: Record<string, number>;
    locOverTime: Record<string, number>;
    bugsByMember: Record<string, number>;
}

interface PerformanceChartsProps {
    analyticsData: AnalyticsData;
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'];

export function PerformanceCharts({ analyticsData }: PerformanceChartsProps) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    // Prepare data for charts
    const locChartData = Object.entries(analyticsData.locByMember).map(([name, loc]) => ({
        name,
        loc: Number(loc.toFixed(0)),
    }));

    const bugsChartData = Object.entries(analyticsData.bugsByMember).map(([name, bugs]) => ({
        name,
        bugs: Number(bugs.toFixed(0)),
    }));

    const environmentChartData = Object.entries(analyticsData.bugsByEnvironment).map(([name, bugs]) => ({
        name,
        value: Number(bugs.toFixed(0)),
    }));

    const timelineData = Object.entries(analyticsData.locOverTime)
        .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
        .map(([date, loc]) => ({
            date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            loc: Number(loc.toFixed(0)),
        }));

    // Chart colors based on theme
    const textColor = isDark ? '#e5e7eb' : '#374151';
    const gridColor = isDark ? '#374151' : '#e5e7eb';

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-800 p-6">
                    <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total LOC</h3>
                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">
                        {analyticsData.totalLOC.toLocaleString()}
                    </p>
                </div>
                <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-800 p-6">
                    <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Bugs</h3>
                    <p className="text-3xl font-bold text-red-600 dark:text-red-400 mt-2">
                        {analyticsData.totalBugs}
                    </p>
                </div>
                <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-800 p-6">
                    <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Late Arrivals</h3>
                    <p className="text-3xl font-bold text-orange-600 dark:text-orange-400 mt-2">
                        {analyticsData.totalLateArrivals}
                    </p>
                </div>
                <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-800 p-6">
                    <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg LOC/Member</h3>
                    <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 mt-2">
                        {analyticsData.avgLOCPerMember.toFixed(0)}
                    </p>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* LOC by Member Bar Chart */}
                <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-800 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Lines of Code by Member</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={locChartData}>
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
                            <Bar dataKey="loc" fill="#3B82F6" name="Lines of Code" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Bugs by Environment Pie Chart */}
                <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-800 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Bugs by Environment</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={environmentChartData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {environmentChartData.map((entry, index) => (
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

                {/* Bugs by Member Bar Chart */}
                <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-800 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Bugs by Member</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={bugsChartData}>
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
                            <Bar dataKey="bugs" fill="#EF4444" name="Bugs" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* LOC Over Time Line Chart */}
                <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-800 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">LOC Over Time</h3>
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
                            <Line type="monotone" dataKey="loc" stroke="#10B981" strokeWidth={2} name="Lines of Code" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
