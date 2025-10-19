import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '../../../lib/supabase-server';

export async function POST() {
  try {
    const supabase = createServerSupabaseClient();
    
    // 1. 現在のメール設定状況を確認
    const { data: settings, error: settingsError } = await supabase
      .from('auth.users')
      .select('count')
      .limit(1);

    if (settingsError) {
      console.error('Error fetching settings:', settingsError);
    }

    // 2. 最近の認証イベントを確認
    const { data: recentAuth, error: authError } = await supabase
      .from('auth.users')
      .select('id, email, created_at, email_confirmed_at')
      .order('created_at', { ascending: false })
      .limit(5);

    if (authError) {
      console.error('Error fetching auth data:', authError);
    }

    // 3. 推奨される解決策を提示
    const recommendations = [
      {
        action: 'Supabase Dashboard での設定確認',
        description: 'Authentication > Settings > Email でメール送信設定を確認',
        priority: 'high'
      },
      {
        action: '無効なメールアドレスの削除',
        description: 'example.com, test.com などの無効なアドレスを削除',
        priority: 'high'
      },
      {
        action: 'メール送信制限の一時解除',
        description: 'Supabase サポートに連絡してメール送信制限を解除依頼',
        priority: 'medium'
      },
      {
        action: 'カスタムSMTP設定',
        description: 'より制御可能なカスタムSMTPプロバイダーの設定を検討',
        priority: 'low'
      }
    ];

    return NextResponse.json({
      success: true,
      message: 'Supabase email settings analysis completed',
      data: {
        currentSettings: settings,
        recentAuth: recentAuth || [],
        recommendations: recommendations
      },
      nextSteps: [
        '1. Supabase Dashboard にアクセス',
        '2. Authentication > Settings > Email を確認',
        '3. 無効なメールアドレスを削除',
        '4. 必要に応じてSupabaseサポートに連絡'
      ]
    });

  } catch (error) {
    console.error('Error resetting Supabase email settings:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
