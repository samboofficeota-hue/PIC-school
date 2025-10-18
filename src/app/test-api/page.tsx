'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

interface ApiTestResult {
  endpoint: string;
  method: string;
  status: 'pending' | 'success' | 'error';
  response?: any;
  error?: string;
  duration?: number;
}

export default function TestApiPage() {
  const { user, loading: authLoading } = useAuth();
  const [results, setResults] = useState<ApiTestResult[]>([]);
  const [testing, setTesting] = useState(false);

  const apiEndpoints = [
    { name: 'プログラム一覧', endpoint: '/api/programs', method: 'GET', requiresAuth: false },
    { name: 'プログラム詳細', endpoint: '/api/programs/1', method: 'GET', requiresAuth: false },
    { name: 'ユーザープロフィール', endpoint: '/api/user/profile', method: 'GET', requiresAuth: true },
    { name: 'ユーザープログラム', endpoint: '/api/user/programs', method: 'GET', requiresAuth: true },
    { name: 'ユーザー進捗', endpoint: '/api/user/progress', method: 'GET', requiresAuth: true },
    { name: 'ユーザー実績', endpoint: '/api/user/achievements', method: 'GET', requiresAuth: true },
    { name: 'ユーザーポイント', endpoint: '/api/user/points', method: 'GET', requiresAuth: true },
    { name: 'ユーザー通知', endpoint: '/api/user/notifications', method: 'GET', requiresAuth: true },
  ];

  const testApiEndpoint = async (endpoint: string, method: string, requiresAuth: boolean) => {
    const startTime = Date.now();
    
    try {
      const options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const response = await fetch(endpoint, options);
      const data = await response.json();
      const duration = Date.now() - startTime;

      return {
        status: response.ok ? 'success' : 'error',
        response: data,
        error: response.ok ? undefined : data.error || `HTTP ${response.status}`,
        duration
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      return {
        status: 'error' as const,
        error: error instanceof Error ? error.message : 'Unknown error',
        duration
      };
    }
  };

  const runAllTests = async () => {
    if (!user && apiEndpoints.some(api => api.requiresAuth)) {
      alert('認証が必要なAPIをテストするにはログインしてください');
      return;
    }

    setTesting(true);
    setResults([]);

    for (const api of apiEndpoints) {
      // 認証が必要でログインしていない場合はスキップ
      if (api.requiresAuth && !user) {
        setResults(prev => [...prev, {
          endpoint: api.endpoint,
          method: api.method,
          status: 'error',
          error: '認証が必要です'
        }]);
        continue;
      }

      setResults(prev => [...prev, {
        endpoint: api.endpoint,
        method: api.method,
        status: 'pending'
      }]);

      const result = await testApiEndpoint(api.endpoint, api.method, api.requiresAuth);
      
      setResults(prev => prev.map(r => 
        r.endpoint === api.endpoint && r.method === api.method 
          ? { ...r, ...result } as ApiTestResult
          : r
      ));
    }

    setTesting(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Loader2 className="w-5 h-5 animate-spin text-blue-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-100 text-green-800">成功</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800">エラー</Badge>;
      default:
        return <Badge className="bg-blue-100 text-blue-800">テスト中</Badge>;
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>認証中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            API エンドポイントテスト
          </h1>
          <p className="text-gray-600">
            実装したAPIエンドポイントの動作確認を行います
          </p>
          {!user && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800">
                認証が必要なAPIをテストするにはログインしてください
              </p>
            </div>
          )}
        </div>

        <div className="mb-6">
          <Button 
            onClick={runAllTests} 
            disabled={testing}
            className="w-full sm:w-auto"
          >
            {testing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                テスト実行中...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                すべてのAPIをテスト
              </>
            )}
          </Button>
        </div>

        <div className="grid gap-6">
          {apiEndpoints.map((api, index) => {
            const result = results.find(r => r.endpoint === api.endpoint && r.method === api.method);
            
            return (
              <Card key={index} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {result ? getStatusIcon(result.status) : <div className="w-5 h-5" />}
                    <div>
                      <h3 className="font-semibold text-lg">{api.name}</h3>
                      <p className="text-sm text-gray-600">
                        {api.method} {api.endpoint}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {result && getStatusBadge(result.status)}
                    {api.requiresAuth && (
                      <Badge variant="outline">認証必要</Badge>
                    )}
                  </div>
                </div>

                {result && (
                  <div className="space-y-3">
                    {result.duration && (
                      <p className="text-sm text-gray-600">
                        応答時間: {result.duration}ms
                      </p>
                    )}
                    
                    {result.error && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-sm text-red-800 font-medium">エラー:</p>
                        <p className="text-sm text-red-700">{result.error}</p>
                      </div>
                    )}
                    
                    {result.response && (
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <p className="text-sm text-gray-800 font-medium mb-2">レスポンス:</p>
                        <pre className="text-xs text-gray-700 overflow-x-auto">
                          {JSON.stringify(result.response, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">テスト結果の見方</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>✅ 成功: APIが正常に動作しています</li>
            <li>❌ エラー: APIに問題があります（詳細はエラーメッセージを確認）</li>
            <li>認証必要: ログインが必要なAPIです</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
