import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '../../lib/supabase-server';

export async function GET() {
  try {
    const supabase = createServerSupabaseClient();
    
    // チャプターテーブルの構造を確認
    const { data, error } = await supabase
      .from('chapters')
      .select('*')
      .limit(1);

    if (error) {
      return NextResponse.json({ 
        error: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true,
      message: 'チャプターテーブルにアクセスできました',
      data: data,
      count: data?.length || 0
    });

  } catch (error) {
    return NextResponse.json({ 
      error: 'Internal Server Error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
