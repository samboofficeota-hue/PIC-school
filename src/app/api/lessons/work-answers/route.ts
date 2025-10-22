import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import type { WorkAnswer, WorkAnswerInput } from '@/types';

/**
 * GET /api/lessons/work-answers
 * ユーザーのワーク回答を取得
 * クエリパラメータ:
 *   - lesson_id: 特定の講座のワーク回答のみを取得（必須）
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

    if (!lessonId) {
      return NextResponse.json(
        { error: 'lesson_idは必須です' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('work_answers')
      .select('*')
      .eq('user_id', user.id)
      .eq('lesson_id', parseInt(lessonId))
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = レコードが見つからない
      console.error('ワーク回答取得エラー:', error);
      return NextResponse.json(
        { error: 'ワーク回答の取得に失敗しました' },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: data || null });
  } catch (error) {
    console.error('予期しないエラー:', error);
    return NextResponse.json(
      { error: '予期しないエラーが発生しました' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/lessons/work-answers
 * ワーク回答を作成または更新
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

    const body: WorkAnswerInput = await request.json();
    const { lesson_id, answers } = body;

    // バリデーション
    if (!lesson_id || !answers) {
      return NextResponse.json(
        { error: 'lesson_idとanswersは必須です' },
        { status: 400 }
      );
    }

    if (lesson_id < 1 || lesson_id > 10) {
      return NextResponse.json(
        { error: 'lesson_idは1〜10の範囲で指定してください' },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const answerData = {
      user_id: user.id,
      lesson_id,
      answers,
      submitted_at: now,
      updated_at: now,
    };

    const { data, error } = await supabase
      .from('work_answers')
      .upsert(answerData, {
        onConflict: 'user_id,lesson_id',
      })
      .select()
      .single();

    if (error) {
      console.error('ワーク回答保存エラー:', error);
      return NextResponse.json(
        { error: 'ワーク回答の保存に失敗しました' },
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
 * PUT /api/lessons/work-answers
 * ワーク回答を更新
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

    const body: WorkAnswerInput = await request.json();
    const { lesson_id, answers } = body;

    if (!lesson_id || !answers) {
      return NextResponse.json(
        { error: 'lesson_idとanswersは必須です' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('work_answers')
      .update({
        answers,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user.id)
      .eq('lesson_id', lesson_id)
      .select()
      .single();

    if (error) {
      console.error('ワーク回答更新エラー:', error);
      return NextResponse.json(
        { error: 'ワーク回答の更新に失敗しました' },
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

