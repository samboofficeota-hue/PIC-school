import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '../../../lib/supabase-server';

export async function GET() {
  try {
    const supabase = createServerSupabaseClient();
    
    // 1. 最近のユーザー登録状況を確認
    const { data: recentUsers, error: usersError } = await supabase
      .from('auth.users')
      .select('id, email, email_confirmed_at, created_at')
      .order('created_at', { ascending: false })
      .limit(10);

    if (usersError) {
      console.error('Error fetching users:', usersError);
    }

    // 2. メール確認待ちのユーザー数を確認
    const { data: unconfirmedUsers, error: unconfirmedError } = await supabase
      .from('auth.users')
      .select('id, email, created_at')
      .is('email_confirmed_at', null)
      .order('created_at', { ascending: false })
      .limit(20);

    if (unconfirmedError) {
      console.error('Error fetching unconfirmed users:', unconfirmedError);
    }

    // 3. プロジェクト設定を確認（可能な範囲で）
    const { data: projectInfo, error: projectError } = await supabase
      .from('auth.users')
      .select('count')
      .limit(1);

    return NextResponse.json({
      success: true,
      data: {
        recentUsers: recentUsers || [],
        unconfirmedUsers: unconfirmedUsers || [],
        totalUnconfirmed: unconfirmedUsers?.length || 0,
        projectInfo: {
          hasUsers: (recentUsers?.length || 0) > 0
        }
      },
      errors: {
        usersError: usersError?.message,
        unconfirmedError: unconfirmedError?.message,
        projectError: projectError?.message
      }
    });

  } catch (error) {
    console.error('Error checking Supabase email status:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
