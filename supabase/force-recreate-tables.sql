-- PIC School 強制テーブル再作成
-- このファイルをSupabaseのSQL Editorで実行してください

-- 1. すべてのテーブルを強制削除（CASCADEで依存関係も削除）
DROP TABLE IF EXISTS admin_roles CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS learning_sessions CASCADE;
DROP TABLE IF EXISTS user_points CASCADE;
DROP TABLE IF EXISTS user_achievements CASCADE;
DROP TABLE IF EXISTS user_progress CASCADE;
DROP TABLE IF EXISTS user_programs CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;

-- 2. スキーマキャッシュをクリア（可能な範囲で）
-- 注意: これはPostgreSQLの内部操作です

-- 3. ユーザープロフィールテーブルを再作成
CREATE TABLE user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  avatar_url TEXT,
  bio TEXT,
  location TEXT,
  phone TEXT,
  birthday DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. ユーザープログラム登録テーブルを再作成
CREATE TABLE user_programs (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  program_id INTEGER REFERENCES programs(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  progress_percentage DECIMAL(5,2) DEFAULT 0,
  last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, program_id)
);

-- 5. ユーザー学習進捗テーブルを再作成
CREATE TABLE user_progress (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  chapter_id INTEGER REFERENCES chapters(id) ON DELETE CASCADE,
  progress_percentage DECIMAL(5,2) DEFAULT 0,
  time_spent_minutes INTEGER DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE,
  last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, chapter_id)
);

-- 6. ユーザー実績テーブルを再作成
CREATE TABLE user_achievements (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id INTEGER REFERENCES achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  points_earned INTEGER DEFAULT 0,
  UNIQUE(user_id, achievement_id)
);

-- 7. ユーザーポイントテーブルを再作成
CREATE TABLE user_points (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  total_points INTEGER DEFAULT 0,
  earned_points INTEGER DEFAULT 0,
  spent_points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- 8. 学習セッションテーブルを再作成
CREATE TABLE learning_sessions (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  chapter_id INTEGER REFERENCES chapters(id) ON DELETE CASCADE,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE,
  duration_minutes INTEGER DEFAULT 0,
  progress_before DECIMAL(5,2) DEFAULT 0,
  progress_after DECIMAL(5,2) DEFAULT 0,
  points_earned INTEGER DEFAULT 0
);

-- 9. 通知テーブルを再作成
CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT CHECK (type IN ('achievement', 'progress', 'system', 'marketing')) DEFAULT 'system',
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. 管理者権限テーブルを再作成
CREATE TABLE admin_roles (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('super_admin', 'admin', 'moderator')) DEFAULT 'admin',
  permissions JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- 11. インデックスの作成
CREATE INDEX IF NOT EXISTS idx_user_programs_user_id ON user_programs(user_id);
CREATE INDEX IF NOT EXISTS idx_user_programs_program_id ON user_programs(program_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_chapter_id ON user_progress(chapter_id);
CREATE INDEX IF NOT EXISTS idx_learning_sessions_user_id ON learning_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_sessions_chapter_id ON learning_sessions(chapter_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);

-- 12. RLS（Row Level Security）の有効化
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_roles ENABLE ROW LEVEL SECURITY;

-- 13. RLSポリシーの作成
-- ユーザープロフィールのポリシー
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- ユーザープログラムのポリシー
CREATE POLICY "Users can view own programs" ON user_programs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own programs" ON user_programs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own programs" ON user_programs
  FOR UPDATE USING (auth.uid() = user_id);

-- ユーザー進捗のポリシー
CREATE POLICY "Users can view own progress" ON user_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON user_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON user_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- 通知のポリシー
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- 14. 関数の作成
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- ユーザープロフィールの作成
  INSERT INTO user_profiles (id, name, avatar_url)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  );
  
  -- ユーザーポイントの初期化
  INSERT INTO user_points (user_id, total_points, earned_points, spent_points)
  VALUES (NEW.id, 0, 0, 0);
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- エラーログを記録
    RAISE WARNING 'Error in handle_new_user: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- 15. トリガーの作成
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 16. 初期データの投入
INSERT INTO achievements (name, description, icon_url, points, category, rarity) VALUES
('初回ログイン', '初回ログインを完了しました', '🎉', 10, 'login', 'common'),
('学習開始', '初回の学習を開始しました', '📚', 20, 'learning', 'common'),
('チャプター完了', '初回のチャプターを完了しました', '✅', 50, 'progress', 'common'),
('プログラム完了', '初回のプログラムを完了しました', '🏆', 100, 'completion', 'uncommon'),
('連続学習', '3日連続で学習しました', '🔥', 75, 'streak', 'uncommon'),
('早朝学習', '朝6時前に学習しました', '🌅', 30, 'timing', 'rare'),
('深夜学習', '夜11時以降に学習しました', '🌙', 25, 'timing', 'rare'),
('完璧主義者', '100%の進捗でチャプターを完了しました', '💯', 100, 'perfection', 'epic'),
('学習マスター', '10個のプログラムを完了しました', '👑', 500, 'mastery', 'legendary'),
('知識の探求者', '50時間の学習を達成しました', '🔍', 1000, 'dedication', 'legendary')
ON CONFLICT DO NOTHING;

-- 17. テーブル構造の確認
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name IN (
  'user_profiles', 'user_programs', 'user_progress', 
  'user_achievements', 'user_points', 'learning_sessions', 
  'notifications', 'admin_roles'
)
ORDER BY table_name, ordinal_position;

-- 18. 完了メッセージ
SELECT 'Force table recreation completed successfully!' as message;
