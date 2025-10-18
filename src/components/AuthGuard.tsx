'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2, Lock } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export function AuthGuard({ 
  children, 
  fallback,
  redirectTo = '/auth/login'
}: AuthGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push(redirectTo);
    }
  }, [user, loading, router, redirectTo]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">認証中...</p>
        </Card>
      </div>
    );
  }

  if (!user) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="p-8 text-center max-w-md">
          <Lock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            認証が必要です
          </h2>
          <p className="text-gray-600 mb-6">
            このページにアクセスするにはログインが必要です。
          </p>
          <div className="space-y-2">
            <Button 
              onClick={() => router.push('/auth/login')}
              className="w-full"
            >
              ログイン
            </Button>
            <Button 
              variant="outline"
              onClick={() => router.push('/auth/signup')}
              className="w-full"
            >
              新規登録
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}

// 管理者専用の認証ガード
export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      // 管理者かどうかをチェック（実際の実装では、user_metadataやデータベースで確認）
      const isAdmin = user.user_metadata?.role === 'admin' || user.email?.includes('admin');
      if (!isAdmin) {
        router.push('/mypage');
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">認証中...</p>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="p-8 text-center max-w-md">
          <Lock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            管理者権限が必要です
          </h2>
          <p className="text-gray-600 mb-6">
            このページにアクセスするには管理者権限が必要です。
          </p>
          <Button 
            onClick={() => router.push('/auth/login')}
            className="w-full"
          >
            ログイン
          </Button>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
