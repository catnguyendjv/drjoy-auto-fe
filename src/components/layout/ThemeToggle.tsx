"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import * as React from "react";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <button className="rounded-md p-2 hover:bg-gray-100 dark:hover:bg-zinc-800">
                <span className="sr-only">Toggle theme</span>
                <div className="h-5 w-5" />
            </button>
        );
    }

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-md p-2 hover:bg-gray-100 dark:hover:bg-zinc-800"
        >
            <span className="sr-only">Toggle theme</span>
            {theme === "dark" ? (
                <Moon className="h-5 w-5 text-gray-900 dark:text-white" />
            ) : (
                <Sun className="h-5 w-5 text-gray-900 dark:text-white" />
            )}
        </button>
    );
}
