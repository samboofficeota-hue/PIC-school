import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import type { LessonProgressStats } from '@/types';

/**
 * GET /api/lessons/stats
 * ユーザーの講座別進捗統計を取得
 * クエリパラメータ:
 *   - lesson_id: 特定の講座の統計のみを取得（オプション）
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

    // 進捗データを取得
    let query = supabase
      .from('lesson_progress')
      .select('*')
      .eq('user_id', user.id);

    if (lessonId) {
      query = query.eq('lesson_id', parseInt(lessonId));
    }

    const { data: progressData, error } = await query;

    if (error) {
      console.error('進捗統計取得エラー:', error);
      return NextResponse.json(
        { error: '進捗統計の取得に失敗しました' },
        { status: 500 }
      );
    }

    // 講座ごとに統計を集計
    const statsByLesson: Record<number, LessonProgressStats> = {};

    progressData?.forEach(progress => {
      const lessonId = progress.lesson_id;
      
      if (!statsByLesson[lessonId]) {
        statsByLesson[lessonId] = {
          lesson_id: lessonId,
          total_sessions: 5, // 各講座は5セッション固定
          completed_sessions: 0,
          progress_percentage: 0,
          total_time_spent_seconds: 0,
        };
      }

      if (progress.status === 'completed') {
        statsByLesson[lessonId].completed_sessions += 1;
      }

      statsByLesson[lessonId].total_time_spent_seconds += progress.time_spent_seconds || 0;
    });

    // 進捗率を計算
    Object.keys(statsByLesson).forEach(lessonIdKey => {
      const lessonId = parseInt(lessonIdKey);
      const stats = statsByLesson[lessonId];
      stats.progress_percentage = Math.round(
        (stats.completed_sessions / stats.total_sessions) * 100
      );
    });

    // 配列に変換
    const statsArray = Object.values(statsByLesson).sort((a, b) => a.lesson_id - b.lesson_id);

    // 全体統計も計算
    const overallStats = {
      total_lessons: 10,
      completed_lessons: statsArray.filter(s => s.completed_sessions === 5).length,
      in_progress_lessons: statsArray.filter(s => s.completed_sessions > 0 && s.completed_sessions < 5).length,
      total_sessions_completed: statsArray.reduce((sum, s) => sum + s.completed_sessions, 0),
      total_time_spent_seconds: statsArray.reduce((sum, s) => sum + s.total_time_spent_seconds, 0),
      overall_progress_percentage: Math.round(
        (statsArray.reduce((sum, s) => sum + s.completed_sessions, 0) / (10 * 5)) * 100
      ),
    };

    return NextResponse.json({
      data: {
        by_lesson: statsArray,
        overall: overallStats,
      },
    });
  } catch (error) {
    console.error('予期しないエラー:', error);
    return NextResponse.json(
      { error: '予期しないエラーが発生しました' },
      { status: 500 }
    );
  }
}

