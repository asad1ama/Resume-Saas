import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { prisma } from "./prisma"

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  trustHost: true,
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, account }) {
  if (account && user?.email) {
    try {
      const dbUser = await prisma.user.upsert({
        where: { email: user.email },
        update: { name: user.name ?? "", image: user.image ?? "" },
        create: {
          email: user.email,
          name: user.name ?? "",
          image: user.image ?? "",
          credits: 3,
        },
      })
      token.id = dbUser.id
      token.email = user.email
    } catch (error) {
      console.error("DB error during login:", error)
      token.email = user.email
      token.name = user.name
    }
  }
      return token
    },
    session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.email = token.email as string
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
})