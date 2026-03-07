export type EvolutionStage = 'ベビー' | 'キッズ' | 'ヤング' | 'アダルト' | '特殊';

export type EvolutionCharacter = {
    id: string;
    name: string;
    stage: EvolutionStage;
    condition: string;
    description: string;
    iconUrl: string;
    parentName?: string;
};

export const LAND_DATA: EvolutionCharacter[] = [
    {
        id: 'land_1', name: 'べびまるっち', stage: 'ベビー',
        condition: '初期キャラクター', description: '',
        iconUrl: '/images/characters/01_べびまるっち.png'
    },
    {
        id: 'land_2', name: 'りくキッズ', stage: 'キッズ', parentName: 'べびまるっち',
        condition: 'りくステージで一定時間経過し、りくマーク🍃が4つ集まると進化', description: '',
        iconUrl: '/images/characters/02_りくキッズ-512x512.png'
    },
    { id: 'land_3', name: 'がおがおヤング', stage: 'ヤング', parentName: 'りくキッズ', condition: 'たまさいぼーの画面に、ちっちゃいミート🍗・だいちミート🍖のマークが一番多い状態で進化', description: '', iconUrl: '/images/characters/05_がおがおヤング_LAND-512x512.png' },
    { id: 'land_4', name: 'とことこヤング', stage: 'ヤング', parentName: 'りくキッズ', condition: 'たまさいぼーの画面に、にんじん🥕・りんご🍎のマークが一番多い状態で進化', description: '', iconUrl: '/images/characters/06_とことこヤング_LAND-512x512.png' },
    { id: 'land_5', name: 'ぺろぺろヤング', stage: 'ヤング', parentName: 'りくキッズ', condition: 'たまさいぼーの画面に、ミールワーム🐛・ミールバグ🐞のマークが一番多い状態で進化', description: '', iconUrl: '/images/characters/07_ぺろぺろヤング_LAND-512x512.png' },
    { id: 'land_6', name: 'にょきにょきヤング', stage: 'ヤング', parentName: 'りくキッズ', condition: 'たまさいぼーの画面に、おにぎり🍙以外のマークがない状態で進化', description: '', iconUrl: '/images/characters/08_にょきにょきヤング_LAND-1-512x512.png' },
    { id: 'land_7', name: 'みゃおっち', stage: 'アダルト', parentName: 'がおがおヤング', condition: '・ぐるぐるマーク🌀0個\n・ごきげんマーク☀6個\n・ごはんマーク6個\nすべてを満たした状態で進化', description: '', iconUrl: '/images/characters/18_みゃおっち_LAND-512x512.png' },
    { id: 'land_11', name: 'ポチっち', stage: 'アダルト', parentName: 'がおがおヤング', condition: '【パターン1】\nぐるぐるマーク🌀1個の状態で進化\n【パターン2】\nぐるぐるマーク🌀0個で、ごきげんマーク☀かごはんマークが6個未満の状態で進化', description: '', iconUrl: '/images/characters/19_ポチっち_LAND-512x512.png' },
    { id: 'land_15', name: 'ぐまっくす', stage: 'アダルト', parentName: 'がおがおヤング', condition: 'ぐるぐるマーク🌀2個から5個の状態で進化', description: '', iconUrl: '/images/characters/20_ぐまっくす_LAND-512x512.png' },
    { id: 'land_19', name: 'らっち', stage: 'アダルト', parentName: 'がおがおヤング', condition: 'ぐるぐるマーク🌀6個の状態で進化', description: '', iconUrl: '/images/characters/21_らっち_LAND-512x512.png' },
    { id: 'land_8', name: 'まめっち', stage: 'アダルト', parentName: 'とことこヤング', condition: '・ぐるぐるマーク🌀0個\n・ごきげんマーク☀6個\n・ごはんマーク6個\nすべてを満たした状態で進化', description: '', iconUrl: '/images/characters/22_まめっち_LAND-512x512.png' },
    { id: 'land_12', name: 'みみっち', stage: 'アダルト', parentName: 'とことこヤング', condition: '【パターン1】\nぐるぐるマーク🌀1個の状態で進化\n【パターン2】\nぐるぐるマーク🌀0個で、ごきげんマーク☀かごはんマークが6個未満の状態で進化', description: '', iconUrl: '/images/characters/23_みみっち_LAND-512x512.png' },
    { id: 'land_16', name: 'もるもっち', stage: 'アダルト', parentName: 'とことこヤング', condition: 'ぐるぐるマーク🌀2個から5個の状態で進化', description: '', iconUrl: '/images/characters/24_もるもっち_LAND-512x512.png' },
    { id: 'land_20', name: 'しいぷっち', stage: 'アダルト', parentName: 'とことこヤング', condition: 'ぐるぐるマーク🌀6個の状態で進化', description: '', iconUrl: '/images/characters/25_しいぷっち_LAND-512x512.png' },
    { id: 'land_9', name: 'れおぱっち', stage: 'アダルト', parentName: 'ぺろぺろヤング', condition: '・ぐるぐるマーク🌀0個\n・ごきげんマーク☀6個\n・ごはんマーク6個\nすべてを満たした状態で進化', description: '', iconUrl: '/images/characters/27_れおぱっち_LAND-512x512.png' },
    { id: 'land_13', name: 'せびれっち', stage: 'アダルト', parentName: 'ぺろぺろヤング', condition: '【パターン1】\nぐるぐるマーク🌀1個の状態で進化\n【パターン2】\nぐるぐるマーク🌀0個で、ごきげんマーク☀かごはんマークが6個未満の状態で進化', description: '', iconUrl: '/images/characters/26_せびれっち_LAND-512x512.png' },
    { id: 'land_17', name: 'えりざーどっち', stage: 'アダルト', parentName: 'ぺろぺろヤング', condition: 'ぐるぐるマーク🌀2個から5個の状態で進化', description: '', iconUrl: '/images/characters/28_えりざーどっち_LAND-512x512.png' },
    { id: 'land_21', name: 'へびーっち', stage: 'アダルト', parentName: 'ぺろぺろヤング', condition: 'ぐるぐるマーク🌀6個の状態で進化', description: '', iconUrl: '/images/characters/29_へびーっち_LAND-512x512.png' },
    { id: 'land_10', name: 'ふらわっち', stage: 'アダルト', parentName: 'にょきにょきヤング', condition: '・ぐるぐるマーク🌀0個\n・ごきげんマーク☀6個\n・ごはんマーク6個\nすべてを満たした状態で進化', description: '', iconUrl: '/images/characters/30_ふらわっち_LAND-512x512.png' },
    { id: 'land_14', name: 'ぽつねんっち', stage: 'アダルト', parentName: 'にょきにょきヤング', condition: '【パターン1】\nぐるぐるマーク🌀1個の状態で進化\n【パターン2】\nぐるぐるマーク🌀0個で、ごきげんマーク☀かごはんマークが6個未満の状態で進化', description: '', iconUrl: '/images/characters/32_ぽつねんっち_LAND-512x512.png' },
    { id: 'land_18', name: 'たすたすっち', stage: 'アダルト', parentName: 'にょきにょきヤング', condition: 'ぐるぐるマーク🌀2個から5個の状態で進化', description: '', iconUrl: '/images/characters/31_たすたすっち_LAND-512x512.png' },
    { id: 'land_22', name: 'しげみさん', stage: 'アダルト', parentName: 'にょきにょきヤング', condition: 'ぐるぐるマーク🌀6個の状態で進化', description: '', iconUrl: '/images/characters/33_しげみさん_LAND-512x512.png' },
    { id: 'land_23', name: 'ちょどらこっち', stage: '特殊', parentName: 'がおがおヤング・とことこヤング・ぺろぺろヤング', condition: 'Pink Landの機種限定の進化。たまさいぼーの構成にかかわらず、ヤング期にPinkLand以外のみず、そら、もりのいずれか2機種それぞれとツーしんであそんでから進化', description: '', iconUrl: '/images/characters/66_ちょこどらっち_LAND-512x512.png' }
];

export const SEA_DATA: EvolutionCharacter[] = [
    { id: 'sea_1', name: 'べびまるっち', stage: 'ベビー', condition: '初期キャラクター', description: '', iconUrl: '/images/characters/01_べびまるっち.png' },
    { id: 'sea_2', name: 'みずキッズ', stage: 'キッズ', parentName: 'べびまるっち', condition: 'みずステージで一定時間経過し、みずマーク💧が4つ集まると進化', description: '', iconUrl: '/images/characters/03_みずキッズ-512x512.png' },

    { id: 'sea_3', name: 'すいすいヤング', stage: 'ヤング', parentName: 'みずキッズ', condition: 'たまさいぼーの画面に、貝🐚・シーフード🐟のマークが一番多い状態で進化', description: '', iconUrl: '/images/characters/09_すいすいヤング_WATER-512x512.png' },
    { id: 'sea_4', name: 'ぴょこぴょこヤング', stage: 'ヤング', parentName: 'みずキッズ', condition: 'たまさいぼーの画面に、あかいわかめ🪸・みどりのわかめ🌿のマークが一番多い状態で進化', description: '', iconUrl: '/images/characters/10_ぴょこぴょこヤング_WATER-512x512.png' },
    { id: 'sea_5', name: 'ぴちぴちヤング', stage: 'ヤング', parentName: 'みずキッズ', condition: 'たまさいぼーの画面に、ミールプランクトン・ミールシュリンプ🦐のマークが一番多い状態で進化', description: '', iconUrl: '/images/characters/11_ぴちぴちヤング_WATER-512x512.png' },
    { id: 'sea_6', name: 'ふよふよヤング', stage: 'ヤング', parentName: 'みずキッズ', condition: 'たまさいぼーの画面に、おにぎり🍙以外の食べ物マークがない状態で進化', description: '', iconUrl: '/images/characters/12_ふよふよヤング_WATER-512x512.png' },

    { id: 'sea_7', name: 'いるかっち', stage: 'アダルト', parentName: 'すいすいヤング', condition: '・ぐるぐるマーク🌀0個\n・ごきげんマーク☀6個\n・ごはんマーク6個\nすべてを満たした状態で進化', description: '', iconUrl: '/images/characters/34_いるかっち_WATER-512x512.png' },
    { id: 'sea_8', name: 'カメっち', stage: 'アダルト', parentName: 'すいすいヤング', condition: '【パターン1】\nぐるぐるマーク🌀1個の状態で進化\n【パターン2】\nぐるぐるマーク🌀0個で、ごきげんマーク☀かごはんマークが6個未満の状態で進化', description: '', iconUrl: '/images/characters/35_カメっち_WATER-512x512.png' },
    { id: 'sea_9', name: 'くじらっち', stage: 'アダルト', parentName: 'すいすいヤング', condition: 'ぐるぐるマーク🌀2個から5個の状態で進化', description: '', iconUrl: '/images/characters/37_くじらっち_WATER-512x512.png' },
    { id: 'sea_10', name: 'うるおっち', stage: 'アダルト', parentName: 'すいすいヤング', condition: 'ぐるぐるマーク🌀6個の状態で進化', description: '', iconUrl: '/images/characters/41_うるおっち_WATER-512x512.png' },

    { id: 'sea_11', name: 'あほろぱっち', stage: 'アダルト', parentName: 'ぴょこぴょこヤング', condition: '・ぐるぐるマーク🌀0個\n・ごきげんマーク☀6個\n・ごはんマーク6個\nすべてを満たした状態で進化', description: '', iconUrl: '/images/characters/38_あほろぱっち_WATER-512x512.png' },
    { id: 'sea_12', name: 'いもりっち', stage: 'アダルト', parentName: 'ぴょこぴょこヤング', condition: '【パターン1】\nぐるぐるマーク🌀1個の状態で進化\n【パターン2】\nぐるぐるマーク🌀0個で、ごきげんマーク☀かごはんマークが6個未満の状態で進化', description: '', iconUrl: '/images/characters/39_いもりっち_WATER-512x512.png' },
    { id: 'sea_13', name: 'かわずっち', stage: 'アダルト', parentName: 'ぴょこぴょこヤング', condition: 'ぐるぐるマーク🌀2個から5個の状態で進化', description: '', iconUrl: '/images/characters/40_かわずっち_WATER-512x512.png' },
    { id: 'sea_14', name: 'びーばーっち', stage: 'アダルト', parentName: 'ぴょこぴょこヤング', condition: 'ぐるぐるマーク🌀6個の状態で進化', description: '', iconUrl: '/images/characters/36_びーばーっち_WATER-1-512x512.png' },

    { id: 'sea_15', name: 'たちゅっち', stage: 'アダルト', parentName: 'ぴちぴちヤング', condition: '・ぐるぐるマーク🌀0個\n・ごきげんマーク☀6個\n・ごはんマーク6個\nすべてを満たした状態で進化', description: '', iconUrl: '/images/characters/42_たちゅっち_WATER-512x512.png' },
    { id: 'sea_16', name: 'しゃーくっち', stage: 'アダルト', parentName: 'ぴちぴちヤング', condition: '【パターン1】\nぐるぐるマーク🌀1個の状態で進化\n【パターン2】\nぐるぐるマーク🌀0個で、ごきげんマーク☀かごはんマークが6個未満の状態で進化', description: '', iconUrl: '/images/characters/43_しゃーくっち_WATER-512x512.png' },
    { id: 'sea_17', name: 'アンコっち', stage: 'アダルト', parentName: 'ぴちぴちヤング', condition: 'ぐるぐるマーク🌀2個から5個の状態で進化', description: '', iconUrl: '/images/characters/44_アンコっち_WATER-512x512.png' },
    { id: 'sea_18', name: 'オトトっち', stage: 'アダルト', parentName: 'ぴちぴちヤング', condition: 'ぐるぐるマーク🌀6個の状態で進化', description: '', iconUrl: '/images/characters/45_オトトっち_WATER-512x512.png' },

    { id: 'sea_19', name: 'くららっち', stage: 'アダルト', parentName: 'ふよふよヤング', condition: '・ぐるぐるマーク🌀0個\n・ごきげんマーク☀6個\n・ごはんマーク6個\nすべてを満たした状態で進化', description: '', iconUrl: '/images/characters/46_くららっち_WATER-512x512.png' },
    { id: 'sea_20', name: 'めんだこっち', stage: 'アダルト', parentName: 'ふよふよヤング', condition: '【パターン1】\nぐるぐるマーク🌀1個の状態で進化\n【パターン2】\nぐるぐるマーク🌀0個で、ごきげんマーク☀かごはんマークが6個未満の状態で進化', description: '', iconUrl: '/images/characters/47_めんだこっち_WATER-512x512.png' },
    { id: 'sea_21', name: 'あめふらっち', stage: 'アダルト', parentName: 'ふよふよヤング', condition: 'ぐるぐるマーク🌀2個から5個の状態で進化', description: '', iconUrl: '/images/characters/48_あめふらっち_WATER-512x512.png' },
    { id: 'sea_22', name: 'ぐそくっち', stage: 'アダルト', parentName: 'ふよふよヤング', condition: 'ぐるぐるマーク🌀6個の状態で進化', description: '', iconUrl: '/images/characters/49_ぐそくっち_WATER-512x512.png' },

    { id: 'sea_23', name: 'まあまりんっち', stage: '特殊', parentName: 'すいすいヤング・ぴょこぴょこヤング・ぴちぴちヤング', condition: 'Blue Waterの機種限定の進化。たまさいぼーの構成にかかわらず、ヤング期にBlueWater以外のりく、そら、もりのいずれか2機種それぞれとツーしんであそんでから進化', description: '', iconUrl: '/images/characters/67_まあまりんっち_WATER-512x512.png' }
];

export const SKY_DATA: EvolutionCharacter[] = [
    { id: 'sky_1', name: 'べびまるっち', stage: 'ベビー', condition: '初期キャラクター', description: '', iconUrl: '/images/characters/01_べびまるっち.png' },
    { id: 'sky_2', name: 'そらキッズ', stage: 'キッズ', parentName: 'べびまるっち', condition: 'そらステージで一定時間経過し、そらマーク☁が4つ集まると進化', description: '', iconUrl: '/images/characters/04_そらキッズ-512x512.png' },

    { id: 'sky_3', name: 'ぱたぱたヤング', stage: 'ヤング', parentName: 'そらキッズ', condition: 'たまさいぼーの画面に、そらチキン🐤・おおぞらチキン🐓のマークが一番多い状態で進化', description: '', iconUrl: '/images/characters/13_ぱたぱたヤング_SKY-512x512.png' },
    { id: 'sky_4', name: 'ぴよぴよヤング', stage: 'ヤング', parentName: 'そらキッズ', condition: 'たまさいぼーの画面に、とうもろこし🌽・さくらんぼ🍒のマークが一番多い状態で進化', description: '', iconUrl: '/images/characters/14_ぴよぴよヤング_SKY-512x512.png' },
    { id: 'sky_5', name: 'ぶんぶんヤング', stage: 'ヤング', parentName: 'そらキッズ', condition: 'たまさいぼーの画面に、ハニーシロップ🍯・フラワーシロップ🏵のマークが一番多い状態で進化', description: '', iconUrl: '/images/characters/15_ぶんぶんヤング_SKY-512x512.png' },
    { id: 'sky_6', name: 'かちかちヤング', stage: 'ヤング', parentName: 'そらキッズ', condition: 'たまさいぼーの画面に、おにぎり🍙以外の食べ物マークがない状態で進化', description: '', iconUrl: '/images/characters/16_かちかちヤング_SKY-512x512.png' },

    { id: 'sky_7', name: 'ほーほっち', stage: 'アダルト', parentName: 'ぱたぱたヤング', condition: '・ぐるぐるマーク🌀0個\n・ごきげんマーク☀6個\n・ごはんマーク6個\nすべてを満たした状態で進化', description: '', iconUrl: '/images/characters/50_ほーほっち_SKY-512x512.png' },
    { id: 'sky_8', name: 'もんがっち', stage: 'アダルト', parentName: 'ぱたぱたヤング', condition: '【パターン1】\nぐるぐるマーク🌀1個の状態で進化\n【パターン2】\nぐるぐるマーク🌀0個で、ごきげんマーク☀かごはんマークが6個未満の状態で進化', description: '', iconUrl: '/images/characters/51_もんがっち_SKY-512x512.png' },
    { id: 'sky_9', name: 'いーぐるっち', stage: 'アダルト', parentName: 'ぱたぱたヤング', condition: 'ぐるぐるマーク🌀2個から5個の状態で進化', description: '', iconUrl: '/images/characters/52_いーぐるっち_SKY-512x512.png' },
    { id: 'sky_10', name: 'ばっち', stage: 'アダルト', parentName: 'ぱたぱたヤング', condition: 'ぐるぐるマーク🌀6個の状態で進化', description: '', iconUrl: '/images/characters/53_ばっち_SKY-512x512.png' },

    { id: 'sky_11', name: 'ぴーこっち', stage: 'アダルト', parentName: 'ぴよぴよヤング', condition: '・ぐるぐるマーク🌀0個\n・ごきげんマーク☀6個\n・ごはんマーク6個\nすべてを満たした状態で進化', description: '', iconUrl: '/images/characters/60_ぴーこっち_SKY-512x512.png' },
    { id: 'sky_12', name: 'ばたっち', stage: 'アダルト', parentName: 'ぴよぴよヤング', condition: '【パターン1】\nぐるぐるマーク🌀1個の状態で進化\n【パターン2】\nぐるぐるマーク🌀0個で、ごきげんマーク☀かごはんマークが6個未満の状態で進化', description: '', iconUrl: '/images/characters/59_ばたっち_SKY-512x512.png' },
    { id: 'sky_13', name: 'くちぱっち', stage: 'アダルト', parentName: 'ぴよぴよヤング', condition: 'ぐるぐるマーク🌀2個から5個の状態で進化', description: '', iconUrl: '/images/characters/58_くちぱっち_SKY-512x512.png' },
    { id: 'sky_14', name: 'きうぃっち', stage: 'アダルト', parentName: 'ぴよぴよヤング', condition: 'ぐるぐるマーク🌀6個の状態で進化', description: '', iconUrl: '/images/characters/61_きうぃっち_SKY-512x512.png' },

    { id: 'sky_15', name: 'ぱぴよっち', stage: 'アダルト', parentName: 'ぶんぶんヤング', condition: '・ぐるぐるマーク🌀0個\n・ごきげんマーク☀6個\n・ごはんマーク6個\nすべてを満たした状態で進化', description: '', iconUrl: '/images/characters/54_ぱぴよっち_SKY-512x512.png' },
    { id: 'sky_16', name: 'カブトっち', stage: 'アダルト', parentName: 'ぶんぶんヤング', condition: '【パターン1】\nぐるぐるマーク🌀1個の状態で進化\n【パターン2】\nぐるぐるマーク🌀0個で、ごきげんマーク☀かごはんマークが6個未満の状態で進化', description: '', iconUrl: '/images/characters/55_カブトっち_SKY-512x512.png' },
    { id: 'sky_17', name: 'てんとっち', stage: 'アダルト', parentName: 'ぶんぶんヤング', condition: 'ぐるぐるマーク🌀2個から5個の状態で進化', description: '', iconUrl: '/images/characters/56_てんとっち_SKY-512x512.png' },
    { id: 'sky_18', name: 'はっちっち', stage: 'アダルト', parentName: 'ぶんぶんヤング', condition: 'ぐるぐるマーク🌀6個の状態で進化', description: '', iconUrl: '/images/characters/57_はっちっち_SKY-512x512.png' },

    { id: 'sky_19', name: 'じぇむっち', stage: 'アダルト', parentName: 'かちかちヤング', condition: '・ぐるぐるマーク🌀0個\n・ごきげんマーク☀6個\n・ごはんマーク6個\nすべてを満たした状態で進化', description: '', iconUrl: '/images/characters/62_じぇむっち_SKY-512x512.png' },
    { id: 'sky_20', name: 'おれたっち', stage: 'アダルト', parentName: 'かちかちヤング', condition: '【パターン1】\nぐるぐるマーク🌀1個の状態で進化\n【パターン2】\nぐるぐるマーク🌀0個で、ごきげんマーク☀かごはんマークが6個未満の状態で進化', description: '', iconUrl: '/images/characters/63_おれたっち_SKY-512x512.png' },
    { id: 'sky_21', name: 'いしころっち', stage: 'アダルト', parentName: 'かちかちヤング', condition: 'ぐるぐるマーク🌀2個から5個の状態で進化', description: '', iconUrl: '/images/characters/64_いしころっち_SKY-512x512.png' },
    { id: 'sky_22', name: 'まぐまっち', stage: 'アダルト', parentName: 'かちかちヤング', condition: 'ぐるぐるマーク🌀6個の状態で進化', description: '', iconUrl: '/images/characters/65_まぐまっち_SKY-512x512.png' },

    { id: 'sky_23', name: 'ややこーんっち', stage: '特殊', parentName: 'ぱたぱたヤング・ぴよぴよヤング・ぶんぶんヤング', condition: 'Purple Skyの機種限定の進化。たまさいぼーの構成にかかわらず、ヤング期にPurpleSky以外のりく、みず、もりのいずれか2機種それぞれとツーしんであそんでから進化', description: '', iconUrl: '/images/characters/68_ややこーんっち_SKY-512x512.png' }
];

export const FOREST_DATA: EvolutionCharacter[] = [
    { id: 'forest_1', name: 'べびまるっち', stage: 'ベビー', condition: '初期キャラクター', description: '', iconUrl: '/images/characters/01_べびまるっち.png' },
    { id: 'forest_2', name: 'もりキッズ', stage: 'キッズ', parentName: 'べびまるっち', condition: 'もりステージで一定時間経過し、もりマーク🎍が4つ集まると進化', description: '', iconUrl: '/images/characters/もりキッズ.png' },

    { id: 'forest_3', name: 'もりがおヤング', stage: 'ヤング', parentName: 'もりキッズ', condition: 'たまさいぼーの画面に、ペキンミート🦆・チャーシュー🥩のマークが一番多い状態で進化', description: '', iconUrl: '/images/characters/もりがおヤング.png' },
    { id: 'forest_4', name: 'もりとこヤング', stage: 'ヤング', parentName: 'もりキッズ', condition: 'たまさいぼーの画面に、えごま☘・ささ🎋のマークが一番多い状態で進化', description: '', iconUrl: '/images/characters/もりとこヤング.png' },
    { id: 'forest_5', name: 'もりぴよヤング', stage: 'ヤング', parentName: 'もりキッズ', condition: 'たまさいぼーの画面に、ざくろ・かき🍅のマークが一番多い状態で進化', description: '', iconUrl: '/images/characters/もりぴよヤング.png' },
    { id: 'forest_6', name: 'もりにょきヤング', stage: 'ヤング', parentName: 'もりキッズ', condition: 'たまさいぼーの画面に、おにぎり🍙以外の食べ物マークがない状態で進化', description: '', iconUrl: '/images/characters/もりにょきヤング.png' },

    { id: 'forest_7', name: 'もりのほーほっち', stage: 'アダルト', parentName: 'もりがおヤング', condition: '・ぐるぐるマーク🌀0個\n・ごきげんマーク☀6個\n・ごはんマーク6個\nすべてを満たした状態で進化', description: '', iconUrl: '/images/characters/もりのほーほっち.png' },
    { id: 'forest_8', name: 'こんこっち', stage: 'アダルト', parentName: 'もりがおヤング', condition: '【パターン1】\nぐるぐるマーク🌀1個の状態で進化\n【パターン2】\nぐるぐるマーク🌀0個で、ごきげんマーク☀かごはんマークが6個未満の状態で進化', description: '', iconUrl: '/images/characters/こんこっち.png' },
    { id: 'forest_9', name: 'たいがおっち', stage: 'アダルト', parentName: 'もりがおヤング', condition: 'ぐるぐるマーク🌀2個から5個の状態で進化', description: '', iconUrl: '/images/characters/たいがおっち.png' },
    { id: 'forest_10', name: 'たぬーんっち', stage: 'アダルト', parentName: 'もりがおヤング', condition: 'ぐるぐるマーク🌀6個の状態で進化', description: '', iconUrl: '/images/characters/たぬーんっち.png' },

    { id: 'forest_11', name: 'れさぱんっち', stage: 'アダルト', parentName: 'もりとこヤング', condition: '・ぐるぐるマーク🌀0個\n・ごきげんマーク☀6個\n・ごはんマーク6個\nすべてを満たした状態で進化', description: '', iconUrl: '/images/characters/れさぱんっち.png' },
    { id: 'forest_12', name: 'かのこっち', stage: 'アダルト', parentName: 'もりとこヤング', condition: '【パターン1】\nぐるぐるマーク🌀1個の状態で進化\n【パターン2】\nぐるぐるマーク🌀0個で、ごきげんマーク☀かごはんマークが6個未満の状態で進化', description: '', iconUrl: '/images/characters/かのこっち.png' },
    { id: 'forest_13', name: 'すいぎゅっち', stage: 'アダルト', parentName: 'もりとこヤング', condition: 'ぐるぐるマーク🌀2個から5個の状態で進化', description: '', iconUrl: '/images/characters/すいぎゅっち.png' },
    { id: 'forest_14', name: 'ぱんぶーっち', stage: 'アダルト', parentName: 'もりとこヤング', condition: 'ぐるぐるマーク🌀6個の状態で進化', description: '', iconUrl: '/images/characters/ぱんぶーっち.png' },

    { id: 'forest_15', name: 'かちっち', stage: 'アダルト', parentName: 'もりぴよヤング', condition: '・ぐるぐるマーク🌀0個\n・ごきげんマーク☀6個\n・ごはんマーク6個\nすべてを満たした状態で進化', description: '', iconUrl: '/images/characters/かちっち.png' },
    { id: 'forest_16', name: 'ときぱっち', stage: 'アダルト', parentName: 'もりぴよヤング', condition: '【パターン1】\nぐるぐるマーク🌀1個の状態で進化\n【パターン2】\nぐるぐるマーク🌀0個で、ごきげんマーク☀かごはんマークが6個未満の状態で進化', description: '', iconUrl: '/images/characters/ときぱっち.png' },
    { id: 'forest_17', name: 'くちぱっち', stage: 'アダルト', parentName: 'もりぴよヤング', condition: 'ぐるぐるマーク🌀2個から5個の状態で進化', description: '', iconUrl: '/images/characters/くちぱっち.png' },
    { id: 'forest_18', name: 'すぱろっち', stage: 'アダルト', parentName: 'もりぴよヤング', condition: 'ぐるぐるマーク🌀6個の状態で進化', description: '', iconUrl: '/images/characters/すぱろっち.png' },

    { id: 'forest_19', name: 'しいたけっち', stage: 'アダルト', parentName: 'もりにょきヤング', condition: '・ぐるぐるマーク🌀0個\n・ごきげんマーク☀6個\n・ごはんマーク6個\nすべてを満たした状態で進化', description: '', iconUrl: '/images/characters/しいたけっち.png' },
    { id: 'forest_20', name: 'ぴぃーっち', stage: 'アダルト', parentName: 'もりにょきヤング', condition: '【パターン1】\nぐるぐるマーク🌀1個の状態で進化\n【パターン2】\nぐるぐるマーク🌀0個で、ごきげんマーク☀かごはんマークが6個未満の状態で進化', description: '', iconUrl: '/images/characters/ぴぃーっち.png' },
    { id: 'forest_21', name: 'なっぱっち', stage: 'アダルト', parentName: 'もりにょきヤング', condition: 'ぐるぐるマーク🌀2個から5個の状態で進化', description: '', iconUrl: '/images/characters/なっぱっち.png' },
    { id: 'forest_22', name: 'らっしゅらでぃっち', stage: 'アダルト', parentName: 'もりにょきヤング', condition: 'ぐるぐるマーク🌀6個の状態で進化', description: '', iconUrl: '/images/characters/らっしゅらでぃっち.png' },

    { id: 'forest_23', name: 'たつっち', stage: '特殊', parentName: 'もりがおヤング・もりとこヤング・もりぴよヤング', condition: 'Jade Forestの機種限定の進化。たまさいぼーの構成にかかわらず、ヤング期にJade Forest以外のりく、みず、そらのいずれか2機種それぞれとツーしんであそんでから進化', description: '', iconUrl: '/images/characters/たつっち.png' }
];
