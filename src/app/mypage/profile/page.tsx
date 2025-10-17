'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Edit,
  Save,
  Camera,
  Award,
  BookOpen,
  Clock,
  Star,
  CheckCircle
} from 'lucide-react';

export default function UserProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: '田中 太郎',
    email: 'tanaka@example.com',
    phone: '090-1234-5678',
    birthday: '1990-05-15',
    location: '東京都',
    bio: 'ビジネススキルの向上を目指して学習中です。特にマーケティングとデータ分析に興味があります。',
    joinDate: '2024-01-15',
    avatar: '/api/placeholder/150/150'
  });

  const handleSave = () => {
    // 実際の保存処理
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const userStats = [
    {
      label: '受講プログラム数',
      value: '3',
      icon: BookOpen,
      color: 'text-blue-600'
    },
    {
      label: '完了プログラム数',
      value: '2',
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      label: '総学習時間',
      value: '24時間',
      icon: Clock,
      color: 'text-purple-600'
    },
    {
      label: '獲得ポイント',
      value: '1,250',
      icon: Award,
      color: 'text-yellow-600'
    }
  ];

  const recentAchievements = [
    {
      id: 1,
      title: '継続学習マスター',
      description: '7日連続で学習を継続',
      earnedAt: '2024-01-20',
      icon: Award
    },
    {
      id: 2,
      title: '高得点キーパー',
      description: 'テストで90点以上を3回獲得',
      earnedAt: '2024-01-18',
      icon: Star
    },
    {
      id: 3,
      title: '初回完了者',
      description: '最初のプログラムを完了',
      earnedAt: '2024-01-15',
      icon: CheckCircle
    }
  ];

  return (
    <div className="space-y-8">
      {/* ヘッダー */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">プロフィール</h1>
          <p className="text-gray-600 mt-2">個人情報と学習統計を管理できます</p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                保存
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                キャンセル
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="w-4 h-4 mr-2" />
              編集
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* プロフィール情報 */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">基本情報</h2>
            
            <div className="space-y-6">
              {/* アバター */}
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="w-12 h-12 text-gray-400" />
                  </div>
                  {isEditing && (
                    <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white hover:bg-primary/90">
                      <Camera className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{profile.name}</h3>
                  <p className="text-gray-600">メンバー登録: {profile.joinDate}</p>
                  <Badge className="mt-2">アクティブ</Badge>
                </div>
              </div>

              {/* 個人情報フォーム */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    氏名
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile({...profile, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{profile.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    メールアドレス
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({...profile, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{profile.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    電話番号
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile({...profile, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{profile.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    生年月日
                  </label>
                  {isEditing ? (
                    <input
                      type="date"
                      value={profile.birthday}
                      onChange={(e) => setProfile({...profile, birthday: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{profile.birthday}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    居住地
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.location}
                      onChange={(e) => setProfile({...profile, location: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{profile.location}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  自己紹介
                </label>
                {isEditing ? (
                  <textarea
                    value={profile.bio}
                    onChange={(e) => setProfile({...profile, bio: e.target.value})}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">{profile.bio}</p>
                )}
              </div>
            </div>
          </Card>

          {/* 学習統計 */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">学習統計</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {userStats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                    <Icon className={`w-8 h-8 mx-auto mb-2 ${stat.color}`} />
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* サイドバー */}
        <div className="space-y-6">
          {/* 最近の実績 */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">最近の実績</h3>
            <div className="space-y-4">
              {recentAchievements.map((achievement) => {
                const Icon = achievement.icon;
                return (
                  <div key={achievement.id} className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900">{achievement.title}</h4>
                      <p className="text-sm text-gray-600">{achievement.description}</p>
                      <p className="text-xs text-gray-400 mt-1">{achievement.earnedAt}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* アカウント設定 */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">アカウント設定</h3>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Mail className="w-4 h-4 mr-2" />
                メール通知設定
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <User className="w-4 h-4 mr-2" />
                プライバシー設定
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Award className="w-4 h-4 mr-2" />
                実績設定
              </Button>
            </div>
          </Card>

          {/* アカウント情報 */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">アカウント情報</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">メンバーID</span>
                <span className="font-medium">#12345</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">登録日</span>
                <span className="font-medium">{profile.joinDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">最終ログイン</span>
                <span className="font-medium">2024-01-20</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">ステータス</span>
                <Badge className="bg-green-100 text-green-800">アクティブ</Badge>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
