"use client"

import { useSession } from "next-auth/react"
import Image from "next/image"
import { handleSignOut } from "@/app/actions/auth"

export function UserProfile() {
  const { data: session } = useSession()

  if (!session?.user) return null

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        {session.user.image && (
          <Image
            src={session.user.image}
            alt={session.user.name || "User"}
            width={32}
            height={32}
            className="rounded-full"
          />
        )}
        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
          {session.user.name}
        </span>
      </div>
      <button
        onClick={() => handleSignOut()}
        className="text-sm text-red-600 hover:text-red-500 dark:text-red-400"
      >
        Sign out
      </button>
    </div>
  )
}
