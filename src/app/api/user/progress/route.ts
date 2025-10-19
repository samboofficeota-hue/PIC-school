import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '../../lib/supabase-server';
import { db } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    
    // 認証チェック
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const programId = searchParams.get('programId');

    // ユーザーの学習進捗取得
    const { data, error } = await db.getUserProgress(
      user.id, 
      programId ? parseInt(programId) : undefined
    );
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    
    // 認証チェック
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { chapterId, progress, timeSpent } = body;

    if (!chapterId || progress === undefined) {
      return NextResponse.json({ 
        error: 'Chapter ID and progress are required' 
      }, { status: 400 });
    }

    // 進捗を更新
    const { data, error } = await db.updateProgress(
      user.id, 
      chapterId, 
      progress, 
      timeSpent || 0
    );
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}