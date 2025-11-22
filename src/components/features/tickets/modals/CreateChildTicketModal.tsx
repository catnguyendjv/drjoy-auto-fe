import { Issue } from "@/types/redmine";
import { useState } from "react";

interface CreateChildTicketModalProps {
    open: boolean;
    parent: Issue | null;
    teams: Array<{ id: number; name: string }>;
    versions: Array<{ id: number; name: string }>;
    onClose: () => void;
    onSubmit: (data: { subject: string; parentId: number; teamId: number | null; versionId: number | null }) => void;
}

export function CreateChildTicketModal({ open, parent, teams, versions, onClose, onSubmit }: CreateChildTicketModalProps) {
    const [subject, setSubject] = useState("");
    const [teamId, setTeamId] = useState<number | null>(null);
    const [versionId, setVersionId] = useState<number | null>(null);

    if (!open || !parent) return null;

    const handleSubmit = () => {
        if (!subject.trim()) return;

        onSubmit({
            subject: subject.trim(),
            parentId: parent.id,
            teamId,
            versionId,
        });
        setSubject("");
        setTeamId(null);
        setVersionId(null);
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-xl max-w-lg w-full border border-gray-200 dark:border-zinc-800">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Tạo ticket con</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Parent #{parent.id}: {parent.subject}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        ✕
                    </button>
                </div>

                <div className="px-6 py-4 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tên ticket</label>
                        <input
                            type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="Nhập tiêu đề cho ticket con"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:text-white"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Team</label>
                            <select
                                value={teamId ?? ""}
                                onChange={(e) => setTeamId(e.target.value ? Number(e.target.value) : null)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:text-white"
                            >
                                <option value="">Theo parent</option>
                                {teams.map((team) => (
                                    <option key={team.id} value={team.id}>
                                        {team.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Target Version</label>
                            <select
                                value={versionId ?? ""}
                                onChange={(e) => setVersionId(e.target.value ? Number(e.target.value) : null)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:text-white"
                            >
                                <option value="">Theo parent</option>
                                {versions.map((version) => (
                                    <option key={version.id} value={version.id}>
                                        {version.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="px-6 py-4 border-t border-gray-200 dark:border-zinc-800 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-zinc-800 rounded-md hover:bg-gray-200 dark:hover:bg-zinc-700"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!subject.trim()}
                        className="px-4 py-2 text-sm font-semibold rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Tạo mới
                    </button>
                </div>
            </div>
        </div>
    );
}
