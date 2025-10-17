'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Search,
  Filter,
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  Users,
  BookOpen,
  Clock,
  CheckCircle,
  Award,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Star,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

interface LearningProgress {
  id: string;
  userId: string;
  userName: string;
  programId: string;
  programName: string;
  chapterId: string;
  chapterName: string;
  progress: number;
  status: 'in_progress' | 'completed' | 'not_started';
  startedAt: string;
  completedAt?: string;
  timeSpent: number; // minutes
  score?: number;
}

interface UserAnalytics {
  userId: string;
  userName: string;
  totalPrograms: number;
  completedPrograms: number;
  totalTimeSpent: number;
  averageScore: number;
  lastActivity: string;
  streak: number;
  achievements: string[];
}

export default function LearningAnalytics() {
  const [activeTab, setActiveTab] = useState<'overview' | 'progress' | 'users'>('overview');
  const [dateRange, setDateRange] = useState('30d');
  const [searchTerm, setSearchTerm] = useState('');

  // サンプルデータ（実際のアプリではAPIから取得）
  const learningProgress: LearningProgress[] = [
    {
      id: '1',
      userId: 'user1',
      userName: '田中 太郎',
      programId: 'prog1',
      programName: 'ビジネススキル基礎コース',
      chapterId: 'ch1',
      chapterName: 'ビジネスの基本原則',
      progress: 100,
      status: 'completed',
      startedAt: '2024-01-15',
      completedAt: '2024-01-16',
      timeSpent: 45,
      score: 85
    },
    {
      id: '2',
      userId: 'user1',
      userName: '田中 太郎',
      programId: 'prog1',
      programName: 'ビジネススキル基礎コース',
      chapterId: 'ch2',
      chapterName: '市場分析と顧客理解',
      progress: 75,
      status: 'in_progress',
      startedAt: '2024-01-17',
      timeSpent: 30,
      score: 78
    },
    {
      id: '3',
      userId: 'user2',
      userName: '佐藤 花子',
      programId: 'prog2',
      programName: 'マーケティング戦略',
      chapterId: 'ch3',
      chapterName: '戦略立案と計画',
      progress: 50,
      status: 'in_progress',
      startedAt: '2024-01-18',
      timeSpent: 20,
      score: 72
    },
    {
      id: '4',
      userId: 'user3',
      userName: '鈴木 一郎',
      programId: 'prog1',
      programName: 'ビジネススキル基礎コース',
      chapterId: 'ch1',
      chapterName: 'ビジネスの基本原則',
      progress: 0,
      status: 'not_started',
      startedAt: '2024-01-20',
      timeSpent: 0
    }
  ];

  const userAnalytics: UserAnalytics[] = [
    {
      userId: 'user1',
      userName: '田中 太郎',
      totalPrograms: 3,
      completedPrograms: 1,
      totalTimeSpent: 180,
      averageScore: 82,
      lastActivity: '2024-01-20',
      streak: 5,
      achievements: ['初回完了', '継続学習', '高得点']
    },
    {
      userId: 'user2',
      userName: '佐藤 花子',
      totalPrograms: 2,
      completedPrograms: 0,
      totalTimeSpent: 120,
      averageScore: 75,
      lastActivity: '2024-01-19',
      streak: 3,
      achievements: ['初回完了']
    },
    {
      userId: 'user3',
      userName: '鈴木 一郎',
      totalPrograms: 1,
      completedPrograms: 0,
      totalTimeSpent: 0,
      averageScore: 0,
      lastActivity: '2024-01-20',
      streak: 0,
      achievements: []
    }
  ];

  const overviewStats = [
    {
      name: '総受講者数',
      value: '1,234',
      change: '+12%',
      changeType: 'positive',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      name: 'アクティブ受講者',
      value: '856',
      change: '+8%',
      changeType: 'positive',
      icon: Activity,
      color: 'text-green-600'
    },
    {
      name: '完了率',
      value: '68%',
      change: '+5%',
      changeType: 'positive',
      icon: Target,
      color: 'text-purple-600'
    },
    {
      name: '平均学習時間',
      value: '2.5時間',
      change: '+15%',
      changeType: 'positive',
      icon: Clock,
      color: 'text-yellow-600'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />完了</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-100 text-blue-800"><Clock className="w-3 h-3 mr-1" />進行中</Badge>;
      case 'not_started':
        return <Badge className="bg-gray-100 text-gray-800">未開始</Badge>;
      default:
        return null;
    }
  };

  const filteredProgress = learningProgress.filter(progress => 
    progress.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    progress.programName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    progress.chapterName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">受講履歴・分析</h1>
          <p className="text-gray-600 mt-2">学習の進捗状況と達成度を分析できます</p>
        </div>
        <div className="flex gap-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="7d">過去7日</option>
            <option value="30d">過去30日</option>
            <option value="90d">過去90日</option>
            <option value="1y">過去1年</option>
          </select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            エクスポート
          </Button>
        </div>
      </div>

      {/* タブ */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            概要
          </button>
          <button
            onClick={() => setActiveTab('progress')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'progress'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            進捗詳細
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'users'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            ユーザー分析
          </button>
        </nav>
      </div>

      {/* 概要タブ */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* 統計カード */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {overviewStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.name} className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                      <div className="flex items-center mt-2">
                        {stat.changeType === 'positive' ? (
                          <ArrowUpRight className="w-4 h-4 text-green-600 mr-1" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4 text-red-600 mr-1" />
                        )}
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 完了率の推移 */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">完了率の推移</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">ビジネススキル基礎コース</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={78} className="w-24" />
                    <span className="text-sm font-medium">78%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">マーケティング戦略</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={65} className="w-24" />
                    <span className="text-sm font-medium">65%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">データ分析コース</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={45} className="w-24" />
                    <span className="text-sm font-medium">45%</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* 学習時間の分布 */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">学習時間の分布</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">0-30分</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                    </div>
                    <span className="text-sm font-medium">25%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">30分-1時間</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '40%' }}></div>
                    </div>
                    <span className="text-sm font-medium">40%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">1-2時間</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '30%' }}></div>
                    </div>
                    <span className="text-sm font-medium">30%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">2時間以上</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{ width: '5%' }}></div>
                    </div>
                    <span className="text-sm font-medium">5%</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* 進捗詳細タブ */}
      {activeTab === 'progress' && (
        <div className="space-y-6">
          {/* 検索 */}
          <Card className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="ユーザー名、プログラム名、チャプター名で検索..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                フィルター
              </Button>
            </div>
          </Card>

          {/* 進捗一覧 */}
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ユーザー
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      プログラム
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      チャプター
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      進捗
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ステータス
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      学習時間
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      スコア
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      完了日
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProgress.map((progress) => (
                    <tr key={progress.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {progress.userName.charAt(0)}
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{progress.userName}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{progress.programName}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{progress.chapterName}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <Progress value={progress.progress} className="w-20" />
                          <span className="text-sm font-medium">{progress.progress}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(progress.status)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {progress.timeSpent}分
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {progress.score ? `${progress.score}点` : '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {progress.completedAt ? new Date(progress.completedAt).toLocaleDateString('ja-JP') : '-'}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* ユーザー分析タブ */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userAnalytics.map((user) => (
              <Card key={user.userId} className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
                    {user.userName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{user.userName}</h3>
                    <p className="text-sm text-gray-500">最終活動: {new Date(user.lastActivity).toLocaleDateString('ja-JP')}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">受講プログラム</span>
                    <span className="text-sm font-medium">{user.completedPrograms}/{user.totalPrograms}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">総学習時間</span>
                    <span className="text-sm font-medium">{user.totalTimeSpent}分</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">平均スコア</span>
                    <span className="text-sm font-medium">{user.averageScore}点</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">連続学習日数</span>
                    <span className="text-sm font-medium">{user.streak}日</span>
                  </div>
                </div>
                
                {user.achievements.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">実績</h4>
                    <div className="flex flex-wrap gap-1">
                      {user.achievements.map((achievement, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          <Award className="w-3 h-3 mr-1" />
                          {achievement}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
