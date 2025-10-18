import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function DELETE() {
  try {
    const supabase = createServerSupabaseClient();
    
    // テストユーザーのメールアドレスリスト
    const testEmails = [
      'testuser@gmail.com',
      'test@example.com',
      'admin@example.com'
    ];

    let deletedCount = 0;
    const errors = [];

    for (const email of testEmails) {
      try {
        // ユーザーを検索
        const { data: users, error: searchError } = await supabase.auth.admin.listUsers();
        
        if (searchError) {
          errors.push(`ユーザー検索エラー (${email}): ${searchError.message}`);
          continue;
        }

        // 該当するユーザーを検索
        const user = users.users.find(u => u.email === email);
        
        if (user) {
          // ユーザーを削除
          const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id);
          
          if (deleteError) {
            errors.push(`ユーザー削除エラー (${email}): ${deleteError.message}`);
          } else {
            deletedCount++;
            console.log(`テストユーザーを削除しました: ${email}`);
          }
        } else {
          console.log(`ユーザーが見つかりません: ${email}`);
        }
      } catch (error) {
        errors.push(`処理エラー (${email}): ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    return NextResponse.json({ 
      success: true,
      message: `${deletedCount}個のテストユーザーを削除しました`,
      deletedCount,
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (error) {
    return NextResponse.json({ 
      error: 'Internal Server Error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
