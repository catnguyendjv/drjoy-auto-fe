"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Kanban, Settings, Home, Calendar } from "lucide-react";
import { clsx } from "clsx";

const navigation = [
    { name: "Kanban", href: "/kanban", icon: Kanban },
    { name: "Schedule", href: "/schedule", icon: Calendar },
    { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="flex h-full w-64 flex-col border-r bg-white dark:bg-black dark:border-zinc-800">
            <div className="flex h-16 items-center px-6 border-b dark:border-zinc-800">
                <Home className="h-6 w-6 text-blue-600 mr-2" />
                <span className="text-lg font-bold text-gray-900 dark:text-white">Redmine App</span>
            </div>
            <nav className="flex-1 space-y-1 px-2 py-4">
                {navigation.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={clsx(
                                "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                                isActive
                                    ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-zinc-800 dark:hover:text-white"
                            )}
                        >
                            <item.icon
                                className={clsx(
                                    "mr-3 h-5 w-5 flex-shrink-0",
                                    isActive
                                        ? "text-blue-600 dark:text-blue-400"
                                        : "text-gray-400 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-300"
                                )}
                            />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
