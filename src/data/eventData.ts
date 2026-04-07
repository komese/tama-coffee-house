export interface TamaEvent {
    id: string;
    time: string;
    description: string;
}

export const SPECIAL_EVENTS: TamaEvent[] = [
    { id: 'sp1', time: 'あなたの誕生日🎂', description: 'ゲーム内でお祝いしてもらえるかも？' },
    { id: 'sp2', time: 'お正月(1/1)', description: '1000ごっちをお年玉でもらえるよ！' },
    { id: 'sp3', time: 'たまごっちの日(11/23)', description: 'UFO🛸がやってきてたまごっちの日(初代たまごっちの発売日)をお祝いするよ！' },
    { id: 'sp4', time: '12月1日から23日まで🎄', description: '惑星に近くにサンタクロースがいるのを見ることができるよ！' },
    { id: 'sp5', time: 'クリスマス・イブ🎅🏻(12/24)', description: 'サンタクロースがプレゼント🎁を落とすのを見ることができるよ！' },
    { id: 'sp6', time: 'クリスマス🎁(12/25)', description: 'サンタクロースがくれたプレゼント🎁をたまごっちが受け取るよ！' }
];

export const MONTHLY_EVENTS: TamaEvent[] = [
    { id: 'mo1', time: '7の倍数の日(7日, 14日, 21日, 28日)', description: 'フィールドにいると流れ星に遭遇🌠お願い事ができるよ！' },
    { id: 'mo2', time: '9のつく日(9日, 19日, 29日)', description: 'わくせいに隕石襲来!?ミニゲーム「いんせきパンチ」をクリアしてわくせいを守ろう！' },
    { id: 'mo3', time: '0のつく日(10日, 20日, 30日)', description: '「わくせいデコ」と「ゆうぐ」がショップで半額！' },
    { id: 'mo4', time: '5のつく日(5日, 15日, 25日)', description: '「たべもの」と「おやつ」がショップで半額！' },
    { id: 'mo5', time: '13日の午後5時', description: 'どどどっちの群れが襲来!!たまごっちを隠してどどどっちからたまごっちを守ろう！(わくせいレベルが6以上で発生）' }
];
