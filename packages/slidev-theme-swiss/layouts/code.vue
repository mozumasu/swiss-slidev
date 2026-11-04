<script setup lang="ts">
import type { ColumnRatio } from '../utils/columns.ts'
import { useSlideContext } from '@slidev/client'
import { computed } from 'vue'
import { columnTemplate, parseColumnRatio } from '../utils/columns.ts'
import Default from './default.vue'

// コード例と説明 (default の枠: 柱の eyebrow・ページ番号 付き)
// 見出しは frontmatter の title。本文が説明 (左)、::code:: 以降がコード (右)。
// ::lead:: を書くと 2 カラムの上に全幅のリード文を出す。
// コードは墨の帯の付いた枠に入れ、本文の高さを上限に、収まらない分は枠の中でスクロールする。
// クリック連動の説明はアドオンの <SwissCodeSteps> を本文に置く。
// eyebrow / background は default レイアウトにそのまま渡る
const { ratio, reverse = false, align = 'start', gap, codeSize, file } = defineProps<{
  /** 説明:コード の比率。'1:2' / [1, 2] / 0.4 / '40%' (説明の割合)。既定は 2:3 (コードを広く) */
  ratio?: ColumnRatio
  /** 左にコード・右に説明にする (ratio は 説明:コード のまま) */
  reverse?: boolean
  /** 説明カラム内の縦位置 */
  align?: 'start' | 'center' | 'end'
  /** カラム間の余白 (CSS の長さ) */
  gap?: string
  /** このスライドのコードの文字サイズ (CSS の長さ。例: 0.7rem)。行が多いときに小さくする */
  codeSize?: string
  /** コードの枠の帯に出すファイル名 */
  file?: string
}>()

const DEFAULT_RATIO: [number, number] = [2, 3]

const { $frontmatter } = useSlideContext()
const title = computed(() => $frontmatter.title as string | undefined)

const gridStyle = computed(() => {
  const [text, code] = parseColumnRatio(ratio, DEFAULT_RATIO)
  return {
    gridTemplateColumns: columnTemplate(reverse ? [code, text] : [text, code]),
    ...(gap ? { columnGap: gap } : {}),
    ...(codeSize ? { '--slidev-code-font-size': codeSize } : {}),
  }
})
</script>

<template>
  <Default class="code">
    <div class="swiss-code">
      <h1 v-if="title">{{ title }}</h1>
      <div v-if="$slots.lead" class="swiss-code__lead">
        <slot name="lead" />
      </div>
      <div class="swiss-code__grid" :class="{ 'is-reverse': reverse }" :style="gridStyle">
        <div class="swiss-code__text" :style="{ alignSelf: align }">
          <slot />
        </div>
        <div class="swiss-code-window swiss-code__pane">
          <div class="swiss-code-window__bar">
            <span class="swiss-code-window__mark" aria-hidden="true" />
            <span v-if="file" class="swiss-code-window__file">{{ file }}</span>
          </div>
          <div class="swiss-code-window__body">
            <slot name="code" />
          </div>
        </div>
      </div>
    </div>
  </Default>
</template>

<style scoped>
.swiss-code {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.swiss-code__lead {
  margin-bottom: 1rem;
  line-height: 1.8;
}

.swiss-code__lead > :deep(*) {
  margin: 0;
}

.swiss-code__grid {
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-rows: minmax(0, 1fr);
  column-gap: calc(var(--swiss-gutter) * 2);
  padding-bottom: 0.5rem;
}

.swiss-code__text {
  min-width: 0;
  line-height: 1.8;
}

.swiss-code__text > :deep(:first-child) {
  margin-top: 0;
}

.swiss-code__pane {
  align-self: start;
  max-height: 100%;
}

.is-reverse .swiss-code__text {
  order: 2;
}
</style>
