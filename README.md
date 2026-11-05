# swiss-slidev

国際タイポグラフィ様式 (スイススタイル) に寄せた [Slidev](https://sli.dev) テーマとアドオンのモノレポ。生成りの紙、墨、1 色のアクセント (赤) だけで組みます。12 列のグリッドに左揃えで大きなサンセリフを置き、罫線と余白で区切ります。角丸、影、グラデーションは使いません。

レイアウトの種類と frontmatter は [y2k-slidev](https://github.com/mozumasu/y2k-slidev) にそろえています。テーマを差し替えても、デッキの md はほぼそのまま使えます。

| package | 内容 |
| ------- | ---- |
| [`slidev-theme-swiss`](./packages/slidev-theme-swiss) | 背景・配色・文字・レイアウト (cover / toc / profile / default / section / two-cols / image-left / image-right / code / code-compare / statement / qa / end) |
| [`slidev-addon-swiss`](./packages/slidev-addon-swiss) | コンポーネント (SwissCard / SwissKeyMessage / SwissSteps / SwissCodeSteps / SwissFeatureList / SwissSpeechBubble / SwissTypeWriter / SwissShape) |

## 使い方

```md
---
theme: slidev-theme-swiss
addons:
  - slidev-addon-swiss
---
```

テーマのレイアウトはアドオンのコンポーネントを使います。Slidev はテーマの package.json に書いた `slidev.addons` を読まないので、デッキの `addons:` にもアドオンを書いてください。

ローカルで確認するときは `pnpm install` のあと `pnpm --filter slidev-theme-swiss dev` を実行します。

## 色とグリッド

headmatter の `themeConfig` で、アクセントの色の差し替え、グリッドの補助線の表示、見出しの置き方の既定を決められます。

```yaml
themeConfig:
  accent: "#0050b4" # 既定は #e30613 (赤)
  grid: true # 12 列の補助線を薄く重ねる
  heading: side # 本文のスライドの見出しを左の 4 列に置く (既定は top)
```

- アクセントの色は、表紙の円、章番号、箇条書きの目印、プログレスバーなど、赤を使っているすべての場所に反映されます
- `grid: true` にすると、本文と同じ 12 列と溝の幅で補助線を引きます。組んでいる途中で、要素が列に沿っているかを確かめるときに使います
- `heading: side` は、見出しを左の 4 列に、本文を右の 8 列に置く組み方です。左右で幅をそろえないので、グリッドの列が見えます。1 枚だけ変えるときは、そのスライドの frontmatter に `heading: side` か `heading: top` を書きます
- md の中でも `class="swiss-grid"` と UnoCSS の `col-span-*` / `col-start-*` で、同じ 12 列に要素を置けます

```md
<div class="swiss-grid">
  <SwissCard title="Mission" class="col-span-6">...</SwissCard>
  <SwissCard title="Vision" color="ink" class="col-span-6">...</SwissCard>
</div>
```

## スライドの切り替えと v-click

既定の切り替えは落ち着いたフェードです。章の変わり目などで、次の切り替えを選べます。

| transition | 動き |
| ---------- | ---- |
| `swiss-wipe` | 赤い帯が左から右へ画面を覆い、そのあとを追って次のスライドが現れる。`swiss-wipe-back` は右から左 |
| `swiss-slide` | 次のスライドが右から押し出す。`swiss-slide-back` は左から |
| `swiss-circle` | 右上 (表紙の赤い円の位置) から赤い円が広がり、その内側から次のスライドが現れる |
| `swiss-columns` | 画面を 12 列に割り、どの列も左端から同時に開いて次のスライドが現れる |

```yaml
---
transition: swiss-wipe | swiss-wipe-back
---
```

- 進むときは今のスライドの `transition` が、戻るときは戻り先のスライドの `transition` が使われます (Slidev の決まり)。`|` の左が進むとき、右が戻るときの切り替えです
- 長さは CSS 変数 `--swiss-wipe-duration` / `--swiss-slide-duration` / `--swiss-circle-duration` / `--swiss-columns-duration` で変えられます
- v-click で出す要素は、フェードしながら少し上へ動いて現れます。`v-click.fade` などの修飾子を付けた要素は、Slidev 組み込みの動きになります
- PDF や PNG に書き出すときは動かしません。OS で「視差効果を減らす」(`prefers-reduced-motion`) を有効にしているときは、一瞬で切り替えます

## 目次ドロワーとプログレスバー

どのスライドにも次の 2 つが付きます。PDF や PNG に書き出すときと、プレゼンター画面には出ません。

- 目次ドロワー: ウィンドウの右端にカーソルを寄せると、目次が引き出されます。項目を押すとそのスライドへ移ります。項目は `toc` レイアウトと同じで、各スライドの `toc: ラベル` (`tocLevel: 2` で子項目) か、無ければスライドタイトルの階層です
- プログレスバー: スライドの下端に、今どこまで進んだかを出します。押すかドラッグすると、その位置のスライドへ移ります。`section` と `statement` を `variant: red` / `ink` で全面のベタにしたスライドでは、バーを白にします

## レイアウト

| layout | 用途 | 主な frontmatter |
| ------ | ---- | ---------------- |
| `cover` | 表紙 | `title` (改行や強調を入れるときは `::title::` スロットに書く) / `eyebrow` (上端の小さな英字) / `subtitle` (右下の発表者名など) / `avatar` (発表者名の左の丸いアイコン) / `titleSize` (長いタイトルを小さくする) / `decor: false` で赤い円を消す |
| `toc` | 目次 | 各スライドの `toc: ラベル` を並べる (`tocLevel: 2` で子項目)。1 つも無ければスライドタイトルの階層を使う。`columns: 2` で 2 段組み |
| `profile` | 自己紹介 | `name` (末尾の括弧書きは小さく出る) / `affiliation` / `image` / `links` / `sections` / `variant` (`poster` は左下に大きな名前、右の区画の真ん中に丸い写真を置き、項目を下に横一列で並べる。`split` は左に写真と名前、右に項目を縦に積む。既定は `poster`)。項目は本文の箇条書き (`- **Work** 説明`) でも書け、先頭の太字が見出しになる |
| `default` | 本文 | 見出しは md の `# 見出し` で書く。上端の柱の左に `eyebrow` (無ければデッキのタイトル)、右にページ番号が出る。`heading: side` で見出しを左の 4 列、本文を右の 8 列に置く |
| `section` | 章扉 | `title` / `no` (章番号) / `eyebrow` (既定は `Chapter`) / `variant` (`red` で画面全体を赤に、`ink` で墨にする) / `decor: false` で右上の正方形を消す |
| `two-cols` | 2 カラム | `title` / `ratio` / `reverse` / `align`。本文が左、`::right::` 以降が右。`::left::` を使うと、その前の本文が全幅のリード文になる |
| `image-left` / `image-right` | 画像と説明 | `title` / `image` / `url` (枠の帯に出す文字) / `frame: false` で枠に入れない / `ratio` |
| `code` | 説明とコード | `title` / `file` (コードの枠の帯に出すファイル名) / `ratio` (説明:コード、既定は `2:3`) / `reverse` / `codeSize`。本文が説明、`::code::` 以降がコード、`::lead::` は全幅のリード文になる |
| `code-compare` | コードの Before / After | `title` / `beforeCaption` / `afterCaption` / `ratio` / `arrow` / `codeSize`。本文が Before、`::after::` 以降が After |
| `statement` | キーメッセージ | `title` (大きな一文) / `label` / `subtitle` / `image` / `align` (既定は `left`) / `variant` (`red` で画面全体を赤に、`ink` で墨にする)。本文は一文の下の説明 |
| `qa` | 問いと答え | `title` が問い (頭の `Q.` は赤の目印として分けて出す)、本文が答え。答えはクリックで出る (`click: false` で最初から出す) / `variant` (`center` は答えを残りの領域に大きく置く、`stack` は問いと答えを罫線で区切って縦中央にまとめる) / `mark` (答えの頭の目印。`false` で外すと答えを中央揃えでさらに大きく出す) / `typing: true` で問いを 1 文字ずつ打って出す / `credit` |
| `end` | 締め | `message` (既定は `Thank you`) / `decor: false` で赤い円を消す。本文は補足になる |

## コンポーネント

```md
<SwissCard title="Mission" label="01" color="ink">
  Enter your grand mission statement.
</SwissCard>

<SwissShape class="swiss-decor" shape="circle" :size="320" style="right: -80px; top: -80px" />
```

- `SwissCard`: 上端に太い罫線を引いた四角いカードです。`color` は `paper` (白地、既定) / `ink` (墨) / `red` (アクセントの色) / `line` (罫線だけ) から選べます。`label` は左上の小さな英字です
- `SwissShape`: 円 (`circle`)、正方形 (`square`)、帯 (`bar`)、十字 (`cross`) の装飾です。`color` は `red` / `ink` / `line` から選べます。大きく置いて画面の端で見切れさせると、スイスのポスターらしくなります
- `SwissKeyMessage`: 見出しのすぐ下に、そのスライドで言いたいことを 1 行で書きます。左端に赤い太線を引き、`*強調*` は赤になります。md の強調を使うときは、タグの前後に空行を入れます
- `SwissTypeWriter`: テキストを 1 文字ずつ打って出します。`qa` の `typing: true` もこれを使っています。`caret` でカーソルを出し、`speed` と `delay` で速さと待ち時間を変えます。PDF や PNG に書き出すときは、最初から全文を出します
- 装飾に `class="swiss-decor"` を付けると、スライド上の好きな位置に置けます。位置は `style` の `top` / `left` などで指定します。クリックは下の要素に届きます

## 手順とコードの説明

```md
<SwissSteps :current="2" :steps="[
  { title: 'Install', description: 'テーマとアドオンを入れる', items: ['pnpm add', { text: 'addons に書く', highlight: true }] },
  { title: 'Write', items: ['layout を選ぶ'] },
]" />

<SwissCodeSteps :steps="[
  { title: '型で受け取る', text: '案件は <em>Deal</em> 型で受け取る', lines: '1-5' },
  '説明だけの項目は文字列で書ける',
]" />
```

- `SwissSteps`: 手順を横に並べます。`variant` は `card` (大きな番号と太い罫線、既定) と `chevron` (矢羽根) から選べます。`current` 番目までを赤にし、残りを薄くします。v-click で 1 つずつ進めるときは `:current="$clicks + 1"` を指定します
- `SwissFeatureList`: 太い見出しと説明を、罫線で区切って並べます。`direction="row"` で横一列に同じ幅で並べ、`profile` の下の項目もこの形です。項目は `items` か、本文の箇条書き (`- **Work** 説明`) で渡します
- `SwissSpeechBubble`: 丸いアイコンの横に、四角い吹き出しでひとことを添えます。アイコンは `image` か `#icon` スロットで渡し、`name` で下に名前を出せます。`side="right"` でアイコンを右に置き、会話の相手側にします。`color` は `paper` (既定) / `red` / `ink`、`size="lg"` で大きな吹き出しになり、`pinned` を付けるとスライドの下端中央に固定します
- `SwissCodeSteps`: `code` レイアウトの説明側に置き、コードの行ハイライト (`{1-5|8-12}`) と同じクリックで説明を 1 つずつ強調します。`text` の `<em>` は赤になります
