import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import type { LessonProgress, LessonProgressInput } from '@/types';

/**
 * GET /api/lessons/progress
 * ユーザーの全講座の進捗を取得
 * クエリパラメータ:
 *   - lesson_id: 特定の講座の進捗のみを取得（オプション）
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const lessonId = searchParams.get('lesson_id');

    let query = supabase
      .from('lesson_progress')
      .select('*')
      .eq('user_id', user.id)
      .order('lesson_id', { ascending: true })
      .order('session_number', { ascending: true });

    if (lessonId) {
      query = query.eq('lesson_id', parseInt(lessonId));
    }

    const { data, error } = await query;

    if (error) {
      console.error('講座進捗取得エラー:', error);
      return NextResponse.json(
        { error: '講座進捗の取得に失敗しました' },
        { status: 500 }
      );
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('予期しないエラー:', error);
    return NextResponse.json(
      { error: '予期しないエラーが発生しました' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/lessons/progress
 * 講座の進捗を作成または更新
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      );
    }

    const body: LessonProgressInput = await request.json();
    const { lesson_id, session_number, status, time_spent_seconds } = body;

    // バリデーション
    if (!lesson_id || !session_number || !status) {
      return NextResponse.json(
        { error: 'lesson_id, session_number, statusは必須です' },
        { status: 400 }
      );
    }

    if (lesson_id < 1 || lesson_id > 10) {
      return NextResponse.json(
        { error: 'lesson_idは1〜10の範囲で指定してください' },
        { status: 400 }
      );
    }

    if (session_number < 1 || session_number > 5) {
      return NextResponse.json(
        { error: 'session_numberは1〜5の範囲で指定してください' },
        { status: 400 }
      );
    }

    // 進捗を更新または作成
    const now = new Date().toISOString();
    const progressData: any = {
      user_id: user.id,
      lesson_id,
      session_number,
      status,
      updated_at: now,
    };

    if (status === 'in_progress' && !progressData.started_at) {
      progressData.started_at = now;
    }

    if (status === 'completed') {
      progressData.completed_at = now;
    }

    if (time_spent_seconds !== undefined) {
      progressData.time_spent_seconds = time_spent_seconds;
    }

    const { data, error } = await supabase
      .from('lesson_progress')
      .upsert(progressData, {
        onConflict: 'user_id,lesson_id,session_number',
      })
      .select()
      .single();

    if (error) {
      console.error('講座進捗保存エラー:', error);
      return NextResponse.json(
        { error: '講座進捗の保存に失敗しました' },
        { status: 500 }
      );
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('予期しないエラー:', error);
    return NextResponse.json(
      { error: '予期しないエラーが発生しました' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/lessons/progress
 * 講座の進捗を更新（既存レコードの更新）
 */
export async function PUT(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      );
    }

    const body: Partial<LessonProgress> & { lesson_id: number; session_number: number } = await request.json();
    const { lesson_id, session_number, ...updates } = body;

    if (!lesson_id || !session_number) {
      return NextResponse.json(
        { error: 'lesson_idとsession_numberは必須です' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('lesson_progress')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user.id)
      .eq('lesson_id', lesson_id)
      .eq('session_number', session_number)
      .select()
      .single();

    if (error) {
      console.error('講座進捗更新エラー:', error);
      return NextResponse.json(
        { error: '講座進捗の更新に失敗しました' },
        { status: 500 }
      );
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('予期しないエラー:', error);
    return NextResponse.json(
      { error: '予期しないエラーが発生しました' },
      { status: 500 }
    );
  }
}

