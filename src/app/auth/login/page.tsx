'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BookOpen, Eye, EyeOff, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetPasswordLoading, setResetPasswordLoading] = useState(false);
  const [resetPasswordMessage, setResetPasswordMessage] = useState('');
  
  const { signIn, resetPassword } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        // エラーメッセージを日本語に変換
        let errorMessage = error.message;
        if (error.message.includes('email_not_confirmed')) {
          errorMessage = 'メールアドレスの確認が必要です。メールボックスを確認してください。';
        } else if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'メールアドレスまたはパスワードが正しくありません。';
        } else if (error.message.includes('email_address_invalid')) {
          errorMessage = '有効なメールアドレスを入力してください。';
        }
        setError(errorMessage);
      } else {
        router.push('/mypage');
      }
    } catch (err) {
      setError('ログイン中にエラーが発生しました。');
    }
    
    setLoading(false);
  };

  const handleResetPassword = async () => {
    if (!email) {
      setError('パスワードリセットにはメールアドレスが必要です。');
      return;
    }

    setResetPasswordLoading(true);
    setError('');
    setResetPasswordMessage('');

    try {
      const { error } = await resetPassword(email);
      
      if (error) {
        setError('パスワードリセットメールの送信に失敗しました。');
      } else {
        setResetPasswordMessage('パスワードリセットメールを送信しました。メールボックスを確認してください。');
      }
    } catch (err) {
      setError('パスワードリセット中にエラーが発生しました。');
    }
    
    setResetPasswordLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* ヘッダー */}
        <div className="text-center">
          <Link href="/" className="flex items-center justify-center space-x-2 mb-6">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold">PIC School</span>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900">ログイン</h2>
          <p className="mt-2 text-sm text-gray-600">
            アカウントにログインして学習を続けましょう
          </p>
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800 font-medium">テスト用アカウント</p>
            <p className="text-xs text-blue-600 mt-1">
              メール: testuser@gmail.com<br/>
              パスワード: password123
            </p>
            <p className="text-xs text-red-600 mt-1">
              ※ メール確認が必要な場合があります
            </p>
          </div>
        </div>

        {/* ログインフォーム */}
        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                メールアドレス
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                パスワード
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="パスワードを入力"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  ログイン状態を保持
                </label>
              </div>

              <div className="text-sm">
                <button
                  type="button"
                  onClick={handleResetPassword}
                  disabled={resetPasswordLoading}
                  className="text-primary hover:text-primary/80 disabled:opacity-50"
                >
                  {resetPasswordLoading ? '送信中...' : 'パスワードを忘れた方'}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ログイン中...
                </>
              ) : (
                'ログイン'
              )}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">または</span>
              </div>
            </div>

            <div className="mt-6">
              <p className="text-center text-sm text-gray-600">
                アカウントをお持ちでない方は{' '}
                <Link href="/auth/signup" className="text-primary hover:text-primary/80 font-medium">
                  新規登録
                </Link>
              </p>
            </div>

            {/* パスワードリセットメッセージ */}
            {resetPasswordMessage && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
                <p className="text-sm text-green-800">{resetPasswordMessage}</p>
              </div>
            )}
          </div>
        </Card>

        {/* フッター */}
        <div className="text-center">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
            ← ホームに戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
