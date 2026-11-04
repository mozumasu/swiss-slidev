<script setup lang="ts">
import type { ColumnRatio } from '../utils/columns.ts'
import { computed } from 'vue'
import { withBase } from '../utils/withBase.ts'
import TwoCols from './two-cols.vue'

// 図版 (スクリーンショットなど) + テキストの 2 カラム。見出しは frontmatter の title。
// 図版は墨の帯の付いた枠に入れ、帯に url を出せる (ブラウザの画面の見せ方)。
// 図版は image か ::image:: スロットで渡し、本文はテキスト側に入る。
// ::text:: を使った場合は、最初の ::text:: より前の本文を 2 カラムの上に全幅で出す (リード文)。
// image-right はこのレイアウトの左右反転 (side: right)
const {
  image,
  alt = '',
  url,
  frame = true,
  ratio,
  align = 'center',
  side = 'left',
} = defineProps<{
  /** 図版の画像 (public/ のルート絶対パスか URL) */
  image?: string
  alt?: string
  /** 枠の帯に出す文字 (画面の URL など) */
  url?: string
  /** false で枠に入れず、画像をそのまま置く */
  frame?: boolean
  /** 見た目の左:右の比率 (two-cols と同じ形式)。既定は 1:1 */
  ratio?: ColumnRatio
  /** カラム内の縦位置 */
  align?: 'start' | 'center' | 'end' | 'stretch'
  /** 図版を置く側 */
  side?: 'left' | 'right'
}>()

const src = computed(() => withBase(image))
</script>

<template>
  <TwoCols
    class="image-left"
    :class="`is-image-${side}`"
    :ratio="ratio"
    :reverse="side === 'right'"
    :align="align"
  >
    <template v-if="$slots.text" #default>
      <slot />
    </template>
    <template #left>
      <div v-if="frame" class="swiss-code-window swiss-image__window">
        <div class="swiss-code-window__bar">
          <span class="swiss-code-window__mark" aria-hidden="true" />
          <span v-if="url" class="swiss-code-window__file swiss-image__url">{{ url }}</span>
        </div>
        <div class="swiss-image__body">
          <slot name="image">
            <img v-if="src" :src="src" :alt="alt">
          </slot>
        </div>
      </div>
      <div v-else class="swiss-image__body is-bare">
        <slot name="image">
          <img v-if="src" :src="src" :alt="alt">
        </slot>
      </div>
    </template>
    <template #right>
      <slot v-if="$slots.text" name="text" />
      <slot v-else />
    </template>
  </TwoCols>
</template>

<style scoped>
.swiss-image__window {
  overflow: hidden;
}

.swiss-image__url {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.swiss-image__body {
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.swiss-image__body :deep(img) {
  display: block;
  width: 100%;
  height: auto;
  max-height: 22rem;
  object-fit: contain;
}
</style>
