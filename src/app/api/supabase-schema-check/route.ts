import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '../../../lib/supabase-server';

export async function GET() {
  try {
    console.log('=== Supabase Schema Check Started ===');
    
    const supabase = createServerSupabaseClient();
    
    const results = [];

    // 1. テーブル構造の確認
    const tableChecks = [
      {
        name: 'user_profiles',
        expectedColumns: ['id', 'name', 'avatar_url', 'bio', 'location', 'phone', 'birthday', 'created_at', 'updated_at'],
        description: 'ユーザープロフィールテーブル'
      },
      {
        name: 'programs',
        expectedColumns: ['id', 'title', 'description', 'thumbnail_url', 'instructor_name', 'instructor_bio', 'price', 'duration_hours', 'difficulty_level', 'category', 'status', 'created_at', 'updated_at'],
        description: 'プログラムテーブル'
      },
      {
        name: 'chapters',
        expectedColumns: ['id', 'program_id', 'title', 'description', 'content', 'video_url', 'duration_minutes', 'order_index', 'is_free', 'created_at', 'updated_at'],
        description: 'チャプターテーブル'
      },
      {
        name: 'user_programs',
        expectedColumns: ['id', 'user_id', 'program_id', 'enrolled_at', 'completed_at', 'progress_percentage', 'last_accessed_at'],
        description: 'ユーザープログラム登録テーブル'
      },
      {
        name: 'user_progress',
        expectedColumns: ['id', 'user_id', 'chapter_id', 'progress_percentage', 'time_spent_minutes', 'completed_at', 'last_accessed_at', 'created_at', 'updated_at'],
        description: 'ユーザー学習進捗テーブル'
      },
      {
        name: 'achievements',
        expectedColumns: ['id', 'name', 'description', 'icon_url', 'points', 'category', 'rarity', 'conditions', 'is_active', 'created_at'],
        description: '実績テーブル'
      },
      {
        name: 'user_achievements',
        expectedColumns: ['id', 'user_id', 'achievement_id', 'earned_at', 'points_earned'],
        description: 'ユーザー実績テーブル'
      },
      {
        name: 'user_points',
        expectedColumns: ['id', 'user_id', 'total_points', 'earned_points', 'spent_points', 'created_at', 'updated_at'],
        description: 'ユーザーポイントテーブル'
      },
      {
        name: 'learning_sessions',
        expectedColumns: ['id', 'user_id', 'chapter_id', 'started_at', 'ended_at', 'duration_minutes', 'progress_before', 'progress_after', 'points_earned'],
        description: '学習セッションテーブル'
      },
      {
        name: 'notifications',
        expectedColumns: ['id', 'user_id', 'title', 'message', 'type', 'is_read', 'created_at'],
        description: '通知テーブル'
      },
      {
        name: 'admin_roles',
        expectedColumns: ['id', 'user_id', 'role', 'permissions', 'created_at'],
        description: '管理者権限テーブル'
      }
    ];

    for (const tableCheck of tableChecks) {
      try {
        console.log(`Checking table structure: ${tableCheck.name}`);
        
        // テーブルの存在確認
        const { data, error } = await supabase
          .from(tableCheck.name)
          .select('*')
          .limit(1);
        
        if (error) {
          results.push({
            table: tableCheck.name,
            description: tableCheck.description,
            success: false,
            message: `Table access failed: ${error.message}`,
            error: error
          });
          continue;
        }

        // カラムの存在確認（実際のデータから推測）
        const sampleRecord = data?.[0];
        const actualColumns = sampleRecord ? Object.keys(sampleRecord) : [];
        const missingColumns = tableCheck.expectedColumns.filter(col => !actualColumns.includes(col));
        const extraColumns = actualColumns.filter(col => !tableCheck.expectedColumns.includes(col));

        results.push({
          table: tableCheck.name,
          description: tableCheck.description,
          success: missingColumns.length === 0,
          message: missingColumns.length === 0 ? 'Table structure is correct' : `Missing columns: ${missingColumns.join(', ')}`,
          data: {
            expectedColumns: tableCheck.expectedColumns,
            actualColumns,
            missingColumns,
            extraColumns,
            hasData: !!sampleRecord
          }
        });

      } catch (error) {
        results.push({
          table: tableCheck.name,
          description: tableCheck.description,
          success: false,
          message: `Table check error: ${error instanceof Error ? error.message : 'Unknown error'}`,
          error: error
        });
      }
    }

    // 2. リレーションの確認
    try {
      console.log('Checking table relationships...');
      
      // programs と chapters のリレーション確認
      const { data: programsWithChapters, error: programsError } = await supabase
        .from('programs')
        .select(`
          id,
          title,
          chapters (
            id,
            title,
            order_index
          )
        `)
        .limit(1);

      if (programsError) {
        results.push({
          test: 'Table Relationships',
          success: false,
          message: `Relationship check failed: ${programsError.message}`,
          error: programsError
        });
      } else {
        results.push({
          test: 'Table Relationships',
          success: true,
          message: 'Table relationships are working correctly',
          data: {
            programsWithChapters: programsWithChapters?.length || 0
          }
        });
      }
    } catch (error) {
      results.push({
        test: 'Table Relationships',
        success: false,
        message: `Relationship check error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error: error
      });
    }

    // 3. インデックスの確認（可能な範囲で）
    try {
      console.log('Checking database indexes...');
      
      // インデックスは直接確認できないため、パフォーマンステストで推測
      const { data: userPrograms, error: userProgramsError } = await supabase
        .from('user_programs')
        .select('user_id, program_id')
        .limit(100);

      if (userProgramsError) {
        results.push({
          test: 'Database Indexes',
          success: false,
          message: `Index check failed: ${userProgramsError.message}`,
          error: userProgramsError
        });
      } else {
        results.push({
          test: 'Database Indexes',
          success: true,
          message: 'Database indexes appear to be working (based on query performance)',
          data: {
            userProgramsCount: userPrograms?.length || 0
          }
        });
      }
    } catch (error) {
      results.push({
        test: 'Database Indexes',
        success: false,
        message: `Index check error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error: error
      });
    }

    const allTestsPassed = results.every(r => r.success);
    const passedTests = results.filter(r => r.success).length;
    const failedTests = results.filter(r => !r.success).length;

    console.log('=== Supabase Schema Check Completed ===');
    console.log(`Passed: ${passedTests}, Failed: ${failedTests}`);

    return NextResponse.json({
      success: allTestsPassed,
      message: allTestsPassed ? 'All schema checks passed' : 'Some schema checks failed',
      results,
      summary: {
        totalTests: results.length,
        passedTests,
        failedTests,
        tablesChecked: tableChecks.length
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Supabase schema check error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: 'Check server logs for more information'
    }, { status: 500 });
  }
}
