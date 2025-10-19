'use client';

import { useEffect, useState } from 'react';

export default function R2DirectTest() {
  const [envAnalysis, setEnvAnalysis] = useState<any>(null);
  const [r2Test, setR2Test] = useState<any>(null);
  const [bucketCheck, setBucketCheck] = useState<any>(null);
  const [deepAnalysis, setDeepAnalysis] = useState<any>(null);
  const [cleanTest, setCleanTest] = useState<any>(null);
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

        // 4. 詳細な環境変数分析
        console.log('Running deep environment analysis...');
        const deepResponse = await fetch('/api/deep-analyze-env');
        const deepData = await deepResponse.json();
        setDeepAnalysis(deepData);
        console.log('Deep analysis:', deepData);

        // 5. クリーンアップされた認証情報でのテスト
        console.log('Running clean credentials test...');
        const cleanResponse = await fetch('/api/clean-env-test');
        const cleanData = await cleanResponse.json();
        setCleanTest(cleanData);
        console.log('Clean test:', cleanData);

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
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

          {/* 詳細な環境変数分析 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">詳細な環境変数分析</h2>
            {deepAnalysis ? (
              <div className="space-y-4">
                <div className={`p-3 rounded ${deepAnalysis.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  <p className="font-medium">
                    {deepAnalysis.success ? '✅ 詳細分析完了' : '❌ 詳細分析失敗'}
                  </p>
                  {deepAnalysis.summary && (
                    <div className="mt-2 text-sm">
                      <p>問題発見: {deepAnalysis.summary.issuesFound}件</p>
                      <p>問題あり: {deepAnalysis.summary.hasProblems ? '⚠️' : '✅'}</p>
                    </div>
                  )}
                </div>
                
                {deepAnalysis.issues && deepAnalysis.issues.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="font-medium text-red-700">発見された問題:</h3>
                    {deepAnalysis.issues.map((issue: string, index: number) => (
                      <div key={index} className="text-sm text-red-600 bg-red-50 p-2 rounded">
                        • {issue}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-red-500">詳細分析の結果を取得できませんでした</p>
            )}
          </div>

          {/* クリーンアップされた認証情報でのテスト */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">クリーンアップ認証テスト</h2>
            {cleanTest ? (
              <div className="space-y-4">
                <div className={`p-3 rounded ${cleanTest.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  <p className="font-medium">
                    {cleanTest.success ? '✅ クリーンアップ認証成功' : '❌ クリーンアップ認証失敗'}
                  </p>
                  {cleanTest.message && (
                    <p className="text-sm mt-1">{cleanTest.message}</p>
                  )}
                </div>
                
                {cleanTest.data && (
                  <div className="text-sm space-y-1">
                    <p>バケット数: {cleanTest.data.bucketCount}</p>
                    <p>アカウントID長: {cleanTest.data.credentialsCleaned?.accountIdLength}</p>
                    <p>アクセスキー長: {cleanTest.data.credentialsCleaned?.accessKeyIdLength}</p>
                    <p>シークレットキー長: {cleanTest.data.credentialsCleaned?.secretKeyLength}</p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-red-500">クリーンアップ認証テストの結果を取得できませんでした</p>
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
