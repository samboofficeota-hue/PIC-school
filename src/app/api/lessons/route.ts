import { NextRequest, NextResponse } from 'next/server';
import { LESSONS, type LessonMetadata } from '@/types';

/**
 * GET /api/lessons
 * 講座一覧とメタデータを取得
 * クエリパラメータ:
 *   - id: 特定の講座のみを取得（オプション）
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lessonId = searchParams.get('id');

    if (lessonId) {
      const id = parseInt(lessonId);
      if (isNaN(id) || id < 1 || id > 10) {
        return NextResponse.json(
          { error: '無効な講座IDです（1〜10の範囲で指定してください）' },
          { status: 400 }
        );
      }

      const lesson = LESSONS.find(l => l.id === id);
      if (!lesson) {
        return NextResponse.json(
          { error: '講座が見つかりません' },
          { status: 404 }
        );
      }

      return NextResponse.json({ data: lesson });
    }

    // 全講座を返す
    return NextResponse.json({ data: LESSONS });
  } catch (error) {
    console.error('予期しないエラー:', error);
    return NextResponse.json(
      { error: '予期しないエラーが発生しました' },
      { status: 500 }
    );
  }
}

