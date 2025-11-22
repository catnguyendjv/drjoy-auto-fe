"use client";

import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Chip, Link as HeroLink } from "@heroui/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";
import { UserProfile } from "@/components/common/UserProfile";

export function TopMenu() {
    const pathname = usePathname();

    const menuItems = [
        { name: "Kanban", href: "/kanban" },
        { name: "Settings", href: "/settings" },
    ];

    return (
        <Navbar isBordered className="bg-content1/70 backdrop-blur" maxWidth="xl">
            <NavbarBrand className="gap-3">
                <Chip color="primary" variant="flat" className="font-semibold" size="lg">
                    Dr.Joy Auto
                </Chip>
            </NavbarBrand>
            <NavbarContent justify="start" className="hidden md:flex gap-6">
                {menuItems.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    return (
                        <NavbarItem key={item.href} isActive={isActive}>
                            <HeroLink
                                as={Link}
                                href={item.href}
                                color={isActive ? "primary" : "foreground"}
                                className="text-sm font-medium"
                            >
                                {item.name}
                            </HeroLink>
                        </NavbarItem>
                    );
                })}
            </NavbarContent>
            <NavbarContent justify="end" className="gap-4">
                <NavbarItem>
                    <ThemeToggle />
                </NavbarItem>
                <NavbarItem>
                    <UserProfile />
                </NavbarItem>
            </NavbarContent>
        </Navbar>
    );
}
