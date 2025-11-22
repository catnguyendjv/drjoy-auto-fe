import { useState } from "react";

interface BulkUpdateBarProps {
    statuses: Array<{ id: number; name: string }>;
    selectedCount: number;
    disabled?: boolean;
    onApply: (statusId: number | null, dueDate: string | null) => void;
}

export function BulkUpdateBar({ statuses, selectedCount, disabled, onApply }: BulkUpdateBarProps) {
    const [statusId, setStatusId] = useState<number | null>(null);
    const [dueDate, setDueDate] = useState<string | null>(null);

    const handleApply = () => {
        onApply(statusId, dueDate);
    };

    return (
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg p-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">Cập nhật đồng loạt</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Đang chọn {selectedCount} ticket</p>
            </div>

            <div className="flex flex-col md:flex-row gap-3 md:items-center">
                <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-700 dark:text-gray-300">Trạng thái</label>
                    <select
                        value={statusId ?? ""}
                        onChange={(e) => setStatusId(e.target.value ? Number(e.target.value) : null)}
                        className="px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:text-white"
                    >
                        <option value="">Giữ nguyên</option>
                        {statuses.map((status) => (
                            <option key={status.id} value={status.id}>
                                {status.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-700 dark:text-gray-300">Due date</label>
                    <input
                        type="date"
                        value={dueDate ?? ""}
                        onChange={(e) => setDueDate(e.target.value || null)}
                        className="px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:text-white"
                    />
                </div>

                <button
                    onClick={handleApply}
                    disabled={disabled}
                    className="px-4 py-2 text-sm font-semibold rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    Áp dụng
                </button>
            </div>
        </div>
    );
}
