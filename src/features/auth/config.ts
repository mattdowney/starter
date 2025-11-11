import NextAuth, { type NextAuthConfig } from 'next-auth'
import { githubProvider } from './providers/github'

const nextAuthConfig: NextAuthConfig = {
  providers: [
    // Uncomment providers as needed
    // githubProvider,
  ],
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard')
      if (isOnDashboard) {
        if (isLoggedIn) return true
        return false // Redirect unauthenticated users to login page
      }
      return true
    },
  },
}

export const authConfig = {
  enabled: false, // Set to true to enable
  ...nextAuthConfig,
}

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)
