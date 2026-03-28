-- サイトの改善要望や個人的なメッセージを管理人に送るための「目安箱」テーブルを作成
CREATE TABLE IF NOT EXISTS feedbacks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    content TEXT NOT NULL,
    author_id UUID REFERENCES auth.users(id), -- ログイン済みユーザーから送られた場合（任意）
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 安全のため、誰でも送信（INSERT）できるが、閲覧（SELECT）は誰もできないように設定します。
-- 管理人はSupabaseのダッシュボード（Table Editor）から直接テーブルを開いて中身を確認します。
ALTER TABLE feedbacks ENABLE ROW LEVEL SECURITY;

-- 匿名ユーザーを含め、誰でもメッセージを送信可能にするポリシー
CREATE POLICY "Allow anyone to insert feedbacks"
ON feedbacks FOR INSERT
WITH CHECK (true);

-- 誰も SELECT (読み取り), UPDATE (更新), DELETE (削除) はAPI経由でできないようにする（RLSによってデフォルトで拒否）
