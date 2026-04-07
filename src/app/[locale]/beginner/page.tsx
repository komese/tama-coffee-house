"use client";

import Link from 'next/link';

export default function BeginnerGuide() {
    return (
        <div className="y2k-container" style={{ maxWidth: '800px', margin: '30px auto 0' }}>
            <h1 className="y2k-title" style={{ textAlign: 'center', lineHeight: '1.2' }}>
                🔰 序盤の進め方<br />
                <span style={{ fontSize: '0.6em', opacity: 0.8 }}>初心者向けお世話ガイド</span>
            </h1>

            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <Link href="/" className="y2k-button" style={{ textDecoration: 'none', display: 'inline-block' }}>
                    ホームに戻る
                </Link>
            </div>

            <div className="y2k-window" style={{ marginBottom: '30px' }}>
                <div className="y2k-window-header">🥚 最初のたまごっちをしっかりお世話しよう</div>
                <div className="y2k-window-body" style={{ lineHeight: '1.8' }}>
                    ゲームを開始したら、<strong>言語、日時、自分の誕生日</strong>を設定します。<br />
                    その後、ズームダイヤルを押すと「エッグバン」が起こり、最初のたまごっちのたまごが誕生します。<br />
                    たまごを貰ったら<strong>1分ほどで孵化</strong>するので、様子を見守りましょう！
                </div>
            </div>

            <div className="y2k-window" style={{ marginBottom: '30px' }}>
                <div className="y2k-window-header">🍼 基本的なお世話</div>
                <div className="y2k-window-body" style={{ lineHeight: '1.8' }}>
                    基本的なお世話は「たまごっちビュー(たまごっちが大きく表示されている画面)」で行います。
                    <ul style={{ paddingLeft: '20px', marginTop: '10px' }}>
                        <li style={{ marginBottom: '10px' }}><strong>🍚 ごはん・おやつをあげる</strong><br />おなかがすいたらごはん、ごきげんが下がったらおやつをあげましょう。</li>
                        <li style={{ marginBottom: '10px' }}><strong>🎾 いっしょにあそぶ</strong><br />たまごっちのごきげん（ハピネス）を上げるためのゲームです。これらはごっちポイントを獲得できませんが、たまごっちの成長に不可欠です。</li>
                        <li style={{ marginBottom: '10px' }}><strong>💩 うんちそうじ</strong><br />「たまふぃーるどビュー（たまごっちが小さく表示されている画面）」でうんちを見つけたら、片付けてあげましょう。片付けたうんちはバイオ燃料になり、後の「トラベル（宇宙旅行）」で使用します。</li>
                        <li style={{ marginBottom: '10px' }}><strong>🛁 おていれ</strong><br />お世話をさぼると体が汚れてしまうので、きれいにしてあげましょう。</li>
                    </ul>
                </div>
            </div>

            <div className="y2k-window" style={{ marginBottom: '30px' }}>
                <div className="y2k-window-header">📈 お世話時間の目安と成長条件の目安</div>
                <div className="y2k-window-body">
                    <h3 style={{ marginBottom: '10px', color: 'var(--primary-color)' }}>育成までの時間</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px', marginBottom: '20px' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f6ebd8', color: 'var(--text-color)' }}>
                                <th style={{ border: '2px solid var(--primary-color)', padding: '10px', textAlign: 'left', width: '20%' }}>段階</th>
                                <th style={{ border: '2px solid var(--primary-color)', padding: '10px', textAlign: 'left', width: '30%' }}>次の成長までの時間</th>
                                <th style={{ border: '2px solid var(--primary-color)', padding: '10px', textAlign: 'left', width: '50%' }}>次の成長条件</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td style={{ border: '2px solid var(--primary-color)', padding: '10px', fontWeight: 'bold' }}>ベビー期</td><td style={{ border: '2px solid var(--primary-color)', padding: '10px' }}>約1時間</td><td style={{ border: '2px solid var(--primary-color)', padding: '10px' }}>陸海空のフィールド属性によって変化</td></tr>
                            <tr><td style={{ border: '2px solid var(--primary-color)', padding: '10px', fontWeight: 'bold' }}>キッズ期</td><td style={{ border: '2px solid var(--primary-color)', padding: '10px' }}>約24時間</td><td style={{ border: '2px solid var(--primary-color)', padding: '10px' }}>与えたエサによって成長先が変化</td></tr>
                            <tr><td style={{ border: '2px solid var(--primary-color)', padding: '10px', fontWeight: 'bold' }}>ヤング期</td><td style={{ border: '2px solid var(--primary-color)', padding: '10px' }}>約24時間</td><td style={{ border: '2px solid var(--primary-color)', padding: '10px' }}>お世話のミスの数で成長先が変化</td></tr>
                            <tr><td style={{ border: '2px solid var(--primary-color)', padding: '10px', fontWeight: 'bold' }}>アダルト期</td><td style={{ border: '2px solid var(--primary-color)', padding: '10px', textAlign: 'center' }}>ー</td><td style={{ border: '2px solid var(--primary-color)', padding: '10px', textAlign: 'center' }}>ー</td></tr>
                        </tbody>
                    </table>
                    <p style={{ fontSize: '0.9rem', color: 'var(--secondary-color)', fontWeight: 'bold' }}>💡 具体的な条件は「<Link href="/#evolution">進化じょうけん</Link>」のページで確認しよう！</p>
                </div>
            </div>

            <div className="y2k-window" style={{ marginBottom: '30px' }}>
                <div className="y2k-window-header">⏰ おきるじかんと寝る時間</div>
                <div className="y2k-window-body">
                    <p style={{ marginBottom: '10px', lineHeight: '1.6' }}>たまごっちには生活リズムがあり、寝ている時間帯が決まっているので起きている時間にたっぷりあそぼう！</p>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f6ebd8', color: 'var(--text-color)' }}>
                                <th style={{ border: '2px solid var(--primary-color)', padding: '10px', textAlign: 'left', width: '25%' }}>時間帯</th>
                                <th style={{ border: '2px solid var(--primary-color)', padding: '10px', textAlign: 'center', width: '30%' }}>時間</th>
                                <th style={{ border: '2px solid var(--primary-color)', padding: '10px', textAlign: 'left' }}>説明</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td style={{ border: '2px solid var(--primary-color)', padding: '10px', fontWeight: 'bold' }}>朝</td><td style={{ border: '2px solid var(--primary-color)', padding: '10px', textAlign: 'center' }}>6:00 ~ 9:59</td><td style={{ border: '2px solid var(--primary-color)', padding: '10px' }}>たまごっちを起こすことができる時間</td></tr>
                            <tr><td style={{ border: '2px solid var(--primary-color)', padding: '10px', fontWeight: 'bold' }}>昼間 ー 夕方</td><td style={{ border: '2px solid var(--primary-color)', padding: '10px', textAlign: 'center' }}>10:00 ~ 18:59</td><td style={{ border: '2px solid var(--primary-color)', padding: '10px' }}>たまごっちが必ず起きている時間</td></tr>
                            <tr><td style={{ border: '2px solid var(--primary-color)', padding: '10px', fontWeight: 'bold' }}>よる</td><td style={{ border: '2px solid var(--primary-color)', padding: '10px', textAlign: 'center' }}>19:00 ~ 21:59</td><td style={{ border: '2px solid var(--primary-color)', padding: '10px' }}>たまごっちを寝かすことができる時間</td></tr>
                            <tr><td style={{ border: '2px solid var(--primary-color)', padding: '10px', fontWeight: 'bold' }}>深夜</td><td style={{ border: '2px solid var(--primary-color)', padding: '10px', textAlign: 'center' }}>22:00 ~ 5:59</td><td style={{ border: '2px solid var(--primary-color)', padding: '10px' }}>たまごっちが必ず寝る時間</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="y2k-window" style={{ marginBottom: '30px' }}>
                <div className="y2k-window-header">🔄 世代交代</div>
                <div className="y2k-window-body" style={{ lineHeight: '1.8' }}>
                    アダルト期まで育てたたまごっちをフィールドにリリースして、新しい世代に交代がすることができます。<br />
                    この場合は、ズームダイヤルを長押ししてラボモードを起動し、「おたすけ」→「たまごそうだん」と進みます。<br />
                    そこで「ブリードする」か「たまごをもらう」かを選ぶ画面が表示されます。
                </div>
            </div>

            <div className="y2k-window" style={{ marginBottom: '30px' }}>
                <div className="y2k-window-header">🎯 序盤の目標</div>
                <div className="y2k-window-body" style={{ lineHeight: '1.8' }}>
                    <strong>わくせいレベル</strong>を上げることでできることが広がります。<br /><br />
                    基本的にはたまごっちを育てればわくせいレベルを上げることができるので、<br />
                    <span style={{ color: 'var(--secondary-color)', fontWeight: 'bold', fontSize: '1.1rem' }}>序盤はここを最大まで上げることを目指しましょう！</span>
                </div>
            </div>

            <div className="y2k-window" style={{ marginBottom: '30px' }}>
                <div className="y2k-window-header">💰 お金(ごっちポイント)稼ぎと節約術</div>
                <div className="y2k-window-body" style={{ lineHeight: '1.8' }}>
                    <p style={{ marginBottom: '15px' }}>
                        「たまごっちパラダイス」でたまごっちのお世話やにゅーたまごっち星のデコレーションに欠かせない「ごっちポイント」。ごはんやおやつ、ゆうぐ（おもちゃ）などをショップで購入するために必要となります。
                    </p>

                    <h3 style={{ marginTop: '20px', color: 'var(--primary-color)' }}>１：ラボモードの「ミニゲーム」をプレイする</h3>
                    <p style={{ paddingLeft: '15px', marginBottom: '15px' }}>
                        ごっちポイントを稼ぐ最も基本的な方法は、ラボモードでプレイできる「ミニゲーム」です。<br />
                        ミニゲームは6種類あり、クリアするとごっちポイントがもらえます。たまごっちのハピネス（ごきげん）は上がりませんが、ポイント稼ぎに特化しています。<br /><br />
                        <strong>たまごっちが寝ている間でもプレイできるため</strong>、時間を有効活用してポイントを貯めることができます。<br />
                        難易度は「かんたん」「ふつう」「むずかしい」の3種類があります。最初は「かんたん」しか選べませんが、わくせいレベルがLv.6になると「ふつう」が、Lv.9になると「むずかしい」が解放され、より多くのポイントを稼げるようになります。
                    </p>

                    <h3 style={{ marginTop: '20px', color: 'var(--primary-color)' }}>２：「ミッション」をクリアする</h3>
                    <p style={{ paddingLeft: '15px', marginBottom: '15px' }}>
                        ゲーム内には合計22の「ミッション」が用意されており、これらを達成すると報酬としてごっちポイントがもらえます。<br />
                        「たまごっちに合計500回ごはんをあげる」といったミッションを達成すると、1000ごっちポイントを獲得できます。<br />
                        ミッションの進捗はラボモードの「インフォメーション」で確認できます。長期的な目標として意識しておくと、まとまったポイントを得るチャンスになります。
                    </p>

                    <h3 style={{ marginTop: '20px', color: 'var(--primary-color)' }}>３：特定の「イベント」で受け取る</h3>
                    <p style={{ paddingLeft: '15px', marginBottom: '15px' }}>
                        お正月の1月1日には、新年のお祝いとして1000ごっちポイントがギフトとして贈られます。<br />
                        （その他のイベントは「<Link href="/events">🎉イベントリスト</Link>」をチェック！）
                    </p>

                    <h3 style={{ marginTop: '20px', color: 'var(--primary-color)' }}>４：いらないアイテムを売る</h3>
                    <p style={{ paddingLeft: '15px', marginBottom: '25px' }}>
                        ラボモードの「ショップ」では、アイテムを購入するだけでなく、手持ちの不要なアイテムを売ってごっちポイントに換えることもできます。使わなくなったゆうぐ（おもちゃ）やデコアイテムがあれば、売却を検討してみましょう。
                    </p>

                    <hr style={{ border: 'none', borderTop: '2px dashed var(--accent-color)', margin: '20px 0' }} />

                    <h3 style={{ color: 'var(--secondary-color)' }}>【番外編】ショップのセールを活用して節約！</h3>
                    <p style={{ paddingLeft: '15px', marginBottom: '15px' }}>
                        稼ぐことと同時に、ポイントを賢く使うことも重要です。ショップでは特定日にセールが開催され、アイテムを<strong style={{ color: 'red' }}>半額</strong>で購入できます。
                    </p>
                    
                    <ul style={{ paddingLeft: '35px', marginBottom: '15px' }}>
                        <li style={{ marginBottom: '10px' }}>
                            <strong>🍚 ごはん・おやつセール</strong><br />
                            毎月 <strong>5日、15日、25日</strong> は、「ごはん」と「おやつ」が50%オフになります。
                        </li>
                        <li>
                            <strong>🎪 おもちゃ・デコセール</strong><br />
                            毎月 <strong>10日、20日、30日</strong> は、「ゆうぐ」と「デコアイテム」が50%オフになります。
                        </li>
                    </ul>
                    
                    <p style={{ paddingLeft: '15px', fontWeight: 'bold' }}>
                        これらのセール日を狙ってまとめ買いをすることで、ごっちポイントの消費を大幅に抑えることができます！
                    </p>
                </div>
            </div>
            
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <Link href="/" className="y2k-button" style={{ textDecoration: 'none', display: 'inline-block' }}>
                    トップページへ
                </Link>
            </div>
        </div>
    );
}
