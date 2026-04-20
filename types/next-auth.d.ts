import "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      businessName?: string
      isAdmin?: boolean
    }
  }

  interface User {
    businessName?: string
    isAdmin?: boolean
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    businessName?: string
    isAdmin?: boolean
  }
}
