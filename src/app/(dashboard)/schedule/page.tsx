import { ScheduleGantt } from "@/components/features/schedule/ScheduleGantt";

export default function SchedulePage() {
    return (
        <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Schedule</h1>
            </div>
            <div className="flex-1 overflow-hidden">
                <ScheduleGantt />
            </div>
        </div>
    );
}
