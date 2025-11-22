"use client";

import { useState } from "react";

interface QuickIssueCreateModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: { subject: string; description: string }) => void;
}

export function QuickIssueCreateModal({ open, onClose, onSubmit }: QuickIssueCreateModalProps) {
    const [subject, setSubject] = useState("");
    const [description, setDescription] = useState("");

    if (!open) return null;

    const handleSubmit = () => {
        const trimmedSubject = subject.trim();
        if (!trimmedSubject) return;

        onSubmit({ subject: trimmedSubject, description: description.trim() });
        setSubject("");
        setDescription("");
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-lg border border-gray-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-zinc-800">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Tạo Issue nhanh</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Nhập tiêu đề và mô tả ngắn cho issue mới.</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        aria-label="Đóng"
                    >
                        ✕
                    </button>
                </div>

                <div className="space-y-4 px-6 py-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Tiêu đề</label>
                        <input
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="Nhập tiêu đề issue"
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Mô tả</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            placeholder="Thêm mô tả ngắn"
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4 dark:border-zinc-800">
                    <button
                        onClick={() => {
                            setSubject("");
                            setDescription("");
                            onClose();
                        }}
                        className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-zinc-800 dark:text-gray-300 dark:hover:bg-zinc-700"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!subject.trim()}
                        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Tạo mới
                    </button>
                </div>
            </div>
        </div>
    );
}

export default QuickIssueCreateModal;
