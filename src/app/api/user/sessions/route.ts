import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { db } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    
    // 認証チェック
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { chapterId } = body;

    if (!chapterId) {
      return NextResponse.json({ 
        error: 'Chapter ID is required' 
      }, { status: 400 });
    }

    // 学習セッション開始
    const { data, error } = await db.createLearningSession(user.id, chapterId);
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    
    // 認証チェック
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { sessionId, progressBefore, progressAfter } = body;

    if (!sessionId || progressBefore === undefined || progressAfter === undefined) {
      return NextResponse.json({ 
        error: 'Session ID, progress before, and progress after are required' 
      }, { status: 400 });
    }

    // 学習セッション終了
    const { data, error } = await db.endLearningSession(
      sessionId, 
      progressBefore, 
      progressAfter
    );
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
