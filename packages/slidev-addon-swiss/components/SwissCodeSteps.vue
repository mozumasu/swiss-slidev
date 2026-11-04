<script setup lang="ts">
import { useSlideContext } from '@slidev/client'
import { computed } from 'vue'
import { activeCodeStep } from '../utils/codeSteps.ts'
import { RichText } from '../utils/richTextVNode.ts'

export interface CodeStep {
  /** 小見出し */
  title?: string
  /** 説明文。<em> / <strong> / <br> を解釈する (<em> は赤) */
  text?: string
  /** 対応する行の目印 (例: '3-4')。右肩に小さく出す */
  lines?: string
}

// コードの行ハイライト ({1|3-4|6}) と連動する番号付きの説明
// クリック数に合わせて対応する説明を赤い番号・左の赤い太線で強調し、ほかは薄くする。
// 説明の i 番目 (0 始まり) がコードの i 番目の範囲に対応する。クリックはコードブロックが登録するので、
// この部品は数えるだけ (コードが無いスライドで使うときは frontmatter に clicks: <説明の数 - 1> を置く)。
// --with-clicks なしの PDF / PNG 書き出し・一覧表示は、コードと同じく最後の説明を強調した最終状態になる
const { steps, at = 0, current } = defineProps<{
  steps: (string | CodeStep)[]
  /** コードブロックの 1 つ目の範囲が表示されるクリック数。コードの前に v-click が 1 つあれば 1 */
  at?: number
  /** 強調する説明を直接指定する (1 始まり)。指定するとクリック数は見ない。0 で全項目を通常表示 */
  current?: number
}>()

const { $clicks } = useSlideContext()

const items = computed<CodeStep[]>(() => steps.map(step => typeof step === 'string' ? { text: step } : step))
const active = computed(() => {
  if (current !== undefined)
    return current > 0 ? Math.min(current, items.value.length) - 1 : undefined
  return activeCodeStep($clicks.value, items.value.length, at)
})
</script>

<template>
  <ol class="swiss-code-steps" :class="{ 'has-active': active !== undefined }">
    <li
      v-for="(item, i) in items"
      :key="i"
      class="swiss-code-steps__item"
      :class="{ 'is-active': i === active }"
    >
      <span class="swiss-code-steps__no">{{ String(i + 1).padStart(2, '0') }}</span>
      <div class="swiss-code-steps__body">
        <p v-if="item.title || item.lines" class="swiss-code-steps__title">
          <span v-if="item.title">{{ item.title }}</span>
          <code v-if="item.lines" class="swiss-code-steps__lines">L{{ item.lines }}</code>
        </p>
        <p v-if="item.text" class="swiss-code-steps__text"><RichText :text="item.text" /></p>
      </div>
    </li>
  </ol>
</template>

<style scoped>
.swiss-code-steps {
  --swiss-code-steps-dim: 0.38;
  --swiss-code-steps-duration: 0.3s;

  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
  border-top: var(--swiss-rule, 1px) solid var(--swiss-line, #111);
  list-style: none;
}

.swiss-code-steps__item::marker {
  content: none;
}

.swiss-code-steps__item {
  position: relative;
  display: flex;
  gap: 0.8rem;
  margin: 0;
  padding: 0.6rem 0.4rem 0.6rem 0.9rem;
  border-bottom: var(--swiss-rule, 1px) solid var(--swiss-line-soft, #d4d1ca);
  line-height: 1.6;
  transition: opacity var(--swiss-code-steps-duration) var(--swiss-ease, ease);
}

/* 左端の赤い太線 (強調中だけ出す) */
.swiss-code-steps__item::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: var(--swiss-rule-bold, 4px);
  background: var(--swiss-red, #e30613);
  opacity: 0;
  transition: opacity var(--swiss-code-steps-duration) var(--swiss-ease, ease);
}

.has-active .swiss-code-steps__item:not(.is-active) {
  opacity: var(--swiss-code-steps-dim);
}

.swiss-code-steps__item.is-active::before {
  opacity: 1;
}

/* 番号は等幅数字。強調中は赤 */
.swiss-code-steps__no {
  flex: none;
  width: 1.5rem;
  color: var(--swiss-ink, #111);
  font-family: var(--swiss-font-display, sans-serif);
  font-size: 1.05rem;
  font-variant-numeric: tabular-nums;
  font-weight: 800;
  line-height: 1.4;
  transition: color var(--swiss-code-steps-duration) var(--swiss-ease, ease);
}

.is-active .swiss-code-steps__no {
  color: var(--swiss-red, #e30613);
}

.swiss-code-steps__body {
  flex: 1;
  min-width: 0;
}

.swiss-code-steps__body p {
  margin: 0;
}

.swiss-code-steps__title {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  font-family: var(--swiss-font-display, sans-serif);
  font-size: 0.95rem;
  font-weight: 700;
}

.swiss-code-steps__lines {
  margin-left: auto;
  padding: 0 !important;
  background: none !important;
  box-shadow: none !important;
  color: var(--swiss-ink-soft, #5a5a5a) !important;
  font-size: 0.6rem;
  font-weight: 400;
}

.swiss-code-steps__text {
  color: var(--swiss-ink-soft, #5a5a5a);
  font-size: 0.78rem;
}

.swiss-code-steps__text :deep(em) {
  color: var(--swiss-red-ink, #c80511);
  font-style: normal;
  font-weight: 700;
}
</style>
