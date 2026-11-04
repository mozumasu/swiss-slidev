<script setup lang="ts">
import type { ColumnRatio } from '../utils/columns.ts'
import { useSlideContext } from '@slidev/client'
import { computed, useSlots } from 'vue'
import { columnTemplate } from '../utils/columns.ts'
import Default from './default.vue'

// Before / After のコードを左右に並べる (default の枠: 柱の eyebrow・ページ番号 付き)
// 見出しは frontmatter の title。本文が Before、::after:: 以降が After。
// ::before:: を使った場合は、最初の ::before:: より前の本文を 2 カラムの上に全幅のリード文として出す。
// Before は墨の線のラベル、After は赤いベタのラベルにして、変えた後のほうに目が行くようにする。
// eyebrow / background は default レイアウトにそのまま渡る
const {
  ratio,
  beforeLabel = 'Before',
  afterLabel = 'After',
  beforeCaption,
  afterCaption,
  arrow = true,
  codeSize,
} = defineProps<{
  /** Before:After の比率。'1:1' / [2, 3] / 0.4 / '40%' (Before の割合)。既定は 1:1 */
  ratio?: ColumnRatio
  beforeLabel?: string
  afterLabel?: string
  /** Before のコードの下に出す補足 */
  beforeCaption?: string
  /** After のコードの下に出す補足 */
  afterCaption?: string
  /** 2 つのコードの間に右向きの矢印を出す */
  arrow?: boolean
  /** このスライドのコードの文字サイズ (CSS の長さ。例: 0.7rem) */
  codeSize?: string
}>()

const { $frontmatter } = useSlideContext()
const title = computed(() => $frontmatter.title as string | undefined)

const slots = useSlots()
const hasLead = computed(() => !!slots.before && !!slots.default)
const gridStyle = computed(() => ({
  gridTemplateColumns: columnTemplate(ratio, arrow ? { middle: 'auto' } : {}),
  ...(codeSize ? { '--slidev-code-font-size': codeSize } : {}),
}))
</script>

<template>
  <Default class="code-compare">
    <div class="swiss-compare">
      <h1 v-if="title">{{ title }}</h1>
      <div v-if="hasLead" class="swiss-compare__lead">
        <slot />
      </div>
      <div class="swiss-compare__grid" :class="{ 'has-arrow': arrow }" :style="gridStyle">
        <section class="swiss-compare__side is-before">
          <p class="swiss-compare__label">{{ beforeLabel }}</p>
          <div class="swiss-code-window">
            <div class="swiss-code-window__body">
              <slot v-if="$slots.before" name="before" />
              <slot v-else />
            </div>
          </div>
          <p v-if="beforeCaption" class="swiss-compare__caption">{{ beforeCaption }}</p>
        </section>
        <div v-if="arrow" class="swiss-compare__arrow" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="28" height="28">
            <path d="M3 12h16M13 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="square" />
          </svg>
        </div>
        <section class="swiss-compare__side is-after">
          <p class="swiss-compare__label">{{ afterLabel }}</p>
          <div class="swiss-code-window">
            <div class="swiss-code-window__body">
              <slot name="after" />
            </div>
          </div>
          <p v-if="afterCaption" class="swiss-compare__caption">{{ afterCaption }}</p>
        </section>
      </div>
    </div>
  </Default>
</template>

<style scoped>
.swiss-compare {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.swiss-compare__lead {
  margin-bottom: 1rem;
  line-height: 1.8;
}

.swiss-compare__lead > :deep(*) {
  margin: 0;
}

.swiss-compare__grid {
  flex: 1;
  min-height: 0;
  display: grid;
  /* 行の高さは中身に合わせ (矢印を中身の中央に置くため)、本文の高さを上限にする */
  grid-template-rows: fit-content(100%);
  align-content: start;
  column-gap: calc(var(--swiss-gutter) * 2);
  padding-bottom: 0.5rem;
}

.swiss-compare__grid.has-arrow {
  column-gap: var(--swiss-gutter);
}

.swiss-compare__side {
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.slidev-layout .swiss-compare__label {
  align-self: flex-start;
  margin: 0 0 0.5rem;
  padding: 0.1rem 0.6rem;
  font-family: var(--swiss-font-display);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: var(--swiss-tracking-caps);
  line-height: 1.6;
  text-transform: uppercase;
}

.is-before .swiss-compare__label {
  box-shadow: inset 0 0 0 1px var(--swiss-ink);
  color: var(--swiss-ink);
}

.is-after .swiss-compare__label {
  background: var(--swiss-red);
  color: var(--swiss-paper-strong);
}

/* Before は罫線を薄くして引かせ、After を主役にする */
.is-before .swiss-code-window {
  border-color: var(--swiss-line-soft);
}

.slidev-layout .swiss-compare__caption {
  margin: 0.5rem 0 0;
  color: var(--swiss-ink-soft);
  font-size: 0.75rem;
  line-height: 1.6;
}

.is-after .swiss-compare__caption {
  color: var(--swiss-ink);
}

.swiss-compare__arrow {
  align-self: center;
  color: var(--swiss-red);
}
</style>
