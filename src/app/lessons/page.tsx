'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import {
  BookOpen,
  Clock,
  Layers,
  ArrowRight,
  LogIn,
  LogOut,
  Home,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';

export default function LessonsPage() {
  const { user, signOut, loading } = useAuth();

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

  const lessons = [
    {
      id: 1,
      title: '公益資本主義とは何か',
      subtitle: '基本の理解',
      description: '公益資本主義の基本概念を理解します。なぜ今、公益資本主義が必要なのか？従来の資本主義との違いは何か？原丈人氏の対話を通じて、その本質に迫ります。',
      duration: '約30分',
      sessions: 5,
      status: 'not-started'
    },
    {
      id: 2,
      title: '日本の立ち位置',
      subtitle: 'データから読み解く日本の課題',
      description: '各種統計データから、日本経済の現状を客観的に分析します。GDP、賃金、格差、生産性など、様々な指標から日本が抱える課題を明確にします。',
      duration: '約30分',
      sessions: 5,
      status: 'not-started'
    },
    {
      id: 3,
      title: '資本主義とは何か',
      subtitle: '投資と経営と労働の関係から考える',
      description: '資本主義の基本的な仕組みを、投資家・経営者・労働者の三者の関係から理解します。それぞれの役割と、現代における課題を考察します。',
      duration: '約30分',
      sessions: 5,
      status: 'not-started'
    },
    {
      id: 4,
      title: '経済とは何か',
      subtitle: 'マクロ経済、GDPの三面等価',
      description: 'マクロ経済学の基礎を学びます。GDPの三面等価（生産・分配・支出）の考え方を理解し、経済全体の動きを把握します。',
      duration: '約30分',
      sessions: 5,
      status: 'not-started'
    },
    {
      id: 5,
      title: '公益資本主義的な経営とは何か',
      subtitle: '経営事例',
      description: '実際の企業事例を通じて、公益資本主義的な経営を学びます。従業員、顧客、社会、株主のバランスを取りながら成長する企業の戦略を分析します。',
      duration: '約30分',
      sessions: 5,
      status: 'not-started'
    },
    {
      id: 6,
      title: '株主資本主義の弊害',
      subtitle: '短期株主と中長期株主、株主と債権者の違い',
      description: '株主至上主義がもたらす問題点を深く理解します。短期的な株価重視が企業経営に与える悪影響と、本来あるべき株主の役割を考えます。',
      duration: '約30分',
      sessions: 5,
      status: 'not-started'
    },
    {
      id: 7,
      title: '実践原則①「適正な社中分配」',
      subtitle: '成長と分配の好循環は分配から',
      description: '公益資本主義の第一原則「適正な社中分配」を学びます。労働分配率、株主還元率を実際に計算し、バランスの取れた分配の重要性を体感します。',
      duration: '約30分',
      sessions: 5,
      status: 'not-started'
    },
    {
      id: 8,
      title: '実践原則②「中長期視点」',
      subtitle: '短期だけではなく中長期視点を持った複眼思考',
      description: '短期的な利益追求だけでなく、中長期的な視点で経営を考える重要性を学びます。複眼思考で物事を捉える力を養います。',
      duration: '約30分',
      sessions: 5,
      status: 'not-started'
    },
    {
      id: 9,
      title: '実践原則③「企業家精神の発揮」',
      subtitle: '起業家ではなく企業家',
      description: '「起業家（アントレプレナー）」と「企業家（イントラプレナー）」の違いを理解します。組織の中で新しい価値を創造する企業家精神の重要性を学びます。',
      duration: '約30分',
      sessions: 5,
      status: 'not-started'
    },
    {
      id: 10,
      title: '公益資本主義で世界が憧れる日本をつくる',
      subtitle: 'あなたは何をする？',
      description: 'これまでの学びを統合し、あなた自身が何をすべきかを考えます。公益資本主義の実践者として、日本の未来をどうアップデートしていくか。最終的な問いに向き合います。',
      duration: '約30分',
      sessions: 5,
      status: 'not-started'
    }
  ];

  const getLessonNumberColor = (index: number) => {
    const colors = [
      'linear-gradient(135deg, #D0F5E5 0%, #9FE8C3 100%)',
      'linear-gradient(135deg, #D5F0F9 0%, #8ED9F0 100%)',
      'linear-gradient(135deg, #FCE5D3 0%, #F9C08A 100%)',
      'linear-gradient(135deg, #EDE5F3 0%, #D9BBE3 100%)',
      'linear-gradient(135deg, #D0F5E5 0%, #9FE8C3 100%)',
      'linear-gradient(135deg, #D5F0F9 0%, #8ED9F0 100%)',
      'linear-gradient(135deg, #FCE5D3 0%, #F9C08A 100%)',
      'linear-gradient(135deg, #EDE5F3 0%, #D9BBE3 100%)',
      'linear-gradient(135deg, #D0F5E5 0%, #9FE8C3 100%)',
      'linear-gradient(135deg, #D5F0F9 0%, #8ED9F0 100%)'
    ];
    return colors[index % colors.length];
  };

  const getTextColor = (index: number) => {
    const colors = ['#2D5F4D', '#2D5568', '#5F3E2D', '#4A2D5F', '#2D5F4D', '#2D5568', '#5F3E2D', '#4A2D5F', '#2D5F4D', '#2D5568'];
    return colors[index % colors.length];
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
                className="text-base font-medium px-4 py-2 rounded-full transition-all duration-300"
                style={{ 
                  backgroundColor: 'var(--color-white)',
                  color: 'var(--color-primary-dark)',
                  boxShadow: 'var(--shadow-sm)'
                }}
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

      {/* ページヘッダー */}
      <section 
        className="relative overflow-hidden"
        style={{ 
          background: 'linear-gradient(135deg, var(--color-primary-pale) 0%, var(--color-secondary-pale) 100%)',
          padding: 'var(--spacing-3xl) 0 var(--spacing-2xl)'
        }}
      >
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            background: 'radial-gradient(circle at 20% 50%, rgba(111, 218, 163, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(94, 196, 232, 0.1) 0%, transparent 50%)'
          }}
        />
        
        <div className="container relative z-10">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>
              カリキュラム
            </h1>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
              3ヶ月・全10回の講座で、公益資本主義を体系的に学びます。<br />
              各回約30分、5つのSessionで構成された効果的な学習プログラムです。
            </p>
          </div>
        </div>
      </section>

      {/* メインコンテンツ */}
      <main className="py-20">
        <div className="container">
          
          {/* レッスンリスト */}
          <div className="space-y-8">
            {lessons.map((lesson, index) => (
              <Card
                key={lesson.id}
                className="p-8 hover:shadow-lg transition-all cursor-pointer group relative overflow-hidden"
                style={{ backgroundColor: 'var(--color-white)' }}
                onClick={() => window.location.href = `/lessons/${lesson.id}`}
              >
                <div
                  className="absolute top-0 left-0 w-1 h-full"
                  style={{ background: 'linear-gradient(180deg, var(--color-primary) 0%, var(--color-secondary) 100%)', transform: 'scaleY(0)', transition: 'transform var(--transition-base)' }}
                />
                
                <div className="flex gap-8 items-start">
                  {/* レッスンナンバー */}
                  <div
                    className="flex-shrink-0 w-20 h-20 rounded-lg flex flex-col items-center justify-center font-bold shadow-sm"
                    style={{ 
                      background: getLessonNumberColor(index),
                      color: getTextColor(index)
                    }}
                  >
                    <div className="text-xs opacity-80">Lesson</div>
                    <div className="text-3xl leading-none">{String(lesson.id).padStart(2, '0')}</div>
                  </div>
                  
                  {/* レッスンコンテンツ */}
                  <div className="flex-grow">
                    <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                      {lesson.title}
                    </h2>
                    <p className="text-lg mb-4" style={{ color: 'var(--color-text-secondary)' }}>
                      {lesson.subtitle}
                    </p>
                    <p className="text-base mb-6 leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                      {lesson.description}
                    </p>
                    
                    {/* メタ情報 */}
                    <div className="flex gap-6 flex-wrap mb-4">
                      <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-text-light)' }}>
                        <Clock className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                        <span>{lesson.duration}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-text-light)' }}>
                        <Layers className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                        <span>{lesson.sessions}つのSession</span>
                      </div>
                    </div>
                    
                    {/* セッションアイコン */}
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((sessionNum) => (
                        <div
                          key={sessionNum}
                          className="w-8 h-8 rounded text-xs font-medium flex items-center justify-center text-white"
                          style={{ 
                            backgroundColor: sessionNum === 1 ? '#FFB6C1' : 
                                           sessionNum === 2 ? '#FFD4A3' :
                                           sessionNum === 3 ? '#A8E6A3' :
                                           sessionNum === 4 ? '#A8D5F5' : '#D4B5F2',
                            color: '#333'
                          }}
                          title={`Session ${sessionNum}`}
                        >
                          {sessionNum}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* アクション */}
                  <div className="flex-shrink-0 flex flex-col gap-2 items-end">
                    <span 
                      className="text-sm px-4 py-2 rounded-full font-medium"
                      style={{ 
                        backgroundColor: 'var(--color-border)',
                        color: 'var(--color-text-light)'
                      }}
                    >
                      未受講
                    </span>
                    <Button
                      className="px-6 py-2 text-sm font-medium flex items-center gap-2"
                      style={{
                        background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
                        color: 'var(--color-white)',
                        boxShadow: 'var(--shadow-sm)'
                      }}
                    >
                      <span>学習を開始</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* カリキュラム統計 */}
          <div 
            className="mt-12 p-8 rounded-2xl text-center text-white"
            style={{ 
              background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)'
            }}
          >
            <h3 className="text-2xl font-bold mb-6 text-white">🎓 カリキュラム全体</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">10</div>
                <div className="text-base opacity-90">講座</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">3</div>
                <div className="text-base opacity-90">ヶ月</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">50</div>
                <div className="text-base opacity-90">Session</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">5</div>
                <div className="text-base opacity-90">時間</div>
              </div>
            </div>
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

      <style jsx>{`
        .group:hover .absolute {
          transform: scaleY(1);
        }
      `}</style>
    </div>
  );
}