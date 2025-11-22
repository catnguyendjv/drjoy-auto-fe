"use client";

import { HeroUIProvider } from "@heroui/react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

interface HeroUIProviderProps {
    children: ReactNode;
}

export function HeroUIProviders({ children }: HeroUIProviderProps) {
    const router = useRouter();

    return (
        <HeroUIProvider navigate={router.push}>
            {children}
        </HeroUIProvider>
    );
}
