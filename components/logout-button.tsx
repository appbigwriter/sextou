"use client"

import { signOut } from "next-auth/react"

export function LogoutButton({ className }: { className?: string }) {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className={className || "text-sm text-gray-600 hover:text-[#F97316]"}
    >
      Sair
    </button>
  )
}
