'use client';

import { useEffect, useState } from 'react';

export default function SimpleTest() {
  const [status, setStatus] = useState('初期化中...');
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const testConnection = async () => {
      try {
        setStatus('環境変数をチェック中...');
        
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        
        if (!url || !key) {
          setStatus('❌ 環境変数が不足しています');
          return;
        }
        
        setStatus('Supabaseクライアントを作成中...');
        
        // 動的にSupabaseクライアントを作成
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(url, key);
        
        setStatus('データベースに接続中...');
        
        const { data, error } = await supabase
          .from('programs')
          .select('id, title')
          .limit(1);
        
        if (error) {
          setStatus(`❌ エラー: ${error.message}`);
          return;
        }
        
        setStatus('✅ 接続成功！');
        setData(data);
        
      } catch (err) {
        setStatus(`❌ 例外エラー: ${err instanceof Error ? err.message : 'Unknown error'}`);
        console.error('Error details:', err);
      }
    };

    testConnection();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">シンプル接続テスト</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">ステータス</h2>
            <p className="text-lg">{status}</p>
          </div>
          
          {data && (
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-2">取得データ</h2>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>
          )}
          
          <div className="text-sm text-gray-600">
            <p>URL: {process.env.NEXT_PUBLIC_SUPABASE_URL || 'undefined'}</p>
            <p>Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '設定済み' : '未設定'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
