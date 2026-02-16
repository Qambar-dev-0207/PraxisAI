import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { getDb } from './lib/mongodb';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

async function getUser(email: string) {
  try {
    console.log('Fetching user from DB for email:', email);
    const db = await getDb();
    const user = await db.collection('users').findOne({ email });
    if (user) console.log('User fetched successfully');
    return user;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          try {
            const user = await getUser(email);
            if (!user) {
                console.log('No user found with email:', email);
                return null;
            }
            
            const passwordsMatch = await bcrypt.compare(password, user.password);
            if (passwordsMatch) {
                return {
                    id: user._id.toString(),
                    email: user.email,
                    name: user.name,
                };
            } else {
                console.log('Password mismatch for user:', email);
            }
          } catch (e) {
            console.error('Error during authorization:', e);
            return null;
          }
        }

        console.log('Invalid credentials');
        return null;
      },
    }),
  ],
});