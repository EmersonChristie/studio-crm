import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

export const {
  auth,
  handlers: authHandlers,
  signIn,
  signOut
} = NextAuth(authConfig);
