-- PIC School データベーススキーマ
-- このファイルをSupabaseのSQL Editorで実行してください

-- ユーザープロフィール拡張テーブル
CREATE TABLE IF NOT EXISTS user_profiles (
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

-- プログラムテーブル
CREATE TABLE IF NOT EXISTS programs (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  instructor_name TEXT,
  instructor_bio TEXT,
  price DECIMAL(10,2) DEFAULT 0,
  duration_hours INTEGER DEFAULT 0,
  difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')) DEFAULT 'beginner',
  category TEXT,
  status TEXT CHECK (status IN ('draft', 'published', 'archived')) DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- チャプターテーブル
CREATE TABLE IF NOT EXISTS chapters (
  id SERIAL PRIMARY KEY,
  program_id INTEGER REFERENCES programs(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  video_url TEXT,
  duration_minutes INTEGER DEFAULT 0,
  order_index INTEGER NOT NULL,
  is_free BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ユーザープログラム登録テーブル
CREATE TABLE IF NOT EXISTS user_programs (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  program_id INTEGER REFERENCES programs(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  progress_percentage DECIMAL(5,2) DEFAULT 0,
  last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, program_id)
);

-- ユーザー学習進捗テーブル
CREATE TABLE IF NOT EXISTS user_progress (
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

-- 実績・バッジテーブル
CREATE TABLE IF NOT EXISTS achievements (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon_url TEXT,
  points INTEGER DEFAULT 0,
  category TEXT,
  rarity TEXT CHECK (rarity IN ('common', 'uncommon', 'rare', 'epic', 'legendary')) DEFAULT 'common',
  conditions JSONB, -- 実績獲得条件
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ユーザー実績テーブル
CREATE TABLE IF NOT EXISTS user_achievements (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id INTEGER REFERENCES achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  points_earned INTEGER DEFAULT 0,
  UNIQUE(user_id, achievement_id)
);

-- ユーザーポイントテーブル
CREATE TABLE IF NOT EXISTS user_points (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  total_points INTEGER DEFAULT 0,
  earned_points INTEGER DEFAULT 0,
  spent_points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- 学習セッションテーブル
CREATE TABLE IF NOT EXISTS learning_sessions (
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

-- 通知テーブル
CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT CHECK (type IN ('achievement', 'progress', 'system', 'marketing')) DEFAULT 'system',
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 管理者権限テーブル
CREATE TABLE IF NOT EXISTS admin_roles (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('super_admin', 'admin', 'moderator')) DEFAULT 'admin',
  permissions JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- インデックスの作成
CREATE INDEX IF NOT EXISTS idx_user_programs_user_id ON user_programs(user_id);
CREATE INDEX IF NOT EXISTS idx_user_programs_program_id ON user_programs(program_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_chapter_id ON user_progress(chapter_id);
CREATE INDEX IF NOT EXISTS idx_chapters_program_id ON chapters(program_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_sessions_user_id ON learning_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);

-- RLS (Row Level Security) の設定
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_roles ENABLE ROW LEVEL SECURITY;

-- ユーザープロフィールのRLSポリシー
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- ユーザープログラムのRLSポリシー
CREATE POLICY "Users can view own programs" ON user_programs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own programs" ON user_programs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own programs" ON user_programs
  FOR UPDATE USING (auth.uid() = user_id);

-- ユーザー進捗のRLSポリシー
CREATE POLICY "Users can view own progress" ON user_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON user_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON user_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- ユーザー実績のRLSポリシー
CREATE POLICY "Users can view own achievements" ON user_achievements
  FOR SELECT USING (auth.uid() = user_id);

-- 学習セッションのRLSポリシー
CREATE POLICY "Users can view own sessions" ON learning_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions" ON learning_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 通知のRLSポリシー
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- 管理者権限のRLSポリシー
CREATE POLICY "Admins can view all admin roles" ON admin_roles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM admin_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('super_admin', 'admin')
    )
  );

-- プログラムとチャプターは公開データとして全ユーザーが閲覧可能
CREATE POLICY "Programs are viewable by everyone" ON programs
  FOR SELECT USING (status = 'published');

CREATE POLICY "Chapters are viewable by everyone" ON chapters
  FOR SELECT USING (true);

-- 実績は全ユーザーが閲覧可能
CREATE POLICY "Achievements are viewable by everyone" ON achievements
  FOR SELECT USING (is_active = true);

-- 関数: ユーザープロフィールの自動作成
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  );
  
  -- 初期ポイントを付与
  INSERT INTO public.user_points (user_id, total_points, earned_points)
  VALUES (NEW.id, 0, 0);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- トリガー: 新規ユーザー登録時にプロフィールを作成
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 関数: 学習進捗の更新
CREATE OR REPLACE FUNCTION public.update_user_progress(
  p_user_id UUID,
  p_chapter_id INTEGER,
  p_progress_percentage DECIMAL(5,2),
  p_time_spent_minutes INTEGER DEFAULT 0
)
RETURNS VOID AS $$
DECLARE
  v_program_id INTEGER;
  v_old_progress DECIMAL(5,2);
  v_points_to_award INTEGER;
BEGIN
  -- チャプターのプログラムIDを取得
  SELECT program_id INTO v_program_id FROM chapters WHERE id = p_chapter_id;
  
  -- 既存の進捗を取得
  SELECT progress_percentage INTO v_old_progress 
  FROM user_progress 
  WHERE user_id = p_user_id AND chapter_id = p_chapter_id;
  
  -- 進捗を更新または挿入
  INSERT INTO user_progress (
    user_id, chapter_id, progress_percentage, 
    time_spent_minutes, last_accessed_at
  )
  VALUES (
    p_user_id, p_chapter_id, p_progress_percentage,
    p_time_spent_minutes, NOW()
  )
  ON CONFLICT (user_id, chapter_id)
  DO UPDATE SET
    progress_percentage = p_progress_percentage,
    time_spent_minutes = user_progress.time_spent_minutes + p_time_spent_minutes,
    last_accessed_at = NOW(),
    completed_at = CASE 
      WHEN p_progress_percentage >= 100 THEN NOW()
      ELSE user_progress.completed_at
    END,
    updated_at = NOW();
  
  -- 100%完了した場合のポイント付与
  IF p_progress_percentage >= 100 AND (v_old_progress IS NULL OR v_old_progress < 100) THEN
    v_points_to_award := 50; -- チャプター完了で50ポイント
    
    -- ポイントを追加
    INSERT INTO user_points (user_id, total_points, earned_points)
    VALUES (p_user_id, v_points_to_award, v_points_to_award)
    ON CONFLICT (user_id)
    DO UPDATE SET
      total_points = user_points.total_points + v_points_to_award,
      earned_points = user_points.earned_points + v_points_to_award,
      updated_at = NOW();
  END IF;
  
  -- プログラム全体の進捗を更新
  UPDATE user_programs
  SET progress_percentage = (
    SELECT AVG(progress_percentage)
    FROM user_progress up
    JOIN chapters c ON c.id = up.chapter_id
    WHERE up.user_id = p_user_id AND c.program_id = v_program_id
  ),
  last_accessed_at = NOW()
  WHERE user_id = p_user_id AND program_id = v_program_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 初期データの挿入
INSERT INTO programs (title, description, instructor_name, instructor_bio, price, duration_hours, difficulty_level, category, status) VALUES
('ビジネススキル基礎コース', 'ビジネスの基本原則から実践的なスキルまで、体系的に学べる総合コースです。', '田中 太郎', '10年以上のビジネス経験を持つコンサルタント', 0, 5, 'beginner', 'ビジネス基礎', 'published'),
('マーケティング戦略', '効果的なマーケティング戦略の立案と実行方法を学びます。', '佐藤 花子', '大手広告代理店での豊富な経験を持つマーケティング専門家', 0, 3, 'intermediate', 'マーケティング', 'published'),
('データ分析コース', 'データに基づいた意思決定を行うための分析手法を学びます。', '鈴木 一郎', 'データサイエンティストとして活躍する専門家', 0, 4, 'intermediate', 'データ分析', 'published'),
('リーダーシップ開発', '効果的なリーダーシップスキルを身につけるためのコースです。', '高橋 美咲', '組織開発の専門家として多くの企業を支援', 0, 3, 'advanced', 'リーダーシップ', 'published');

-- 初期実績データの挿入
INSERT INTO achievements (name, description, points, category, rarity) VALUES
('初回完了', '最初のチャプターを完了しました', 50, 'learning', 'common'),
('継続学習', '7日連続で学習しました', 100, 'consistency', 'uncommon'),
('高得点', 'テストで90点以上を獲得しました', 75, 'performance', 'uncommon'),
('学習時間マスター', '累計学習時間が20時間を超えました', 150, 'time', 'rare'),
('プログラム完了', 'プログラムを完全に修了しました', 500, 'completion', 'rare');
