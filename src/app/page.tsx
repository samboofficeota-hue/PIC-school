'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import {
  BookOpen,
  Award,
  Users,
  Target,
  CheckCircle,
  Clock,
  TrendingUp,
  Sparkles,
  MessageSquare,
  BarChart3,
  ArrowRight,
  Play,
  LogIn,
  LogOut,
  Comments,
  Newspaper,
  PencilAlt,
  Robot,
  GraduationCap,
  InfoCircle,
  Rocket
} from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const { user, signOut, loading } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  // ハイドレーションエラーを防ぐため、ローディング中は何も表示しない
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-background)' }}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: 'var(--color-primary)' }}></div>
      </div>
    );
  }

  const features = [
    {
      icon: Comments,
      title: '対話形式の学び',
      description: '原丈人氏と編集者の対話を通じて、複雑な概念をわかりやすく理解できます。',
      color: 'var(--color-primary)'
    },
    {
      icon: Newspaper,
      title: 'リアルなニュース',
      description: '直近のニュースを題材に、公益資本主義的な視点で社会を読み解きます。',
      color: 'var(--color-secondary)'
    },
    {
      icon: PencilAlt,
      title: '実践的ワーク',
      description: '自分の手を動かして計算・分析することで、理論を体感的に学べます。',
      color: 'var(--color-accent)'
    },
    {
      icon: Robot,
      title: 'AI対話で思考深化',
      description: 'AIキャラクターとの対話を通じて、自分の考えをさらに深めていけます。',
      color: 'var(--color-accent-secondary)'
    },
    {
      icon: Users,
      title: 'みんなの広場',
      description: '他の受講者の意見や考えを共有し、多様な視点に触れることができます。',
      color: 'var(--color-success)'
    }
  ];

  const stats = [
    { number: '10', label: '回の講座', icon: BookOpen },
    { number: '3', label: 'ヶ月間', icon: Award },
    { number: '30', label: '分/各回', icon: Clock },
    { number: '5', label: 'つのSession', icon: Target }
  ];

  const sessions = [
    {
      number: 1,
      title: 'イントロ - 対話で理解する',
      description: '原丈人氏と編集者の対話形式で、各回のテーマの核心に迫ります。チャット形式の読みやすいデザインで、複雑な概念もすっと頭に入ります。',
      duration: '約5分',
      color: 'var(--color-session-intro)'
    },
    {
      number: 2,
      title: 'ニュース - 現実と繋げる',
      description: '直近3ヶ月のニュースから、テーマに関連する事例をピックアップ。公益資本主義的な論点と観点をコラム形式で解説します。',
      duration: '約7分',
      color: 'var(--color-session-news)'
    },
    {
      number: 3,
      title: 'ワーク - 手を動かす',
      description: 'インタラクティブなテンプレートを使って、実際のデータを入力・計算。例えば労働分配率や株主還元率を自分で計算することで、理論を実感できます。',
      duration: '約10分',
      color: 'var(--color-session-work)'
    },
    {
      number: 4,
      title: '対話 - 考えを深める',
      description: '公益資本主義GPTをベースにしたAIキャラクターと対話。あなたの考えに質問を返しながら、思考を深めていきます。他の受講者の意見も見れる広場機能付き。',
      duration: '約5分',
      color: 'var(--color-session-dialogue)'
    },
    {
      number: 5,
      title: 'サマリー - 要点を整理',
      description: 'その回の論点と学びをコンパクトにまとめて表示。復習にも最適です。',
      duration: '約3分',
      color: 'var(--color-session-summary)'
    }
  ];

  const audience = [
    {
      icon: '🎓',
      title: '高校生',
      description: 'これから社会に出る前に、経済と社会の仕組みを深く理解したい方'
    },
    {
      icon: '📚',
      title: '大学生',
      description: '就職活動や将来のキャリアを考える上で、新しい視点を得たい方'
    },
    {
      icon: '💼',
      title: '20代社会人',
      description: '働き始めた今だからこそ、経済の本質を学び直したい方'
    }
  ];

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
              <div className="flex flex-col">
                <span className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
                  公益資本主義アカデミー
                </span>
                <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  Public Interest Capitalism Academy
                </span>
              </div>
            </Link>
            
            <nav className="flex items-center space-x-4">
              <Link href="/" className="nav-link active">
                ホーム
              </Link>
              <Link href="/program/1" className="nav-link">
                カリキュラム
              </Link>
              <Link href="#about" className="nav-link">
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

      {/* ヒーローセクション */}
      <section 
        className="relative overflow-hidden"
        style={{ 
          background: 'linear-gradient(135deg, var(--color-primary-pale) 0%, var(--color-secondary-pale) 50%, var(--color-accent-pale) 100%)',
          padding: 'var(--spacing-4xl) 0'
        }}
      >
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
            animation: 'float 20s ease-in-out infinite'
          }}
        />
        
        <div className="container relative z-10">
          <div className="text-center space-y-8">
            <Badge 
              variant="secondary" 
              className="bg-white/20 text-white border-white/30 backdrop-blur-sm"
            >
              <Sparkles className="w-3 h-3 mr-1" />
              オンライン学習プラットフォーム
            </Badge>
            
            <div className="space-y-4">
              <h1 
                className="text-4xl md:text-6xl max-w-4xl mx-auto"
                style={{ 
                  color: 'var(--color-text-primary)',
                  textShadow: '2px 2px 4px rgba(255,255,255,0.8)'
                }}
              >
                公益資本主義で<br />
                世界が憧れる日本をつくる
              </h1>
              <p 
                className="text-xl max-w-2xl mx-auto"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Public Interest Capitalism Academy
              </p>
              <p 
                className="text-lg max-w-3xl mx-auto leading-relaxed"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                公益資本主義の概念を学び、経済の仕組みを理解し、<br />
                日本の未来をアップデートする方法を一緒に考えましょう。<br />
                3ヶ月間・全10回の学習プログラムで、あなたの視点が変わります。
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/program/1">
                <Button
                  size="lg"
                  className="h-14 px-8 text-lg group"
                  style={{ 
                    background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)',
                    color: 'var(--color-text-primary)',
                    boxShadow: 'var(--shadow-lg)'
                  }}
                >
                  <Rocket className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  カリキュラムを見る
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="#about">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 px-8 text-lg"
                  style={{
                    backgroundColor: 'transparent',
                    border: '2px solid var(--color-primary)',
                    color: 'var(--color-text-primary)'
                  }}
                >
                  <InfoCircle className="w-5 h-5 mr-2" />
                  詳しく知る
                </Button>
              </Link>
            </div>

            {/* 統計情報 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto pt-12">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={index}
                    className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
                  >
                    <Icon className="w-8 h-8 text-white/80 mx-auto mb-2" />
                    <div className="text-3xl text-white mb-1">{stat.number}</div>
                    <div className="text-sm text-white/80">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 特徴セクション */}
      <section className="py-20" style={{ backgroundColor: 'var(--color-white)' }}>
        <div className="container">
          <h2 className="section-title">アカデミーの特徴</h2>
          <p className="section-subtitle">5つのSessionで深く、楽しく学ぶ</p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="p-6 text-center hover:shadow-lg transition-all cursor-pointer group"
                  style={{
                    background: 'linear-gradient(135deg, var(--color-white) 0%, var(--color-background) 100%)',
                    border: '2px solid transparent'
                  }}
                >
                  <div
                    className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform"
                    style={{ background: `linear-gradient(135deg, ${feature.color} 0%, ${feature.color}dd 100%)` }}
                  >
                    <Icon className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl mb-2" style={{ color: 'var(--color-text-primary)' }}>
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                    {feature.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* 対象者セクション */}
      <section 
        className="py-20"
        style={{ background: 'linear-gradient(135deg, var(--color-background) 0%, var(--color-white) 100%)' }}
      >
        <div className="container">
          <h2 className="section-title">こんな方におすすめ</h2>
          <p className="section-subtitle">未来を担う世代へ</p>
          
          <div className="grid md:grid-cols-3 gap-6">
            {audience.map((item, index) => (
              <Card
                key={index}
                className="p-8 text-center relative overflow-hidden"
                style={{ backgroundColor: 'var(--color-white)' }}
              >
                <div
                  className="absolute top-0 left-0 w-full h-1"
                  style={{ background: 'linear-gradient(90deg, var(--color-primary) 0%, var(--color-secondary) 100%)' }}
                />
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-2xl mb-4" style={{ color: 'var(--color-text-primary)' }}>
                  {item.title}
                </h3>
                <p style={{ color: 'var(--color-text-secondary)' }}>
                  {item.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* プログラム概要 */}
      <section className="py-20" style={{ backgroundColor: 'var(--color-white)' }}>
        <div className="container">
          <h2 className="section-title">プログラム概要</h2>
          <p className="section-subtitle">3ヶ月で体系的に学ぶ</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="text-center p-6 rounded-lg shadow-sm"
                  style={{ 
                    background: 'linear-gradient(135deg, var(--color-primary-pale) 0%, var(--color-secondary-pale) 100%)'
                  }}
                >
                  <div className="text-5xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                    {stat.number}
                  </div>
                  <div className="text-lg font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Session紹介 */}
      <section 
        className="py-20"
        style={{ background: 'linear-gradient(180deg, var(--color-background) 0%, var(--color-white) 100%)' }}
      >
        <div className="container">
          <h2 className="section-title">各回の学習体験（約30分）</h2>
          <p className="section-subtitle">5つのSessionで構成された効果的な学び</p>
          
          <div className="space-y-4">
            {sessions.map((session, index) => (
              <Card
                key={index}
                className="p-6 flex items-center gap-6 hover:shadow-lg transition-all cursor-pointer group"
                style={{ backgroundColor: 'var(--color-white)' }}
              >
                <div
                  className="flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg"
                  style={{ backgroundColor: session.color }}
                >
                  {session.number}
                </div>
                
                <div className="flex-1">
                  <h3 className="text-xl mb-2 group-hover:text-primary transition-colors" style={{ color: 'var(--color-text-primary)' }}>
                    {session.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                    {session.description}
                  </p>
                </div>

                <div className="flex-shrink-0 text-sm font-medium" style={{ color: 'var(--color-text-light)' }}>
                  {session.duration}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTAセクション */}
      <section 
        className="py-20 text-center"
        style={{ background: 'var(--gradient-primary)' }}
      >
        <div className="container max-w-4xl">
          <h2 className="text-3xl md:text-4xl text-white mb-6">
            さあ、一緒に日本の未来を考えよう
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            公益資本主義を学ぶことは、あなた自身の未来を考えることです。<br />
            今すぐカリキュラムをチェックして、学びの旅を始めましょう。
          </p>
          <Link href="/program/1">
            <Button
              size="lg"
              className="h-14 px-8 text-lg group"
              style={{
                backgroundColor: 'var(--color-white)',
                color: 'var(--color-text-primary)',
                boxShadow: 'var(--shadow-lg)'
              }}
            >
              <GraduationCap className="w-5 h-5 mr-2" />
              カリキュラムを見る
            </Button>
          </Link>
        </div>
      </section>

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
                <p><Link href="/program/1" className="text-sm text-white/80 hover:text-white transition-colors">カリキュラム</Link></p>
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
        @keyframes float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(30px, -30px) rotate(120deg); }
          66% { transform: translate(-20px, 20px) rotate(240deg); }
        }
        
        .nav-link {
          font-size: var(--font-size-base);
          font-weight: var(--font-weight-medium);
          color: var(--color-text-primary);
          padding: var(--spacing-sm) var(--spacing-md);
          border-radius: var(--radius-full);
          transition: all var(--transition-base);
        }
        
        .nav-link:hover {
          background-color: var(--color-white);
          color: var(--color-primary-dark);
          box-shadow: var(--shadow-sm);
        }
        
        .nav-link.active {
          background-color: var(--color-white);
          color: var(--color-primary-dark);
        }
      `}</style>
    </div>
  );
}