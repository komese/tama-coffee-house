-- messagesテーブル群（全10言語）に対する author_avatar_url カラム追加スクリプト
-- 未ログイン（ゲスト）ユーザーが選択したアイコン画像のURLを保存するために使用します。

ALTER TABLE messages ADD COLUMN IF NOT EXISTS author_avatar_url TEXT;
ALTER TABLE en_messages ADD COLUMN IF NOT EXISTS author_avatar_url TEXT;
ALTER TABLE zh_tw_messages ADD COLUMN IF NOT EXISTS author_avatar_url TEXT;
ALTER TABLE ko_messages ADD COLUMN IF NOT EXISTS author_avatar_url TEXT;
ALTER TABLE pt_br_messages ADD COLUMN IF NOT EXISTS author_avatar_url TEXT;
ALTER TABLE de_messages ADD COLUMN IF NOT EXISTS author_avatar_url TEXT;
ALTER TABLE fr_messages ADD COLUMN IF NOT EXISTS author_avatar_url TEXT;
ALTER TABLE es_messages ADD COLUMN IF NOT EXISTS author_avatar_url TEXT;
ALTER TABLE it_messages ADD COLUMN IF NOT EXISTS author_avatar_url TEXT;
ALTER TABLE th_messages ADD COLUMN IF NOT EXISTS author_avatar_url TEXT;
