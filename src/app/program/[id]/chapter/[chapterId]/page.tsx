import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  BookOpen,
  Clock,
  Target,
  CheckCircle,
  Play,
  ArrowLeft,
  MessageSquare,
  BarChart3,
  Award,
  Users,
  Calendar,
  Star,
  Download,
  Share2,
  Home,
  ChevronRight,
  FileText,
  Video,
  Image,
  HelpCircle
} from 'lucide-react';
import Link from 'next/link';

interface ChapterDetailPageProps {
  params: {
    id: string;
    chapterId: string;
  };
}

export default function ChapterDetailPage({ params }: ChapterDetailPageProps) {
  // サンプルデータ（実際のアプリではAPIから取得）
  const chapter = {
    id: params.chapterId,
    programId: params.id,
    title: 'ビジネスの基本原則',
    description: 'ビジネスの基本概念と原則について学びます。',
    duration: '約45分',
    level: '基礎レベル',
    progress: 0,
    topics: [
      {
        id: 1,
        title: 'ビジネスの基本原則',
        description: 'ビジネスの基本概念と原則について学びます。',
        duration: '約1分',
        type: 'content',
        isCompleted: false,
        isLocked: false,
        content: {
          importantPoints: [
            'ビジネスの成功には基本原則の理解が不可欠である',
            'ビジネスの本質は価値の創造と交換にある'
          ],
          detailedContent: [
            '市場における需要と供給の関係は、ビジネスの基盤となる重要な概念です。顧客のニーズを正確に把握し、それに対応する価値ある商品やサービスを提供することで、持続可能なビジネスを構築できます。',
            '顧客価値の創造は、単に製品やサービスを提供するだけでなく、顧客の課題を解決し、生活や仕事をより良くすることを意味します。この価値創造のプロセスこそが、ビジネスの本質的な目的です。'
          ]
        }
      },
      {
        id: 2,
        title: '市場分析の重要性',
        description: '市場の動向を分析し、競合状況を把握する方法を学びます。',
        duration: '約8分',
        type: 'content',
        isCompleted: false,
        isLocked: true,
        content: {
          importantPoints: [
            '市場分析は戦略立案の基礎となる',
            '競合分析により差別化ポイントを見つける'
          ],
          detailedContent: [
            '市場分析は、ビジネス戦略を立てる上で最も重要な要素の一つです。市場の規模、成長性、競合状況、顧客のニーズなどを包括的に分析することで、効果的な戦略を立案できます。',
            '競合分析では、直接競合だけでなく、間接競合や代替品も考慮する必要があります。競合の強みと弱みを分析し、自社の差別化ポイントを見つけることが重要です。'
          ]
        }
      },
      {
        id: 3,
        title: '顧客理解とペルソナ設計',
        description: 'ターゲット顧客を深く理解し、ペルソナを作成する方法を学びます。',
        duration: '約12分',
        type: 'content',
        isCompleted: false,
        isLocked: true,
        content: {
          importantPoints: [
            'ペルソナ設計により顧客像を明確化する',
            '顧客の行動パターンとニーズを深く理解する'
          ],
          detailedContent: [
            'ペルソナ設計は、抽象的な「顧客」を具体的な人物像として描き出す手法です。年齢、職業、価値観、行動パターンなどを詳細に設定することで、より効果的なマーケティング戦略を立案できます。',
            '顧客理解を深めるためには、定量的なデータだけでなく、定性的な洞察も重要です。インタビューや観察を通じて、顧客の潜在的なニーズや課題を発見することができます。'
          ]
        }
      },
      {
        id: 4,
        title: 'バリュープロポジションの構築',
        description: '顧客に提供する価値を明確に定義し、伝える方法を学びます。',
        duration: '約15分',
        type: 'content',
        isCompleted: false,
        isLocked: true,
        content: {
          importantPoints: [
            'バリュープロポジションは競合との差別化の核心',
            '顧客の課題解決に焦点を当てた価値提案が重要'
          ],
          detailedContent: [
            'バリュープロポジションは、自社の商品やサービスが顧客に提供する価値を明確に定義したものです。競合との差別化を図り、顧客に選ばれる理由を明確に伝えることが重要です。',
            '効果的なバリュープロポジションは、顧客の具体的な課題やニーズに基づいて構築されます。顧客が抱える問題を深く理解し、それを解決する独自のアプローチを提示することが成功の鍵となります。'
          ]
        }
      },
      {
        id: 5,
        title: '第1章のまとめとテスト',
        description: '第1章で学んだ内容をまとめ、理解度をテストします。',
        duration: '約9分',
        type: 'test',
        isCompleted: false,
        isLocked: true,
        content: {
          importantPoints: [
            '学習内容の振り返りと定着',
            '理解度の確認と改善点の把握'
          ],
          detailedContent: [
            '本章では、ビジネスの基本原則について学習しました。市場分析、顧客理解、バリュープロポジションの構築など、ビジネス戦略の基礎となる重要な概念を理解できたはずです。',
            'テストを通じて、学習内容の理解度を確認し、不足している部分を明確にしましょう。理解が不十分な部分があれば、該当するトピックを再度学習することをお勧めします。'
          ]
        }
      }
    ]
  };

  const currentTopic = chapter.topics[0]; // 最初のトピックを表示

  return (
    <div className="min-h-screen bg-background">
      {/* ヘッダー */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href={`/program/${params.id}`}>
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  戻る
                </Button>
              </Link>
              <div className="h-6 w-px bg-border" />
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>第1章</span>
                <ChevronRight className="w-4 h-4" />
                <span>チャプター1</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                共有
              </Button>
              <Link href="/">
                <Button variant="outline" size="sm">
                  <Home className="w-4 h-4 mr-2" />
                  ホームに戻る
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* 左側サイドバー - カリキュラム */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <div className="space-y-6">
                {/* 学習進捗 */}
                <div>
                  <h3 className="font-semibold mb-4">学習進捗</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>全体の進捗</span>
                        <span>{chapter.progress}%</span>
                      </div>
                      <Progress value={chapter.progress} className="h-2" />
                    </div>
                    <div className="text-sm text-muted-foreground">
                      0/25 チャプター完了
                    </div>
                  </div>
                </div>

                {/* カリキュラム */}
                <div>
                  <h3 className="font-semibold mb-4">カリキュラム</h3>
                  <div className="space-y-2">
                    {chapter.topics.map((topic, index) => (
                      <div
                        key={topic.id}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          index === 0
                            ? 'bg-primary text-primary-foreground'
                            : topic.isLocked
                            ? 'bg-muted/50 text-muted-foreground cursor-not-allowed'
                            : 'hover:bg-muted'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0">
                            {topic.isCompleted ? (
                              <CheckCircle className="w-5 h-5 text-green-500" />
                            ) : topic.isLocked ? (
                              <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center">
                                <span className="text-xs font-medium">{index + 1}</span>
                              </div>
                            ) : (
                              <Play className="w-5 h-5" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate">
                              {topic.title}
                            </div>
                            <div className="text-xs opacity-75 truncate">
                              {topic.duration}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* 右側メインコンテンツ */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              {/* チャプター情報 */}
              <Card className="p-8" style={{ background: 'var(--gradient-primary)' }}>
                <div className="text-white">
                  <div className="flex items-center gap-3 mb-4">
                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                      チャプター1
                    </Badge>
                  </div>
                  <h1 className="text-3xl font-bold mb-4">{currentTopic.title}</h1>
                  <div className="flex items-center gap-6 text-white/90">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{currentTopic.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Target className="w-4 h-4" />
                      <span>{chapter.level}</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* 重要なポイント */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">重要なポイント</h2>
                <ol className="space-y-3">
                  {currentTopic.content.importantPoints.map((point, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ol>
              </Card>

              {/* タブナビゲーション */}
              <Card className="p-6">
                <div className="flex space-x-1 mb-6">
                  {[
                    { id: 'content', label: '詳細内容', icon: FileText },
                    { id: 'visual', label: 'ビジュアル', icon: Image },
                    { id: 'resources', label: 'リソース', icon: Download }
                  ].map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          tab.id === 'content'
                            ? 'bg-primary text-primary-foreground'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                {/* 詳細内容 */}
                <div className="space-y-4">
                  {currentTopic.content.detailedContent.map((paragraph, index) => (
                    <p key={index} className="text-muted-foreground leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </Card>

              {/* ナビゲーションボタン */}
              <div className="flex justify-between">
                <Button variant="outline" disabled>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  前のチャプター
                </Button>
                <Button>
                  次のチャプター
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ヘルプボタン */}
      <div className="fixed bottom-6 right-6">
        <Button
          size="lg"
          className="rounded-full w-14 h-14 shadow-lg"
          style={{ background: 'var(--gradient-primary)' }}
        >
          <HelpCircle className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
}
