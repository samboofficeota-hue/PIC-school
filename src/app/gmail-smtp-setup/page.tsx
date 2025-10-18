'use client';

import { useState } from 'react';

export default function GmailSMTPSetup() {
  const [step, setStep] = useState(1);

  const steps = [
    {
      id: 1,
      title: 'Gmailアプリパスワードの作成',
      content: (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">📱 手順</h3>
            <ol className="list-decimal list-inside space-y-2 text-blue-800">
              <li>Googleアカウント設定にアクセス</li>
              <li>「セキュリティ」→「2段階認証」を有効化</li>
              <li>「アプリパスワード」を選択</li>
              <li>「メール」を選択してパスワードを生成</li>
              <li>生成された16文字のパスワードをコピー</li>
            </ol>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800">
              ⚠️ <strong>重要:</strong> 通常のGmailパスワードではなく、<strong>アプリパスワード</strong>を使用してください。
            </p>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: 'Supabase Dashboard での設定',
      content: (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-900 mb-2">🔧 SMTP設定値</h3>
            <div className="bg-gray-100 rounded p-3 font-mono text-sm">
              <div><strong>SMTP Host:</strong> smtp.gmail.com</div>
              <div><strong>Port:</strong> 587</div>
              <div><strong>Username:</strong> your-email@gmail.com</div>
              <div><strong>Password:</strong> [生成したアプリパスワード]</div>
              <div><strong>Security:</strong> STARTTLS</div>
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">📍 設定場所</h3>
            <p className="text-blue-800">
              Supabase Dashboard → Authentication → Settings → Email → SMTP Settings
            </p>
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: '設定のテスト',
      content: (
        <div className="space-y-4">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h3 className="font-semibold text-purple-900 mb-2">🧪 テスト手順</h3>
            <ol className="list-decimal list-inside space-y-2 text-purple-800">
              <li>Supabaseで設定を保存</li>
              <li>「Send test email」ボタンをクリック</li>
              <li>テストメールが受信されることを確認</li>
              <li>本番環境でユーザー登録をテスト</li>
            </ol>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">🔗 テスト用リンク</h3>
            <div className="space-y-2">
              <a 
                href="https://pic-school.vercel.app/auth/signup" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-center"
              >
                本番環境でサインアップテスト
              </a>
              <a 
                href="https://pic-school.vercel.app/supabase-dashboard" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded text-center"
              >
                Supabase状況確認
              </a>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            📧 Gmail SMTP設定ガイド
          </h1>

          {/* ステップインジケーター */}
          <div className="flex justify-center mb-8">
            <div className="flex space-x-4">
              {steps.map((s) => (
                <div key={s.id} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    step >= s.id 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {s.id}
                  </div>
                  {s.id < steps.length && (
                    <div className={`w-8 h-0.5 mx-2 ${
                      step > s.id ? 'bg-blue-500' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ステップ内容 */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              {steps[step - 1].title}
            </h2>
            {steps[step - 1].content}
          </div>

          {/* ナビゲーションボタン */}
          <div className="flex justify-between">
            <button
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
              className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 text-white px-6 py-2 rounded-lg font-medium"
            >
              前のステップ
            </button>
            
            <button
              onClick={() => setStep(Math.min(steps.length, step + 1))}
              disabled={step === steps.length}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-6 py-2 rounded-lg font-medium"
            >
              次のステップ
            </button>
          </div>

          {/* 完了メッセージ */}
          {step === steps.length && (
            <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-900 mb-2">
                🎉 設定完了！
              </h3>
              <p className="text-green-800">
                Gmail SMTP設定が完了しました。これで確認メールが正常に送信されるはずです。
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
