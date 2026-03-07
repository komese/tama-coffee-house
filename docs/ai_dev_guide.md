# たまコーヒーハウス 開発用ガイド (AI連携編)

この「たまコーヒーハウス」プロジェクトを、GeminiなどのAIアシスタントと一緒に開発していくためのガイドです。

## 1. フォルダの場所
現在のプロジェクトフォルダは以下の場所にあります。
```text
C:\Users\a5cao\.gemini\antigravity\playground\obsidian-parsec\tama-coffee-house
```

## 2. Gemini等に教えるファイルの探し方
AIにコードを編集してもらうには、以下の主要ファイルをAIに読み込ませる（またはコピペする）のが最も簡単です。

### 🎨 見た目・デザインを変えたい時
*   **`src/app/globals.css`** (サイト全体の色やフォント設定)
*   **`src/components/Simulator.tsx`** (シミュレーター画面のレイアウト)
*   **`src/components/EvolutionList.tsx`** (進化条件リストのレイアウト)

### 📝 テキストや画像・データを変えたい時
*   **`src/app/page.tsx`** (ホーム画面の文章)
*   **`src/components/Header.tsx`** / **`src/components/Footer.tsx`** (メニューや免責事項)
*   **`src/components/Simulator.tsx` の上部** (`BASE_OPTIONS`など、シミュレーターのデータ)
*   **`src/components/EvolutionList.tsx` の上部** (`EVOLUTION_DATA`、進化条件のデータ)

## 3. おすすめのAIへの指示（プロンプト）例

**画像を入れたい時：**
> 「`src/components/Simulator.tsx`のBASE_OPTIONSのicon部分を、`/public/images/`配下にある画像(`base1.png`など)を表示するように書き換えてください。」

**色やデザインを変えたい時：**
> 「`src/app/globals.css`の現在のカラーパレットはこれです。（※コードを貼る）この色をもっとピンク系で、平成レトロ感のある色に変更して、コードを出力してください。」

**新しい進化条件を追加したい時：**
> 「`src/components/EvolutionList.tsx`にある`EVOLUTION_DATA`に、新しいキャラクター『てんさいっち』を追加したいです。条件は『お世話ミス0回、かしこさMAX』です。追加したコードを書いてください。」

---

**開発をスタート・確認するコマンド**
```bash
npm run dev
```
（ブラウザで `http://localhost:3000` を開いたままにしておくと、AIに書いてもらったコードを上書き保存するだけで自動で画面が変わります！）
