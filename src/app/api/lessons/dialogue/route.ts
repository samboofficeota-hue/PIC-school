import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import type { DialogueHistory, DialogueHistoryInput } from '@/types';

/**
 * GET /api/lessons/dialogue
 * ユーザーの対話履歴を取得
 * クエリパラメータ:
 *   - lesson_id: 特定の講座の対話履歴のみを取得（オプション）
 *   - limit: 取得件数制限（デフォルト: 50）
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
    const limit = parseInt(searchParams.get('limit') || '50');

    let query = supabase
      .from('dialogue_history')
      .select('*')
      .eq('user_id', user.id)
      .order('submitted_at', { ascending: false })
      .limit(limit);

    if (lessonId) {
      query = query.eq('lesson_id', parseInt(lessonId));
    }

    const { data, error } = await query;

    if (error) {
      console.error('対話履歴取得エラー:', error);
      return NextResponse.json(
        { error: '対話履歴の取得に失敗しました' },
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
 * POST /api/lessons/dialogue
 * 対話履歴を作成
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

    const body: DialogueHistoryInput = await request.json();
    const { lesson_id, user_input, ai_response, prompt_theme } = body;

    // バリデーション
    if (!lesson_id || !user_input || !ai_response) {
      return NextResponse.json(
        { error: 'lesson_id, user_input, ai_responseは必須です' },
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
    const dialogueData = {
      user_id: user.id,
      lesson_id,
      user_input,
      ai_response,
      prompt_theme: prompt_theme || null,
      submitted_at: now,
      created_at: now,
    };

    const { data, error } = await supabase
      .from('dialogue_history')
      .insert(dialogueData)
      .select()
      .single();

    if (error) {
      console.error('対話履歴保存エラー:', error);
      return NextResponse.json(
        { error: '対話履歴の保存に失敗しました' },
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

