# 引き継ぎメモ：なんごく・こおりフィールド追加作業

## 現在の状態（2026-08-17時点）
- **すべてローカルの未コミット変更のみ**。`git commit`していない。本番（Vercel）には一切反映されていない。
- `git status` で見えるのは messages/*.json 10言語分、src配下6ファイル、public/images/charactersに新規画像多数（Untracked）。

## これまでにやったこと

### 1. 進化条件リスト（完了・動作確認済み）
- `src/data/evolutionData.ts` に `NANGOKU_DATA`, `KOORI_DATA` を追加（各22体：ベビー〜特殊進化）
- `src/components/EvolutionList.tsx` にタブ追加
- `/evolution/nangoku`, `/evolution/koori` ページ新設
- 10言語の `messages/*.json` に `home.nangoku/koori`, `evolution.nangoku/koori`, `metadata.nangokuTitle/kooriTitle` 追加
- 画像は `public/images/characters/` に日本語ファイル名で配置済み（例: `なんごくみゃおっち_TROPICS.png`）
- キッズ・ヤング期の画像も顔・口を合成した画像に対応済み

### 2. 遺伝シミュレーター（ほぼ完了）
- `src/data/simulatorData.ts` の `TAMA_DATA` に34体（アダルト+特殊）追加、`mouthPosition` フィールドを新設
- `src/components/Simulator.tsx` に口レイヤーの合成処理を追加（色置換より**前**に描画すること。順序を間違えると口だけ色が変わらないキャラが出る）
- 素材は `public/simulator/character/`, `eyes/`, `mouth/` に配置
- **新旧フィールドを跨いで組み合わせた時の目の位置ズレ**は、実機で目視調整した固定値で解消済み：
  ```
  isNewBase && !isNewEye → eyePosX += 12, eyePosY += 6
  !isNewBase && isNewEye → eyePosX -= 12, eyePosY -= 6
  ```
  （Simulator.tsx内、目を描画する直前に実装済み）

### 3. 家系図メーカー（完了）
- `src/app/[locale]/family-tree/page.tsx` の `ALL_CHARACTERS` と `ID_TO_INTERNAL` に34体分追加済み
- `generateCharacterSprite` 関数にも口レイヤー合成を追加済み

## ⚠️ 未解決・要対応

### crocotchi の口が左に切れる問題
- `crocotchi`（なんごくのクロコっち系アダルト）は口の位置データ（data.json由来の正しい値 `mouthPosition: [-6, 15]`）だと、体の輪郭の外（左）にはみ出して見切れる。
- **原因**: crocotchiの体画像はゲーム内の元データそのままだと横幅49px。口の絵はその輪郭より少し左まで伸びるデザインになっている（ワニ系のキャラなので口が横に広い）。
- **試して失敗した対処**:
  1. 口の座標をずらす → ゲーム内の正しい値と変わってしまうためNG（ユーザーからのフィードバック）
  2. 体のキャンバスを左に8px広げて、目・口の座標も同じ分シフトする → 理屈は合っていたはずだが、**ブラウザの画像キャッシュのせいで正しく反映されているか確認できず、ユーザー側で「口も目もずれた」と報告があり、原因究明前に一旦全部元に戻した**
- **現在の状態**: crocotchiは完全に「触る前の状態」に復元済み（`eyePosition: [-10, 0]`, `mouthPosition: [-6, 15]`, body画像49x50）。口は左に少し切れたままだが、他には影響ない。
- **次にやるなら**: 案2（キャンバス拡張）の方向性は理屈上正しいはず。ただし検証時は必ず `fetch(url, {cache:'no-store'})` で画像を取得して確認するか、開発サーバーを再起動してから確認すること。`<img src>` の通常ロードはブラウザにキャッシュされて古い画像が表示され続けることがあり、今回の混乱の主因だった。

## 重要な学び・注意点

1. **既存87体とnangoku/koori34体は画像の座標系が根本的に違う**
   - 既存: 体・目の画像はゲームの元アートそのまま（可変サイズ、切り詰めなし）。`eyePosition`は「体画像自身の左上(0,0)」基準の単純な貼り付け座標。
   - 新規: GitHubの `Scalynko/TamaParaGenerator` リポジトリの `data.json` から取得した座標は「64×64のフル仮想キャンバス」基準。体は透明部分をPillowの `getbbox()` で切り詰めてあるので、座標は `data.jsonの値 - 切り詰めたオフセット` で変換して保存してある。
   - この2つを混在させると（新ベース×旧目、旧ベース×新目）機械的な計算式だけでは正しい位置にならない。今回は実機で目視調整した固定値（上記2番参照）で解決。

2. **ブラウザの画像キャッシュに何度も足を引っ張られた**
   - `public/` 配下の画像を書き換えても、同じファイル名のまま `<img>` タグで参照していると古い画像がキャッシュされ続けることがある。
   - 検証時は `fetch(url, {cache:'no-store'})` を使うか、開発サーバー自体を再起動するのが確実。

3. **キャラクター素材の入手元**: GitHub `Scalynko/TamaParaGenerator` リポジトリの `images/{ID}_body.png` / `_eyes.png` / `_mouth.png` と `data.json`。IDと内部名（`tropicalmeowtchi`など）とゲーム内キャラ名の対応表は `src/app/[locale]/family-tree/page.tsx` の `ID_TO_INTERNAL` に既にまとまっている。

4. **座標データの手作業ミス**: `tarantytchi` と `rakkotchi` のベースカラー判定を手作業で書き写す際に誤記していたことがあった（`sky_blue`→正しくは`blue`など）。ピクセル色から自動判定したログと実際にコードに書いた値がズレていないか、書き写す時は要注意。

## このセッションを開始したらまず
1. `D:\tamagochi\tama-coffee-house` で `git status` を確認し、現状把握
2. `.claude/launch.json`（`C:\Users\kumasaki\.claude\launch.json`）に `tama-coffee-house` の設定済み。`preview_start` で起動可能
3. crocotchiの口の見切れ問題から着手するか、他の作業に進むかユーザーに確認
