import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  BookOpen,
  Clock,
  CheckCircle,
  Trophy,
  Target,
  TrendingUp,
  Award,
  Play,
  ArrowRight,
  Calendar,
  Star,
  Users,
  BarChart3,
  Settings
} from 'lucide-react';
import Link from 'next/link';

export default function UserDashboard() {
  // サンプルデータ（実際のアプリではAPIから取得）
  const userStats = [
    {
      name: '受講中プログラム',
      value: '3',
      change: '+1',
      changeType: 'positive',
      icon: BookOpen,
      color: 'text-blue-600'
    },
    {
      name: '完了プログラム',
      value: '2',
      change: '+1',
      changeType: 'positive',
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      name: '総学習時間',
      value: '24時間',
      change: '+5時間',
      changeType: 'positive',
      icon: Clock,
      color: 'text-purple-600'
    },
    {
      name: '獲得ポイント',
      value: '1,250',
      change: '+150',
      changeType: 'positive',
      icon: Trophy,
      color: 'text-yellow-600'
    }
  ];

  const currentPrograms = [
    {
      id: 1,
      title: 'ビジネススキル基礎コース',
      progress: 75,
      totalChapters: 25,
      completedChapters: 19,
      nextChapter: '第20章: データ分析の基礎',
      estimatedTime: '2時間30分',
      lastStudied: '2024-01-20',
      thumbnail: '/api/placeholder/300/200'
    },
    {
      id: 2,
      title: 'マーケティング戦略',
      progress: 45,
      totalChapters: 15,
      completedChapters: 7,
      nextChapter: '第8章: デジタルマーケティング',
      estimatedTime: '3時間15分',
      lastStudied: '2024-01-19',
      thumbnail: '/api/placeholder/300/200'
    },
    {
      id: 3,
      title: 'リーダーシップ開発',
      progress: 20,
      totalChapters: 18,
      completedChapters: 4,
      nextChapter: '第5章: チームビルディング',
      estimatedTime: '4時間20分',
      lastStudied: '2024-01-18',
      thumbnail: '/api/placeholder/300/200'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'completion',
      title: '第19章を完了',
      program: 'ビジネススキル基礎コース',
      time: '2時間前',
      points: 50
    },
    {
      id: 2,
      type: 'achievement',
      title: '継続学習バッジを獲得',
      program: 'マーケティング戦略',
      time: '1日前',
      points: 100
    },
    {
      id: 3,
      type: 'test',
      title: '第7章のテストに合格',
      program: 'マーケティング戦略',
      time: '2日前',
      points: 75
    },
    {
      id: 4,
      type: 'start',
      title: '新しいプログラムを開始',
      program: 'リーダーシップ開発',
      time: '3日前',
      points: 25
    }
  ];

  const achievements = [
    {
      id: 1,
      title: '初回完了',
      description: '最初のチャプターを完了しました',
      icon: CheckCircle,
      earnedAt: '2024-01-15',
      points: 50
    },
    {
      id: 2,
      title: '継続学習',
      description: '7日連続で学習しました',
      icon: Calendar,
      earnedAt: '2024-01-20',
      points: 100
    },
    {
      id: 3,
      title: '高得点',
      description: 'テストで90点以上を獲得しました',
      icon: Star,
      earnedAt: '2024-01-18',
      points: 75
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'completion':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'achievement':
        return <Trophy className="w-5 h-5 text-yellow-600" />;
      case 'test':
        return <Target className="w-5 h-5 text-blue-600" />;
      case 'start':
        return <Play className="w-5 h-5 text-purple-600" />;
      default:
        return <BookOpen className="w-5 h-5 text-gray-600" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'completion':
        return 'bg-green-100';
      case 'achievement':
        return 'bg-yellow-100';
      case 'test':
        return 'bg-blue-100';
      case 'start':
        return 'bg-purple-100';
      default:
        return 'bg-gray-100';
    }
  };

  return (
    <div className="space-y-8">
      {/* ヘッダー */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">ダッシュボード</h1>
        <p className="text-gray-600 mt-2">学習の進捗状況と最新の活動を確認できます</p>
      </div>

      {/* 統計カード */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {userStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.name} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                    <span className="text-sm font-medium text-green-600">{stat.change}</span>
                    <span className="text-sm text-gray-500 ml-1">今週</span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg bg-gray-50 ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 受講中プログラム */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">受講中プログラム</h2>
            <Link href="/mypage/learning">
              <Button variant="outline" size="sm">
                すべて表示
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
          
          <div className="space-y-4">
            {currentPrograms.map((program) => (
              <div key={program.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{program.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{program.nextChapter}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {program.estimatedTime}
                      </span>
                      <span>最終学習: {program.lastStudied}</span>
                    </div>
                  </div>
                  <Badge variant="outline">
                    {program.completedChapters}/{program.totalChapters}章
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>進捗</span>
                    <span>{program.progress}%</span>
                  </div>
                  <Progress value={program.progress} className="h-2" />
                </div>
                
                <div className="mt-3">
                  <Link href={`/program/${program.id}`}>
                    <Button size="sm" className="w-full">
                      <Play className="w-4 h-4 mr-2" />
                      学習を続ける
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* 最近の活動 */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">最近の活動</h2>
            <Link href="/mypage/learning">
              <Button variant="outline" size="sm">
                詳細を見る
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
          
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getActivityColor(activity.type)}`}>
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                  <p className="text-sm text-gray-500">{activity.program}</p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-gray-400">{activity.time}</p>
                    <div className="flex items-center text-xs text-yellow-600">
                      <Trophy className="w-3 h-3 mr-1" />
                      +{activity.points}pt
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* 実績・バッジ */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">最近獲得した実績</h2>
          <Link href="/mypage/achievements">
            <Button variant="outline" size="sm">
              すべて表示
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {achievements.map((achievement) => {
            const Icon = achievement.icon;
            return (
              <div key={achievement.id} className="p-4 bg-gray-50 rounded-lg text-center">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{achievement.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                <div className="flex items-center justify-center text-xs text-yellow-600">
                  <Trophy className="w-3 h-3 mr-1" />
                  +{achievement.points}pt
                </div>
                <p className="text-xs text-gray-400 mt-2">{achievement.earnedAt}</p>
              </div>
            );
          })}
        </div>
      </Card>

      {/* クイックアクション */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6">クイックアクション</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/program">
            <Button className="h-20 flex flex-col items-center justify-center space-y-2 w-full">
              <BookOpen className="w-6 h-6" />
              <span>新しいプログラムを探す</span>
            </Button>
          </Link>
          <Link href="/mypage/learning">
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2 w-full">
              <BarChart3 className="w-6 h-6" />
              <span>学習履歴を見る</span>
            </Button>
          </Link>
          <Link href="/mypage/settings">
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2 w-full">
              <Settings className="w-6 h-6" />
              <span>設定を変更</span>
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
