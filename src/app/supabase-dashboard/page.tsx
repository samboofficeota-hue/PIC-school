'use client';

import { useState, useEffect } from 'react';

interface EmailStatus {
  recentUsers: any[];
  unconfirmedUsers: any[];
  totalUnconfirmed: number;
  projectInfo: {
    hasUsers: boolean;
  };
}

interface Recommendations {
  action: string;
  description: string;
  priority: string;
}

export default function SupabaseDashboard() {
  const [emailStatus, setEmailStatus] = useState<EmailStatus | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendations[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchEmailStatus();
  }, []);

  const fetchEmailStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/check-supabase-email-status');
      const data = await response.json();
      
      if (data.success) {
        setEmailStatus(data.data);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendations = async () => {
    try {
      setActionLoading('recommendations');
      const response = await fetch('/api/reset-supabase-email-settings', {
        method: 'POST'
      });
      const data = await response.json();
      
      if (data.success) {
        setRecommendations(data.data.recommendations);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setActionLoading(null);
    }
  };

  const cleanupInvalidEmails = async () => {
    try {
      setActionLoading('cleanup');
      const response = await fetch('/api/cleanup-invalid-emails', {
        method: 'POST'
      });
      const data = await response.json();
      
      if (data.success) {
        alert(`Found ${data.details.usersFound} users with invalid email patterns`);
        fetchEmailStatus(); // 再読み込み
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Supabaseの状況を確認中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            🔧 Supabase メール設定ダッシュボード
          </h1>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="text-red-800 font-semibold">エラー</div>
              <div className="text-red-600">{error}</div>
            </div>
          )}

          {/* 現在の状況 */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              📊 現在の状況
            </h2>
            
            {emailStatus && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="text-blue-800 font-semibold">確認待ちユーザー</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {emailStatus.totalUnconfirmed}
                  </div>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="text-green-800 font-semibold">総ユーザー数</div>
                  <div className="text-2xl font-bold text-green-600">
                    {emailStatus.recentUsers.length}
                  </div>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="text-yellow-800 font-semibold">プロジェクト状況</div>
                  <div className="text-sm text-yellow-600">
                    {emailStatus.projectInfo.hasUsers ? 'アクティブ' : '非アクティブ'}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 確認待ちユーザー一覧 */}
          {emailStatus && emailStatus.unconfirmedUsers.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                ⏳ 確認待ちユーザー一覧
              </h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="space-y-2">
                  {emailStatus.unconfirmedUsers.map((user: any, index: number) => (
                    <div key={user.id} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                      <div>
                        <span className="font-medium">{user.email}</span>
                        <span className="text-sm text-gray-500 ml-2">
                          ({new Date(user.created_at).toLocaleString()})
                        </span>
                      </div>
                      <span className="text-sm text-red-600">
                        {user.email.includes('example.com') || user.email.includes('test.com') ? '⚠️ 無効' : '⏳ 待機中'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* アクションボタン */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              🛠️ アクション
            </h2>
            
            <div className="flex flex-wrap gap-4">
              <button
                onClick={fetchRecommendations}
                disabled={actionLoading === 'recommendations'}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-6 py-2 rounded-lg font-medium"
              >
                {actionLoading === 'recommendations' ? '分析中...' : '解決策を取得'}
              </button>
              
              <button
                onClick={cleanupInvalidEmails}
                disabled={actionLoading === 'cleanup'}
                className="bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white px-6 py-2 rounded-lg font-medium"
              >
                {actionLoading === 'cleanup' ? '確認中...' : '無効メールを確認'}
              </button>
              
              <button
                onClick={fetchEmailStatus}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium"
              >
                状況を再読み込み
              </button>
            </div>
          </div>

          {/* 推奨解決策 */}
          {recommendations.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                💡 推奨解決策
              </h2>
              
              <div className="space-y-4">
                {recommendations.map((rec, index) => (
                  <div key={index} className={`border rounded-lg p-4 ${
                    rec.priority === 'high' ? 'border-red-200 bg-red-50' :
                    rec.priority === 'medium' ? 'border-yellow-200 bg-yellow-50' :
                    'border-green-200 bg-green-50'
                  }`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold text-gray-900">{rec.action}</div>
                        <div className="text-gray-600 mt-1">{rec.description}</div>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        rec.priority === 'high' ? 'bg-red-100 text-red-800' :
                        rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {rec.priority === 'high' ? '高' : rec.priority === 'medium' ? '中' : '低'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Supabase Dashboard へのリンク */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              🔗 Supabase Dashboard への直接アクセス
            </h3>
            <p className="text-blue-700 mb-4">
              以下の手順でSupabase Dashboardにアクセスして、メール設定を確認・修正してください：
            </p>
            <ol className="list-decimal list-inside space-y-2 text-blue-700">
              <li>Supabase Dashboard にログイン</li>
              <li>プロジェクトを選択</li>
              <li>Authentication → Settings → Email に移動</li>
              <li>メール送信設定を確認</li>
              <li>必要に応じて無効なユーザーを削除</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
