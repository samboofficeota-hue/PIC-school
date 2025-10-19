'use client';

import { useEffect, useState } from 'react';

export default function R2DirectTest() {
  const [envAnalysis, setEnvAnalysis] = useState<any>(null);
  const [r2Test, setR2Test] = useState<any>(null);
  const [bucketCheck, setBucketCheck] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const runTests = async () => {
      try {
        setLoading(true);
        
        // 1. 環境変数分析
        console.log('Running environment analysis...');
        const envResponse = await fetch('/api/debug-r2-env');
        const envData = await envResponse.json();
        setEnvAnalysis(envData);
        console.log('Environment analysis:', envData);

        // 2. R2接続テスト
        console.log('Running R2 connection test...');
        const r2Response = await fetch('/api/test-r2');
        const r2Data = await r2Response.json();
        setR2Test(r2Data);
        console.log('R2 test:', r2Data);

        // 3. バケット存在確認
        console.log('Running bucket check...');
        const bucketResponse = await fetch('/api/check-r2-bucket');
        const bucketData = await bucketResponse.json();
        setBucketCheck(bucketData);
        console.log('Bucket check:', bucketData);

      } catch (error) {
        console.error('Test error:', error);
      } finally {
        setLoading(false);
      }
    };

    runTests();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Cloudflare R2 直接テスト</h1>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p>テスト実行中...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Cloudflare R2 直接テスト</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 環境変数分析 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">環境変数分析</h2>
            {envAnalysis ? (
              <div className="space-y-4">
                <div className={`p-3 rounded ${envAnalysis.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  <p className="font-medium">
                    {envAnalysis.success ? '✅ 環境変数分析成功' : '❌ 環境変数分析失敗'}
                  </p>
                  {envAnalysis.summary && (
                    <div className="mt-2 text-sm">
                      <p>すべて設定済み: {envAnalysis.summary.allPresent ? '✅' : '❌'}</p>
                      <p>無効文字あり: {envAnalysis.summary.hasInvalidChars ? '⚠️' : '✅'}</p>
                    </div>
                  )}
                </div>
                
                {envAnalysis.analysis && (
                  <div className="space-y-2 text-sm">
                    {Object.entries(envAnalysis.analysis).map(([key, value]: [string, any]) => (
                      <div key={key} className="border rounded p-2">
                        <p className="font-medium">{key}:</p>
                        <p>存在: {value.exists ? '✅' : '❌'}</p>
                        <p>長さ: {value.length}</p>
                        <p>先頭: {value.firstChars}</p>
                        <p>改行文字: {value.hasNewlines ? '⚠️' : '✅'}</p>
                        <p>タブ文字: {value.hasTabs ? '⚠️' : '✅'}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-red-500">環境変数分析の結果を取得できませんでした</p>
            )}
          </div>

          {/* R2接続テスト */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">R2接続テスト</h2>
            {r2Test ? (
              <div className="space-y-4">
                <div className={`p-3 rounded ${r2Test.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  <p className="font-medium">
                    {r2Test.success ? '✅ R2接続成功' : '❌ R2接続失敗'}
                  </p>
                  {r2Test.error && (
                    <p className="text-sm mt-1 text-red-600">エラー: {r2Test.error}</p>
                  )}
                  {r2Test.details && (
                    <p className="text-sm mt-1 text-gray-600">詳細: {r2Test.details}</p>
                  )}
                </div>
                
                {r2Test.success && (
                  <div className="text-sm space-y-1">
                    <p>バケット: {r2Test.bucket}</p>
                    <p>オブジェクト数: {r2Test.objectCount}</p>
                    <p>エンドポイント: {r2Test.endpoint}</p>
                    <p>アカウントID: {r2Test.accountId}</p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-red-500">R2接続テストの結果を取得できませんでした</p>
            )}
          </div>

          {/* バケット存在確認 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">バケット存在確認</h2>
            {bucketCheck ? (
              <div className="space-y-4">
                <div className={`p-3 rounded ${bucketCheck.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  <p className="font-medium">
                    {bucketCheck.success ? '✅ バケット確認成功' : '❌ バケット確認失敗'}
                  </p>
                  {bucketCheck.message && (
                    <p className="text-sm mt-1">{bucketCheck.message}</p>
                  )}
                </div>
                
                {bucketCheck.results && (
                  <div className="space-y-2 text-sm">
                    {bucketCheck.results.map((result: any, index: number) => (
                      <div key={index} className={`border rounded p-2 ${result.success ? 'bg-green-50' : 'bg-red-50'}`}>
                        <p className="font-medium">{result.test}: {result.success ? '✅' : '❌'}</p>
                        <p className="text-xs">{result.message}</p>
                        {result.suggestion && (
                          <p className="text-xs text-blue-600 mt-1">💡 {result.suggestion}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-red-500">バケット確認の結果を取得できませんでした</p>
            )}
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
