'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  Home,
  Clock,
  BookOpen,
  MessageSquare,
  Newspaper,
  PenTool,
  Bot,
  ListChecks
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LESSONS, SESSION_NAMES, SESSION_TYPES, getLessonById, getSessionName, type LessonId, type SessionNumber } from '@/types';
import { redirect } from 'next/navigation';

interface SessionDetailPageProps {
  params: {
    lessonId: string;
    sessionNumber: string;
  };
}

export default function SessionDetailPage({ params }: SessionDetailPageProps) {
  const router = useRouter();
  const lessonId = parseInt(params.lessonId) as LessonId;
  const sessionNumber = parseInt(params.sessionNumber) as SessionNumber;
  
  // バリデーション
  if (
    isNaN(lessonId) || lessonId < 1 || lessonId > 10 ||
    isNaN(sessionNumber) || sessionNumber < 1 || sessionNumber > 5
  ) {
    redirect('/lessons');
  }

  const lesson = getLessonById(lessonId);
  const sessionName = getSessionName(sessionNumber);
  
  if (!lesson) {
    redirect('/lessons');
  }

  // セッションアイコンのマッピング
  const sessionIcons: Record<SessionNumber, any> = {
    1: MessageSquare,
    2: Newspaper,
    3: PenTool,
    4: Bot,
    5: ListChecks,
  };

  const SessionIcon = sessionIcons[sessionNumber];

  // セッションカラー
  const sessionColors: Record<SessionNumber, string> = {
    1: 'var(--color-session-intro)',
    2: 'var(--color-session-news)',
    3: 'var(--color-session-work)',
    4: 'var(--color-session-dialogue)',
    5: 'var(--color-session-summary)',
  };

  const sessionColor = sessionColors[sessionNumber];

  // 進捗状態
  const [isCompleted, setIsCompleted] = useState(false);

  // セッション完了処理
  const handleComplete = async () => {
    // TODO: APIで進捗を保存
    setIsCompleted(true);
    
    // 次のセッションまたは講座へ
    if (sessionNumber < 5) {
      router.push(`/lessons/${lessonId}/session/${sessionNumber + 1}`);
    } else if (lessonId < 10) {
      router.push(`/lessons/${lessonId + 1}`);
    } else {
      router.push('/lessons');
    }
  };

  // サンプルコンテンツ
  const getSessionContent = () => {
    switch (sessionNumber) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
              イントロダクション: 対話で理解する
            </h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-lg leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                このセッションでは、原丈人氏と編集者の対話形式で{lesson.title}のテーマについて学びます。
              </p>
            </div>
            <Card className="p-6">
              <h3 className="font-bold mb-3" style={{ color: 'var(--color-text-primary)' }}>
                対話内容
              </h3>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <p className="font-medium text-blue-900">編集者</p>
                  <p style={{ color: 'var(--color-text-secondary)' }}>
                    {lesson.title}について教えてください。
                  </p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <p className="font-medium text-purple-900">原丈人氏</p>
                  <p style={{ color: 'var(--color-text-secondary)' }}>
                    {lesson.description}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
              ニュース: 現実と繋げる
            </h2>
            <Card className="p-6">
              <h3 className="font-bold mb-3" style={{ color: 'var(--color-text-primary)' }}>
                最近のニュース
              </h3>
              <p style={{ color: 'var(--color-text-secondary)' }}>
                {lesson.theme}に関連する最近のニュースと、公益資本主義的な視点からの分析を学びます。
              </p>
            </Card>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
              ワーク: 手を動かす
            </h2>
            <Card className="p-6">
              <h3 className="font-bold mb-3" style={{ color: 'var(--color-text-primary)' }}>
                実践ワーク
              </h3>
              <p className="mb-4" style={{ color: 'var(--color-text-secondary)' }}>
                ここでは{lesson.theme}について、実際に手を動かして計算や分析を行います。
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block font-medium mb-2">質問1: あなたの考えを記入してください</label>
                  <textarea
                    className="w-full p-3 border rounded-lg"
                    rows={4}
                    placeholder="ここに記入..."
                  />
                </div>
                <Button>
                  回答を保存
                </Button>
              </div>
            </Card>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
              対話: 考えを深める
            </h2>
            <Card className="p-6">
              <h3 className="font-bold mb-3" style={{ color: 'var(--color-text-primary)' }}>
                AI対話
              </h3>
              <p className="mb-4" style={{ color: 'var(--color-text-secondary)' }}>
                AIキャラクターと対話しながら、{lesson.theme}についてさらに考えを深めましょう。
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  AIとの対話機能は近日実装予定です。
                </p>
              </div>
            </Card>
            <Card className="p-6">
              <h3 className="font-bold mb-3" style={{ color: 'var(--color-text-primary)' }}>
                みんなの意見広場
              </h3>
              <p style={{ color: 'var(--color-text-secondary)' }}>
                他の受講者の意見や考えを見ることができます。
              </p>
            </Card>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
              サマリー: 要点を整理
            </h2>
            <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50">
              <h3 className="font-bold mb-4 text-xl" style={{ color: 'var(--color-text-primary)' }}>
                {lesson.title} のまとめ
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                    重要ポイント
                  </h4>
                  <ul className="list-disc list-inside space-y-1" style={{ color: 'var(--color-text-secondary)' }}>
                    <li>{lesson.theme}の基本概念を理解しました</li>
                    <li>実際のニュース事例から学びました</li>
                    <li>実践的なワークを通じて体感しました</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                    次のステップ
                  </h4>
                  <p style={{ color: 'var(--color-text-secondary)' }}>
                    学んだことを日常生活や仕事で活かしてみましょう。
                  </p>
                </div>
              </div>
            </Card>
          </div>
        );

      default:
        return null;
    }
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
            <div className="flex items-center gap-4">
              <Link href={`/lessons/${lessonId}`}>
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  講座に戻る
                </Button>
              </Link>
              <div className="h-6 w-px bg-border" />
              <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                第{lessonId}回 › Session {sessionNumber}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/lessons">
                <Button variant="ghost" size="sm">
                  <BookOpen className="w-4 h-4 mr-2" />
                  カリキュラム
                </Button>
              </Link>
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <Home className="w-4 h-4 mr-2" />
                  ホーム
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container py-12">
        {/* セッションヘッダー */}
        <Card 
          className="p-8 mb-8"
          style={{ 
            background: `linear-gradient(135deg, ${sessionColor} 0%, ${sessionColor}dd 100%)`,
            color: 'white'
          }}
        >
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0 w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
              <SessionIcon className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <Badge variant="secondary" className="mb-3 bg-white/20 text-white border-white/30">
                Session {sessionNumber}/5
              </Badge>
              <h1 className="text-3xl font-bold mb-2">{sessionName}</h1>
              <p className="text-lg text-white/90">{lesson.title}</p>
              <div className="flex items-center gap-4 mt-4 text-white/80">
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  約5-10分
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* セッションコンテンツ */}
        <div className="mb-8">
          {getSessionContent()}
        </div>

        {/* 完了ボタン */}
        <Card className="p-6 bg-gradient-to-r from-green-50 to-blue-50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg mb-1" style={{ color: 'var(--color-text-primary)' }}>
                このSessionを完了しますか？
              </h3>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                完了すると次のSessionに進めます
              </p>
            </div>
            <Button
              onClick={handleComplete}
              size="lg"
              className="bg-gradient-to-r from-green-500 to-blue-500 text-white"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              完了する
            </Button>
          </div>
        </Card>

        {/* ナビゲーション */}
        <div className="flex justify-between items-center mt-8">
          <div>
            {sessionNumber > 1 ? (
              <Link href={`/lessons/${lessonId}/session/${sessionNumber - 1}`}>
                <Button variant="outline">
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  前のSession
                </Button>
              </Link>
            ) : (
              <Link href={`/lessons/${lessonId}`}>
                <Button variant="outline">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  講座ページへ
                </Button>
              </Link>
            )}
          </div>
          <div>
            {sessionNumber < 5 ? (
              <Link href={`/lessons/${lessonId}/session/${sessionNumber + 1}`}>
                <Button>
                  次のSession
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            ) : lessonId < 10 ? (
              <Link href={`/lessons/${lessonId + 1}`}>
                <Button>
                  次の講座へ
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            ) : (
              <Link href="/lessons">
                <Button>
                  カリキュラムへ
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

