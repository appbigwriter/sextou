import "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      businessName?: string
    }
  }

  interface User {
    businessName?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    businessName?: string
  }
}
