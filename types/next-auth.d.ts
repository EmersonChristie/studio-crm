import NextAuth, { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    email: string;
    name?: string | null;
  }

  interface Session {
    user: User;
  }

  interface JWT {
    sub: string;
  }
}
