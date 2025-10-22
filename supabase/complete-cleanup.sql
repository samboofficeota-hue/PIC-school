-- ======================================
-- Supabase Database COMPLETE Cleanup Script
-- ======================================
-- このスクリプトは既存のデータベースを完全にクリーンな状態にします
-- 注意: すべてのデータ、テーブル、関数、トリガー、ポリシーが削除されます
-- ======================================

-- Step 1: すべてのトリガーを削除
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT trigger_name, event_object_table 
              FROM information_schema.triggers 
              WHERE trigger_schema = 'public') 
    LOOP
        EXECUTE 'DROP TRIGGER IF EXISTS ' || quote_ident(r.trigger_name) || 
                ' ON ' || quote_ident(r.event_object_table) || ' CASCADE';
    END LOOP;
END $$;

-- auth.users のトリガーも削除（権限があれば）
DO $$ 
BEGIN
    DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Could not drop trigger on auth.users (expected if no permission)';
END $$;

-- Step 2: すべてのポリシーを削除
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT schemaname, tablename, policyname 
              FROM pg_policies 
              WHERE schemaname = 'public') 
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || 
                ' ON ' || quote_ident(r.tablename) || ' CASCADE';
    END LOOP;
END $$;

-- Step 3: すべてのテーブルを削除
DO $$ 
DECLARE
    r RECORD;
BEGIN
    -- 外部キー制約を無視して削除するため CASCADE を使用
    FOR r IN (SELECT tablename 
              FROM pg_tables 
              WHERE schemaname = 'public') 
    LOOP
        EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
    END LOOP;
END $$;

-- Step 4: すべての関数を削除
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT routine_name, routine_schema
              FROM information_schema.routines 
              WHERE routine_schema = 'public' 
              AND routine_type = 'FUNCTION') 
    LOOP
        EXECUTE 'DROP FUNCTION IF EXISTS ' || 
                quote_ident(r.routine_schema) || '.' || quote_ident(r.routine_name) || 
                ' CASCADE';
    END LOOP;
END $$;

-- Step 5: すべてのシーケンスを削除
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT sequence_name 
              FROM information_schema.sequences 
              WHERE sequence_schema = 'public') 
    LOOP
        EXECUTE 'DROP SEQUENCE IF EXISTS ' || quote_ident(r.sequence_name) || ' CASCADE';
    END LOOP;
END $$;

-- Step 6: すべてのビューを削除
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT table_name 
              FROM information_schema.views 
              WHERE table_schema = 'public') 
    LOOP
        EXECUTE 'DROP VIEW IF EXISTS ' || quote_ident(r.table_name) || ' CASCADE';
    END LOOP;
END $$;

-- 確認クエリ（コメントを外して実行すると、残っているオブジェクトを確認できます）
-- SELECT 'Tables:' as object_type, tablename as name FROM pg_tables WHERE schemaname = 'public'
-- UNION ALL
-- SELECT 'Functions:', routine_name FROM information_schema.routines WHERE routine_schema = 'public'
-- UNION ALL
-- SELECT 'Triggers:', trigger_name FROM information_schema.triggers WHERE trigger_schema = 'public'
-- UNION ALL
-- SELECT 'Policies:', policyname FROM pg_policies WHERE schemaname = 'public';

-- ======================================
-- クリーンアップ完了
-- ======================================
-- データベースが完全にクリーンな状態になりました
-- 次のステップ: schema.sql を実行してください
-- ======================================

