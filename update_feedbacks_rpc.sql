-- 非ログインユーザー（ゲスト）の送信データも安全に読み取れるようにするための特殊な関数（RPC）を作成します。
-- 目安箱テーブル (feedbacks) はプライバシー保護のため、「全体の読み取り（SELECT）」を完全に禁止しています。
-- しかしこの関数を通すことで、「自分の送信したメッセージの長くて複雑なID（UUID）」を知っている端末（localStorage）からのみ、そのデータだけをピンポイントで取得できるようになります。

CREATE OR REPLACE FUNCTION get_my_feedbacks(feedback_ids UUID[])
RETURNS SETOF feedbacks
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT * FROM feedbacks WHERE id = ANY(feedback_ids);
$$;
