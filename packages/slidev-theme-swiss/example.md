---
theme: ./
addons:
  - slidev-addon-swiss
title: Grid & Type
layout: cover
eyebrow: Slidev Night — 2026
subtitle: "@mozumasu"
# themeConfig:
#   accent: "#0050b4"  # アクセントの色を差し替える
#   grid: true         # 12 列の補助線を重ねる
#   heading: side      # 本文のスライドの見出しを左の 4 列に置く
---

グリッドと文字だけで組む、スイススタイルの Slidev テーマ

---
layout: toc
title: Agenda
# 次のスライドへは横に押し出して移る
transition: swiss-slide | swiss-slide-back
---

---
layout: profile
# variant: poster (既定) は左下に大きな名前、右の区画の真ん中に写真
name: もずます (mozumasu)
affiliation: "Software Engineer\nターミナルと dotfiles が好き"
image: /example-avatar.svg
links:
  - label: "X: @mozumasu"
    url: https://x.com/mozumasu
  - label: "GitHub: mozumasu"
    url: https://github.com/mozumasu
# 右の項目は本文の箇条書き。先頭の太字が見出しになる (sections prop でも渡せる)
---

- **Work** 開発環境と CI を整える仕事をしています
- **Like** Neovim、WezTerm、Nix。*dotfiles をいじる時間* が好き
- **Talk** ターミナルの便利な使い方をよく話します

---
layout: profile
# variant: split は左に写真と名前、右に項目を縦に積む
variant: split
name: もずます (mozumasu)
affiliation: "Software Engineer\nターミナルと dotfiles が好き"
image: /example-avatar.svg
links:
  - label: "X: @mozumasu"
    url: https://x.com/mozumasu
  - label: "GitHub: mozumasu"
    url: https://github.com/mozumasu
# 右の項目は本文の箇条書き。先頭の太字が見出しになる (sections prop でも渡せる)
# 次の章扉へは 12 列が開いて移る
transition: swiss-columns
---

- **Work** 開発環境と CI を整える仕事をしています
- **Like** Neovim、WezTerm、Nix。*dotfiles をいじる時間* が好き
- **Talk** ターミナルの便利な使い方をよく話します

---
layout: section
no: "01"
title: About
toc: About
---

---
eyebrow: Our Statement
---

# Mission & Vision

<SwissKeyMessage>

何をするかと、その先に何を見るかを *1 枚* で示す

</SwissKeyMessage>

<div class="swiss-grid mt-6">
  <SwissCard title="Mission" label="01" class="col-span-6 h-52">
    Enter your grand mission statement.
  </SwissCard>
  <SwissCard title="Vision" label="02" color="ink" class="col-span-6 h-52">
    Enter your grand vision statement.
  </SwissCard>
</div>

---
eyebrow: "Layout — heading: side"
heading: side
---

# 見出しを左に置く

`heading: side` を書くと、見出しを左の 4 列、本文を右の 8 列に置きます。左右で幅をそろえないことで、グリッドの列が見えるようになります。

- 本文が長くなっても、見出しは左の列に留まる
- 全スライドの既定にするなら、headmatter に `themeConfig.heading: side` を書く

---
eyebrow: Variants
---

# Card Colors

<div class="swiss-grid mt-6">
  <SwissCard title="Paper" label="default" class="col-span-3 h-44">color="paper"</SwissCard>
  <SwissCard title="Ink" label="02" color="ink" class="col-span-3 h-44">color="ink"</SwissCard>
  <SwissCard title="Red" label="03" color="red" class="col-span-3 h-44">color="red"</SwissCard>
  <SwissCard title="Line" label="04" color="line" class="col-span-3 h-44">color="line"</SwissCard>
</div>

---
eyebrow: Typography
---

# 箇条書きとコード

<div class="swiss-grid">
<div class="col-span-7">

- 文字は左揃え。差は大きさと太さで付ける
- **強調** は赤、`inline code` は白地に細い枠
- 角丸・影・グラデーションは使わない

```ts
// アクセントの色は headmatter の themeConfig で変えられる
export default { themeConfig: { accent: '#0050b4' } }
```

</div>
<div class="col-span-4 col-start-9">

| 要素 | 値 |
| --- | --- |
| 列 | 12 |
| 溝 | 1.25rem |
| 書体 | Inter Tight |

</div>
</div>

---
eyebrow: How it works
---

# 3 Steps

<SwissSteps class="mt-4" :current="2" :steps="[
  { title: 'Install', description: 'テーマとアドオンを入れる', items: ['pnpm add', { text: 'addons に書く', highlight: true }] },
  { title: 'Write', description: 'md でスライドを書く', items: ['layout を選ぶ', 'SwissCard を置く'] },
  { title: 'Share', description: 'ビルドして公開する', items: ['slidev build', 'URL を共有'] },
]" />

---
eyebrow: Roadmap
---

# Chevron

<SwissSteps class="mt-6" variant="chevron" :current="2" :steps="[
  { title: 'Design', items: ['グリッドを決める', { text: '書体を選ぶ', highlight: true }] },
  { title: 'Build', items: ['レイアウト', 'コンポーネント'] },
  { title: 'Polish', items: ['書き出しを確かめる'] },
  { title: 'Ship', items: ['公開する'] },
]" />

---
layout: code
title: Code & Steps
eyebrow: Layout — code
file: topPartners.ts
---

<SwissCodeSteps :steps="[
  { title: '型で受け取る', text: '案件は <em>Deal</em> 型で受け取る', lines: '1-5' },
  { title: '集計する', text: '<em>パートナーごと</em>に受注額を足す', lines: '8-12' },
  { title: '大きい順に返す', text: '<em>上位 N 社</em>だけを返す', lines: '13-15' },
]" />

::code::

```ts {1-5|8-12|13-15}
interface Deal {
  partnerId: string
  amount: number
  status: 'won' | 'lost' | 'open'
}

export function topPartners(deals: Deal[], limit = 3) {
  const totals = deals
    .filter(deal => deal.status === 'won')
    .reduce((map, { partnerId, amount }) =>
      map.set(partnerId, (map.get(partnerId) ?? 0) + amount),
    new Map<string, number>())
  return [...totals]
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
}
```

---
layout: code-compare
title: Before / After
eyebrow: Layout — code-compare
beforeCaption: 集計の途中経過を変数に持ち回る
# 次の章扉へは赤い帯が払う切り替えで移る (戻るときは右から左)
transition: swiss-wipe | swiss-wipe-back
afterCaption: 絞り込みと集計を 1 つの流れで読める
codeSize: 0.75rem
---

```ts
const totals = {}
for (const deal of deals) {
  if (deal.status !== 'won')
    continue
  if (!totals[deal.partnerId])
    totals[deal.partnerId] = 0
  totals[deal.partnerId] += deal.amount
}
```

::after::

```ts {3-5}
const totals = new Map<string, number>()
deals
  .filter(d => d.status === 'won')
  .forEach(({ partnerId: id, amount }) =>
    totals.set(id, (totals.get(id) ?? 0) + amount))
```

---
layout: section
variant: red
no: "02"
title: Layouts
toc: Layouts
---

---
layout: two-cols
title: Two Columns
eyebrow: Layout — two-cols
---

左のカラム。Slidev 組み込みの two-cols と同じく、本文が左に入る

- `ratio` で左右の比率を変えられる
- `reverse` で左右を入れ替える

::right::

<SwissCard title="Right" label="::right::" class="h-48">
  ::right:: 以降が右のカラムに入る
</SwissCard>

---
layout: image-right
title: Screenshot
eyebrow: Layout — image-right
image: /example-screen.svg
url: https://swiss-slidev.localhost
tocLevel: 2
toc: image-left / image-right
---

スクリーンショットを、帯の付いた枠に入れる

- `url` は枠の帯に出る
- `frame: false` で枠に入れずに置く
- `image-left` は左右反転

---
eyebrow: Component — SwissSpeechBubble
tocLevel: 2
toc: Speech Bubble
---

# Speech Bubble

<div class="flex flex-col gap-5 mt-2">
  <SwissSpeechBubble image="/example-avatar-2.svg" name="audience">
    角丸を使わないのはなぜ？
  </SwissSpeechBubble>
  <SwissSpeechBubble image="/example-avatar.svg" name="mozumasu" side="right" color="red">
    形を四角と円に絞ると、<code>grid</code> の列がそのまま見えるから
  </SwissSpeechBubble>
  <SwissSpeechBubble image="/example-avatar-2.svg" name="audience" color="ink">
    なるほど、色も 1 色だけ？
  </SwissSpeechBubble>
</div>

<SwissSpeechBubble v-click image="/example-avatar.svg" pinned>
  pinned を付けると下端の中央に固定できる
</SwissSpeechBubble>

---
layout: statement
title: 飾るより、揃える
label: Key Message
subtitle: Order is the decoration.
toc: Statement
---

すべての要素を 12 列のグリッドに載せ、文字の大きさと太さで情報の順番を見せます

---
layout: statement
variant: red
label: One Message
title: 一枚に、ひとつだけ。
subtitle: One slide, one message.
# 次のスライドへは右上から赤い円が広がって移る
transition: swiss-circle
---

variant: red で画面全体を赤に、variant: ink で墨にします

---
layout: qa
title: Q. 色はいくつ使えますか？
toc: Q&A
---

墨と紙のほかは、<br>*アクセントの 1 色*だけ

---
layout: qa
mark: false
typing: true
title: Q. 問いをタイプして出すには？
credit: credit は答えの下の出典。答えの次のクリックで出る
tocLevel: 2
toc: Q&A (typing / mark なし)
---

*typing: true* と書く

---
layout: qa
variant: stack
title: Q. 誰のためのテーマか？
tocLevel: 2
toc: Q&A (stack)
---

資料を作る人が、<br>*中身に集中する*ためのもの

---
layout: end
---

@mozumasu
