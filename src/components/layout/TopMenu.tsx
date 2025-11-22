import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { UserProfile } from "@/components/common/UserProfile";

export function TopMenu() {
    return (
        <div className="flex items-center justify-between bg-white px-6 py-4 shadow-sm dark:bg-zinc-800">
            <div className="flex items-center gap-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Dr.Joy Auto
                </h2>
                <nav className="flex gap-4">
                    <Link
                        href="/kanban"
                        className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                    >
                        Kanban
                    </Link>
                    <Link
                        href="/issue-management"
                        className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                    >
                        Issue Management
                    </Link>
                    <Link
                        href="/settings"
                        className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                    >
                        Settings
                    </Link>
                    {/* Add more menu items here */}
                </nav>
            </div>
            <div className="flex items-center gap-4">
                <ThemeToggle />
                <UserProfile />
            </div>
        </div>
    );
}
