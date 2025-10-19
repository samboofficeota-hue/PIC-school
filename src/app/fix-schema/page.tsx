'use client';

import { useState } from 'react';

export default function FixSchema() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleApplySchema = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/apply-schema', {
        method: 'POST'
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Schema application error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">データベーススキーマ修正</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">問題の概要</h2>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 font-medium mb-2">発見された問題:</p>
            <ul className="text-red-700 text-sm space-y-1">
              <li>• user_profilesテーブル: 全カラムが不足</li>
              <li>• chaptersテーブル: 4カラムが不足</li>
              <li>• その他のテーブル: 構造が不完全</li>
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">修正の実行</h2>
          <p className="text-gray-600 mb-4">
            データベーススキーマを正しく適用して、不足しているテーブルとカラムを作成します。
          </p>
          <button
            onClick={handleApplySchema}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium"
          >
            {loading ? 'スキーマ適用中...' : 'スキーマを適用'}
          </button>
        </div>

        {result && (
          <div className="space-y-6">
            {/* 結果サマリー */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">適用結果</h2>
              <div className={`p-3 rounded ${result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <p className="font-medium">
                  {result.success ? '✅ スキーマ適用成功' : '❌ スキーマ適用に問題があります'}
                </p>
                {result.summary && (
                  <div className="mt-2 text-sm">
                    <p>総テーブル数: {result.summary.totalTests}</p>
                    <p>成功: {result.summary.passedTests}</p>
                    <p>失敗: {result.summary.failedTests}</p>
                  </div>
                )}
              </div>
            </div>

            {/* 詳細結果 */}
            {result.results && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">詳細結果</h2>
                <div className="space-y-2 text-sm max-h-64 overflow-y-auto">
                  {result.results.map((result: any, index: number) => (
                    <div key={index} className={`border rounded p-2 ${result.success ? 'bg-green-50' : 'bg-red-50'}`}>
                      <p className="font-medium">{result.table}: {result.success ? '✅' : '❌'}</p>
                      <p className="text-xs">{result.message}</p>
                      {result.error && (
                        <p className="text-xs text-red-600 mt-1">
                          エラー: {result.error.message || result.error}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 次のステップ */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-blue-900">次のステップ</h2>
              <ol className="space-y-2 text-blue-800">
                <li>1. スキーマ適用が完了したら、Supabaseダッシュボードで再確認</li>
                <li>2. 不足していたテーブルとカラムが正しく作成されているか確認</li>
                <li>3. 必要に応じて初期データを投入</li>
                <li>4. RLS（Row Level Security）の設定を確認</li>
              </ol>
            </div>
          </div>
        )}

        {/* 注意事項 */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-900 mb-2">⚠️ 注意事項</h3>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>• この操作は既存のデータに影響する可能性があります</li>
            <li>• 本番環境で実行する前に、データのバックアップを取ることを推奨します</li>
            <li>• スキーマ適用後は、Supabaseダッシュボードで再確認してください</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
