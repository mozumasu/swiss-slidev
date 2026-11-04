<script setup lang="ts">
import { RichText } from '../utils/richTextVNode.ts'

// 太い見出し + 説明を罫線で区切って並べるリスト (自己紹介の項目、サービスの特徴など)。
// direction: column は縦に積み、row は横一列に同じ幅で並べる (項目の数だけ列ができる)。
// 項目は items prop か、slot 内の md 箇条書き (前後に空行) で渡す。
// slot では `- **Work** 説明文` のように先頭の太字が見出しになる。
// clicks を付けると 1 項目ずつ v-click で表示する (slot のときは <v-clicks> で囲む)。
// description は <em> / <strong> / <br> だけを解釈する
export interface FeatureListItem {
  /** 見出し。書いたとおりの大文字・小文字で表示する */
  title: string
  description?: string
}

const { items, clicks = false, direction = 'column' } = defineProps<{
  items?: FeatureListItem[]
  /** column: 縦に積む (既定) / row: 横一列に並べる */
  direction?: 'column' | 'row'
  /** 項目を 1 つずつ v-click で表示する */
  clicks?: boolean
}>()
</script>

<template>
  <div class="swiss-feature-list" :class="`is-${direction}`">
    <ul v-if="items">
      <li v-for="(item, i) in items" :key="i" v-click="clicks ? undefined : false">
        <strong>{{ item.title }}</strong>
        <span v-if="item.description"><RichText :text="item.description" /></span>
      </li>
    </ul>
    <slot v-else />
  </div>
</template>

<style scoped>
.swiss-feature-list ul,
.swiss-feature-list :deep(ul) {
  margin: 0;
  padding: 0;
  border-top: var(--swiss-rule, 1px) solid var(--swiss-line, #111);
  list-style: none;
}

/* 項目の間は細い罫線で区切る */
.swiss-feature-list li,
.swiss-feature-list :deep(li) {
  margin: 0;
  padding: 0.7rem 0 0.8rem;
  border-bottom: var(--swiss-rule, 1px) solid var(--swiss-line-soft, #d4d1ca);
  list-style: none;
  color: var(--swiss-ink, #111);
  font-size: 0.9rem;
  line-height: 1.7;
}

/* テーマの箇条書きの赤い正方形は、見出しが目印になるので出さない */
.swiss-feature-list li::before,
.swiss-feature-list :deep(li)::before {
  content: none;
}

/* 先頭の太字を見出しにして、説明と改行する。大文字には変えず書いたとおりに出す */
.swiss-feature-list li > strong,
.swiss-feature-list :deep(li > strong:first-child) {
  display: block;
  margin-bottom: 0.2rem;
  color: var(--swiss-ink, #111);
  font-family: var(--swiss-font-display, sans-serif);
  font-size: 1.25rem;
  font-weight: 800;
  letter-spacing: -0.01em;
  line-height: 1.25;
}

.swiss-feature-list li > span {
  display: block;
}

.swiss-feature-list :deep(em),
.swiss-feature-list :deep(li > strong:not(:first-child)) {
  color: var(--swiss-red-ink, #c80511);
  font-style: normal;
  font-weight: 700;
}

.swiss-feature-list :deep(p) {
  margin: 0;
}

/* --- row: 横一列に並べ、各項目の上端に太めの墨の罫線を引く --- */
.swiss-feature-list.is-row ul,
.swiss-feature-list.is-row :deep(ul) {
  display: grid;
  grid-auto-columns: minmax(0, 1fr);
  grid-auto-flow: column;
  column-gap: calc(var(--swiss-gutter, 1.25rem) * 2);
  border-top: 0;
}

.swiss-feature-list.is-row li,
.swiss-feature-list.is-row :deep(li) {
  padding: 0.8rem 0 0;
  border-top: 2px solid var(--swiss-line, #111);
  border-bottom: 0;
}
</style>
