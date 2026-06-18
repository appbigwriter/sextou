import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"
import { isConfiguredAdminEmail } from "@/lib/admin"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isOnDashboard = req.nextUrl.pathname.startsWith("/dashboard")
  const isOnAdmin = req.nextUrl.pathname.startsWith("/admin")
  const isOnAdminApi = req.nextUrl.pathname.startsWith("/api/admin")
  const isOnApiAuth = req.nextUrl.pathname.startsWith("/api/auth")
  const isOnSextouTools =
    req.nextUrl.pathname === "/sextou-tools" ||
    req.nextUrl.pathname.startsWith("/sextou-tools/")
  const isAdmin =
    Boolean(req.auth?.user?.isAdmin) || isConfiguredAdminEmail(req.auth?.user?.email)
  const nextPath = `${req.nextUrl.pathname}${req.nextUrl.search}`

  if (isOnApiAuth) {
    return NextResponse.next()
  }

  if (!isLoggedIn && (isOnDashboard || isOnAdmin || isOnAdminApi || isOnSextouTools)) {
    const loginUrl = new URL("/login", req.nextUrl)
    loginUrl.searchParams.set("next", nextPath)
    return NextResponse.redirect(loginUrl)
  }

  if (isOnAdmin && !isAdmin) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl))
  }

  if (isLoggedIn && (req.nextUrl.pathname === "/login" || req.nextUrl.pathname === "/cadastro")) {
    const redirectUrl = new URL(
      req.nextUrl.searchParams.get("next")?.startsWith("/")
        ? req.nextUrl.searchParams.get("next")!
        : "/dashboard",
      req.nextUrl
    )
    return NextResponse.redirect(redirectUrl)
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/api/admin/:path*",
    "/sextou-tools/:path*",
    "/login",
    "/cadastro",
  ],
}
