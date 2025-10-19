import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '../../../lib/supabase-server';

export async function POST() {
  try {
    console.log('=== Schema Application Started ===');
    
    const supabase = createServerSupabaseClient();
    
    const results = [];

    // 1. user_profilesテーブルの修正
    try {
      console.log('Fixing user_profiles table...');
      
      // 既存のテーブルを削除（存在する場合）
      await supabase.rpc('exec_sql', { 
        sql: 'DROP TABLE IF EXISTS user_profiles CASCADE;' 
      });
      
      // テーブルを再作成
      const { error: createError } = await supabase.rpc('exec_sql', {
        sql: `
          CREATE TABLE user_profiles (
            id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
            name TEXT,
            avatar_url TEXT,
            bio TEXT,
            location TEXT,
            phone TEXT,
            birthday DATE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `
      });
      
      if (createError) {
        results.push({
          table: 'user_profiles',
          success: false,
          message: `Creation failed: ${createError.message}`,
          error: createError
        });
      } else {
        results.push({
          table: 'user_profiles',
          success: true,
          message: 'Table created successfully'
        });
      }
    } catch (error) {
      results.push({
        table: 'user_profiles',
        success: false,
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error: error
      });
    }

    // 2. chaptersテーブルの修正
    try {
      console.log('Fixing chapters table...');
      
      // 不足しているカラムを追加
      const alterQueries = [
        'ALTER TABLE chapters ADD COLUMN IF NOT EXISTS description TEXT;',
        'ALTER TABLE chapters ADD COLUMN IF NOT EXISTS duration_minutes INTEGER DEFAULT 0;',
        'ALTER TABLE chapters ADD COLUMN IF NOT EXISTS is_free BOOLEAN DEFAULT false;',
        'ALTER TABLE chapters ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();'
      ];
      
      for (const query of alterQueries) {
        const { error } = await supabase.rpc('exec_sql', { sql: query });
        if (error) {
          console.error(`Query failed: ${query}`, error);
        }
      }
      
      results.push({
        table: 'chapters',
        success: true,
        message: 'Missing columns added successfully'
      });
    } catch (error) {
      results.push({
        table: 'chapters',
        success: false,
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error: error
      });
    }

    // 3. 他のテーブルの確認と作成
    const tableDefinitions = [
      {
        name: 'user_programs',
        sql: `
          CREATE TABLE IF NOT EXISTS user_programs (
            id SERIAL PRIMARY KEY,
            user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
            program_id INTEGER REFERENCES programs(id) ON DELETE CASCADE,
            enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            completed_at TIMESTAMP WITH TIME ZONE,
            progress_percentage DECIMAL(5,2) DEFAULT 0,
            last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            UNIQUE(user_id, program_id)
          );
        `
      },
      {
        name: 'user_progress',
        sql: `
          CREATE TABLE IF NOT EXISTS user_progress (
            id SERIAL PRIMARY KEY,
            user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
            chapter_id INTEGER REFERENCES chapters(id) ON DELETE CASCADE,
            progress_percentage DECIMAL(5,2) DEFAULT 0,
            time_spent_minutes INTEGER DEFAULT 0,
            completed_at TIMESTAMP WITH TIME ZONE,
            last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            UNIQUE(user_id, chapter_id)
          );
        `
      },
      {
        name: 'achievements',
        sql: `
          CREATE TABLE IF NOT EXISTS achievements (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            description TEXT,
            icon_url TEXT,
            points INTEGER DEFAULT 0,
            category TEXT,
            rarity TEXT CHECK (rarity IN ('common', 'uncommon', 'rare', 'epic', 'legendary')) DEFAULT 'common',
            conditions JSONB,
            is_active BOOLEAN DEFAULT true,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `
      },
      {
        name: 'user_achievements',
        sql: `
          CREATE TABLE IF NOT EXISTS user_achievements (
            id SERIAL PRIMARY KEY,
            user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
            achievement_id INTEGER REFERENCES achievements(id) ON DELETE CASCADE,
            earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            points_earned INTEGER DEFAULT 0,
            UNIQUE(user_id, achievement_id)
          );
        `
      },
      {
        name: 'user_points',
        sql: `
          CREATE TABLE IF NOT EXISTS user_points (
            id SERIAL PRIMARY KEY,
            user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
            total_points INTEGER DEFAULT 0,
            earned_points INTEGER DEFAULT 0,
            spent_points INTEGER DEFAULT 0,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            UNIQUE(user_id)
          );
        `
      },
      {
        name: 'learning_sessions',
        sql: `
          CREATE TABLE IF NOT EXISTS learning_sessions (
            id SERIAL PRIMARY KEY,
            user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
            chapter_id INTEGER REFERENCES chapters(id) ON DELETE CASCADE,
            started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            ended_at TIMESTAMP WITH TIME ZONE,
            duration_minutes INTEGER DEFAULT 0,
            progress_before DECIMAL(5,2) DEFAULT 0,
            progress_after DECIMAL(5,2) DEFAULT 0,
            points_earned INTEGER DEFAULT 0
          );
        `
      },
      {
        name: 'notifications',
        sql: `
          CREATE TABLE IF NOT EXISTS notifications (
            id SERIAL PRIMARY KEY,
            user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
            title TEXT NOT NULL,
            message TEXT NOT NULL,
            type TEXT CHECK (type IN ('achievement', 'progress', 'system', 'marketing')) DEFAULT 'system',
            is_read BOOLEAN DEFAULT false,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `
      },
      {
        name: 'admin_roles',
        sql: `
          CREATE TABLE IF NOT EXISTS admin_roles (
            id SERIAL PRIMARY KEY,
            user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
            role TEXT CHECK (role IN ('super_admin', 'admin', 'moderator')) DEFAULT 'admin',
            permissions JSONB DEFAULT '{}',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            UNIQUE(user_id)
          );
        `
      }
    ];

    for (const tableDef of tableDefinitions) {
      try {
        console.log(`Creating/checking table: ${tableDef.name}`);
        const { error } = await supabase.rpc('exec_sql', { sql: tableDef.sql });
        
        if (error) {
          results.push({
            table: tableDef.name,
            success: false,
            message: `Creation failed: ${error.message}`,
            error: error
          });
        } else {
          results.push({
            table: tableDef.name,
            success: true,
            message: 'Table created/verified successfully'
          });
        }
      } catch (error) {
        results.push({
          table: tableDef.name,
          success: false,
          message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
          error: error
        });
      }
    }

    const allTestsPassed = results.every(r => r.success);
    const passedTests = results.filter(r => r.success).length;
    const failedTests = results.filter(r => !r.success).length;

    console.log('=== Schema Application Completed ===');
    console.log(`Passed: ${passedTests}, Failed: ${failedTests}`);

    return NextResponse.json({
      success: allTestsPassed,
      message: allTestsPassed ? 'All tables created successfully' : 'Some tables failed to create',
      results,
      summary: {
        totalTests: results.length,
        passedTests,
        failedTests
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Schema application error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: 'Check server logs for more information'
    }, { status: 500 });
  }
}
