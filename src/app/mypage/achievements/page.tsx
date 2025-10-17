'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Trophy,
  Award,
  Star,
  CheckCircle,
  Calendar,
  Download,
  Share2,
  Filter,
  Search,
  Target,
  Clock,
  BookOpen,
  TrendingUp,
  Users,
  Crown,
  Medal,
  Shield
} from 'lucide-react';

export default function Achievements() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'badges' | 'certificates' | 'milestones'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // サンプルデータ（実際のアプリではAPIから取得）
  const achievements = [
    {
      id: 1,
      type: 'badge',
      title: '継続学習マスター',
      description: '7日連続で学習を継続しました',
      icon: Trophy,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      earnedAt: '2024-01-20',
      points: 100,
      rarity: 'common'
    },
    {
      id: 2,
      type: 'certificate',
      title: 'ビジネススキル基礎コース修了証',
      description: 'ビジネススキル基礎コースを完了しました',
      icon: Award,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      earnedAt: '2024-01-18',
      points: 500,
      rarity: 'rare',
      programName: 'ビジネススキル基礎コース',
      completionDate: '2024-01-18',
      grade: 'A+'
    },
    {
      id: 3,
      type: 'badge',
      title: '高得点キーパー',
      description: 'テストで90点以上を3回獲得しました',
      icon: Star,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      earnedAt: '2024-01-15',
      points: 75,
      rarity: 'uncommon'
    },
    {
      id: 4,
      type: 'milestone',
      title: '初回完了者',
      description: '最初のプログラムを完了しました',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      earnedAt: '2024-01-15',
      points: 50,
      rarity: 'common'
    },
    {
      id: 5,
      type: 'certificate',
      title: 'データ分析コース修了証',
      description: 'データ分析コースを完了しました',
      icon: Award,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
      earnedAt: '2024-01-10',
      points: 500,
      rarity: 'rare',
      programName: 'データ分析コース',
      completionDate: '2024-01-10',
      grade: 'A'
    },
    {
      id: 6,
      type: 'badge',
      title: '学習時間マスター',
      description: '累計学習時間が20時間を超えました',
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      earnedAt: '2024-01-08',
      points: 150,
      rarity: 'uncommon'
    }
  ];

  const stats = [
    {
      label: '総獲得ポイント',
      value: '1,375',
      icon: Trophy,
      color: 'text-yellow-600'
    },
    {
      label: '獲得バッジ数',
      value: '4',
      icon: Medal,
      color: 'text-purple-600'
    },
    {
      label: '修了証明書',
      value: '2',
      icon: Award,
      color: 'text-blue-600'
    },
    {
      label: 'マイルストーン',
      value: '1',
      icon: Target,
      color: 'text-green-600'
    }
  ];

  const filteredAchievements = achievements.filter(achievement => {
    const matchesFilter = activeFilter === 'all' || achievement.type === activeFilter;
    const matchesSearch = achievement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         achievement.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getRarityBadge = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return <Badge variant="outline">コモン</Badge>;
      case 'uncommon':
        return <Badge className="bg-green-100 text-green-800">アンコモン</Badge>;
      case 'rare':
        return <Badge className="bg-blue-100 text-blue-800">レア</Badge>;
      case 'epic':
        return <Badge className="bg-purple-100 text-purple-800">エピック</Badge>;
      case 'legendary':
        return <Badge className="bg-yellow-100 text-yellow-800">レジェンダリー</Badge>;
      default:
        return null;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'badge':
        return <Medal className="w-4 h-4" />;
      case 'certificate':
        return <Award className="w-4 h-4" />;
      case 'milestone':
        return <Target className="w-4 h-4" />;
      default:
        return <Trophy className="w-4 h-4" />;
    }
  };

  const filters = [
    { id: 'all', name: 'すべて', count: achievements.length },
    { id: 'badges', name: 'バッジ', count: achievements.filter(item => item.type === 'badge').length },
    { id: 'certificates', name: '証明書', count: achievements.filter(item => item.type === 'certificate').length },
    { id: 'milestones', name: 'マイルストーン', count: achievements.filter(item => item.type === 'milestone').length }
  ];

  return (
    <div className="space-y-8">
      {/* ヘッダー */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">実績・証明書</h1>
        <p className="text-gray-600 mt-2">獲得したバッジ、証明書、マイルストーンを確認できます</p>
      </div>

      {/* 統計カード */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.color.replace('text-', 'bg-').replace('-600', '-100')}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* フィルターと検索 */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* フィルター */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id as any)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeFilter === filter.id
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {filter.name} ({filter.count})
              </button>
            ))}
          </div>

          {/* 検索 */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="実績名で検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* 実績一覧 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAchievements.map((achievement) => {
          const Icon = achievement.icon;
          return (
            <Card key={achievement.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="text-center space-y-4">
                {/* アイコン */}
                <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${achievement.bgColor}`}>
                  <Icon className={`w-8 h-8 ${achievement.color}`} />
                </div>

                {/* タイトルと説明 */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{achievement.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{achievement.description}</p>
                  
                  {/* 証明書の詳細情報 */}
                  {achievement.type === 'certificate' && achievement.programName && (
                    <div className="text-xs text-gray-500 space-y-1 mb-3">
                      <div>プログラム: {achievement.programName}</div>
                      <div>完了日: {achievement.completionDate}</div>
                      <div>成績: {achievement.grade}</div>
                    </div>
                  )}

                  {/* レアリティとポイント */}
                  <div className="flex items-center justify-center gap-2 mb-3">
                    {getRarityBadge(achievement.rarity)}
                    <div className="flex items-center text-sm text-yellow-600">
                      <Trophy className="w-4 h-4 mr-1" />
                      +{achievement.points}pt
                    </div>
                  </div>

                  {/* 獲得日 */}
                  <div className="flex items-center justify-center text-xs text-gray-500">
                    <Calendar className="w-3 h-3 mr-1" />
                    {new Date(achievement.earnedAt).toLocaleDateString('ja-JP')}
                  </div>
                </div>

                {/* アクションボタン */}
                <div className="flex gap-2">
                  {achievement.type === 'certificate' ? (
                    <>
                      <Button size="sm" className="flex-1">
                        <Download className="w-4 h-4 mr-2" />
                        ダウンロード
                      </Button>
                      <Button size="sm" variant="outline">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </>
                  ) : (
                    <Button size="sm" variant="outline" className="flex-1">
                      <Share2 className="w-4 h-4 mr-2" />
                      共有
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* 空の状態 */}
      {filteredAchievements.length === 0 && (
        <Card className="p-12 text-center">
          <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">実績がありません</h3>
          <p className="text-gray-600 mb-6">
            {activeFilter === 'all' 
              ? 'まだ実績を獲得していません。'
              : `該当する${filters.find(filter => filter.id === activeFilter)?.name}がありません。`
            }
          </p>
          <Button>
            <BookOpen className="w-4 h-4 mr-2" />
            学習を開始する
          </Button>
        </Card>
      )}

      {/* 実績の説明 */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">実績について</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-800">
          <div>
            <div className="flex items-center mb-2">
              <Medal className="w-4 h-4 mr-2" />
              <span className="font-medium">バッジ</span>
            </div>
            <p>学習の進捗や成果に応じて獲得できるデジタルバッジです。</p>
          </div>
          <div>
            <div className="flex items-center mb-2">
              <Award className="w-4 h-4 mr-2" />
              <span className="font-medium">証明書</span>
            </div>
            <p>プログラム完了時に発行される修了証明書です。ダウンロードして印刷できます。</p>
          </div>
          <div>
            <div className="flex items-center mb-2">
              <Target className="w-4 h-4 mr-2" />
              <span className="font-medium">マイルストーン</span>
            </div>
            <p>学習の重要な節目を記録する特別な実績です。</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
