-- feedbacksテーブルに「管理人からのお返事」用のカラムを追加
ALTER TABLE feedbacks ADD COLUMN IF NOT EXISTS admin_reply TEXT;
ALTER TABLE feedbacks ADD COLUMN IF NOT EXISTS admin_replied_at TIMESTAMP WITH TIME ZONE;

-- RLSポリシーの追加：
-- ユーザーが「自分が送信したメッセージとお返事」だけをアカウント画面で読み取れるようにします
CREATE POLICY "Users can view their own feedbacks"
ON feedbacks FOR SELECT
USING (auth.uid() = author_id);
