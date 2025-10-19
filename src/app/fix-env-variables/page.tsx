'use client';

import { useState } from 'react';

export default function FixEnvVariables() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleFix = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/fix-env-variables', {
        method: 'POST'
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Fix error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">環境変数修正ツール</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">問題の概要</h2>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 font-medium mb-2">発見された問題:</p>
            <ul className="text-red-700 text-sm space-y-1">
              <li>• すべてのCloudflare環境変数に改行文字が含まれています</li>
              <li>• 制御文字が含まれています</li>
              <li>• 長さの不一致が発生しています</li>
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">修正の実行</h2>
          <p className="text-gray-600 mb-4">
            環境変数を分析して、クリーンアップされた値を取得します。
          </p>
          <button
            onClick={handleFix}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium"
          >
            {loading ? '分析中...' : '環境変数を分析'}
          </button>
        </div>

        {result && (
          <div className="space-y-6">
            {/* 比較結果 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">比較結果</h2>
              {result.comparison && (
                <div className="space-y-4">
                  {Object.entries(result.comparison).map(([key, value]: [string, any]) => (
                    <div key={key} className="border rounded-lg p-4">
                      <h3 className="font-medium text-lg mb-2">{key}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-medium text-red-600">元の値:</p>
                          <p className="font-mono bg-red-50 p-2 rounded">{value.original}</p>
                        </div>
                        <div>
                          <p className="font-medium text-green-600">クリーンアップ後:</p>
                          <p className="font-mono bg-green-50 p-2 rounded">{value.cleaned}</p>
                        </div>
                      </div>
                      {value.changed && (
                        <p className="text-orange-600 text-sm mt-2">⚠️ 変更が必要です</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 修正手順 */}
            {result.instructions && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4 text-blue-900">
                  {result.instructions.title}
                </h2>
                <ol className="space-y-2 text-blue-800">
                  {result.instructions.steps.map((step: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <span className="font-medium mr-2">{index + 1}.</span>
                      <span className={step.startsWith('   -') ? 'font-mono text-sm ml-4' : ''}>
                        {step}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* クリーンアップされた値 */}
            {result.cleanedValues && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4 text-green-900">
                  クリーンアップされた値
                </h2>
                <div className="space-y-3">
                  {Object.entries(result.cleanedValues).map(([key, value]: [string, any]) => (
                    <div key={key} className="bg-white rounded p-3">
                      <p className="font-medium text-sm text-gray-600 mb-1">{key}:</p>
                      <p className="font-mono text-sm break-all">{value}</p>
                    </div>
                  ))}
                </div>
                <p className="text-green-700 text-sm mt-4">
                  💡 これらの値をVercelの環境変数に設定してください
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
