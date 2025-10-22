import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import type { CommunityPost, CommunityPostInput } from '@/types';

/**
 * GET /api/community/posts
 * コミュニティ投稿を取得
 * クエリパラメータ:
 *   - lesson_id: 特定の講座の投稿のみを取得（オプション）
 *   - is_public: 公開投稿のみ取得（デフォルト: true）
 *   - limit: 取得件数制限（デフォルト: 20）
 *   - offset: オフセット（デフォルト: 0）
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    
    const { searchParams } = new URL(request.url);
    const lessonId = searchParams.get('lesson_id');
    const isPublic = searchParams.get('is_public') !== 'false';
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = supabase
      .from('community_posts')
      .select(`
        *,
        user_profiles (
          display_name,
          user_type
        )
      `)
      .order('posted_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (lessonId) {
      query = query.eq('lesson_id', parseInt(lessonId));
    }

    if (isPublic) {
      query = query.eq('is_public', true);
    }

    const { data, error } = await query;

    if (error) {
      console.error('コミュニティ投稿取得エラー:', error);
      return NextResponse.json(
        { error: 'コミュニティ投稿の取得に失敗しました' },
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
 * POST /api/community/posts
 * コミュニティ投稿を作成
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

    const body: CommunityPostInput = await request.json();
    const { lesson_id, content, is_public = true } = body;

    // バリデーション
    if (!lesson_id || !content) {
      return NextResponse.json(
        { error: 'lesson_idとcontentは必須です' },
        { status: 400 }
      );
    }

    if (lesson_id < 1 || lesson_id > 10) {
      return NextResponse.json(
        { error: 'lesson_idは1〜10の範囲で指定してください' },
        { status: 400 }
      );
    }

    if (content.length < 10) {
      return NextResponse.json(
        { error: '投稿内容は10文字以上である必要があります' },
        { status: 400 }
      );
    }

    if (content.length > 1000) {
      return NextResponse.json(
        { error: '投稿内容は1000文字以内である必要があります' },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const postData = {
      user_id: user.id,
      lesson_id,
      content,
      is_public,
      likes_count: 0,
      posted_at: now,
      updated_at: now,
      created_at: now,
    };

    const { data, error } = await supabase
      .from('community_posts')
      .insert(postData)
      .select()
      .single();

    if (error) {
      console.error('コミュニティ投稿作成エラー:', error);
      return NextResponse.json(
        { error: 'コミュニティ投稿の作成に失敗しました' },
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
 * PUT /api/community/posts
 * コミュニティ投稿を更新
 * Body: { post_id, content?, is_public? }
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

    const body: { post_id: number; content?: string; is_public?: boolean } = await request.json();
    const { post_id, content, is_public } = body;

    if (!post_id) {
      return NextResponse.json(
        { error: 'post_idは必須です' },
        { status: 400 }
      );
    }

    const updates: any = {
      updated_at: new Date().toISOString(),
    };

    if (content !== undefined) {
      if (content.length < 10 || content.length > 1000) {
        return NextResponse.json(
          { error: '投稿内容は10〜1000文字である必要があります' },
          { status: 400 }
        );
      }
      updates.content = content;
    }

    if (is_public !== undefined) {
      updates.is_public = is_public;
    }

    const { data, error } = await supabase
      .from('community_posts')
      .update(updates)
      .eq('id', post_id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('コミュニティ投稿更新エラー:', error);
      return NextResponse.json(
        { error: 'コミュニティ投稿の更新に失敗しました' },
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
 * DELETE /api/community/posts
 * コミュニティ投稿を削除
 * Body: { post_id }
 */
export async function DELETE(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      );
    }

    const body: { post_id: number } = await request.json();
    const { post_id } = body;

    if (!post_id) {
      return NextResponse.json(
        { error: 'post_idは必須です' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('community_posts')
      .delete()
      .eq('id', post_id)
      .eq('user_id', user.id);

    if (error) {
      console.error('コミュニティ投稿削除エラー:', error);
      return NextResponse.json(
        { error: 'コミュニティ投稿の削除に失敗しました' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('予期しないエラー:', error);
    return NextResponse.json(
      { error: '予期しないエラーが発生しました' },
      { status: 500 }
    );
  }
}

