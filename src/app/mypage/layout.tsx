'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AuthGuard } from '@/components/AuthGuard';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  User,
  BookOpen,
  BarChart3,
  Settings,
  LogOut,
  Home,
  Trophy
} from 'lucide-react';

interface UserLayoutProps {
  children: ReactNode;
}

const navigation = [
  {
    name: 'ダッシュボード',
    href: '/mypage',
    icon: LayoutDashboard
  },
  {
    name: 'プロフィール',
    href: '/mypage/profile',
    icon: User
  },
  {
    name: '学習履歴',
    href: '/mypage/learning',
    icon: BookOpen
  },
  {
    name: '実績・証明書',
    href: '/mypage/achievements',
    icon: Trophy
  },
  {
    name: '設定',
    href: '/mypage/settings',
    icon: Settings
  }
];

export default function UserLayout({ children }: UserLayoutProps) {
  return (
    <AuthGuard>
      <UserLayoutContent>{children}</UserLayoutContent>
    </AuthGuard>
  );
}

function UserLayoutContent({ children }: UserLayoutProps) {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/mypage" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">マイページ</span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="outline" size="sm">
                  <Home className="w-4 h-4 mr-2" />
                  ホーム
                </Button>
              </Link>
              <div className="text-sm text-gray-500">
                {user?.user_metadata?.name || user?.email || 'ユーザー'}さん
              </div>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                ログアウト
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* サイドバー */}
        <nav className="w-64 bg-white shadow-sm min-h-screen">
          <div className="p-4">
            <nav className="space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors text-gray-700 hover:bg-gray-100"
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </nav>

        {/* メインコンテンツ */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
