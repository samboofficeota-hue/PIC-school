'use client';

import { useEffect, useState } from 'react';

export default function SupabaseDashboard() {
  const [healthCheck, setHealthCheck] = useState<any>(null);
  const [schemaCheck, setSchemaCheck] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const runChecks = async () => {
      try {
        setLoading(true);
        
        // 1. Supabaseヘルスチェック
        console.log('Running Supabase health check...');
        const healthResponse = await fetch('/api/supabase-health-check');
        const healthData = await healthResponse.json();
        setHealthCheck(healthData);
        console.log('Health check:', healthData);

        // 2. スキーマチェック
        console.log('Running schema check...');
        const schemaResponse = await fetch('/api/supabase-schema-check');
        const schemaData = await schemaResponse.json();
        setSchemaCheck(schemaData);
        console.log('Schema check:', schemaData);

      } catch (error) {
        console.error('Check error:', error);
      } finally {
        setLoading(false);
      }
    };

    runChecks();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Supabase ダッシュボード</h1>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p>Supabase接続とスキーマを確認中...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Supabase ダッシュボード</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ヘルスチェック結果 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">接続状況</h2>
            {healthCheck ? (
              <div className="space-y-4">
                <div className={`p-3 rounded ${healthCheck.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  <p className="font-medium">
                    {healthCheck.success ? '✅ 接続正常' : '❌ 接続に問題があります'}
                  </p>
                  {healthCheck.summary && (
                    <div className="mt-2 text-sm">
                      <p>テスト数: {healthCheck.summary.totalTests}</p>
                      <p>成功: {healthCheck.summary.passedTests}</p>
                      <p>失敗: {healthCheck.summary.failedTests}</p>
                    </div>
                  )}
                </div>
                
                {healthCheck.results && (
                  <div className="space-y-2 text-sm max-h-64 overflow-y-auto">
                    {healthCheck.results.map((result: any, index: number) => (
                      <div key={index} className={`border rounded p-2 ${result.success ? 'bg-green-50' : 'bg-red-50'}`}>
                        <p className="font-medium">{result.test}: {result.success ? '✅' : '❌'}</p>
                        <p className="text-xs">{result.message}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-red-500">ヘルスチェックの結果を取得できませんでした</p>
            )}
          </div>

          {/* スキーマチェック結果 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">データベーススキーマ</h2>
            {schemaCheck ? (
              <div className="space-y-4">
                <div className={`p-3 rounded ${schemaCheck.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  <p className="font-medium">
                    {schemaCheck.success ? '✅ スキーマ正常' : '❌ スキーマに問題があります'}
                  </p>
                  {schemaCheck.summary && (
                    <div className="mt-2 text-sm">
                      <p>テーブル数: {schemaCheck.summary.tablesChecked}</p>
                      <p>成功: {schemaCheck.summary.passedTests}</p>
                      <p>失敗: {schemaCheck.summary.failedTests}</p>
                    </div>
                  )}
                </div>
                
                {schemaCheck.results && (
                  <div className="space-y-2 text-sm max-h-64 overflow-y-auto">
                    {schemaCheck.results.map((result: any, index: number) => (
                      <div key={index} className={`border rounded p-2 ${result.success ? 'bg-green-50' : 'bg-red-50'}`}>
                        <p className="font-medium">{result.table || result.test}: {result.success ? '✅' : '❌'}</p>
                        <p className="text-xs">{result.message}</p>
                        {result.data && result.data.missingColumns && result.data.missingColumns.length > 0 && (
                          <p className="text-xs text-red-600 mt-1">
                            不足カラム: {result.data.missingColumns.join(', ')}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-red-500">スキーマチェックの結果を取得できませんでした</p>
            )}
          </div>
        </div>

        {/* データベース設計の概要 */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">データベース設計概要</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="border rounded p-4">
              <h3 className="font-medium text-blue-600 mb-2">ユーザー関連</h3>
              <ul className="text-sm space-y-1">
                <li>• user_profiles</li>
                <li>• user_programs</li>
                <li>• user_progress</li>
                <li>• user_achievements</li>
                <li>• user_points</li>
              </ul>
            </div>
            <div className="border rounded p-4">
              <h3 className="font-medium text-green-600 mb-2">コンテンツ関連</h3>
              <ul className="text-sm space-y-1">
                <li>• programs</li>
                <li>• chapters</li>
                <li>• learning_sessions</li>
              </ul>
            </div>
            <div className="border rounded p-4">
              <h3 className="font-medium text-purple-600 mb-2">システム関連</h3>
              <ul className="text-sm space-y-1">
                <li>• achievements</li>
                <li>• notifications</li>
                <li>• admin_roles</li>
              </ul>
            </div>
          </div>
        </div>

        {/* コンソールログの指示 */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">デバッグ情報</h3>
          <p className="text-sm text-blue-800">
            ブラウザの開発者ツール（F12）のコンソールタブで詳細なログを確認できます。
          </p>
        </div>
      </div>
    </div>
  );
}