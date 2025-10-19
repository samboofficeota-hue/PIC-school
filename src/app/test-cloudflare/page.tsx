'use client';

import { useEffect, useState } from 'react';
import { uploadToR2 } from '@/lib/cloudflare';

export default function TestCloudflare() {
  const [status, setStatus] = useState('初期化中...');
  const [uploadResult, setUploadResult] = useState<any>(null);

  useEffect(() => {
    const testConnection = async () => {
      try {
        setStatus('Cloudflare R2に接続中...');
        
        const response = await fetch('/api/test-r2');
        const data = await response.json();
        
        console.log('API Response:', data);
        console.log('Response Status:', response.status);
        
        if (data.success) {
          setStatus(`✅ 接続成功！バケット: ${data.bucket}, オブジェクト数: ${data.objectCount}`);
        } else {
          setStatus(`❌ 接続失敗: ${data.error}`);
          console.error('API Error Details:', data);
        }
        
      } catch (err) {
        setStatus(`❌ 例外エラー: ${err instanceof Error ? err.message : 'Unknown error'}`);
        console.error('Error details:', err);
      }
    };

    testConnection();
  }, []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setStatus('ファイルをアップロード中...');
      const result = await uploadToR2(file, `test/${Date.now()}-${file.name}`);
      setUploadResult(result);
      setStatus('✅ ファイルアップロード成功！');
    } catch (error) {
      setStatus(`❌ アップロードエラー: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Cloudflare R2接続テスト</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">接続状況</h2>
            <p className="text-lg">{status}</p>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">ファイルアップロードテスト</h2>
            <input
              type="file"
              onChange={handleFileUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
          
          {uploadResult && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 mb-2">アップロード成功！</h3>
              <p className="text-sm text-green-700">URL: {uploadResult}</p>
            </div>
          )}
          
          <div className="text-sm text-gray-600">
            <p>Account ID: サーバーサイドで設定済み</p>
            <p>Access Key ID: サーバーサイドで設定済み</p>
            <p>Secret Key: サーバーサイドで設定済み</p>
            <p className="mt-2 text-xs text-gray-500">
              ※ セキュリティのため、クライアントサイドでは表示されません
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
