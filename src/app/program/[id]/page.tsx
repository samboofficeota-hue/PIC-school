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
  Share2
} from 'lucide-react';
import Link from 'next/link';

interface ProgramDetailPageProps {
  params: {
    id: string;
  };
}

export default function ProgramDetailPage({ params }: ProgramDetailPageProps) {
  // サンプルデータ（実際のアプリではAPIから取得）
  const program = {
    id: params.id,
    title: 'ビジネススキル基礎コース',
    description: 'ビジネスの基本原則から実践的なスキルまで、体系的に学べる総合コースです。',
    instructor: '田中 太郎',
    duration: '5時間30分',
    level: '初級',
    rating: 4.8,
    students: 1250,
    price: 0,
    isFree: true,
    progress: 0,
    chapters: [
      {
        id: 1,
        title: 'ビジネスの基本原則',
        description: 'ビジネスの基本概念と原則について学びます。',
        duration: '45分',
        isCompleted: false,
        isLocked: false,
        topics: [
          'ビジネスとは何か',
          '市場の仕組み',
          '顧客価値の創造',
          '競争優位性の構築'
        ]
      },
      {
        id: 2,
        title: '市場分析と顧客理解',
        description: '市場の動向を分析し、顧客のニーズを理解する方法を学びます。',
        duration: '60分',
        isCompleted: false,
        isLocked: true,
        topics: [
          '市場調査の方法',
          '顧客セグメンテーション',
          '競合分析',
          'SWOT分析'
        ]
      },
      {
        id: 3,
        title: '戦略立案と計画',
        description: '効果的なビジネス戦略を立案し、実行計画を立てる方法を学びます。',
        duration: '75分',
        isCompleted: false,
        isLocked: true,
        topics: [
          '戦略フレームワーク',
          '目標設定',
          'リソース配分',
          'リスク管理'
        ]
      },
      {
        id: 4,
        title: '実行とオペレーション',
        description: '戦略を実行し、日常的なオペレーションを管理する方法を学びます。',
        duration: '80分',
        isCompleted: false,
        isLocked: true,
        topics: [
          'プロジェクト管理',
          'チームビルディング',
          'プロセス改善',
          '品質管理'
        ]
      },
      {
        id: 5,
        title: 'データ分析と意思決定',
        description: 'データに基づいた意思決定を行うための分析手法を学びます。',
        duration: '70分',
        isCompleted: false,
        isLocked: true,
        topics: [
          'データの収集と整理',
          '分析手法',
          '予測モデル',
          '意思決定フレームワーク'
        ]
      }
    ],
    features: [
      {
        icon: BookOpen,
        title: '5章25チャプター',
        description: '充実した学習コンテンツ'
      },
      {
        icon: MessageSquare,
        title: 'AI学習アシスタント',
        description: '24時間いつでも質問可能'
      },
      {
        icon: Target,
        title: '実践的なテスト',
        description: '理解度を確認できるテスト'
      },
      {
        icon: BarChart3,
        title: '進捗トラッキング',
        description: '学習の進捗を可視化'
      }
    ],
    requirements: [
      '基本的なPC操作スキル',
      'インターネット接続環境',
      '学習への意欲'
    ],
    whatYouWillLearn: [
      'ビジネスの基本原則と概念',
      '市場分析と顧客理解の方法',
      '効果的な戦略立案の手法',
      '実行力とオペレーション管理',
      'データに基づいた意思決定'
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      {/* ヘッダー */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  戻る
                </Button>
              </Link>
              <div className="h-6 w-px bg-border" />
              <h1 className="text-lg font-semibold">{program.title}</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                共有
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                ダウンロード
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* メインコンテンツ */}
          <div className="lg:col-span-2 space-y-8">
            {/* プログラム概要 */}
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{program.title}</h2>
                    <p className="text-muted-foreground text-lg">{program.description}</p>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {program.isFree ? '無料' : `¥${program.price.toLocaleString()}`}
                  </Badge>
                </div>

                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{program.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Target className="w-4 h-4" />
                    <span>{program.level}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span>{program.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{program.students.toLocaleString()}人が受講</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* 学習内容 */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">学習内容</h3>
              <div className="space-y-4">
                {program.chapters.map((chapter, index) => (
                  <div
                    key={chapter.id}
                    className={`p-4 rounded-lg border ${
                      chapter.isLocked
                        ? 'bg-muted/50 border-muted'
                        : 'hover:bg-muted/50 border-border'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        {chapter.isCompleted ? (
                          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                            <CheckCircle className="w-5 h-5 text-white" />
                          </div>
                        ) : chapter.isLocked ? (
                          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                            <span className="text-sm font-medium text-muted-foreground">
                              {index + 1}
                            </span>
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                            <Play className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium">{chapter.title}</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              {chapter.description}
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {chapter.duration}
                              </span>
                              <span>{chapter.topics.length}トピック</span>
                            </div>
                          </div>
                          {!chapter.isLocked && (
                            <Link href={`/program/${params.id}/chapter/${chapter.id}`}>
                              <Button size="sm" variant="outline">
                                開始
                              </Button>
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* 学習目標 */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">このコースで学べること</h3>
              <ul className="space-y-2">
                {program.whatYouWillLearn.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* 前提条件 */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">前提条件</h3>
              <ul className="space-y-2">
                {program.requirements.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          {/* サイドバー */}
          <div className="space-y-6">
            {/* 学習開始ボタン */}
            <Card className="p-6">
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">
                    {program.isFree ? '無料' : `¥${program.price.toLocaleString()}`}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {program.isFree ? '今すぐ学習を開始できます' : '一度購入すれば永続的にアクセス可能'}
                  </p>
                </div>
                
                <Link href={`/program/${params.id}/chapter/1`}>
                  <Button className="w-full h-12 text-lg">
                    <Play className="w-5 h-5 mr-2" />
                    学習を開始する
                  </Button>
                </Link>
                
                <div className="text-center text-sm text-muted-foreground">
                  30日間の返金保証付き
                </div>
              </div>
            </Card>

            {/* 進捗状況 */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">学習進捗</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>全体の進捗</span>
                    <span>{program.progress}%</span>
                  </div>
                  <Progress value={program.progress} className="h-2" />
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">完了済み</div>
                    <div className="font-semibold">0章</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">残り</div>
                    <div className="font-semibold">5章</div>
                  </div>
                </div>
              </div>
            </Card>

            {/* コースの特徴 */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">コースの特徴</h3>
              <div className="space-y-3">
                {program.features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div key={index} className="flex items-start gap-3">
                      <Icon className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-sm">{feature.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {feature.description}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* 講師情報 */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">講師</h3>
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
                  {program.instructor.charAt(0)}
                </div>
                <div>
                  <div className="font-medium">{program.instructor}</div>
                  <div className="text-sm text-muted-foreground">ビジネスコンサルタント</div>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm">4.8 (125件のレビュー)</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
