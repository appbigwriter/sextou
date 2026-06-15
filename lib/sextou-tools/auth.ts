import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"

export async function requireToolkitUser() {
  const session = await auth()

  if (!session?.user?.email) {
    redirect("/login?next=/sextou-tools")
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      fullName: true,
      businessName: true,
      email: true,
    },
  })

  if (!user) {
    redirect("/login")
  }

  return user
}
