'use server';
 
import { signIn, signOut } from '@/auth';
import { AuthError } from 'next-auth';
import { getDb } from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
 
import { redirect } from 'next/navigation';
 
export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    console.log('Attempting to sign in with email:', email);

    await signIn('credentials', {
      email,
      password,
      redirect: false,
    });
  } catch (error) {
    console.error('Sign in error in action:', error);
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
  
  console.log('Sign in successful, redirecting...');
  redirect('/dashboard');
}

export async function logout() {
  await signOut({ redirectTo: '/' });
}

export async function registerUser(
    prevState: string | undefined,
    formData: FormData,
  ) {
    try {
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
    } catch (error) {
      console.error('Register error:', error);
      return 'Registration failed. Please try again.';
    }
}