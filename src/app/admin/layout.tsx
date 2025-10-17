import { ReactNode } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  BarChart3,
  Settings,
  LogOut
} from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
}

const navigation = [
  {
    name: 'ダッシュボード',
    href: '/admin',
    icon: LayoutDashboard
  },
  {
    name: 'ユーザー管理',
    href: '/admin/users',
    icon: Users
  },
  {
    name: 'コンテンツ管理',
    href: '/admin/content',
    icon: BookOpen
  },
  {
    name: '受講履歴',
    href: '/admin/analytics',
    icon: BarChart3
  },
  {
    name: '設定',
    href: '/admin/settings',
    icon: Settings
  }
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/admin" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">PIC School Admin</span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                管理者
              </div>
              <Button variant="outline" size="sm">
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
