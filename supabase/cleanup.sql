-- ======================================
-- Supabase Database Cleanup Script
-- ======================================
-- このスクリプトは既存のテーブルとデータを完全に削除します
-- 注意: このスクリプトを実行すると、すべてのデータが失われます
-- 
-- 実行順序:
-- 1. このスクリプトを実行（cleanup.sql）
-- 2. schema.sqlを実行
-- ======================================

-- トリガーの削除
-- 注意: テーブルが存在しない場合はエラーが出ますが、問題ありません
DO $$ 
BEGIN
    DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
EXCEPTION WHEN undefined_table THEN NULL;
END $$;

DO $$ 
BEGIN
    DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
EXCEPTION WHEN undefined_table THEN NULL;
END $$;

DO $$ 
BEGIN
    DROP TRIGGER IF EXISTS update_lesson_progress_updated_at ON lesson_progress;
EXCEPTION WHEN undefined_table THEN NULL;
END $$;

DO $$ 
BEGIN
    DROP TRIGGER IF EXISTS update_work_answers_updated_at ON work_answers;
EXCEPTION WHEN undefined_table THEN NULL;
END $$;

DO $$ 
BEGIN
    DROP TRIGGER IF EXISTS update_community_posts_updated_at ON community_posts;
EXCEPTION WHEN undefined_table THEN NULL;
END $$;

DO $$ 
BEGIN
    DROP TRIGGER IF EXISTS on_like_changed ON likes;
EXCEPTION WHEN undefined_table THEN NULL;
END $$;

-- 関数の削除
DROP FUNCTION IF EXISTS handle_new_user CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column CASCADE;
DROP FUNCTION IF EXISTS update_post_likes_count CASCADE;

-- RLSポリシーの削除（テーブル削除時に自動削除されますが、明示的に記載）
-- user_profiles
DROP POLICY IF EXISTS "Users can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;

-- lesson_progress
DROP POLICY IF EXISTS "Users can view own progress" ON lesson_progress;
DROP POLICY IF EXISTS "Users can insert own progress" ON lesson_progress;
DROP POLICY IF EXISTS "Users can update own progress" ON lesson_progress;

-- work_answers
DROP POLICY IF EXISTS "Users can view own work answers" ON work_answers;
DROP POLICY IF EXISTS "Users can insert own work answers" ON work_answers;
DROP POLICY IF EXISTS "Users can update own work answers" ON work_answers;

-- dialogue_history
DROP POLICY IF EXISTS "Users can view own dialogue history" ON dialogue_history;
DROP POLICY IF EXISTS "Users can insert own dialogue history" ON dialogue_history;

-- community_posts
DROP POLICY IF EXISTS "Anyone can view public posts" ON community_posts;
DROP POLICY IF EXISTS "Users can view own posts" ON community_posts;
DROP POLICY IF EXISTS "Users can insert own posts" ON community_posts;
DROP POLICY IF EXISTS "Users can update own posts" ON community_posts;
DROP POLICY IF EXISTS "Users can delete own posts" ON community_posts;

-- likes
DROP POLICY IF EXISTS "Users can view all likes" ON likes;
DROP POLICY IF EXISTS "Users can insert own likes" ON likes;
DROP POLICY IF EXISTS "Users can delete own likes" ON likes;

-- 旧テーブルの削除（参照制約を考慮して逆順で削除）
-- 新構造のテーブル
DROP TABLE IF EXISTS likes CASCADE;
DROP TABLE IF EXISTS community_posts CASCADE;
DROP TABLE IF EXISTS dialogue_history CASCADE;
DROP TABLE IF EXISTS work_answers CASCADE;
DROP TABLE IF EXISTS lesson_progress CASCADE;

-- 旧構造のテーブル（存在する場合）
DROP TABLE IF EXISTS ai_chat_history CASCADE;
DROP TABLE IF EXISTS discussion_posts CASCADE;
DROP TABLE IF EXISTS worksheets CASCADE;
DROP TABLE IF EXISTS lecture_history CASCADE;
DROP TABLE IF EXISTS course_progress CASCADE;
DROP TABLE IF EXISTS chapters CASCADE;
DROP TABLE IF EXISTS lectures CASCADE;
DROP TABLE IF EXISTS programs CASCADE;
DROP TABLE IF EXISTS courses CASCADE;

-- その他のテーブル
DROP TABLE IF EXISTS achievements CASCADE;
DROP TABLE IF EXISTS user_achievements CASCADE;
DROP TABLE IF EXISTS certificates CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;

-- ======================================
-- クリーンアップ完了
-- ======================================
-- 次のステップ: schema.sql を実行してください

