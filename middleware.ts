import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"
import { isConfiguredAdminEmail } from "@/lib/admin"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isOnDashboard = req.nextUrl.pathname.startsWith("/dashboard")
  const isOnAdmin = req.nextUrl.pathname.startsWith("/admin")
  const isOnAdminApi = req.nextUrl.pathname.startsWith("/api/admin")
  const isOnApiAuth = req.nextUrl.pathname.startsWith("/api/auth")
  const isAdmin =
    Boolean(req.auth?.user?.isAdmin) || isConfiguredAdminEmail(req.auth?.user?.email)

  if (isOnApiAuth) {
    return NextResponse.next()
  }

  if (!isLoggedIn && (isOnDashboard || isOnAdmin || isOnAdminApi)) {
    return NextResponse.redirect(new URL("/login", req.nextUrl))
  }

  if (isOnAdmin && !isAdmin) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl))
  }

  if (isLoggedIn && (req.nextUrl.pathname === "/login" || req.nextUrl.pathname === "/cadastro")) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/api/admin/:path*", "/login", "/cadastro"],
}
