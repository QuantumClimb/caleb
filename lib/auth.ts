import { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from './prisma'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    CredentialsProvider({
      name: 'Demo Account',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'demo@caleb.com'
        },
        password: {
          label: 'Password',
          type: 'password',
          placeholder: 'demo123'
        }
      },
      async authorize(credentials) {
        // This is for demo purposes only
        // In production, you'd verify against a hashed password
        if (
          credentials?.email === 'demo@caleb.com' &&
          credentials?.password === 'demo123'
        ) {
          const user = await prisma.user.findUnique({
            where: { email: 'demo@caleb.com' }
          })

          if (user) {
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              image: user.avatar
            }
          }
        }
        return null
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    },
    async signIn({ user, account }) {
      if (account?.provider === 'google' || account?.provider === 'github') {
        try {
          // Check if user exists in our database
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! }
          })

          // If user doesn't exist, create them with default preferences
          if (!existingUser) {
            await prisma.user.create({
              data: {
                email: user.email!,
                name: user.name || '',
                avatar: user.image,
                currency: 'USD',
                language: 'en',
                theme: 'dark',
                emailNotifications: true,
                pushNotifications: true,
                marketingNotifications: false
              }
            })
          }
        } catch (error) {
          console.error('Error during sign in:', error)
          return false
        }
      }
      return true
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error'
  }
}