"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Kanban, Settings, Home, Calendar, Clock, BarChart3, ChevronLeft, ChevronRight } from "lucide-react";
import { clsx } from "clsx";
import { useState } from "react";

const navigation = [
    { name: "Kanban", href: "/kanban", icon: Kanban },
    { name: "Schedule", href: "/schedule", icon: Calendar },
    { name: "Time Logs", href: "/timelogs", icon: Clock },
    { name: "Performance", href: "/performance", icon: BarChart3 },
    { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(true);

    return (
        <div 
            onClick={() => isCollapsed && setIsCollapsed(false)}
            className={clsx(
                "flex h-full flex-col border-r bg-white dark:bg-black dark:border-zinc-800 transition-all duration-300",
                isCollapsed ? "w-16 cursor-pointer" : "w-64"
            )}
        >
            <div className={clsx(
                "flex h-16 items-center border-b dark:border-zinc-800 transition-all duration-300",
                isCollapsed ? "justify-center px-0" : "px-6"
            )}>
                <Home className="h-6 w-6 text-blue-600 flex-shrink-0" />
                <span className={clsx(
                    "text-lg font-bold text-gray-900 dark:text-white whitespace-nowrap overflow-hidden transition-all duration-300",
                    isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100 ml-2"
                )}>
                    Redmine App
                </span>
            </div>
            <nav className="flex-1 space-y-1 px-2 py-4">
                {navigation.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            title={isCollapsed ? item.name : undefined}
                            className={clsx(
                                "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                                isActive
                                    ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-zinc-800 dark:hover:text-white",
                                isCollapsed ? "justify-center" : ""
                            )}
                        >
                            <item.icon
                                className={clsx(
                                    "h-5 w-5 flex-shrink-0 transition-all duration-300",
                                    isActive
                                        ? "text-blue-600 dark:text-blue-400"
                                        : "text-gray-400 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-300",
                                    !isCollapsed && "mr-3"
                                )}
                            />
                            <span className={clsx(
                                "whitespace-nowrap overflow-hidden transition-all duration-300",
                                isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                            )}>
                                {item.name}
                            </span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t dark:border-zinc-800">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsCollapsed(!isCollapsed);
                    }}
                    className="flex w-full items-center justify-center rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-zinc-800 dark:hover:text-white transition-colors"
                >
                    {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
                </button>
            </div>
        </div>
    );
}
