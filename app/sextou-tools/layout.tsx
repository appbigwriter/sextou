import type { ReactNode } from "react"
import { ToolkitHeader } from "@/components/sextou-tools/toolkit-header"
import { resolveToolkitUser } from "@/lib/sextou-tools/auth"
import { redirect } from "next/navigation"

export default async function SextouToolsLayout({
  children,
}: {
  children: ReactNode
}) {
  const result = await resolveToolkitUser()

  if (result.kind === "unauthorized") {
    redirect("/login?next=/sextou-tools")
  }

  const user =
    result.kind === "ok"
      ? result.user
      : {
          fullName: "Banco indisponivel",
          businessName: "Sextou Tools aguardando conexao",
        }

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#F0EDE6]">
      <ToolkitHeader userName={user.fullName} businessName={user.businessName} />
      {children}
    </div>
  )
}
