-- PIC School セキュリティ問題修正
-- このファイルをSupabaseのSQL Editorで実行してください

-- 1. achievementsテーブルのRLS有効化
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

-- 2. achievementsテーブルのRLSポリシー作成
-- 全ユーザーが読み取り可能、管理者のみ書き込み可能
CREATE POLICY "Anyone can view achievements" ON achievements
  FOR SELECT USING (true);

CREATE POLICY "Only admins can insert achievements" ON achievements
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('super_admin', 'admin')
    )
  );

CREATE POLICY "Only admins can update achievements" ON achievements
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM admin_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('super_admin', 'admin')
    )
  );

CREATE POLICY "Only admins can delete achievements" ON achievements
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM admin_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('super_admin', 'admin')
    )
  );

-- 3. handle_new_user関数のセキュリティ修正
-- 既存の関数を削除（CASCADEで依存オブジェクトも削除）
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;

-- セキュアな関数を再作成
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
    -- エラーログを記録（本番環境では適切なログシステムを使用）
    RAISE WARNING 'Error in handle_new_user: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- 4. トリガーの再作成
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 5. 追加のセキュリティ設定
-- 既存のテーブルでRLSが無効になっているものがないか確認
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;

-- 6. programsテーブルのRLSポリシー
CREATE POLICY "Anyone can view published programs" ON programs
  FOR SELECT USING (status = 'published');

CREATE POLICY "Only admins can manage programs" ON programs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('super_admin', 'admin')
    )
  );

-- 7. chaptersテーブルのRLSポリシー
CREATE POLICY "Anyone can view chapters of published programs" ON chapters
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM programs 
      WHERE id = chapters.program_id 
      AND status = 'published'
    )
  );

CREATE POLICY "Only admins can manage chapters" ON chapters
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('super_admin', 'admin')
    )
  );

-- 8. 関数の権限設定
-- handle_new_user関数の実行権限を制限
REVOKE ALL ON FUNCTION handle_new_user() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION handle_new_user() TO service_role;

-- 9. セキュリティ設定の確認
-- RLSが有効になっているテーブルの確認
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN (
  'user_profiles', 'programs', 'chapters', 'user_programs', 
  'user_progress', 'achievements', 'user_achievements', 
  'user_points', 'learning_sessions', 'notifications', 'admin_roles'
)
ORDER BY tablename;

-- 10. 完了メッセージ
SELECT 'Security issues have been fixed!' as message;
