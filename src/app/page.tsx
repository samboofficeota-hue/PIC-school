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
  LogOut
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  const features = [
    {
      icon: BookOpen,
      title: '体系的なカリキュラム',
      description: '5章25チャプターの充実した学習コンテンツで、基礎から実践まで段階的に学べます。',
      color: 'var(--brand-primary)'
    },
    {
      icon: MessageSquare,
      title: 'AI学習アシスタント',
      description: '各チャプターでAIと対話しながら、理解を深め、疑問を解消できます。',
      color: 'var(--brand-secondary)'
    },
    {
      icon: Target,
      title: 'ミニテストで確認',
      description: '各章の最後にテストがあり、学習の定着度を確認できます。',
      color: 'var(--brand-accent)'
    },
    {
      icon: BarChart3,
      title: '進捗トラッキング',
      description: '学習の進捗を可視化し、モチベーションを維持しながら学習を続けられます。',
      color: 'var(--brand-success)'
    }
  ];

  const stats = [
    { number: '25', label: 'チャプター', icon: BookOpen },
    { number: '5', label: '章構成', icon: Award },
    { number: '100+', label: '学習項目', icon: Target },
    { number: '∞', label: 'AI対話', icon: MessageSquare }
  ];

  const chapters = [
    {
      number: 1,
      title: '基礎知識の理解',
      description: 'ビジネスの基本原則、市場分析、顧客理解など、基礎となる知識を習得します。',
      duration: '約60分',
      topics: 5
    },
    {
      number: 2,
      title: '戦略立案と計画',
      description: 'ビジネス戦略フレームワーク、目標設定、リソース配分など、戦略立案の手法を学びます。',
      duration: '約75分',
      topics: 5
    },
    {
      number: 3,
      title: '実行とオペレーション',
      description: 'プロジェクト管理、チームビルディング、プロセス改善など、実行力を身につけます。',
      duration: '約80分',
      topics: 5
    },
    {
      number: 4,
      title: 'データ分析と意思決定',
      description: 'データに基づいた意思決定、分析手法、予測などを習得します。',
      duration: '約70分',
      topics: 5
    },
    {
      number: 5,
      title: 'イノベーションと成長',
      description: 'イノベーション戦略、成長戦略、持続可能性など、未来志向の学びを得ます。',
      duration: '約65分',
      topics: 5
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* ヘッダー */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">PIC School</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <div className="text-sm text-gray-600">
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
        style={{ background: 'var(--gradient-primary)' }}
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSIjRkZGIiBzdHJva2Utb3BhY2l0eT0iLjEiLz48L2c+PC9zdmc+')] opacity-20" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center space-y-8">
            <Badge 
              variant="secondary" 
              className="bg-white/20 text-white border-white/30 backdrop-blur-sm"
            >
              <Sparkles className="w-3 h-3 mr-1" />
              オンライン学習プラットフォーム
            </Badge>
            
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl text-white max-w-4xl mx-auto">
                ビジネススキルを
                <br />
                体系的に学ぶ
              </h1>
              <p className="text-xl text-white/90 max-w-2xl mx-auto">
                AIアシスタントと共に、自分のペースで学習を進められる
                <br className="hidden md:block" />
                オンラインスクール
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/program/business-skills">
                <Button
                  size="lg"
                  className="h-14 px-8 bg-white hover:bg-white/90 shadow-xl text-lg group"
                  style={{ color: 'var(--brand-primary)' }}
                >
                  <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  学習を始める
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/program/business-skills">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 px-8 bg-white/10 hover:bg-white/20 text-white border-white/30 backdrop-blur-sm text-lg"
                >
                  <BookOpen className="w-5 h-5 mr-2" />
                  詳しく見る
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
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <Badge variant="outline" style={{ borderColor: 'var(--brand-primary)', color: 'var(--brand-primary)' }}>
            特徴
          </Badge>
          <h2>学習を加速させる機能</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            効率的な学習をサポートする、充実した機能を搭載しています
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="p-6 hover:shadow-lg transition-shadow cursor-pointer group"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                  style={{ background: `${feature.color}15` }}
                >
                  <Icon className="w-6 h-6" style={{ color: feature.color }} />
                </div>
                <h3 className="mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* カリキュラムセクション */}
      <section 
        className="py-20 px-4 sm:px-6 lg:px-8"
        style={{ background: 'var(--bg-primary-light)' }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="outline" style={{ borderColor: 'var(--brand-secondary)', color: 'var(--brand-secondary)' }}>
              カリキュラム
            </Badge>
            <h2>5章で学ぶビジネスの全体像</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              基礎から応用まで、体系的に学べる構成になっています
            </p>
          </div>

          <div className="space-y-4">
            {chapters.map((chapter, index) => (
              <Link key={index} href="/program/business-skills">
                <Card className="p-6 hover:shadow-lg transition-all cursor-pointer group">
                  <div className="flex items-start gap-6">
                    <div
                      className="flex-shrink-0 w-16 h-16 rounded-xl flex items-center justify-center text-white shadow-lg"
                      style={{ background: 'var(--gradient-secondary)' }}
                    >
                      <span className="text-2xl">第{chapter.number}章</span>
                    </div>
                    
                    <div className="flex-1 space-y-3">
                      <div>
                        <h3 className="group-hover:text-primary transition-colors">
                          {chapter.title}
                        </h3>
                        <p className="text-muted-foreground mt-1">
                          {chapter.description}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{chapter.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <BookOpen className="w-4 h-4" />
                          <span>{chapter.topics}チャプター</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Target className="w-4 h-4" />
                          <span>テスト付き</span>
                        </div>
                      </div>
                    </div>

                    <ArrowRight 
                      className="w-6 h-6 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0"
                    />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 学習の流れセクション */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <Badge variant="outline" style={{ borderColor: 'var(--brand-success)', color: 'var(--brand-success)' }}>
            学習の流れ
          </Badge>
          <h2>シンプルな3ステップ</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              step: '01',
              title: 'コンテンツを読む',
              description: '各チャプターのコンテンツを自分のペースで読み進めます。重要なポイントをハイライトすることもできます。',
              icon: BookOpen,
              color: 'var(--brand-primary)'
            },
            {
              step: '02',
              title: 'AIと対話する',
              description: '理解を深めるために、AIアシスタントと対話しながら学習を進めます。疑問点があればいつでも質問できます。',
              icon: MessageSquare,
              color: 'var(--brand-secondary)'
            },
            {
              step: '03',
              title: 'テストで確認',
              description: '各章の最後にミニテストで理解度を確認。全章クリアで次のステップへ進めます。',
              icon: CheckCircle,
              color: 'var(--brand-success)'
            }
          ].map((item, index) => {
            const Icon = item.icon;
            return (
              <Card key={index} className="p-8 text-center">
                <div
                  className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center text-white shadow-lg"
                  style={{ background: item.color }}
                >
                  <Icon className="w-10 h-10" />
                </div>
                <div 
                  className="text-sm mb-3"
                  style={{ color: item.color }}
                >
                  STEP {item.step}
                </div>
                <h3 className="mb-3">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* CTAセクション */}
      <section 
        className="py-20 px-4 sm:px-6 lg:px-8"
        style={{ background: 'var(--gradient-primary)' }}
      >
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-4xl text-white">
            今すぐ学習を始めましょう
          </h2>
          <p className="text-xl text-white/90">
            無料で全てのコンテンツにアクセスできます
          </p>
          <Link href="/program/business-skills">
            <Button
              size="lg"
              className="h-14 px-8 bg-white hover:bg-white/90 shadow-xl text-lg group"
              style={{ color: 'var(--brand-primary)' }}
            >
              <Play className="w-5 h-5 mr-2" />
              学習を始める
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>

      {/* フッター */}
      <footer className="border-t py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center text-muted-foreground">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
              style={{ background: 'var(--gradient-primary)' }}
            >
              <BookOpen className="w-5 h-5" />
            </div>
            <span>オンラインスクール</span>
          </div>
          <div className="flex justify-center gap-4 mb-4">
            <Link href="/mypage" className="text-sm hover:text-primary transition-colors">
              マイページ
            </Link>
            <Link href="/admin" className="text-sm hover:text-primary transition-colors">
              管理画面
            </Link>
            <Link href="/test-supabase" className="text-sm hover:text-primary transition-colors">
              Supabaseテスト
            </Link>
            <Link href="/test-cloudflare" className="text-sm hover:text-primary transition-colors">
              R2テスト
            </Link>
            <Link href="/debug-env" className="text-sm hover:text-primary transition-colors">
              環境変数確認
            </Link>
          </div>
          <p className="text-sm">
            © 2025 オンラインスクール. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
