import NextAuth, { User } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { isConfiguredAdminEmail } from "@/lib/admin"

interface ExtendedUser extends User {
  businessName?: string
  isAdmin?: boolean
}

export async function isAdmin(email: string) {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { isAdmin: true },
  })
  return user?.isAdmin || isConfiguredAdminEmail(email)
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  // trustHost faz o NextAuth detectar o host automaticamente da requisição
  // sem precisar de NEXTAUTH_URL configurado corretamente
  trustHost: true,
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials): Promise<ExtendedUser | null> {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        let user
        try {
          user = await prisma.user.findUnique({
            where: { email: credentials.email as string }
          })
        } catch (err) {
          console.error("[AUTH] DB error:", err)
          return null
        }

        if (!user || !user.passwordHash) {
          return null
        }

        const isPasswordValid = await compare(
          credentials.password as string,
          user.passwordHash
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.fullName,
          businessName: user.businessName,
          isAdmin: Boolean((user as any).isAdmin) || isConfiguredAdminEmail(user.email),
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.businessName = (user as any).businessName
        token.isAdmin = Boolean((user as any).isAdmin)
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.businessName = token.businessName as string
        session.user.isAdmin = Boolean(token.isAdmin)
      }
      return session
    }
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
})
