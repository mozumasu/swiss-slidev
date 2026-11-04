<script setup lang="ts">
import { useNav, useSlideContext } from '@slidev/client'
import { computed } from 'vue'
import { useTocItems } from '../composables/useTocItems.ts'
import { tocTitle } from '../utils/toc.ts'
import Default from './default.vue'

// 目次 (アジェンダ) のスライド。default の枠 (柱の eyebrow・ページ番号) 付き。
// 項目は各スライドの frontmatter の `toc: ラベル` (`tocLevel: 2` で子項目)。
// 1 つも無ければスライドタイトルの階層を使う。項目を押すとそのスライドへ移動する。
// 見出しは frontmatter の title か本文の最初の見出し (`## Agenda`)。本文は項目の一覧に置き換わる
const { columns = 1 } = defineProps<{
  /** 段組みの列数。項目が多くて縦に収まらないときに 2 にする */
  columns?: number | string
}>()

const { slides, go } = useNav()
const { $page } = useSlideContext()
const { items } = useTocItems()
const title = computed(() => tocTitle(slides.value[$page.value - 1]?.meta, 'Agenda'))
</script>

<template>
  <Default class="toc">
    <div class="swiss-toc">
      <h1>{{ title }}</h1>
      <ol class="swiss-toc__list" :style="{ columnCount: Number(columns) || 1 }">
        <li v-for="(item, i) in items" :key="item.no" class="swiss-toc__item">
          <a href="#" class="swiss-toc__link" @click.prevent="go(item.no)">
            <span class="swiss-toc__no">{{ String(i + 1).padStart(2, '0') }}</span>
            <span class="swiss-toc__label">{{ item.label }}</span>
          </a>
          <ol v-if="item.children.length" class="swiss-toc__children">
            <li v-for="child in item.children" :key="child.no">
              <a href="#" @click.prevent="go(child.no)">{{ child.label }}</a>
            </li>
          </ol>
        </li>
      </ol>
    </div>
  </Default>
</template>

<style scoped>
/* Slidev の ol の字下げ (.slidev-layout ol) より強くするため .slidev-layout を付ける */
.slidev-layout .swiss-toc__list {
  margin: 0;
  padding: 0;
  column-gap: calc(var(--swiss-gutter) * 2);
  list-style: none;
}

/* 項目の間は細い罫線で区切る。Slidev が li に付ける左マージンは消し、見出しと左端を揃える */
.swiss-toc__item {
  break-inside: avoid;
  margin: 0;
  padding: 0.6rem 0;
  border-top: var(--swiss-rule) solid var(--swiss-line);
}

.swiss-toc__link {
  display: flex;
  align-items: baseline;
  gap: 1rem;
  color: var(--swiss-ink);
  text-decoration: none;
}

/* 番号は赤の等幅数字 */
.swiss-toc__no {
  flex: none;
  width: 2.4rem;
  color: var(--swiss-red);
  font-family: var(--swiss-font-display);
  font-size: 1.1rem;
  font-variant-numeric: tabular-nums;
  font-weight: 800;
  line-height: 1;
}

.swiss-toc__label {
  flex: 1;
  font-family: var(--swiss-font-display);
  font-size: 1.3rem;
  font-weight: 700;
  letter-spacing: -0.01em;
}

.swiss-toc__link:hover .swiss-toc__label {
  color: var(--swiss-red-ink);
}

.slidev-layout .swiss-toc__children {
  margin: 0.3rem 0 0 3.4rem;
  padding: 0;
  list-style: none;
}

.swiss-toc__children li {
  padding: 0.1rem 0;
  font-size: 0.8rem;
}

.swiss-toc__children li::before {
  content: none;
}

.swiss-toc__children a {
  color: var(--swiss-ink-soft);
  text-decoration: none;
}
</style>
