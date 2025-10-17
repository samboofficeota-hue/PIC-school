'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  BookOpen,
  Clock,
  CheckCircle,
  Play,
  Calendar,
  Filter,
  Search,
  Download,
  Star,
  Award,
  Target,
  BarChart3,
  TrendingUp,
  ArrowRight,
  Eye
} from 'lucide-react';
import Link from 'next/link';

export default function LearningHistory() {
  const [activeTab, setActiveTab] = useState<'all' | 'completed' | 'in_progress' | 'not_started'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'progress' | 'name'>('recent');

  // サンプルデータ（実際のアプリではAPIから取得）
  const learningHistory = [
    {
      id: 1,
      programId: 1,
      title: 'ビジネススキル基礎コース',
      description: 'ビジネスの基本原則から実践的なスキルまで、体系的に学べる総合コースです。',
      status: 'in_progress',
      progress: 75,
      totalChapters: 25,
      completedChapters: 19,
      totalTime: '5時間30分',
      timeSpent: '4時間15分',
      lastStudied: '2024-01-20',
      startedAt: '2024-01-15',
      completedAt: null,
      rating: 4.8,
      thumbnail: '/api/placeholder/300/200',
      instructor: '田中 太郎',
      category: 'ビジネス基礎'
    },
    {
      id: 2,
      programId: 2,
      title: 'マーケティング戦略',
      description: '効果的なマーケティング戦略の立案と実行方法を学びます。',
      status: 'in_progress',
      progress: 45,
      totalChapters: 15,
      completedChapters: 7,
      totalTime: '3時間20分',
      timeSpent: '1時間30分',
      lastStudied: '2024-01-19',
      startedAt: '2024-01-10',
      completedAt: null,
      rating: 4.6,
      thumbnail: '/api/placeholder/300/200',
      instructor: '佐藤 花子',
      category: 'マーケティング'
    },
    {
      id: 3,
      programId: 3,
      title: 'データ分析コース',
      description: 'データに基づいた意思決定を行うための分析手法を学びます。',
      status: 'completed',
      progress: 100,
      totalChapters: 20,
      completedChapters: 20,
      totalTime: '4時間15分',
      timeSpent: '4時間15分',
      lastStudied: '2024-01-18',
      startedAt: '2024-01-05',
      completedAt: '2024-01-18',
      rating: 4.9,
      thumbnail: '/api/placeholder/300/200',
      instructor: '鈴木 一郎',
      category: 'データ分析'
    },
    {
      id: 4,
      programId: 4,
      title: 'リーダーシップ開発',
      description: '効果的なリーダーシップスキルを身につけるためのコースです。',
      status: 'not_started',
      progress: 0,
      totalChapters: 18,
      completedChapters: 0,
      totalTime: '3時間45分',
      timeSpent: '0分',
      lastStudied: null,
      startedAt: null,
      completedAt: null,
      rating: 4.7,
      thumbnail: '/api/placeholder/300/200',
      instructor: '高橋 美咲',
      category: 'リーダーシップ'
    }
  ];

  const filteredHistory = learningHistory.filter(item => {
    const matchesTab = activeTab === 'all' || item.status === activeTab;
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />完了</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-100 text-blue-800"><Play className="w-3 h-3 mr-1" />受講中</Badge>;
      case 'not_started':
        return <Badge className="bg-gray-100 text-gray-800">未開始</Badge>;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'border-green-200 bg-green-50';
      case 'in_progress':
        return 'border-blue-200 bg-blue-50';
      case 'not_started':
        return 'border-gray-200 bg-gray-50';
      default:
        return 'border-gray-200';
    }
  };

  const tabs = [
    { id: 'all', name: 'すべて', count: learningHistory.length },
    { id: 'completed', name: '完了済み', count: learningHistory.filter(item => item.status === 'completed').length },
    { id: 'in_progress', name: '受講中', count: learningHistory.filter(item => item.status === 'in_progress').length },
    { id: 'not_started', name: '未開始', count: learningHistory.filter(item => item.status === 'not_started').length }
  ];

  return (
    <div className="space-y-8">
      {/* ヘッダー */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">学習履歴</h1>
          <p className="text-gray-600 mt-2">受講したプログラムの履歴と進捗を確認できます</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            履歴をエクスポート
          </Button>
        </div>
      </div>

      {/* 統計カード */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">総プログラム数</p>
              <p className="text-2xl font-bold text-gray-900">{learningHistory.length}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">完了済み</p>
              <p className="text-2xl font-bold text-gray-900">
                {learningHistory.filter(item => item.status === 'completed').length}
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">総学習時間</p>
              <p className="text-2xl font-bold text-gray-900">
                {learningHistory.reduce((total, item) => {
                  const time = item.timeSpent.replace('時間', '').replace('分', '');
                  return total + (time.includes('時間') ? parseInt(time) * 60 : parseInt(time));
                }, 0) / 60}時間
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">平均評価</p>
              <p className="text-2xl font-bold text-gray-900">
                {(learningHistory.reduce((sum, item) => sum + item.rating, 0) / learningHistory.length).toFixed(1)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* タブとフィルター */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* タブ */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.name} ({tab.count})
              </button>
            ))}
          </div>

          {/* 検索とソート */}
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="プログラム名で検索..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="recent">最近の活動順</option>
              <option value="progress">進捗順</option>
              <option value="name">名前順</option>
            </select>
          </div>
        </div>
      </Card>

      {/* 学習履歴一覧 */}
      <div className="space-y-6">
        {filteredHistory.map((item) => (
          <Card key={item.id} className={`p-6 ${getStatusColor(item.status)}`}>
            <div className="flex flex-col lg:flex-row gap-6">
              {/* サムネイル */}
              <div className="w-full lg:w-48 h-32 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-12 h-12 text-gray-400" />
              </div>

              {/* コンテンツ */}
              <div className="flex-1 space-y-4">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
                      {getStatusBadge(item.status)}
                    </div>
                    <p className="text-gray-600 mb-3">{item.description}</p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {item.instructor}
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {item.totalTime}
                      </span>
                      <span className="flex items-center">
                        <Star className="w-4 h-4 mr-1" />
                        {item.rating}
                      </span>
                      <Badge variant="outline">{item.category}</Badge>
                    </div>
                  </div>
                  
                  <div className="flex flex-col lg:items-end space-y-2">
                    <div className="text-right">
                      <div className="text-sm text-gray-600">進捗</div>
                      <div className="text-2xl font-bold text-gray-900">{item.progress}%</div>
                    </div>
                    <div className="w-32">
                      <Progress value={item.progress} className="h-2" />
                    </div>
                  </div>
                </div>

                {/* 進捗詳細 */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600">完了チャプター</div>
                    <div className="font-semibold">{item.completedChapters}/{item.totalChapters}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">学習時間</div>
                    <div className="font-semibold">{item.timeSpent}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">最終学習</div>
                    <div className="font-semibold">
                      {item.lastStudied ? new Date(item.lastStudied).toLocaleDateString('ja-JP') : '-'}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600">開始日</div>
                    <div className="font-semibold">
                      {item.startedAt ? new Date(item.startedAt).toLocaleDateString('ja-JP') : '-'}
                    </div>
                  </div>
                </div>

                {/* アクションボタン */}
                <div className="flex flex-wrap gap-2">
                  {item.status === 'not_started' ? (
                    <Link href={`/program/${item.programId}`}>
                      <Button>
                        <Play className="w-4 h-4 mr-2" />
                        学習を開始
                      </Button>
                    </Link>
                  ) : item.status === 'completed' ? (
                    <>
                      <Link href={`/program/${item.programId}`}>
                        <Button variant="outline">
                          <Eye className="w-4 h-4 mr-2" />
                          内容を確認
                        </Button>
                      </Link>
                      <Button variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        証明書をダウンロード
                      </Button>
                    </>
                  ) : (
                    <Link href={`/program/${item.programId}`}>
                      <Button>
                        <Play className="w-4 h-4 mr-2" />
                        学習を続ける
                      </Button>
                    </Link>
                  )}
                  
                  <Button variant="outline">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    詳細分析
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* 空の状態 */}
      {filteredHistory.length === 0 && (
        <Card className="p-12 text-center">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">学習履歴がありません</h3>
          <p className="text-gray-600 mb-6">
            {activeTab === 'all' 
              ? 'まだプログラムを受講していません。'
              : `該当する${tabs.find(tab => tab.id === activeTab)?.name}のプログラムがありません。`
            }
          </p>
          <Link href="/program">
            <Button>
              <BookOpen className="w-4 h-4 mr-2" />
              プログラムを探す
            </Button>
          </Link>
        </Card>
      )}
    </div>
  );
}
