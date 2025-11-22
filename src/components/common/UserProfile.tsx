"use client";

import { Button, User as HeroUser } from "@heroui/react";
import { useSession } from "next-auth/react";
import { handleSignOut } from "@/app/actions/auth";

export function UserProfile() {
    const { data: session } = useSession();

    if (!session?.user) return null;

    return (
        <div className="flex items-center gap-3">
            <HeroUser
                name={session.user.name || "User"}
                description={session.user.email}
                avatarProps={{
                    src: session.user.image ?? undefined,
                    size: "sm",
                    radius: "full",
                    showFallback: true,
                }}
                classNames={{
                    name: "text-sm font-semibold",
                    description: "text-xs text-default-500",
                }}
            />
            <Button
                size="sm"
                color="danger"
                variant="flat"
                onPress={() => handleSignOut()}
            >
                Sign out
            </Button>
        </div>
    );
}
