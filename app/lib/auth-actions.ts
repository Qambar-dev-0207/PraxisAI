'use server';
 
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { getDb } from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
 
export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', {
      ...Object.fromEntries(formData),
      redirectTo: '/dashboard',
      callbackUrl: '/dashboard',
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

export async function registerUser(
    prevState: string | undefined,
    formData: FormData,
  ) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const name = formData.get('name') as string;
  
    if (!email || !password || password.length < 6) {
        return 'Invalid input. Password must be 6+ chars.';
    }

    const db = await getDb();

    // Check if user exists
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

    // Auto-login after registration
    try {
      await signIn('credentials', {
        email,
        password,
        redirectTo: '/dashboard',
        callbackUrl: '/dashboard',
      });
    } catch (error) {
       if (error instanceof AuthError) {
          return 'Registration successful, but auto-login failed.';
       }
       throw error;
    }

    return 'success';
}