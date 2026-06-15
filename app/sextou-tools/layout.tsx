import type { ReactNode } from "react"
import { ToolkitHeader } from "@/components/sextou-tools/toolkit-header"
import { requireToolkitUser } from "@/lib/sextou-tools/auth"

export default async function SextouToolsLayout({
  children,
}: {
  children: ReactNode
}) {
  const user = await requireToolkitUser()

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#F0EDE6]">
      <ToolkitHeader userName={user.fullName} businessName={user.businessName} />
      {children}
    </div>
  )
}
