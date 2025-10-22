import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

interface RouteContext {
  params: {
    id: string;
  };
}

/**
 * POST /api/community/posts/[id]/likes
 * 投稿にいいねを追加
 */
export async function POST(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      );
    }

    const postId = parseInt(params.id);

    if (isNaN(postId)) {
      return NextResponse.json(
        { error: '無効な投稿IDです' },
        { status: 400 }
      );
    }

    // 投稿が存在するか確認
    const { data: post, error: postError } = await supabase
      .from('community_posts')
      .select('id')
      .eq('id', postId)
      .single();

    if (postError || !post) {
      return NextResponse.json(
        { error: '投稿が見つかりません' },
        { status: 404 }
      );
    }

    // いいねを追加（既に存在する場合はエラーになる）
    const { data, error } = await supabase
      .from('likes')
      .insert({
        user_id: user.id,
        post_id: postId,
        liked_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      // ユニーク制約違反の場合
      if (error.code === '23505') {
        return NextResponse.json(
          { error: '既にいいね済みです' },
          { status: 400 }
        );
      }
      console.error('いいね追加エラー:', error);
      return NextResponse.json(
        { error: 'いいねの追加に失敗しました' },
        { status: 500 }
      );
    }

    // トリガーによりlikes_countは自動更新される
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
 * DELETE /api/community/posts/[id]/likes
 * 投稿からいいねを削除
 */
export async function DELETE(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      );
    }

    const postId = parseInt(params.id);

    if (isNaN(postId)) {
      return NextResponse.json(
        { error: '無効な投稿IDです' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('likes')
      .delete()
      .eq('user_id', user.id)
      .eq('post_id', postId);

    if (error) {
      console.error('いいね削除エラー:', error);
      return NextResponse.json(
        { error: 'いいねの削除に失敗しました' },
        { status: 500 }
      );
    }

    // トリガーによりlikes_countは自動更新される
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('予期しないエラー:', error);
    return NextResponse.json(
      { error: '予期しないエラーが発生しました' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/community/posts/[id]/likes
 * 投稿のいいね一覧を取得
 */
export async function GET(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const supabase = createClient();
    const postId = parseInt(params.id);

    if (isNaN(postId)) {
      return NextResponse.json(
        { error: '無効な投稿IDです' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('likes')
      .select(`
        *,
        user_profiles (
          display_name,
          user_type
        )
      `)
      .eq('post_id', postId)
      .order('liked_at', { ascending: false });

    if (error) {
      console.error('いいね一覧取得エラー:', error);
      return NextResponse.json(
        { error: 'いいね一覧の取得に失敗しました' },
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

