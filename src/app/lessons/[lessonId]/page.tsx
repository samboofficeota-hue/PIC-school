import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  BookOpen,
  Clock,
  CheckCircle,
  Play,
  Lock,
  ArrowLeft,
  ChevronRight,
  MessageSquare,
  FileText,
  PenTool,
  Bot,
  ListChecks,
  Newspaper
} from 'lucide-react';
import Link from 'next/link';
import { LESSONS, SESSION_NAMES, SESSION_TYPES, getLessonById, type LessonId, type SessionNumber } from '@/types';
import { redirect } from 'next/navigation';

interface LessonDetailPageProps {
  params: {
    lessonId: string;
  };
}

export default function LessonDetailPage({ params }: LessonDetailPageProps) {
  const lessonId = parseInt(params.lessonId) as LessonId;
  
  // 講座IDのバリデーション
  if (isNaN(lessonId) || lessonId < 1 || lessonId > 10) {
    redirect('/lessons');
  }

  const lesson = getLessonById(lessonId);
  
  if (!lesson) {
    redirect('/lessons');
  }

  // セッションアイコンのマッピング
  const sessionIcons = {
    1: MessageSquare,  // イントロ
    2: Newspaper,      // ニュース
    3: PenTool,        // ワーク
    4: Bot,            // 対話
    5: ListChecks,     // サマリー
  };

  // セッション説明
  const sessionDescriptions = {
    1: '原丈人氏と編集者の対話形式で、テーマの核心に迫ります。',
    2: '直近のニュースから、テーマに関連する事例をピックアップして解説します。',
    3: 'インタラクティブなテンプレートを使って、実際に手を動かして学びます。',
    4: 'AIキャラクターとの対話を通じて、あなたの考えをさらに深めます。',
    5: 'その回の論点と学びをコンパクトにまとめます。',
  };

  // セッション所要時間
  const sessionDurations = {
    1: '約5分',
    2: '約7分',
    3: '約10分',
    4: '約5分',
    5: '約3分',
  };

  // セッションカラー
  const sessionColors = {
    1: 'var(--color-session-intro)',
    2: 'var(--color-session-news)',
    3: 'var(--color-session-work)',
    4: 'var(--color-session-dialogue)',
    5: 'var(--color-session-summary)',
  };

  // TODO: 実際のAPIから取得
  // const { progress } = useLessonProgress(lessonId);
  const mockProgress = {
    completed: 0,
    total: 5,
    percentage: 0,
  };

  const sessions = [1, 2, 3, 4, 5].map((num) => {
    const sessionNumber = num as SessionNumber;
    const Icon = sessionIcons[sessionNumber];
    
    return {
      number: sessionNumber,
      title: SESSION_NAMES[sessionNumber],
      description: sessionDescriptions[sessionNumber],
      duration: sessionDurations[sessionNumber],
      type: SESSION_TYPES[sessionNumber],
      icon: Icon,
      color: sessionColors[sessionNumber],
      isCompleted: false, // TODO: 実際の進捗から取得
      isLocked: num > 1 && !false, // TODO: 前のセッションが完了していない場合はロック
    };
  });

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
            <Link href="/lessons">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                カリキュラムに戻る
              </Button>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  ホーム
                </Button>
              </Link>
              <Link href="/mypage">
                <Button variant="outline" size="sm">
                  マイページ
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container py-12">
        {/* 講座ヘッダー */}
        <Card 
          className="p-8 mb-8"
          style={{ 
            background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
            color: 'white'
          }}
        >
          <div className="flex items-start gap-6">
            <div
              className="flex-shrink-0 w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold bg-white shadow-lg"
              style={{ color: 'var(--color-primary)' }}
            >
              {lesson.id}
            </div>
            <div className="flex-1">
              <Badge variant="secondary" className="mb-3 bg-white/20 text-white border-white/30">
                第{lesson.id}回
              </Badge>
              <h1 className="text-4xl font-bold mb-3">{lesson.title}</h1>
              <p className="text-xl mb-4 text-white/90">{lesson.description}</p>
              <div className="flex items-center gap-6 text-white/80">
                <span className="flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  約30分
                </span>
                <span className="flex items-center">
                  <BookOpen className="w-5 h-5 mr-2" />
                  5 Sessions
                </span>
                <span className="flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  テーマ: {lesson.theme}
                </span>
              </div>
            </div>
          </div>

          {/* 進捗バー */}
          <div className="mt-6 bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex justify-between text-sm mb-2">
              <span>学習進捗</span>
              <span className="font-medium">{mockProgress.percentage}%</span>
            </div>
            <Progress value={mockProgress.percentage} className="h-2 bg-white/20" />
            <div className="text-sm mt-2 text-white/80">
              {mockProgress.completed}/{mockProgress.total} Sessions 完了
            </div>
          </div>
        </Card>

        {/* セッションリスト */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--color-text-primary)' }}>
            学習コンテンツ
          </h2>

          {sessions.map((session) => {
            const Icon = session.icon;
            
            return (
              <Card
                key={session.number}
                className={`p-6 transition-all ${
                  session.isLocked 
                    ? 'opacity-60' 
                    : 'hover:shadow-lg cursor-pointer'
                }`}
                style={{
                  borderLeft: `4px solid ${session.color}`,
                  backgroundColor: 'var(--color-white)'
                }}
              >
                <div className="flex items-start gap-6">
                  {/* セッション番号 */}
                  <div
                    className="flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold text-white shadow-md"
                    style={{ backgroundColor: session.color }}
                  >
                    {session.isLocked ? (
                      <Lock className="w-6 h-6" />
                    ) : session.isCompleted ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      session.number
                    )}
                  </div>

                  {/* セッション情報 */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 
                            className="text-xl font-bold"
                            style={{ color: 'var(--color-text-primary)' }}
                          >
                            Session {session.number}: {session.title}
                          </h3>
                          {session.isCompleted && (
                            <Badge className="bg-green-100 text-green-800">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              完了
                            </Badge>
                          )}
                        </div>
                        <p 
                          className="text-base mb-3"
                          style={{ color: 'var(--color-text-secondary)' }}
                        >
                          {session.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm" style={{ color: 'var(--color-text-light)' }}>
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {session.duration}
                          </span>
                          <span className="flex items-center">
                            <Icon className="w-4 h-4 mr-1" />
                            {session.type}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* アクションボタン */}
                    {session.isLocked ? (
                      <Button disabled variant="outline" size="sm">
                        <Lock className="w-4 h-4 mr-2" />
                        前のSessionを完了してください
                      </Button>
                    ) : (
                      <Link href={`/lessons/${lessonId}/session/${session.number}`}>
                        <Button 
                          size="sm"
                          style={{
                            background: `linear-gradient(135deg, ${session.color} 0%, ${session.color}dd 100%)`,
                            color: 'white'
                          }}
                        >
                          {session.isCompleted ? (
                            <>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              復習する
                            </>
                          ) : (
                            <>
                              <Play className="w-4 h-4 mr-2" />
                              開始する
                            </>
                          )}
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* 学習のヒント */}
        <Card className="mt-8 p-6" style={{ backgroundColor: 'var(--color-primary-pale)' }}>
          <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--color-text-primary)' }}>
            💡 学習のヒント
          </h3>
          <ul className="space-y-2" style={{ color: 'var(--color-text-secondary)' }}>
            <li>• 各Sessionは順番に学習することをおすすめします</li>
            <li>• ワーク（Session 3）では実際に手を動かして計算してみましょう</li>
            <li>• 対話（Session 4）では、自分の考えを深く掘り下げてみましょう</li>
            <li>• サマリー（Session 5）で学んだことを振り返りましょう</li>
          </ul>
        </Card>

        {/* ナビゲーション */}
        <div className="flex justify-between items-center mt-8">
          <Link href="/lessons">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              カリキュラムに戻る
            </Button>
          </Link>
          {lessonId < 10 && (
            <Link href={`/lessons/${lessonId + 1}`}>
              <Button variant="outline">
                次の講座へ
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

