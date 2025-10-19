import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '../../../lib/supabase-server';

export async function GET() {
  try {
    console.log('=== Table Structure Debug Started ===');
    
    const supabase = createServerSupabaseClient();
    
    const results = [];

    // 1. テーブル存在確認（システムカタログから）
    try {
      console.log('Checking table existence from system catalog...');
      
      const { data: tables, error } = await supabase
        .rpc('exec_sql', {
          sql: `
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name IN (
              'user_profiles', 'programs', 'chapters', 'user_programs', 
              'user_progress', 'achievements', 'user_achievements', 
              'user_points', 'learning_sessions', 'notifications', 'admin_roles'
            )
            ORDER BY table_name;
          `
        });

      if (error) {
        results.push({
          test: 'Table Existence Check',
          success: false,
          message: `Failed to check table existence: ${error.message}`,
          error: error
        });
      } else {
        results.push({
          test: 'Table Existence Check',
          success: true,
          message: `Found ${tables?.length || 0} tables`,
          data: { tables: tables?.map((t: any) => t.table_name) || [] }
        });
      }
    } catch (error) {
      results.push({
        test: 'Table Existence Check',
        success: false,
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error: error
      });
    }

    // 2. 各テーブルのカラム情報を詳細確認
    const tablesToCheck = [
      'user_profiles', 'programs', 'chapters', 'user_programs', 
      'user_progress', 'achievements', 'user_achievements', 
      'user_points', 'learning_sessions', 'notifications', 'admin_roles'
    ];

    for (const tableName of tablesToCheck) {
      try {
        console.log(`Checking columns for table: ${tableName}`);
        
        // システムカタログからカラム情報を取得
        const { data: columns, error: columnsError } = await supabase
          .rpc('exec_sql', {
            sql: `
              SELECT column_name, data_type, is_nullable, column_default
              FROM information_schema.columns 
              WHERE table_schema = 'public' 
              AND table_name = '${tableName}'
              ORDER BY ordinal_position;
            `
          });

        if (columnsError) {
          results.push({
            table: tableName,
            success: false,
            message: `Failed to get column info: ${columnsError.message}`,
            error: columnsError
          });
        } else {
            const columnNames = columns?.map((c: any) => c.column_name) || [];
          results.push({
            table: tableName,
            success: true,
            message: `Found ${columnNames.length} columns`,
            data: {
              columns: columnNames,
              columnDetails: columns || []
            }
          });
        }

        // 実際のデータからカラムを推測
        try {
          const { data: sampleData, error: sampleError } = await supabase
            .from(tableName)
            .select('*')
            .limit(1);

          if (sampleError) {
            results.push({
              table: `${tableName}_sample`,
              success: false,
              message: `Failed to get sample data: ${sampleError.message}`,
              error: sampleError
            });
          } else {
            const sampleColumns = sampleData?.[0] ? Object.keys(sampleData[0]) : [];
            results.push({
              table: `${tableName}_sample`,
              success: true,
              message: `Sample data columns: ${sampleColumns.length}`,
              data: { sampleColumns }
            });
          }
        } catch (error) {
          results.push({
            table: `${tableName}_sample`,
            success: false,
            message: `Sample data error: ${error instanceof Error ? error.message : 'Unknown error'}`,
            error: error
          });
        }

      } catch (error) {
        results.push({
          table: tableName,
          success: false,
          message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
          error: error
        });
      }
    }

    // 3. テーブル作成の再実行テスト
    try {
      console.log('Testing table recreation...');
      
      // テスト用の一時テーブルを作成
      const { error: createError } = await supabase
        .rpc('exec_sql', {
          sql: `
            CREATE TABLE IF NOT EXISTS test_table_structure (
              id SERIAL PRIMARY KEY,
              test_column TEXT,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
          `
        });

      if (createError) {
        results.push({
          test: 'Table Creation Test',
          success: false,
          message: `Failed to create test table: ${createError.message}`,
          error: createError
        });
      } else {
        // テストテーブルを削除
        await supabase.rpc('exec_sql', {
          sql: 'DROP TABLE IF EXISTS test_table_structure;'
        });
        
        results.push({
          test: 'Table Creation Test',
          success: true,
          message: 'Table creation is working correctly'
        });
      }
    } catch (error) {
      results.push({
        test: 'Table Creation Test',
        success: false,
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error: error
      });
    }

    const allTestsPassed = results.every(r => r.success);
    const passedTests = results.filter(r => r.success).length;
    const failedTests = results.filter(r => !r.success).length;

    console.log('=== Table Structure Debug Completed ===');
    console.log(`Passed: ${passedTests}, Failed: ${failedTests}`);

    return NextResponse.json({
      success: allTestsPassed,
      message: allTestsPassed ? 'All table structure checks passed' : 'Some table structure checks failed',
      results,
      summary: {
        totalTests: results.length,
        passedTests,
        failedTests,
        tablesChecked: tablesToCheck.length
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Table structure debug error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: 'Check server logs for more information'
    }, { status: 500 });
  }
}
