"use client";

import { Button, Card, CardBody, CardHeader, Divider, Listbox, ListboxItem, Tooltip } from "@heroui/react";
import { clsx } from "clsx";
import { Calendar, ChevronLeft, ChevronRight, Clock, Home, Kanban, Settings, BarChart3 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";

const navigation = [
    { name: "Kanban", href: "/kanban", icon: Kanban },
    { name: "Schedule", href: "/schedule", icon: Calendar },
    { name: "Time Logs", href: "/timelogs", icon: Clock },
    { name: "Performance", href: "/performance", icon: BarChart3 },
    { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const activeKey = useMemo(() => {
        const current = navigation.find((item) => pathname.startsWith(item.href));
        return current?.href ?? navigation[0].href;
    }, [pathname]);

    return (
        <Card
            shadow="sm"
            className={clsx(
                "m-4 h-[calc(100vh-2rem)] border-1 border-default-100 bg-content1 transition-all duration-300",
                isCollapsed ? "w-20" : "w-72"
            )}
        >
            <CardHeader className={clsx(
                "flex items-center gap-3",
                isCollapsed ? "justify-center" : "justify-start"
            )}>
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Home className="h-5 w-5" />
                    </div>
                    <div className={clsx(
                        "flex flex-col transition-all duration-300",
                        isCollapsed ? "hidden" : ""
                    )}>
                        <p className="text-sm font-semibold">Redmine App</p>
                        <p className="text-xs text-default-500">Workflow console</p>
                    </div>
                </div>
            </CardHeader>
            <Divider />
            <CardBody className="flex flex-col gap-4 overflow-hidden p-3">
                <Listbox
                    aria-label="Main navigation"
                    selectionMode="single"
                    selectedKeys={new Set([activeKey])}
                    onAction={(key) => router.push(String(key))}
                    disallowEmptySelection
                    hideSelectedIcon
                    classNames={{
                        base: "flex-1 overflow-y-auto", 
                        list: "gap-1",
                    }}
                >
                    {navigation.map((item) => {
                        const content = (
                            <ListboxItem
                                key={item.href}
                                startContent={<item.icon className="h-5 w-5" />}
                                classNames={{
                                    base: clsx(
                                        "rounded-lg border border-transparent px-3 py-3 text-foreground transition-colors",
                                        pathname.startsWith(item.href)
                                            ? "bg-primary/10 border-primary/40 text-primary"
                                            : "hover:bg-default-100"
                                    ),
                                    title: clsx(
                                        "text-sm font-medium",
                                        isCollapsed && "sr-only"
                                    ),
                                }}
                            >
                                {item.name}
                            </ListboxItem>
                        );

                        if (isCollapsed) {
                            return (
                                <Tooltip key={item.name} content={item.name} placement="right" offset={8}>
                                    {content}
                                </Tooltip>
                            );
                        }

                        return content;
                    })}
                </Listbox>
                <Divider />
                <Button
                    isIconOnly
                    variant="flat"
                    color="default"
                    radius="full"
                    onPress={() => setIsCollapsed(!isCollapsed)}
                    className="self-center"
                >
                    {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                </Button>
            </CardBody>
        </Card>
    );
}
