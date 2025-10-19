import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('=== Vercel Debug Started ===');
    
    const results = [];

    // 1. 環境変数の確認
    const envVars = {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
      NODE_ENV: process.env.NODE_ENV,
      VERCEL: process.env.VERCEL,
      VERCEL_ENV: process.env.VERCEL_ENV,
      VERCEL_URL: process.env.VERCEL_URL
    };

    results.push({
      test: 'Environment Variables',
      success: true,
      message: 'Environment variables check',
      data: {
        supabaseUrl: envVars.NEXT_PUBLIC_SUPABASE_URL ? 'Present' : 'Missing',
        supabaseAnonKey: envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Present' : 'Missing',
        supabaseServiceKey: envVars.SUPABASE_SERVICE_ROLE_KEY ? 'Present' : 'Missing',
        nodeEnv: envVars.NODE_ENV,
        vercel: envVars.VERCEL,
        vercelEnv: envVars.VERCEL_ENV,
        vercelUrl: envVars.VERCEL_URL
      }
    });

    // 2. Supabaseクライアントのテスト
    try {
      const { createServerSupabaseClient } = await import('../../lib/supabase-server');
      const supabase = createServerSupabaseClient();
      
      results.push({
        test: 'Supabase Client Creation',
        success: true,
        message: 'Supabase client created successfully'
      });

      // 3. 基本的なクエリテスト
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .limit(1);

      if (error) {
        results.push({
          test: 'Basic Query Test',
          success: false,
          message: `Query failed: ${error.message}`,
          error: error
        });
      } else {
        results.push({
          test: 'Basic Query Test',
          success: true,
          message: `Query successful, found ${data?.length || 0} records`,
          data: { recordCount: data?.length || 0 }
        });
      }

    } catch (error) {
      results.push({
        test: 'Supabase Client Test',
        success: false,
        message: `Client creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error: error
      });
    }

    // 4. システム情報
    results.push({
      test: 'System Information',
      success: true,
      message: 'System info collected',
      data: {
        timestamp: new Date().toISOString(),
        userAgent: process.env.USER_AGENT || 'Unknown',
        platform: process.platform,
        nodeVersion: process.version
      }
    });

    // 5. メモリ使用量
    const memUsage = process.memoryUsage();
    results.push({
      test: 'Memory Usage',
      success: true,
      message: 'Memory usage check',
      data: {
        rss: Math.round(memUsage.rss / 1024 / 1024) + ' MB',
        heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024) + ' MB',
        heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024) + ' MB',
        external: Math.round(memUsage.external / 1024 / 1024) + ' MB'
      }
    });

    const allTestsPassed = results.every(r => r.success);
    const passedTests = results.filter(r => r.success).length;
    const failedTests = results.filter(r => !r.success).length;

    console.log('=== Vercel Debug Completed ===');
    console.log(`Passed: ${passedTests}, Failed: ${failedTests}`);

    return NextResponse.json({
      success: allTestsPassed,
      message: allTestsPassed ? 'All Vercel checks passed' : 'Some Vercel checks failed',
      results,
      summary: {
        totalTests: results.length,
        passedTests,
        failedTests
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Vercel debug error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: 'Check server logs for more information'
    }, { status: 500 });
  }
}
