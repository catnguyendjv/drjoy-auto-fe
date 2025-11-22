"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { X, Plus, Loader2, ChevronDown } from "lucide-react";
import { SearchableSelect, Option } from "@/components/ui/SearchableSelect";
import { redmineApi, RedmineIssue, RedmineProject, RedmineVersion } from "@/lib/api/redmine.service";
import { CUSTOM_FIELDS, PRIORITIES, PRIORITIES_ARRAY, TEAM_OPTIONS, TRACKERS, TRACKERS_ARRAY } from "@/lib/redmine-config";
import { Issue } from "@/types/redmine";

interface QuickIssueCreateModalProps {
    isOpen: boolean;
    onClose: () => void;
    defaultVersionId?: number | null;
    defaultTeamName?: string;
    onCreated?: (issues: Issue[]) => void;
}

interface IssueFormState {
    subjects: string;
    description: string;
    projectId: number | null;
    versionId: number | null;
    trackerId: number;
    priorityId: number;
    teamName: string;
}

type IssueCreatePayload = Partial<RedmineIssue> & {
    tracker_id?: number;
    priority_id?: number;
    project_id?: number;
    fixed_version_id?: number | null;
    tracker: { id: number; name: string };
    priority?: { id: number; name: string };
};

const defaultFormState: IssueFormState = {
    subjects: "",
    description: "",
    projectId: null,
    versionId: null,
    trackerId: TRACKERS.TASK.id,
    priorityId: PRIORITIES.NORMAL.id,
    teamName: "",
};

export function QuickIssueCreateModal({ isOpen, onClose, defaultVersionId = null, defaultTeamName, onCreated }: QuickIssueCreateModalProps) {
    const [projects, setProjects] = useState<RedmineProject[]>([]);
    const [versions, setVersions] = useState<RedmineVersion[]>([]);
    const [formState, setFormState] = useState<IssueFormState>({ ...defaultFormState, versionId: defaultVersionId, teamName: defaultTeamName || "" });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingOptions, setIsLoadingOptions] = useState(false);
    const [showAdvancedFields, setShowAdvancedFields] = useState(false);

    const trackerOptions = useMemo<Option[]>(() => TRACKERS_ARRAY.map(tracker => ({ value: tracker.id.toString(), label: tracker.name })), []);
    const priorityOptions = useMemo<Option[]>(() => PRIORITIES_ARRAY.map(priority => ({ value: priority.id.toString(), label: priority.name })), []);
    const projectOptions = useMemo<Option[]>(() => projects.map(project => ({ value: project.id.toString(), label: project.name })), [projects]);
    const versionOptions = useMemo<Option[]>(() => versions.map(version => ({ value: version.id.toString(), label: version.name })), [versions]);

    useEffect(() => {
        if (!isOpen) return;

        const loadOptions = async () => {
            setIsLoadingOptions(true);
            try {
                const [projectsResponse, versionsResponse] = await Promise.all([
                    redmineApi.getProjects({ limit: 100, offset: 0 }),
                    redmineApi.getAllVersions({ limit: 100 }),
                ]);

                if (projectsResponse?.projects) {
                    setProjects(projectsResponse.projects);

                    if (!formState.projectId && projectsResponse.projects.length > 0) {
                        setFormState(prev => ({ ...prev, projectId: projectsResponse.projects[0].id }));
                    }
                }

                if (versionsResponse) {
                    setVersions(versionsResponse);

                    if (!formState.versionId && defaultVersionId) {
                        setFormState(prev => ({ ...prev, versionId: defaultVersionId ?? null }));
                    }

                    if (defaultVersionId) {
                        const defaultVersion = versionsResponse.find(v => v.id === defaultVersionId);
                        if (defaultVersion?.project?.id) {
                            setFormState(prev => ({ ...prev, projectId: prev.projectId ?? defaultVersion.project.id }));
                        }
                    }
                }
            } catch (error) {
                console.error("Failed to load quick issue options", error);
                toast.error("Không thể tải dữ liệu dự án/phiên bản");
            } finally {
                setIsLoadingOptions(false);
            }
        };

        loadOptions();
    }, [defaultVersionId, formState.projectId, formState.versionId, isOpen]);

    useEffect(() => {
        if (!isOpen) return;
        setFormState(prev => ({ ...prev, teamName: defaultTeamName || prev.teamName }));
    }, [defaultTeamName, isOpen]);

    useEffect(() => {
        if (!isOpen) return;
        if (defaultVersionId) {
            setFormState(prev => ({ ...prev, versionId: defaultVersionId }));
        }
    }, [defaultVersionId, isOpen]);

    const handleChange = (field: keyof IssueFormState, value: string) => {
        setFormState(prev => ({ ...prev, [field]: value } as IssueFormState));
    };

    const handleNumericChange = (field: keyof IssueFormState, value: string) => {
        const parsedValue = value ? parseInt(value, 10) : null;
        setFormState(prev => ({ ...prev, [field]: parsedValue } as IssueFormState));
    };

    const mapToIssue = (redmineIssue: RedmineIssue): Issue => {
        const teamField = redmineIssue.custom_fields?.find(cf => cf.id === CUSTOM_FIELDS.TEAM.id || cf.name === CUSTOM_FIELDS.TEAM.name);

        return {
            id: redmineIssue.id,
            subject: redmineIssue.subject,
            description: redmineIssue.description || "",
            tracker: redmineIssue.tracker,
            status: redmineIssue.status,
            priority: redmineIssue.priority,
            assigned_to: redmineIssue.assigned_to,
            project: redmineIssue.project,
            author: redmineIssue.author,
            fixed_version: redmineIssue.fixed_version,
            parent_id: redmineIssue.parent?.id,
            start_date: redmineIssue.start_date,
            due_date: redmineIssue.due_date,
            done_ratio: redmineIssue.done_ratio ?? 0,
            is_private: redmineIssue.is_private ?? false,
            estimated_hours: redmineIssue.estimated_hours,
            spent_hours: redmineIssue.spent_hours,
            created_on: redmineIssue.created_on,
            updated_on: redmineIssue.updated_on,
            custom_fields: redmineIssue.custom_fields ?? [],
            closed_on: redmineIssue.closed_on,
            team: teamField ? { id: teamField.id, name: String(teamField.value) } : undefined,
        };
    };

    const handleCreate = async () => {
        const subjects = formState.subjects
            .split("\n")
            .map(s => s.trim())
            .filter(Boolean);

        if (!subjects.length) {
            toast.error("Vui lòng nhập ít nhất 1 tiêu đề");
            return;
        }

        if (!formState.projectId) {
            toast.error("Vui lòng chọn dự án cho ticket mới");
            return;
        }

        const tracker = TRACKERS_ARRAY.find(t => t.id === formState.trackerId) || TRACKERS_ARRAY[0];
        const priority = PRIORITIES_ARRAY.find(p => p.id === formState.priorityId) || PRIORITIES_ARRAY[0];

        setIsSubmitting(true);

        try {
            const creationResults = await Promise.allSettled(
                subjects.map(async (subject) => {
                    const payload: IssueCreatePayload = {
                        subject,
                        description: formState.description,
                        tracker: { id: tracker.id, name: tracker.name },
                        tracker_id: tracker.id,
                        project_id: formState.projectId ?? undefined,
                        priority: { id: priority.id, name: priority.name },
                        priority_id: priority.id,
                        fixed_version_id: formState.versionId ?? undefined,
                        custom_fields: [],
                    };

                    if (formState.teamName) {
                        payload.custom_fields?.push({ id: CUSTOM_FIELDS.TEAM.id, value: formState.teamName });
                    }

                    const response = await redmineApi.createIssue(payload);
                    return mapToIssue(response.issue);
                })
            );

            const successfulIssues: Issue[] = creationResults
                .filter((result): result is PromiseFulfilledResult<Issue> => result.status === "fulfilled")
                .map(result => result.value);

            const failedIssues = creationResults.filter(result => result.status === "rejected").length;

            if (successfulIssues.length) {
                onCreated?.(successfulIssues);
                toast.success(`Tạo thành công ${successfulIssues.length} ticket`);
                setFormState(prev => ({ ...prev, subjects: "" }));
            }

            if (failedIssues) {
                toast.error(`${failedIssues} ticket không thể tạo, vui lòng kiểm tra lại`);
            }

            if (!failedIssues && successfulIssues.length) {
                onClose();
            }
        } catch (error) {
            console.error("Failed to create issues", error);
            toast.error("Không thể tạo ticket, vui lòng thử lại");
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetAndClose = () => {
        setFormState({ ...defaultFormState, versionId: defaultVersionId ?? null, teamName: defaultTeamName || "" });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-zinc-800">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Tạo nhiều ticket nhanh</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Nhập tiêu đề mỗi dòng để tạo nhiều ticket cùng lúc</p>
                    </div>
                    <button
                        onClick={resetAndClose}
                        className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        aria-label="Close"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Dự án</label>
                            <SearchableSelect
                                options={projectOptions}
                                value={formState.projectId?.toString() || ""}
                                onChange={(value) => handleNumericChange("projectId", value)}
                                placeholder={isLoadingOptions ? "Đang tải..." : "Chọn dự án"}
                            />
                        </div>

                        <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 dark:border-zinc-700 dark:bg-zinc-800/40">
                            <div>
                                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Trường tuỳ chọn</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Ẩn/hiện các trường không bắt buộc để nhập nhanh hơn</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowAdvancedFields(prev => !prev)}
                                className="inline-flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-200 transition hover:bg-gray-100 dark:bg-zinc-900 dark:text-gray-100 dark:ring-zinc-700 dark:hover:bg-zinc-800"
                            >
                                <ChevronDown className={`h-4 w-4 transition-transform ${showAdvancedFields ? "rotate-180" : ""}`} />
                                {showAdvancedFields ? "Ẩn bớt" : "Hiển thị"}
                            </button>
                        </div>

                        {showAdvancedFields && (
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Phiên bản</label>
                                    <SearchableSelect
                                        options={versionOptions}
                                        value={formState.versionId?.toString() || ""}
                                        onChange={(value) => handleNumericChange("versionId", value)}
                                        placeholder={isLoadingOptions ? "Đang tải..." : "Chọn phiên bản"}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tracker</label>
                                    <SearchableSelect
                                        options={trackerOptions}
                                        value={formState.trackerId.toString()}
                                        onChange={(value) => handleNumericChange("trackerId", value)}
                                        placeholder="Chọn tracker"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Priority</label>
                                    <SearchableSelect
                                        options={priorityOptions}
                                        value={formState.priorityId.toString()}
                                        onChange={(value) => handleNumericChange("priorityId", value)}
                                        placeholder="Chọn priority"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Team</label>
                                    <select
                                        value={formState.teamName}
                                        onChange={(e) => handleChange("teamName", e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                                    >
                                        <option value="">-- Không chọn --</option>
                                        {TEAM_OPTIONS.map(option => (
                                            <option key={option.value} value={option.value}>{option.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Mô tả chung</label>
                                    <textarea
                                        value={formState.description}
                                        onChange={(e) => handleChange("description", e.target.value)}
                                        className="min-h-[100px] w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                                        placeholder="Mô tả sẽ được áp dụng cho tất cả ticket"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tiêu đề (mỗi dòng một ticket)</label>
                            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                <Plus className="w-4 h-4" />
                                <span>Nhấn Enter để xuống dòng và thêm ticket mới</span>
                            </div>
                        </div>
                        <textarea
                            value={formState.subjects}
                            onChange={(e) => handleChange("subjects", e.target.value)}
                            className="min-h-[180px] w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                            placeholder="VD:\n[FE] Login page - update UI\n[BE] Add API refresh token"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400">Các ticket sẽ được tạo cùng tracker/priority/phiên bản đã chọn</p>
                    </div>
                </div>

                <div className="flex justify-end gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900">
                    <button
                        onClick={resetAndClose}
                        className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-zinc-800"
                        disabled={isSubmitting}
                    >
                        Huỷ
                    </button>
                    <button
                        onClick={handleCreate}
                        disabled={isSubmitting}
                        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70"
                    >
                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                        Tạo ticket
                    </button>
                </div>
            </div>
        </div>
    );
}
