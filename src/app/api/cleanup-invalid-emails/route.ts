import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '../../../lib/supabase-server';

export async function POST() {
  try {
    const supabase = createServerSupabaseClient();
    
    // 無効なメールアドレスのパターン
    const invalidEmailPatterns = [
      '%@example.com',
      '%@test.com',
      '%@localhost',
      '%@invalid',
      '%@fake.com',
      '%@dummy.com'
    ];

    let deletedCount = 0;
    const errors: string[] = [];

    // 各パターンに対して削除を試行
    for (const pattern of invalidEmailPatterns) {
      try {
        // 注意: 実際の削除は慎重に行う必要があります
        // まずは該当するユーザーを特定
        const { data: usersToDelete, error: selectError } = await supabase
          .from('auth.users')
          .select('id, email')
          .ilike('email', pattern);

        if (selectError) {
          errors.push(`Error selecting users with pattern ${pattern}: ${selectError.message}`);
          continue;
        }

        if (usersToDelete && usersToDelete.length > 0) {
          console.log(`Found ${usersToDelete.length} users with pattern ${pattern}:`, usersToDelete);
          
          // 実際の削除は行わず、ログのみ出力
          // 本番環境では慎重に実行する必要があります
          deletedCount += usersToDelete.length;
        }
      } catch (error) {
        errors.push(`Error processing pattern ${pattern}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Found ${deletedCount} users with invalid email patterns`,
      details: {
        patternsChecked: invalidEmailPatterns,
        usersFound: deletedCount,
        errors: errors
      },
      warning: 'This is a dry run. No actual deletions were performed.'
    });

  } catch (error) {
    console.error('Error cleaning up invalid emails:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
