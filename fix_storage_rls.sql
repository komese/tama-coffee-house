-- bbs-images ストレージバケットのRLSポリシーを修正
-- 現在：ログインしているユーザーしか画像をアップロードできない
-- 修正後：ゲスト（未ログイン）ユーザーでも画像をアップロードできるようにする

-- 既存のINSERTポリシーを削除（名前は環境によって異なる場合があります）
-- Supabaseダッシュボードの Storage > Policies で確認してください

-- 誰でもアップロードできるポリシーを作成
CREATE POLICY "Allow public uploads to bbs-images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'bbs-images');

-- 誰でも画像を閲覧できるポリシー（既にあるかもしれませんが念のため）
CREATE POLICY "Allow public read from bbs-images"
ON storage.objects FOR SELECT
USING (bucket_id = 'bbs-images');
