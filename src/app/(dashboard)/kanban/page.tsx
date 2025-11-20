import { KanbanBoard } from "@/components/features/kanban/KanbanBoard";

export default function KanbanPage() {
    return (
        <div className="flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Kanban Board</h1>
            </div>
            <div>
                <KanbanBoard />
            </div>
        </div>
    );
}
