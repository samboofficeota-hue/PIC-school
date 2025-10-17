import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Users,
  BookOpen,
  TrendingUp,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowUpRight,
  BarChart3
} from 'lucide-react';

export default function AdminDashboard() {
  // サンプルデータ（実際のアプリではAPIから取得）
  const stats = [
    {
      name: '総ユーザー数',
      value: '1,234',
      change: '+12%',
      changeType: 'positive',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      name: 'アクティブユーザー',
      value: '856',
      change: '+8%',
      changeType: 'positive',
      icon: TrendingUp,
      color: 'text-green-600'
    },
    {
      name: '総プログラム数',
      value: '12',
      change: '+2',
      changeType: 'positive',
      icon: BookOpen,
      color: 'text-purple-600'
    },
    {
      name: '今月の収益',
      value: '¥2,450,000',
      change: '+15%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'text-yellow-600'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      user: '田中 太郎',
      action: '新しいプログラムを購入',
      program: 'ビジネススキル基礎コース',
      time: '2時間前',
      type: 'purchase'
    },
    {
      id: 2,
      user: '佐藤 花子',
      action: 'チャプターを完了',
      program: 'マーケティング戦略',
      time: '4時間前',
      type: 'completion'
    },
    {
      id: 3,
      user: '鈴木 一郎',
      action: 'アカウントを登録',
      program: '-',
      time: '6時間前',
      type: 'registration'
    },
    {
      id: 4,
      user: '高橋 美咲',
      action: '支払いを完了',
      program: 'データ分析コース',
      time: '8時間前',
      type: 'payment'
    }
  ];

  const topPrograms = [
    {
      name: 'ビジネススキル基礎コース',
      students: 456,
      revenue: '¥1,200,000',
      completion: 78
    },
    {
      name: 'マーケティング戦略',
      students: 234,
      revenue: '¥680,000',
      completion: 82
    },
    {
      name: 'データ分析コース',
      students: 189,
      revenue: '¥520,000',
      completion: 75
    }
  ];

  return (
    <div className="space-y-8">
      {/* ヘッダー */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">ダッシュボード</h1>
        <p className="text-gray-600 mt-2">システムの概要と最新の活動を確認できます</p>
      </div>

      {/* 統計カード */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.name} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    <span className={`text-sm font-medium ${
                      stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">先月比</span>
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
        {/* 最近の活動 */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">最近の活動</h2>
            <Button variant="outline" size="sm">
              すべて表示
              <ArrowUpRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
          
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  activity.type === 'purchase' ? 'bg-green-100' :
                  activity.type === 'completion' ? 'bg-blue-100' :
                  activity.type === 'registration' ? 'bg-purple-100' :
                  'bg-yellow-100'
                }`}>
                  {activity.type === 'purchase' ? (
                    <DollarSign className="w-4 h-4 text-green-600" />
                  ) : activity.type === 'completion' ? (
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                  ) : activity.type === 'registration' ? (
                    <Users className="w-4 h-4 text-purple-600" />
                  ) : (
                    <Clock className="w-4 h-4 text-yellow-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.user} が {activity.action}
                  </p>
                  <p className="text-sm text-gray-500">{activity.program}</p>
                  <p className="text-xs text-gray-400">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* 人気プログラム */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">人気プログラム</h2>
            <Button variant="outline" size="sm">
              詳細を見る
              <ArrowUpRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
          
          <div className="space-y-4">
            {topPrograms.map((program, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{program.name}</h3>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                    <span>{program.students} 名の受講者</span>
                    <span>完了率: {program.completion}%</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{program.revenue}</p>
                  <Badge variant="secondary" className="mt-1">
                    収益
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* クイックアクション */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6">クイックアクション</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button className="h-20 flex flex-col items-center justify-center space-y-2">
            <Users className="w-6 h-6" />
            <span>新しいユーザーを追加</span>
          </Button>
          <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
            <BookOpen className="w-6 h-6" />
            <span>プログラムを作成</span>
          </Button>
          <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
            <BarChart3 className="w-6 h-6" />
            <span>レポートを生成</span>
          </Button>
        </div>
      </Card>
    </div>
  );
}
