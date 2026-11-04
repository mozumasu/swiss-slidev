<script setup lang="ts">
import { configs, useSlideContext } from '@slidev/client'
import { handleBackground } from '@slidev/client/layoutHelper.ts'
import { computed } from 'vue'

// 本文の基本フレーム。上端に柱 (左に eyebrow、右にページ番号) と墨の罫線を引き、その下に本文を置く。
// eyebrow が無いスライドは、柱の左にデッキのタイトルを薄く出して、どのページも柱の形をそろえる。
// 見出しは md の `# 見出し` で書く。heading: side で見出しを左の 4 列、本文を右の 8 列に置く
// (headmatter の themeConfig.heading: side で全スライドの既定にできる)
const { background, eyebrow, heading } = defineProps<{
  background?: string
  /** 柱の左に出す小さな英字 (章の名前など) */
  eyebrow?: string
  /** top: 見出しを本文の上に置く (既定) / side: 見出しを左の 4 列、本文を右の 8 列に置く */
  heading?: 'top' | 'side'
}>()

const { $page } = useSlideContext()
const style = computed(() => handleBackground(background))
const pageLabel = computed(() => String($page.value).padStart(2, '0'))
const runningHead = computed(() => eyebrow ?? configs.title)
const isSide = computed(() => (heading ?? configs.themeConfig?.heading) === 'side')
</script>

<template>
  <div class="slidev-layout default" :style="style">
    <header class="default__header">
      <p class="swiss-eyebrow" :class="{ 'is-deck-title': !eyebrow }">{{ runningHead }}</p>
      <p class="swiss-eyebrow default__page">{{ pageLabel }}</p>
    </header>
    <div class="swiss-content default__body" :class="{ 'is-side': isSide }">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.default {
  position: relative;
  display: flex;
  flex-direction: column;
}

.default__header {
  flex: none;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 2rem;
  min-height: 1.4rem;
  margin-bottom: 1.6rem;
  padding-bottom: 0.35rem;
  border-bottom: var(--swiss-rule) solid var(--swiss-line);
}

/* デッキのタイトルは章の名前 (eyebrow) より控えめに出す */
.slidev-layout .default__header .is-deck-title {
  overflow: hidden;
  color: var(--swiss-ink-faint);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.slidev-layout .default__page {
  flex: none;
  font-variant-numeric: tabular-nums;
}

/* 本文に置いた装飾 (class="swiss-decor") の top / bottom が本文の高さ基準になるよう広げる */
.default__body {
  flex: 1;
  min-height: 0;
}

/* --- heading: side --- 見出しを左の 4 列に固定し、ほかの要素はすべて右の 8 列に流す。
   見出しは本文の行をまたいで縦に伸ばし、本文が長くても左の列に留める */
.default__body.is-side {
  display: grid;
  grid-template-columns: repeat(var(--swiss-columns), minmax(0, 1fr));
  column-gap: var(--swiss-gutter);
  align-content: start;
}

.default__body.is-side > :deep(*) {
  grid-column: 5 / 13;
}

/* 本文の 1 つ目の要素の上端を、見出しの上端に揃える */
.default__body.is-side > :deep(:first-child),
.default__body.is-side > :deep(h1 + *) {
  margin-top: 0;
}

.default__body.is-side > :deep(h1) {
  grid-column: 1 / 5;
  grid-row: 1 / span 30;
  margin: 0;
  padding-right: var(--swiss-gutter);
  font-size: 2rem;
  /* 4 列は狭いので、1 語で列に収まらない長い英単語だけ語の途中で折り返す */
  overflow-wrap: break-word;
  hyphens: auto;
}

/* 装飾は列に載せずスライド上の好きな位置に置けるままにする */
.default__body.is-side > :deep(.swiss-decor) {
  grid-column: auto;
  grid-row: auto;
}
</style>
