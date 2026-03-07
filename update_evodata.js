import fs from 'fs';

let code = fs.readFileSync('src/data/evolutionData.ts', 'utf8');

// Sea
code = code.replace(
    `condition: 'べびまるっちの時にたまさいぼーの構成がみず４つで成長'`,
    `condition: 'みずステージで一定時間経過し、みずマーク💧が4つ集まると進化'`
);
code = code.replace(
    `condition: 'たまさいぼーの画面に、シーフードやかいのマークが一番多い状態で成長'`,
    `condition: 'たまさいぼーの画面に、貝🐚・シーフード🐟のマークが一番多い状態で進化'`
);
code = code.replace(
    `condition: 'たまさいぼーの画面に、みどりのわかめやあかいわかめのマークが一番多い状態で成長'`,
    `condition: 'たまさいぼーの画面に、あかいわかめ🪸・みどりのわかめ🌿のマークが一番多い状態で進化'`
);
code = code.replace(
    `condition: 'たまさいぼーの画面に、ミールシュリンプやミールプランクトンのマークが一番多い状態で成長'`,
    `condition: 'たまさいぼーの画面に、ミールプランクトン・ミールシュリンプ🦐のマークが一番多い状態で進化'`
);
code = code.replace(
    `BlueWater(みず)のたまごっちデバイスからのみ成長。ヤング期のあいだにBlueWater(みず)以外の2種類のたまごっちデバイスとツーしんをすると成長`,
    `Blue Waterの機種限定の進化。たまさいぼーの構成にかかわらず、ヤング期にBlueWater以外のりく、そら、もりのいずれか2機種それぞれとツーしんであそぶと進化`
);

// Sky
code = code.replace(
    `condition: 'べびまるっちの時にたまさいぼーの構成がそら４つで成長'`,
    `condition: 'そらステージで一定時間経過し、そらマーク☁が4つ集まると進化'`
);
code = code.replace(
    `condition: 'たまさいぼーの画面に、おおぞらチキンやそらチキンのマークが一番多い状態で成長'`,
    `condition: 'たまさいぼーの画面に、そらチキン🐤・おおぞらチキン🐓のマークが一番多い状態で進化'`
);
code = code.replace(
    `condition: 'たまさいぼーの画面に、さくらんぼやとうもろこしのマークが一番多い状態で成長'`,
    `condition: 'たまさいぼーの画面に、とうもろこし🌽・さくらんぼ🍒のマークが一番多い状態で進化'`
);
code = code.replace(
    `condition: 'たまさいぼーの画面に、フラワーシロップやハニーシロップのマークが一番多い状態で成長'`,
    `condition: 'たまさいぼーの画面に、ハニーシロップ🍯・フラワーシロップ🏵のマークが一番多い状態で進化'`
);
code = code.replace(
    `Purple Sky(そら)のたまごっちデバイスからのみ成長。ヤング期のあいだにPurple Sky(そら)以外の2種類のたまごっちデバイスとツーしんをすると成長`,
    `Purple Skyの機種限定の進化。たまさいぼーの構成にかかわらず、ヤング期にPurpleSky以外のりく、みず、もりのいずれか2機種それぞれとツーしんであそぶと進化`
);

// Forest
code = code.replace(
    `condition: 'べびまるっちの時にたまさいぼーの構成がもり４つで成長'`,
    `condition: 'もりステージで一定時間経過し、もりマーク🎍が4つ集まると進化'`
);
code = code.replace(
    `condition: 'たまさいぼーの画面に、チャーシューやペキンミートのマークが一番多い状態で成長'`,
    `condition: 'たまさいぼーの画面に、ペキンミート🦆・チャーシュー🥩のマークが一番多い状態で進化'`
);
code = code.replace(
    `condition: 'たまさいぼーの画面に、ささやえごまのはのマークが一番多い状態で成長'`,
    `condition: 'たまさいぼーの画面に、えごま☘・ささ🎋のマークが一番多い状態で進化'`
);
code = code.replace(
    `condition: 'たまさいぼーの画面に、かきやざくろのマークが一番多い状態で成長'`,
    `condition: 'たまさいぼーの画面に、ざくろ・かき🍅のマークが一番多い状態で進化'`
);
code = code.replace(
    `Jade Forest (もり)のたまごっちデバイスからのみ成長。ヤング期のあいだにJade Forest (もり)以外の2種類のたまごっちデバイスとツーしんをすると成長`,
    `Jade Forestの機種限定の進化。たまさいぼーの構成にかかわらず、ヤング期にJade Forest以外のりく、みず、そらのいずれか2機種それぞれとツーしんであそぶと進化`
);

// Global replacements
code = code.replaceAll(
    `condition: 'たまさいぼーの画面に、最も多いマークの構成がないと成長'`,
    `condition: 'たまさいぼーの画面に、おにぎり🍙以外の食べ物マークがない状態で進化'`
);
code = code.replaceAll(`ぐるぐるマーク🌀2個から5個の状態で成長`, `ぐるぐるマーク🌀2個から5個の状態で進化`);
code = code.replaceAll(`ぐるぐるマーク🌀6個の状態で成長`, `ぐるぐるマーク🌀6個の状態で進化`);

fs.writeFileSync('src/data/evolutionData.ts', code);
console.log('Update complete.');
