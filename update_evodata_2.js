import fs from 'fs';

let code = fs.readFileSync('src/data/evolutionData.ts', 'utf8');

// 特殊進化の「ツーしんであそぶと進化」を「ツーしんであそんでから進化」に一括置換
code = code.replaceAll(`ツーしんであそぶと進化`, `ツーしんであそんでから進化`);

fs.writeFileSync('src/data/evolutionData.ts', code);
console.log('Update complete.');
