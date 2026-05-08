'use server';

import { signIn, signOut } from '@/auth';
import { AuthError } from 'next-auth';
import { getDb } from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { z } from 'zod';

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    const email = formData.get('email');
    const password = formData.get('password');

    if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
      return 'Email and password are required.';
    }

    const parsed = z
      .object({ email: z.string().email(), password: z.string().min(6) })
      .safeParse({ email: email.toLowerCase(), password });

    if (!parsed.success) {
      return 'Invalid email or password (min 6 chars).';
    }

    await signIn('credentials', {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: '/dashboard',
    });
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        case 'CallbackRouteError':
          return 'Sign-in failed. Check server logs.';
        default:
          return 'Authentication error.';
      }
    }
    console.error('Authenticate error:', error);
    return 'Something went wrong. Try again.';
  }
}

export async function logout() {
  await signOut({ redirectTo: '/' });
}

const RegisterSchema = z.object({
  name: z.string().trim().min(1, 'Name required.').max(80),
  email: z.string().trim().email('Invalid email.'),
  password: z.string().min(6, 'Password must be 6+ chars.').max(128),
});

export async function registerUser(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    const raw = {
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
    };

    if (typeof raw.name !== 'string' || typeof raw.email !== 'string' || typeof raw.password !== 'string') {
      return 'All fields required.';
    }

    const parsed = RegisterSchema.safeParse({
      name: raw.name,
      email: raw.email.toLowerCase(),
      password: raw.password,
    });

    if (!parsed.success) {
      return parsed.error.issues[0]?.message || 'Invalid input.';
    }

    const { name, email, password } = parsed.data;

    const db = await getDb();

    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return 'User already exists.';
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.collection('users').insertOne({
      email,
      password: hashedPassword,
      name,
      createdAt: new Date(),
    });

    await signIn('credentials', {
      email,
      password,
      redirectTo: '/dashboard',
    });

    return 'success';
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    if (error instanceof AuthError) {
      return 'Account created but auto-login failed. Please log in.';
    }
    console.error('Register error:', error);
    return 'Registration failed. Please try again.';
  }
}
