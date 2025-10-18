'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
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
  Settings,
  Loader2
} from 'lucide-react';
import Link from 'next/link';

interface UserStats {
  enrolledPrograms: number;
  completedPrograms: number;
  totalLearningTime: number;
  totalPoints: number;
}

interface UserProgram {
  id: number;
  programs: {
    id: number;
    title: string;
    description: string;
    thumbnail_url: string;
    instructor_name: string;
    duration_hours: number;
    difficulty_level: string;
    category: string;
  };
  progress_percentage: number;
  enrolled_at: string;
  completed_at: string | null;
}

interface UserAchievement {
  id: number;
  earned_at: string;
  points_earned: number;
  achievements: {
    id: number;
    name: string;
    description: string;
    icon_url: string;
    points: number;
    category: string;
    rarity: string;
  };
}

export default function UserDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [userStats, setUserStats] = useState<UserStats>({
    enrolledPrograms: 0,
    completedPrograms: 0,
    totalLearningTime: 0,
    totalPoints: 0
  });
  const [userPrograms, setUserPrograms] = useState<UserProgram[]>([]);
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);

  useEffect(() => {
    console.log('Auth state:', { user, authLoading });
    if (user && !authLoading) {
      fetchUserData();
    } else if (!user && !authLoading) {
      setLoading(false);
    }
  }, [user, authLoading]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      
      // 並行してデータを取得
      const [programsRes, achievementsRes, pointsRes] = await Promise.all([
        fetch('/api/user/programs'),
        fetch('/api/user/achievements'),
        fetch('/api/user/points')
      ]);

      const [programsData, achievementsData, pointsData] = await Promise.all([
        programsRes.json(),
        achievementsRes.json(),
        pointsRes.json()
      ]);

      if (programsData.data) {
        setUserPrograms(programsData.data);
        setUserStats(prev => ({
          ...prev,
          enrolledPrograms: programsData.data.length,
          completedPrograms: programsData.data.filter((p: UserProgram) => p.completed_at).length
        }));
      }

      if (achievementsData.data) {
        setUserAchievements(achievementsData.data);
      }

      if (pointsData.data) {
        setUserStats(prev => ({
          ...prev,
          totalPoints: pointsData.data.total_points || 0
        }));
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">
            {authLoading ? '認証中...' : 'データを読み込み中...'}
          </p>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <p className="text-gray-600 mb-4">ログインが必要です</p>
          <Link href="/auth/login">
            <Button>ログインページへ</Button>
          </Link>
        </Card>
      </div>
    );
  }

  // 統計データの準備
  const statsData = [
    {
      name: '受講中プログラム',
      value: userStats.enrolledPrograms.toString(),
      change: '+0',
      changeType: 'positive',
      icon: BookOpen,
      color: 'text-blue-600'
    },
    {
      name: '完了プログラム',
      value: userStats.completedPrograms.toString(),
      change: '+0',
      changeType: 'positive',
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      name: '総学習時間',
      value: `${userStats.totalLearningTime}時間`,
      change: '+0時間',
      changeType: 'positive',
      icon: Clock,
      color: 'text-purple-600'
    },
    {
      name: '獲得ポイント',
      value: userStats.totalPoints.toLocaleString(),
      change: '+0',
      changeType: 'positive',
      icon: Trophy,
      color: 'text-yellow-600'
    }
  ];

  // 現在のプログラムデータ（実際のデータから生成）
  const currentPrograms = userPrograms.map(program => ({
    id: program.id,
    title: program.programs.title,
    nextChapter: `第${Math.floor(program.progress_percentage / 20) + 1}章`,
    completedChapters: Math.floor(program.progress_percentage / 20),
    totalChapters: 5, // 仮の値
    progress: program.progress_percentage,
    estimatedTime: `${program.programs.duration_hours * 60}分`,
    lastStudied: program.completed_at ? '完了' : '継続中',
    difficulty: program.programs.difficulty_level,
    thumbnail: program.programs.thumbnail_url || '/api/placeholder/300/200'
  }));

  // 最近の活動データ（実績から生成）
  const recentActivities = userAchievements.slice(0, 5).map(achievement => ({
    id: achievement.id,
    type: 'achievement',
    title: achievement.achievements.name,
    program: achievement.achievements.category,
    time: new Date(achievement.earned_at).toLocaleDateString('ja-JP'),
    points: achievement.points_earned
  }));

  return (
    <div className="space-y-8">
      {/* ヘッダー */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">ダッシュボード</h1>
        <p className="text-gray-600 mt-2">学習の進捗状況と最新の活動を確認できます</p>
      </div>

      {/* 統計カード */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.name} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className={`text-sm ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${stat.color.replace('text-', 'bg-').replace('-600', '-100')}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* 現在のプログラム */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">現在のプログラム</h2>
          <Link href="/mypage/learning">
            <Button variant="outline" size="sm">
              すべて表示
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentPrograms.length > 0 ? (
            currentPrograms.map((program) => (
              <Card key={program.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
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

                <div className="mt-4 flex gap-2">
                  <Link href={`/program/${program.programs.id}`} className="flex-1">
                    <Button size="sm" className="w-full">
                      <Play className="w-4 h-4 mr-2" />
                      続きを学習
                    </Button>
                  </Link>
                </div>
              </Card>
            ))
          ) : (
            <Card className="p-8 text-center col-span-full">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">プログラムがありません</h3>
              <p className="text-gray-600 mb-4">新しいプログラムに登録して学習を始めましょう</p>
              <Link href="/">
                <Button>プログラムを探す</Button>
              </Link>
            </Card>
          )}
        </div>
      </div>

      {/* 最近の活動 */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">最近の活動</h2>
          <Link href="/mypage/achievements">
            <Button variant="outline" size="sm">
              すべて表示
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        <Card className="p-6">
          {recentActivities.length > 0 ? (
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between py-3 border-b last:border-b-0">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-full">
                      {activity.type === 'completion' ? (
                        <CheckCircle className="w-5 h-5 text-blue-600" />
                      ) : (
                        <Award className="w-5 h-5 text-yellow-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{activity.title}</p>
                      <p className="text-sm text-gray-600">{activity.program}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">{activity.time}</p>
                    <p className="text-sm font-medium text-green-600">+{activity.points}pt</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">活動がありません</h3>
              <p className="text-gray-600">学習を開始すると、ここに活動が表示されます</p>
            </div>
          )}
        </Card>
      </div>

      {/* クイックアクション */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">クイックアクション</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/mypage/learning">
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2 w-full">
              <BookOpen className="w-6 h-6" />
              <span>学習履歴</span>
            </Button>
          </Link>
          <Link href="/mypage/achievements">
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2 w-full">
              <Trophy className="w-6 h-6" />
              <span>実績・証明書</span>
            </Button>
          </Link>
          <Link href="/mypage/profile">
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2 w-full">
              <Users className="w-6 h-6" />
              <span>プロフィール</span>
            </Button>
          </Link>
          <Link href="/mypage/settings">
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2 w-full">
              <Settings className="w-6 h-6" />
              <span>設定を変更</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}