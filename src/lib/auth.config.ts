import { NextAuthConfig } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GithubProvider from 'next-auth/providers/github';
import { AuthService } from './services/auth.service';

export const authConfig = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID ?? '',
      clientSecret: process.env.GITHUB_SECRET ?? ''
    }),
    CredentialsProvider({
      credentials: {
        email: {
          type: 'email',
          label: 'Email'
        },
        password: {
          type: 'password',
          label: 'Password'
        }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const user = await AuthService.verifyCredentials(
            credentials.email as string,
            credentials.password as string
          );
          return user;
        } catch (error) {
          return null;
        }
      }
    })
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'github' && user.email) {
        const existingUser = await AuthService.getUserByEmail(user.email);
        if (!existingUser) {
          await AuthService.createUser({
            email: user.email,
            password: '', // OAuth users don't need password
            name: user.name || undefined
          });
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    }
  },
  pages: {
    signIn: '/'
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt'
  }
} satisfies NextAuthConfig;
