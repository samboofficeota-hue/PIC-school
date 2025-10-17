'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// クライアントサイドで直接環境変数を読み込み
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default function TestSupabase() {
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('programs')
          .select('*')
          .order('id', { ascending: true });

        if (error) {
          setError(error.message);
        } else {
          setPrograms(data || []);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Supabaseに接続中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">❌ エラーが発生しました</div>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Supabase接続テスト
          </h1>
          <p className="text-gray-600">
            データベースからプログラムデータを取得しています
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <div className="text-green-500 text-xl mr-2">✅</div>
            <h2 className="text-xl font-semibold">接続成功！</h2>
          </div>
          
          <p className="text-gray-600 mb-6">
            プログラム数: <span className="font-semibold">{programs.length}</span>件
          </p>

          <div className="space-y-4">
            {programs.map((program) => (
              <div key={program.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{program.title}</h3>
                    <p className="text-gray-600 mt-1">{program.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span>価格: ¥{program.price.toLocaleString()}</span>
                      <span>ID: {program.id}</span>
                    </div>
                  </div>
                  {program.thumbnail_url && (
                    <img 
                      src={program.thumbnail_url} 
                      alt={program.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">接続情報</h3>
            <div className="text-sm text-blue-800 space-y-1">
              <p>URL: {process.env.NEXT_PUBLIC_SUPABASE_URL}</p>
              <p>Status: 接続成功</p>
              <p>取得データ数: {programs.length}件</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
