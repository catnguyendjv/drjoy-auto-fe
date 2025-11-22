"use client";

import { Switch } from "@heroui/react";
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
        return <div className="h-8 w-14" />;
    }

    return (
        <Switch
            aria-label="Toggle theme"
            isSelected={theme === "dark"}
            size="sm"
            color="primary"
            startContent={<Sun className="h-4 w-4" />}
            endContent={<Moon className="h-4 w-4" />}
            onValueChange={(value) => setTheme(value ? "dark" : "light")}
        />
    );
}
