import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json({ 
        error: 'Email and password are required' 
      }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();
    
    // テスト用のユーザー登録
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: 'https://pic-school.vercel.app/auth/login'
      }
    });

    return NextResponse.json({ 
      success: true,
      message: 'Signup test completed',
      data: {
        user: data?.user ? {
          id: data.user.id,
          email: data.user.email,
          email_confirmed_at: data.user.email_confirmed_at,
          created_at: data.user.created_at
        } : null,
        session: data?.session ? 'Session created' : 'No session',
        email_confirmation_sent: data?.user && !data.user.email_confirmed_at
      },
      error: error ? {
        message: error.message,
        code: error.status
      } : null,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    return NextResponse.json({ 
      error: 'Internal Server Error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
