'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import {
  BookOpen,
  Clock,
  Layers,
  ArrowLeft,
  ArrowRight,
  LogIn,
  LogOut,
  Home,
  ChevronRight,
  MessageSquare,
  Newspaper,
  PenTool,
  Bot,
  ClipboardList,
  Check
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function LessonPage() {
  const { lessonId } = useParams();
  const { user, signOut, loading } = useAuth();
  const [currentSession, setCurrentSession] = useState(1);

  const handleSignOut = async () => {
    await signOut();
  };

  // ハイドレーションエラーを防ぐため、ローディング中は何も表示しない
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FFF8F0' }}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: 'var(--color-primary)' }}></div>
      </div>
    );
  }

  const lessonData = {
    1: {
      title: '公益資本主義とは何か',
      subtitle: '基本の理解',
      description: '公益資本主義の基本概念を理解します。なぜ今、公益資本主義が必要なのか？従来の資本主義との違いは何か？原丈人氏の対話を通じて、その本質に迫ります。',
      duration: '約30分',
      sessions: 5
    }
  };

  const lessonIdStr = Array.isArray(lessonId) ? lessonId[0] : lessonId;
  const lessonIdNum = parseInt(lessonIdStr, 10);
  const lesson = lessonData[lessonIdNum as keyof typeof lessonData] || lessonData[1];

  const sessions = [
    {
      id: 1,
      title: 'イントロ',
      description: '原丈人氏と編集者の対話形式で、公益資本主義の基本概念を理解します。',
      icon: MessageSquare,
      color: '#FFB6C1'
    },
    {
      id: 2,
      title: 'ニュース',
      description: '直近のニュースから、公益資本主義的な視点で社会を読み解きます。',
      icon: Newspaper,
      color: '#FFD4A3'
    },
    {
      id: 3,
      title: 'ワーク',
      description: '実践的なワークで、理論を体感的に学びます。',
      icon: PenTool,
      color: '#A8E6A3'
    },
    {
      id: 4,
      title: '対話',
      description: 'AIキャラクターとの対話を通じて、考えを深めます。',
      icon: Bot,
      color: '#A8D5F5'
    },
    {
      id: 5,
      title: 'サマリー',
      description: 'この回の論点と学びをまとめます。',
      icon: ClipboardList,
      color: '#D4B5F2'
    }
  ];

  const showSession = (sessionNumber: number) => {
    setCurrentSession(sessionNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const nextSession = () => {
    if (currentSession < 5) {
      setCurrentSession(currentSession + 1);
    }
  };

  const prevSession = () => {
    if (currentSession > 1) {
      setCurrentSession(currentSession - 1);
    }
  };

  const renderSessionContent = (sessionId: number) => {
    switch (sessionId) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="space-y-6">
                {/* メッセージ1 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-15 h-15 rounded-full flex items-center justify-center font-bold text-lg shadow-md" style={{ background: 'linear-gradient(135deg, var(--color-secondary) 0%, var(--color-secondary-dark) 100%)', color: 'var(--color-white)' }}>
                    編
                  </div>
                  <div className="flex-grow">
                    <div className="font-bold text-base mb-1" style={{ color: 'var(--color-text-primary)' }}>
                      編集者
                      <span className="text-sm font-normal ml-2" style={{ color: 'var(--color-text-light)' }}>ファシリテーター</span>
                    </div>
                    <div className="p-4 rounded-lg" style={{ background: 'linear-gradient(135deg, var(--color-secondary-pale) 0%, rgba(255,255,255,0.5) 100%)', color: 'var(--color-text-secondary)' }}>
                      原さん、今日は「公益資本主義」について教えていただけますか？最近よく耳にする言葉ですが、具体的にどういう概念なのでしょうか？
                    </div>
                  </div>
                </div>

                {/* メッセージ2 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-15 h-15 rounded-full flex items-center justify-center font-bold text-lg shadow-md" style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)', color: 'var(--color-white)' }}>
                    原
                  </div>
                  <div className="flex-grow">
                    <div className="font-bold text-base mb-1" style={{ color: 'var(--color-text-primary)' }}>
                      原丈人
                      <span className="text-sm font-normal ml-2" style={{ color: 'var(--color-text-light)' }}>公益資本主義提唱者</span>
                    </div>
                    <div className="p-4 rounded-lg" style={{ background: 'linear-gradient(135deg, var(--color-primary-pale) 0%, rgba(255,255,255,0.5) 100%)', color: 'var(--color-text-secondary)' }}>
                      はい。公益資本主義とは、簡単に言うと「企業が社会全体の利益を考えながら事業を行う」という考え方です。従来の株主至上主義とは異なり、従業員、顧客、取引先、そして社会全体のステークホルダーの利益をバランスよく考える経営哲学なんです。
                    </div>
                  </div>
                </div>

                {/* メッセージ3 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-15 h-15 rounded-full flex items-center justify-center font-bold text-lg shadow-md" style={{ background: 'linear-gradient(135deg, var(--color-secondary) 0%, var(--color-secondary-dark) 100%)', color: 'var(--color-white)' }}>
                    編
                  </div>
                  <div className="flex-grow">
                    <div className="font-bold text-base mb-1" style={{ color: 'var(--color-text-primary)' }}>
                      編集者
                    </div>
                    <div className="p-4 rounded-lg" style={{ background: 'linear-gradient(135deg, var(--color-secondary-pale) 0%, rgba(255,255,255,0.5) 100%)', color: 'var(--color-text-secondary)' }}>
                      なるほど。でも、企業は利益を追求するのが当たり前ですよね？公益と利益は矛盾しないんでしょうか？
                    </div>
                  </div>
                </div>

                {/* メッセージ4 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-15 h-15 rounded-full flex items-center justify-center font-bold text-lg shadow-md" style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)', color: 'var(--color-white)' }}>
                    原
                  </div>
                  <div className="flex-grow">
                    <div className="font-bold text-base mb-1" style={{ color: 'var(--color-text-primary)' }}>
                      原丈人
                    </div>
                    <div className="p-4 rounded-lg" style={{ background: 'linear-gradient(135deg, var(--color-primary-pale) 0%, rgba(255,255,255,0.5) 100%)', color: 'var(--color-text-secondary)' }}>
                      いい質問ですね。実は、矛盾しないんです。むしろ、長期的に見れば公益を追求することが企業の持続的な成長につながります。従業員を大切にすれば生産性が上がり、顧客を大切にすれば信頼が得られ、社会を大切にすればブランド価値が高まる。これが好循環を生むんです。
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border-l-4" style={{ borderLeftColor: 'var(--color-accent)' }}>
              <div className="flex gap-4 mb-4 text-sm" style={{ color: 'var(--color-text-light)' }}>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>2024年12月15日</span>
                </div>
                <div className="flex items-center gap-2">
                  <Newspaper className="w-4 h-4" />
                  <span>日本経済新聞</span>
                </div>
              </div>
              
              <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>
                トヨタ、従業員への利益還元を大幅拡大　ベースアップ過去最高に
              </h3>
              
              <div className="p-4 rounded-lg mb-6" style={{ backgroundColor: 'var(--color-background)' }}>
                <p className="mb-4" style={{ color: 'var(--color-text-secondary)' }}>
                  トヨタ自動車は15日、2025年春闘において従業員へのベースアップを過去最高水準とする方針を発表した。好調な業績を背景に、労働分配率を引き上げ、従業員への還元を強化する。同社は「従業員の成長なくして企業の成長はない」とコメントしている。
                </p>
                <p style={{ color: 'var(--color-text-secondary)' }}>
                  一方で、株主への配当も維持する方針で、従業員、株主、そして設備投資のバランスを取った経営を目指すとしている。この動きは、他の日本企業にも波及する可能性がある。
                </p>
              </div>
              
              <div className="p-6 rounded-lg" style={{ background: 'linear-gradient(135deg, var(--color-accent-pale) 0%, rgba(255,255,255,0.5) 100%)' }}>
                <h4 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--color-text-primary)' }}>
                  💡 公益資本主義的な視点
                </h4>
                <div style={{ color: 'var(--color-text-secondary)' }}>
                  <p className="mb-4">このトヨタのニュースは、まさに公益資本主義の実践例と言えます。注目すべきは以下の3点です：</p>
                  <ul className="space-y-2 pl-6">
                    <li><strong>従業員への還元強化：</strong>ベースアップの大幅な引き上げは、従業員の生活を向上させ、モチベーションを高めます。これは短期的にはコストですが、長期的には生産性向上につながります。</li>
                    <li><strong>バランスの取れた分配：</strong>従業員への還元を強化しながらも、株主配当を維持し、設備投資も確保する。これは「適正な社中分配」の実践です。</li>
                    <li><strong>社会への波及効果：</strong>トヨタのような大企業の動きは、他企業にも影響を与えます。賃上げが広がれば、日本経済全体の消費が活性化し、好循環が生まれます。</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center p-6 rounded-lg" style={{ background: 'linear-gradient(135deg, var(--color-primary-pale) 0%, var(--color-secondary-pale) 100%)' }}>
              <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>
                📝 ワーク：公益資本主義を自分の言葉で説明してみよう
              </h3>
              <p style={{ color: 'var(--color-text-secondary)' }}>
                Session 1とSession 2で学んだことを踏まえて、あなた自身の言葉で公益資本主義を説明してみましょう。<br />
                また、なぜそれが今の日本に必要なのか、あなたの考えを書いてみてください。
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h4 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--color-text-primary)' }}>
                <PenTool className="w-5 h-5" />
                あなたの理解を言葉にしてみよう
              </h4>
              
              <div className="space-y-6">
                <div>
                  <label className="block font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>
                    1. 公益資本主義とは何か、あなたの言葉で説明してください
                  </label>
                  <textarea 
                    className="w-full p-4 border-2 rounded-lg resize-vertical min-h-32"
                    style={{ borderColor: 'var(--color-border)' }}
                    placeholder="例：公益資本主義とは、企業が利益を追求しながらも、従業員や社会全体の幸福も同時に考える経営の考え方だと思います..."
                  />
                  <p className="text-sm mt-2" style={{ color: 'var(--color-text-light)' }}>
                    💡 ヒント：誰かに説明するつもりで、できるだけわかりやすく書いてみましょう
                  </p>
                </div>

                <div>
                  <label className="block font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>
                    2. なぜ今の日本に公益資本主義が必要だと思いますか？
                  </label>
                  <textarea 
                    className="w-full p-4 border-2 rounded-lg resize-vertical min-h-32"
                    style={{ borderColor: 'var(--color-border)' }}
                    placeholder="例：日本では賃金が上がらず、格差が広がっています。公益資本主義によって従業員への分配が増えれば..."
                  />
                  <p className="text-sm mt-2" style={{ color: 'var(--color-text-light)' }}>
                    💡 ヒント：Session 2のニュースも参考に、日本の課題と結びつけて考えてみましょう
                  </p>
                </div>

                <Button 
                  className="w-full py-3 text-lg font-bold"
                  style={{
                    background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
                    color: 'var(--color-white)',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <Check className="w-5 h-5 mr-2" />
                  回答を保存
                </Button>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center p-6 rounded-lg" style={{ background: 'linear-gradient(135deg, var(--color-accent-pale) 0%, rgba(255,255,255,0.5) 100%)' }}>
              <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>
                🤔 考えを深める問い
              </h3>
              <p className="text-lg" style={{ color: 'var(--color-text-secondary)' }}>
                もしあなたが企業の経営者だったら、<br />
                株主から「もっと配当を増やせ」と言われたとき、<br />
                どう対応しますか？
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>
                <PenTool className="w-5 h-5 inline mr-2" />
                あなたの考えを書いてみましょう
              </h4>
              <textarea 
                className="w-full p-4 border-2 rounded-lg resize-vertical min-h-40 mb-4"
                style={{ borderColor: 'var(--color-border)' }}
                placeholder="あなたならどう対応しますか？理由も含めて自由に書いてみてください..."
              />
              <Button 
                className="w-full py-3 text-lg font-bold"
                style={{
                  background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
                  color: 'var(--color-white)',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <Bot className="w-5 h-5 mr-2" />
                AIと対話する
              </Button>
              <p className="text-center text-sm mt-2" style={{ color: 'var(--color-text-light)' }}>
                ※ このモックアップではAI応答はダミーです
              </p>
            </div>

            <div className="p-6 rounded-lg" style={{ background: 'linear-gradient(135deg, var(--color-secondary-pale) 0%, rgba(255,255,255,0.5) 100%)' }}>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-white" style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)' }}>
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-bold" style={{ color: 'var(--color-text-primary)' }}>
                    公益資本主義AI
                  </div>
                  <div className="text-sm" style={{ color: 'var(--color-text-light)' }}>
                    あなたの考えに対する質問
                  </div>
                </div>
              </div>
              <div style={{ color: 'var(--color-text-secondary)' }}>
                <p className="mb-4">なるほど、興味深い視点ですね。では、もう少し深く考えてみましょう：</p>
                <p className="mb-4"><strong>質問1:</strong> 短期的な株主の要求に応えることと、長期的な企業価値の向上、どちらが本当の意味で株主のためになると思いますか？</p>
                <p className="mb-4"><strong>質問2:</strong> 従業員への投資を減らして配当を増やした場合、5年後、10年後の企業はどうなっていると思いますか？</p>
                <p><strong>質問3:</strong> あなたが株主だったら、目先の配当と企業の持続的成長、どちらを重視しますか？</p>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-4" style={{ color: 'var(--color-text-primary)' }}>
                <div className="w-12 h-12 rounded-lg flex items-center justify-center text-white" style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)' }}>
                  <Check className="w-6 h-6" />
                </div>
                この講座の核心
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="text-lg font-bold text-primary">✓</span>
                  <span style={{ color: 'var(--color-text-secondary)' }}>公益資本主義とは、企業が利益を追求しながらも、従業員・顧客・社会全体の利益をバランスよく考える経営哲学である</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-lg font-bold text-primary">✓</span>
                  <span style={{ color: 'var(--color-text-secondary)' }}>株主至上主義とは異なり、すべてのステークホルダーの幸福を目指す</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-lg font-bold text-primary">✓</span>
                  <span style={{ color: 'var(--color-text-secondary)' }}>短期的な利益だけでなく、長期的な視点で企業価値を高めることを重視する</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-lg font-bold text-primary">✓</span>
                  <span style={{ color: 'var(--color-text-secondary)' }}>公益と利益は矛盾せず、むしろ長期的には好循環を生む関係にある</span>
                </li>
              </ul>
            </div>

            <div className="text-center p-8 rounded-lg" style={{ background: 'linear-gradient(135deg, var(--color-primary-pale) 0%, var(--color-secondary-pale) 100%)' }}>
              <h3 className="text-2xl font-bold mb-6" style={{ color: 'var(--color-text-primary)' }}>
                🎉 第1回完了！
              </h3>
              <p className="text-lg mb-8" style={{ color: 'var(--color-text-secondary)' }}>
                お疲れ様でした！公益資本主義の基本を理解できましたね。<br />
                次の講座で、さらに理解を深めていきましょう。
              </p>
              <Link href="/lessons">
                <Button 
                  className="px-8 py-4 text-lg font-bold"
                  style={{
                    background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
                    color: 'var(--color-white)',
                    boxShadow: 'var(--shadow-md)'
                  }}
                >
                  <BookOpen className="w-5 h-5 mr-2" />
                  カリキュラムに戻る
                </Button>
              </Link>
            </div>
          </div>
        );

      default:
        return <div>Session not found</div>;
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFF8F0' }}>
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
              <div className="flex flex-col">
                <span className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
                  公益資本主義アカデミー
                </span>
                <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  Public Interest Capitalism Academy
                </span>
              </div>
            </Link>
            
            <nav className="flex items-center space-x-6">
              <Link 
                href="/" 
                className="text-base font-medium px-4 py-2 rounded-full transition-all duration-300 hover:bg-white hover:shadow-sm"
                style={{ color: 'var(--color-text-primary)' }}
              >
                ホーム
              </Link>
              <Link 
                href="/lessons" 
                className="text-base font-medium px-4 py-2 rounded-full transition-all duration-300 hover:bg-white hover:shadow-sm"
                style={{ color: 'var(--color-text-primary)' }}
              >
                カリキュラム
              </Link>
              <Link 
                href="#about" 
                className="text-base font-medium px-4 py-2 rounded-full transition-all duration-300 hover:bg-white hover:shadow-sm"
                style={{ color: 'var(--color-text-primary)' }}
              >
                概要
              </Link>
            </nav>
            
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    {user.user_metadata?.name || user.email}さん
                  </div>
                  <Link href="/mypage">
                    <Button variant="outline" size="sm">
                      マイページ
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" onClick={handleSignOut}>
                    <LogOut className="w-4 h-4 mr-2" />
                    ログアウト
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/auth/login">
                    <Button variant="outline" size="sm">
                      <LogIn className="w-4 h-4 mr-2" />
                      ログイン
                    </Button>
                  </Link>
                  <Link href="/auth/signup">
                    <Button size="sm">
                      新規登録
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* レッスンヘッダー */}
      <section 
        className="relative overflow-hidden"
        style={{ 
          background: 'linear-gradient(135deg, var(--color-primary-pale) 0%, var(--color-secondary-pale) 100%)',
          padding: 'var(--spacing-2xl) 0'
        }}
      >
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            background: 'radial-gradient(circle at 20% 50%, rgba(111, 218, 163, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(94, 196, 232, 0.15) 0%, transparent 50%)'
          }}
        />
        
        <div className="container relative z-10">
          <div className="flex items-center gap-2 text-sm mb-6" style={{ color: 'var(--color-text-light)' }}>
            <Link href="/" className="hover:text-primary transition-colors">
              <Home className="w-4 h-4 inline mr-1" />
              ホーム
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/lessons" className="hover:text-primary transition-colors">カリキュラム</Link>
            <ChevronRight className="w-4 h-4" />
            <span>第{lessonIdNum}回</span>
          </div>
          
          <div className="flex gap-8 items-start">
            <div
              className="flex-shrink-0 w-25 h-25 rounded-lg flex flex-col items-center justify-center text-white font-bold shadow-lg"
              style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)' }}
            >
              <div className="text-sm opacity-90">Lesson</div>
              <div className="text-4xl leading-none">{String(lessonIdNum).padStart(2, '0')}</div>
            </div>
            
            <div className="flex-grow">
              <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                {lesson.title}
              </h1>
              <p className="text-xl mb-6" style={{ color: 'var(--color-text-secondary)' }}>
                {lesson.subtitle}
              </p>
              <div className="flex gap-6 flex-wrap">
                <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  <Clock className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                  <span>{lesson.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  <Layers className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                  <span>{lesson.sessions}つのSession</span>
                </div>
                <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  <BookOpen className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                  <span>第{lessonIdNum}回 / 全10回</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* メインコンテンツ */}
      <main className="py-8">
        <div className="container">
          
          {/* セッションナビゲーション */}
          <div className="bg-white rounded-lg p-6 shadow-md mb-8 sticky top-20 z-40">
            <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>
              <Layers className="w-5 h-5 inline mr-2" />
              Session一覧
            </h3>
            <div className="flex gap-2 flex-wrap">
              {sessions.map((session) => (
                <button
                  key={session.id}
                  onClick={() => showSession(session.id)}
                  className={`flex-1 min-w-36 p-4 rounded-lg text-center transition-all border-2 ${
                    currentSession === session.id 
                      ? 'border-primary shadow-sm' 
                      : 'border-transparent hover:shadow-md hover:-translate-y-0.5'
                  }`}
                  style={{ 
                    backgroundColor: session.color,
                    color: '#333'
                  }}
                >
                  <div className="text-lg font-bold mb-1">Session {session.id}</div>
                  <div className="text-sm">{session.title}</div>
                </button>
              ))}
            </div>
          </div>

          {/* セッションコンテンツ */}
          <div className="bg-white rounded-lg p-8 shadow-md mb-8">
            <div className="text-center mb-8">
              <div 
                className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold text-3xl shadow-lg"
                style={{ backgroundColor: sessions[currentSession - 1]?.color }}
              >
                {currentSession}
              </div>
              <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                Session {currentSession}: {sessions[currentSession - 1]?.title}
              </h2>
              <p className="text-base" style={{ color: 'var(--color-text-secondary)' }}>
                {sessions[currentSession - 1]?.description}
              </p>
            </div>
            
            {renderSessionContent(currentSession)}
          </div>

          {/* セッションフッター */}
          <div className="flex justify-between items-center gap-4 p-6 bg-white rounded-lg shadow-md">
            <Button
              onClick={prevSession}
              disabled={currentSession === 1}
              className="flex items-center gap-2"
              style={{ 
                backgroundColor: currentSession === 1 ? 'var(--color-border)' : 'var(--color-border)',
                color: 'var(--color-text-primary)'
              }}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>前のSession</span>
            </Button>
            
            <div className="text-center">
              <div className="text-sm mb-2" style={{ color: 'var(--color-text-light)' }}>
                Session {currentSession} / 5
              </div>
              <div className="flex gap-2 justify-center">
                {[1, 2, 3, 4, 5].map((dot) => (
                  <div
                    key={dot}
                    className={`w-3 h-3 rounded-full transition-all ${
                      currentSession === dot 
                        ? 'scale-130' 
                        : ''
                    }`}
                    style={{ 
                      backgroundColor: currentSession === dot 
                        ? 'var(--color-primary)' 
                        : 'var(--color-border)'
                    }}
                  />
                ))}
              </div>
            </div>
            
            <Button
              onClick={currentSession === 5 ? () => window.location.href = '/lessons' : nextSession}
              className="flex items-center gap-2"
              style={{
                background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
                color: 'var(--color-white)',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <span>{currentSession === 5 ? '講座を完了' : '次のSession'}</span>
              {currentSession === 5 ? <Check className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </Button>
          </div>

        </div>
      </main>

      {/* フッター */}
      <footer 
        className="py-12"
        style={{ 
          backgroundColor: 'var(--color-text-primary)',
          color: 'var(--color-white)',
          marginTop: 'var(--spacing-4xl)'
        }}
      >
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-white mb-4">公益資本主義アカデミー</h3>
              <p className="text-sm text-white/80">
                公益資本主義の概念を学び、日本の未来をアップデートする学習プラットフォーム
              </p>
            </div>
            
            <div>
              <h3 className="text-white mb-4">リンク</h3>
              <div className="space-y-2">
                <p><Link href="/" className="text-sm text-white/80 hover:text-white transition-colors">ホーム</Link></p>
                <p><Link href="/lessons" className="text-sm text-white/80 hover:text-white transition-colors">カリキュラム</Link></p>
                <p><Link href="#about" className="text-sm text-white/80 hover:text-white transition-colors">概要</Link></p>
              </div>
            </div>
            
            <div>
              <h3 className="text-white mb-4">お問い合わせ</h3>
              <p className="text-sm text-white/80">このサイトはモックアップです</p>
            </div>
          </div>
          
          <div 
            className="text-center pt-6 border-t border-white/20 text-sm text-white/60"
          >
            © 2025 Public Interest Capitalism Academy. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}