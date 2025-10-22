'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { useLessonStats } from '@/lib/hooks/useLessons';
import {
  BookOpen,
  Clock,
  CheckCircle,
  Play,
  Lock,
  ArrowRight,
  Target,
  Award,
  TrendingUp,
  Calendar,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { LESSONS, type LessonId } from '@/types';

export default function CurriculumPage() {
  const { user } = useAuth();
  const { stats, loading } = useLessonStats();
  const [hoveredLesson, setHoveredLesson] = useState<number | null>(null);

  // 講座ごとの進捗を取得
  const getLessonProgress = (lessonId: LessonId) => {
    if (!stats?.by_lesson) return { progress: 0, completed: 0, total: 5 };
    const lessonStat = stats.by_lesson.find((s: any) => s.lesson_id === lessonId);
    return {
      progress: lessonStat?.progress_percentage || 0,
      completed: lessonStat?.completed_sessions || 0,
      total: 5,
    };
  };

  // 講座のロック状態を判定
  const isLessonLocked = (lessonId: LessonId) => {
    if (!user) return true;
    if (lessonId === 1) return false; // 第1回は常に解放
    
    // 前の講座が完了していない場合はロック
    const prevLessonProgress = getLessonProgress((lessonId - 1) as LessonId);
    return prevLessonProgress.completed < 5;
  };

  // 講座のステータスバッジを取得
  const getLessonStatusBadge = (lessonId: LessonId) => {
    const progress = getLessonProgress(lessonId);
    
    if (progress.completed === 5) {
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200">
          <CheckCircle className="w-3 h-3 mr-1" />
          完了
        </Badge>
      );
    } else if (progress.completed > 0) {
      return (
        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
          <Play className="w-3 h-3 mr-1" />
          学習中
        </Badge>
      );
    } else if (isLessonLocked(lessonId)) {
      return (
        <Badge className="bg-gray-100 text-gray-600 border-gray-200">
          <Lock className="w-3 h-3 mr-1" />
          ロック中
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-purple-100 text-purple-800 border-purple-200">
          開始可能
        </Badge>
      );
    }
  };

  // 全体進捗情報
  const overallProgress = stats?.overall || {
    completed_lessons: 0,
    in_progress_lessons: 0,
    total_sessions_completed: 0,
    overall_progress_percentage: 0,
    total_time_spent_seconds: 0,
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
      {/* ヘッダー */}
      <header 
        className="sticky top-0 z-50"
        style={{ 
          background: 'linear-gradient(135deg, var(--color-primary-light) 0%, var(--color-secondary-light) 100%)',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div className="container">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center space-x-2">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                style={{ background: 'var(--gradient-primary)' }}
              >
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
                公益資本主義アカデミー
              </span>
            </Link>
            
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  ホーム
                </Button>
              </Link>
              {user && (
                <Link href="/mypage">
                  <Button variant="outline" size="sm">
                    マイページ
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container py-12">
        {/* タイトルセクション */}
        <div className="text-center mb-12">
          <Badge 
            variant="secondary" 
            className="mb-4"
            style={{ 
              background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
              color: 'white',
              border: 'none'
            }}
          >
            <Sparkles className="w-3 h-3 mr-1" />
            全10回の学習プログラム
          </Badge>
          <h1 
            className="text-4xl font-bold mb-4"
            style={{ color: 'var(--color-text-primary)' }}
          >
            カリキュラム
          </h1>
          <p 
            className="text-lg max-w-2xl mx-auto"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            公益資本主義の概念から実践まで、3ヶ月間で体系的に学びます。<br />
            各講座は5つのSessionで構成されており、約30分で完了します。
          </p>
        </div>

        {/* 進捗サマリー（ログインユーザーのみ） */}
        {user && (
          <Card 
            className="p-6 mb-12"
            style={{ 
              background: 'linear-gradient(135deg, var(--color-white) 0%, var(--color-background) 100%)',
              border: '2px solid var(--color-primary-light)'
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
                  あなたの学習進捗
                </h2>
                <p style={{ color: 'var(--color-text-secondary)' }}>
                  継続的な学習で理解を深めましょう
                </p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold" style={{ color: 'var(--color-primary)' }}>
                  {overallProgress.overall_progress_percentage}%
                </div>
                <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  全体進捗
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <CheckCircle className="w-5 h-5 mr-2" style={{ color: 'var(--color-success)' }} />
                  <span className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
                    {overallProgress.completed_lessons}
                  </span>
                </div>
                <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  完了講座
                </div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Play className="w-5 h-5 mr-2" style={{ color: 'var(--color-primary)' }} />
                  <span className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
                    {overallProgress.in_progress_lessons}
                  </span>
                </div>
                <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  学習中
                </div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Target className="w-5 h-5 mr-2" style={{ color: 'var(--color-accent)' }} />
                  <span className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
                    {overallProgress.total_sessions_completed}/50
                  </span>
                </div>
                <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  Session完了
                </div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Clock className="w-5 h-5 mr-2" style={{ color: 'var(--color-secondary)' }} />
                  <span className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
                    {Math.floor(overallProgress.total_time_spent_seconds / 60)}
                  </span>
                </div>
                <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  学習時間（分）
                </div>
              </div>
            </div>

            <Progress value={overallProgress.overall_progress_percentage} className="h-3" />
          </Card>
        )}

        {/* 講座リスト */}
        <div className="space-y-6">
          {LESSONS.map((lesson) => {
            const progress = getLessonProgress(lesson.id);
            const isLocked = isLessonLocked(lesson.id);
            const isHovered = hoveredLesson === lesson.id;

            return (
              <Card
                key={lesson.id}
                className={`p-6 transition-all duration-300 ${
                  isLocked ? 'opacity-60' : 'hover:shadow-xl cursor-pointer'
                }`}
                style={{
                  backgroundColor: isHovered && !isLocked ? 'var(--color-primary-pale)' : 'var(--color-white)',
                  border: `2px solid ${isHovered && !isLocked ? 'var(--color-primary)' : 'var(--color-border)'}`
                }}
                onMouseEnter={() => !isLocked && setHoveredLesson(lesson.id)}
                onMouseLeave={() => setHoveredLesson(null)}
              >
                <div className="flex items-start gap-6">
                  {/* 講座番号 */}
                  <div
                    className="flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg"
                    style={{
                      background: isLocked 
                        ? 'var(--color-text-light)'
                        : `linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)`
                    }}
                  >
                    {isLocked ? <Lock className="w-8 h-8" /> : lesson.id}
                  </div>

                  {/* 講座情報 */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 
                            className="text-2xl font-bold"
                            style={{ color: 'var(--color-text-primary)' }}
                          >
                            {lesson.title}
                          </h3>
                          {getLessonStatusBadge(lesson.id)}
                        </div>
                        <p 
                          className="text-base mb-3"
                          style={{ color: 'var(--color-text-secondary)' }}
                        >
                          {lesson.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm" style={{ color: 'var(--color-text-light)' }}>
                          <span className="flex items-center">
                            <Target className="w-4 h-4 mr-1" />
                            テーマ: {lesson.theme}
                          </span>
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            約30分
                          </span>
                          <span className="flex items-center">
                            <BookOpen className="w-4 h-4 mr-1" />
                            5 Sessions
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 進捗バー（ログインユーザーのみ） */}
                    {user && (
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span style={{ color: 'var(--color-text-secondary)' }}>
                            進捗: {progress.completed}/5 Sessions
                          </span>
                          <span 
                            className="font-medium"
                            style={{ color: 'var(--color-primary)' }}
                          >
                            {progress.progress}%
                          </span>
                        </div>
                        <Progress value={progress.progress} className="h-2" />
                      </div>
                    )}

                    {/* アクションボタン */}
                    <div className="flex items-center gap-3">
                      {isLocked ? (
                        <Button 
                          disabled 
                          variant="outline"
                          className="flex items-center gap-2"
                        >
                          <Lock className="w-4 h-4" />
                          前の講座を完了してください
                        </Button>
                      ) : (
                        <Link href={`/lessons/${lesson.id}`}>
                          <Button
                            className="flex items-center gap-2"
                            style={{
                              background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)',
                              color: 'white'
                            }}
                          >
                            {progress.completed > 0 ? (
                              <>
                                <Play className="w-4 h-4" />
                                続きから学習
                              </>
                            ) : (
                              <>
                                <BookOpen className="w-4 h-4" />
                                学習を開始
                              </>
                            )}
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* フッター */}
        <div className="text-center mt-12 p-8">
          <p style={{ color: 'var(--color-text-secondary)' }}>
            すべての講座を完了すると、修了証を取得できます
          </p>
        </div>
      </div>
    </div>
  );
}

