import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function GET() {
  try {
    console.log('=== Supabase Health Check Started ===');
    
    const supabase = createServerSupabaseClient();
    
    const results = [];

    // 1. 基本的な接続テスト
    try {
      console.log('Testing basic connection...');
      const { data, error } = await supabase
        .from('programs')
        .select('count')
        .limit(1);
      
      if (error) {
        results.push({
          test: 'Basic Connection',
          success: false,
          message: `Connection failed: ${error.message}`,
          error: error
        });
      } else {
        results.push({
          test: 'Basic Connection',
          success: true,
          message: 'Successfully connected to Supabase'
        });
      }
    } catch (error) {
      results.push({
        test: 'Basic Connection',
        success: false,
        message: `Connection error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error: error
      });
    }

    // 2. 認証システムの確認
    try {
      console.log('Testing auth system...');
      const { data: { user }, error } = await supabase.auth.getUser();
      
      results.push({
        test: 'Auth System',
        success: true,
        message: user ? `User authenticated: ${user.id}` : 'No user session (expected for API)',
        data: { hasUser: !!user }
      });
    } catch (error) {
      results.push({
        test: 'Auth System',
        success: false,
        message: `Auth error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error: error
      });
    }

    // 3. テーブル存在確認
    const tables = [
      'user_profiles',
      'programs', 
      'chapters',
      'user_programs',
      'user_progress',
      'achievements',
      'user_achievements',
      'user_points',
      'learning_sessions',
      'notifications',
      'admin_roles'
    ];

    for (const table of tables) {
      try {
        console.log(`Checking table: ${table}`);
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1);
        
        if (error) {
          results.push({
            test: `Table: ${table}`,
            success: false,
            message: `Table access failed: ${error.message}`,
            error: error
          });
        } else {
          results.push({
            test: `Table: ${table}`,
            success: true,
            message: `Table accessible, ${data?.length || 0} records found`,
            data: { recordCount: data?.length || 0 }
          });
        }
      } catch (error) {
        results.push({
          test: `Table: ${table}`,
          success: false,
          message: `Table check error: ${error instanceof Error ? error.message : 'Unknown error'}`,
          error: error
        });
      }
    }

    // 4. データベース関数の確認
    try {
      console.log('Testing database functions...');
      const { data, error } = await supabase
        .rpc('update_user_progress', {
          p_user_id: '00000000-0000-0000-0000-000000000000', // ダミーUUID
          p_chapter_id: 1,
          p_progress_percentage: 0,
          p_time_spent_minutes: 0
        });
      
      if (error && error.message.includes('function') && error.message.includes('does not exist')) {
        results.push({
          test: 'Database Functions',
          success: false,
          message: 'Database functions not found - schema may not be applied',
          error: error
        });
      } else {
        results.push({
          test: 'Database Functions',
          success: true,
          message: 'Database functions are available'
        });
      }
    } catch (error) {
      results.push({
        test: 'Database Functions',
        success: false,
        message: `Function test error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error: error
      });
    }

    const allTestsPassed = results.every(r => r.success);
    const passedTests = results.filter(r => r.success).length;
    const failedTests = results.filter(r => !r.success).length;

    console.log('=== Supabase Health Check Completed ===');
    console.log(`Passed: ${passedTests}, Failed: ${failedTests}`);

    return NextResponse.json({
      success: allTestsPassed,
      message: allTestsPassed ? 'All Supabase checks passed' : 'Some Supabase checks failed',
      results,
      summary: {
        totalTests: results.length,
        passedTests,
        failedTests,
        tablesChecked: tables.length
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Supabase health check error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: 'Check server logs for more information'
    }, { status: 500 });
  }
}
