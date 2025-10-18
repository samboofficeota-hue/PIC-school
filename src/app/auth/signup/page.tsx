'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BookOpen, Eye, EyeOff, Loader2, CheckCircle } from 'lucide-react';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  
  const { signUp } = useAuth();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // バリデーション
    if (formData.password !== formData.confirmPassword) {
      setError('パスワードが一致しません');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('パスワードは6文字以上で入力してください');
      setLoading(false);
      return;
    }

    // メールアドレスのバリデーション
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('有効なメールアドレスを入力してください');
      setLoading(false);
      return;
    }

    // テスト用メールアドレスのブロック
    const testDomains = ['example.com', 'test.com', 'localhost', 'invalid'];
    const emailDomain = formData.email.split('@')[1]?.toLowerCase();
    if (testDomains.some(domain => emailDomain?.includes(domain))) {
      setError('有効なメールアドレスを入力してください（テスト用ドメインは使用できません）');
      setLoading(false);
      return;
    }

    const { data, error } = await signUp(formData.email, formData.password, {
      name: formData.name
    });
    
    if (error) {
      // エラーメッセージを日本語に変換
      let errorMessage = error.message;
      if (error.message.includes('email_address_invalid')) {
        errorMessage = '有効なメールアドレスを入力してください。';
      } else if (error.message.includes('password_too_short')) {
        errorMessage = 'パスワードは6文字以上で入力してください。';
      } else if (error.message.includes('email_address_already_registered')) {
        errorMessage = 'このメールアドレスは既に登録されています。';
      }
      setError(errorMessage);
    } else {
      // 確認メールが送信されたかチェック
      if (data?.user) {
        if (!data.user.email_confirmed_at) {
          // 確認メールが必要
          setEmailSent(true);
          setSuccess(true);
          console.log('Email confirmation required for:', data.user.email);
        } else {
          // 既に確認済みの場合は直接マイページへ
          console.log('User already confirmed, redirecting to mypage');
          router.push('/mypage');
        }
      } else {
        // ユーザーが作成されなかった場合
        setError('ユーザーの作成に失敗しました。');
      }
    }
    
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <Card className="p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {emailSent ? '確認メールを送信しました！' : '登録完了！'}
            </h2>
            <p className="text-gray-600 mb-6">
              {emailSent 
                ? `確認メールを ${formData.email} に送信しました。メールボックスを確認して、リンクをクリックしてアカウントを有効化してください。`
                : 'アカウントが正常に作成されました。'
              }
            </p>
            {emailSent && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-sm text-blue-800">
                  📧 確認メールが届かない場合は、迷惑メールフォルダも確認してください。
                </p>
              </div>
            )}
            <div className="space-y-3">
              <Link href="/auth/login">
                <Button className="w-full">
                  ログインページへ
                </Button>
              </Link>
              <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
                ← ホームに戻る
              </Link>
            </div>
          </Card>
        </div>
      </div>
    );
  }

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
          <h2 className="text-3xl font-bold text-gray-900">新規登録</h2>
          <p className="mt-2 text-sm text-gray-600">
            アカウントを作成して学習を始めましょう
          </p>
        </div>

        {/* サインアップフォーム */}
        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                お名前
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="山田 太郎"
              />
            </div>

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
                value={formData.email}
                onChange={handleChange}
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
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="6文字以上で入力"
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

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                パスワード（確認）
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="パスワードを再入力"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                <Link href="/terms" className="text-primary hover:text-primary/80">
                  利用規約
                </Link>
                および
                <Link href="/privacy" className="text-primary hover:text-primary/80">
                  プライバシーポリシー
                </Link>
                に同意します
              </label>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  登録中...
                </>
              ) : (
                'アカウントを作成'
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
                すでにアカウントをお持ちの方は{' '}
                <Link href="/auth/login" className="text-primary hover:text-primary/80 font-medium">
                  ログイン
                </Link>
              </p>
            </div>
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
