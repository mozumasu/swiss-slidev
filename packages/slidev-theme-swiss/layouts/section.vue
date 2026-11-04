<script setup lang="ts">
import { useSlideContext } from '@slidev/client'
import { handleBackground } from '@slidev/client/layoutHelper.ts'
import { computed } from 'vue'
import { toneOf } from '../utils/tone.ts'

// 章扉。上端に太い罫線と小さな英字、左下に赤い大きな章番号、その右に見出しを下揃えで置く。
// 見出しは frontmatter の title、無ければスロット (md の `# 見出し`) をそのまま出す。
// variant: red / ink は画面全体を赤か墨のベタにして、文字を白抜きにする
const { background, variant = 'default', no, eyebrow = 'Chapter', decor = true } = defineProps<{
  background?: string
  /** default: 紙の地 / red: アクセントの赤のベタ / ink: 墨のベタ */
  variant?: 'default' | 'red' | 'ink'
  /** 章番号 (例: 01) */
  no?: string | number
  /** 上端の小さな英字 */
  eyebrow?: string
  /** false で右上の赤い正方形を消す */
  decor?: boolean
}>()

const { $frontmatter } = useSlideContext()
const title = computed(() => $frontmatter.title as string | undefined)
const style = computed(() => handleBackground(background))
const tone = computed(() => toneOf(variant))
</script>

<template>
  <div class="slidev-layout section" :class="`is-${tone}`" :style="style">
    <div class="swiss-content section__inner">
      <header class="section__head">
        <hr class="swiss-rule is-bold">
        <div class="section__head-row">
          <p class="swiss-eyebrow">{{ eyebrow }}</p>
          <span v-if="decor" class="section__mark" aria-hidden="true" />
        </div>
      </header>
      <div class="swiss-grid section__body">
        <p v-if="no !== undefined" class="swiss-display section__no">{{ no }}</p>
        <div class="section__text">
          <h1 v-if="title" class="section__title">{{ title }}</h1>
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.section {
  --swiss-section-text: var(--swiss-ink);
  --swiss-section-no: var(--swiss-red);
  --swiss-section-mark: var(--swiss-red);
  --swiss-section-rule: var(--swiss-line);

  color: var(--swiss-section-text);
  position: relative;
  overflow: hidden;
}

.section__inner {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.section__head-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-top: 0.6rem;
}

.section__mark {
  width: 2.2rem;
  height: 2.2rem;
  background: var(--swiss-section-mark);
}

/* 章番号と見出しを最後の行のベースラインで揃える */
.section__body {
  flex: 1;
  align-content: end;
  align-items: last baseline;
}

.slidev-layout .section__no {
  grid-column: 1 / 6;
  color: var(--swiss-section-no);
  font-size: 13rem;
  font-variant-numeric: tabular-nums;
  line-height: 0.8;
}

.section__text {
  grid-column: 6 / 13;
}

.section__title,
.section__text :deep(h1) {
  margin: 0;
  color: var(--swiss-section-text);
  font-size: 3.2rem;
  line-height: 1.05;
}

/* 上端の太い罫線もベタの上では白抜きにする */
.section .swiss-rule {
  background: var(--swiss-section-rule);
}

.section .swiss-eyebrow {
  color: var(--swiss-section-text);
}

/* --- variant: red / ink --- 赤のベタでは章番号と正方形を墨に、墨のベタでは赤にしてアクセントを残す */
.section.is-red,
.section.is-ink {
  --swiss-section-text: var(--swiss-paper-strong);
  --swiss-section-rule: var(--swiss-paper-strong);
}

.section.is-red {
  --swiss-section-no: var(--swiss-ink);
  --swiss-section-mark: var(--swiss-ink);

  background: var(--swiss-red);
}

.section.is-ink {
  background: var(--swiss-ink);
}
</style>
