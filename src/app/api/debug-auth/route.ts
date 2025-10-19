import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '../../lib/supabase-server';

export async function GET() {
  try {
    const supabase = createServerSupabaseClient();
    
    // 現在の認証設定を確認
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    // 環境変数の確認
    const envCheck = {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? '設定済み' : '未設定',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '設定済み' : '未設定',
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? '設定済み' : '未設定',
    };

    return NextResponse.json({ 
      success: true,
      message: '認証設定の確認',
      user: user ? { id: user.id, email: user.email, email_confirmed_at: user.email_confirmed_at } : null,
      userError: userError ? userError.message : null,
      environment: envCheck,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    return NextResponse.json({ 
      error: 'Internal Server Error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
