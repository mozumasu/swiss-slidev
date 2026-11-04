<script setup lang="ts">
import { useSlideContext } from '@slidev/client'
import { handleBackground } from '@slidev/client/layoutHelper.ts'
import { computed, useSlots } from 'vue'
import { toneOf } from '../utils/tone.ts'
import { withBase } from '../utils/withBase.ts'

// 言いたいことを 1 枚で大きく見せる (発表の結論・キーメッセージなど)。
// label が赤い小さな英字、title が大きな一文、subtitle がその下のサブコピー、
// 本文 (md) が 2〜3 行の説明。下のビジュアルは ::visual:: スロットか image で置く。
// variant: red / ink は画面全体をアクセントの赤か墨のベタにして、文字を白抜きにする
const { background, variant = 'default', subtitle, label, image, align = 'left', decor = true } = defineProps<{
  background?: string
  /** default: 紙の地 / red: アクセントの赤のベタ / ink: 墨のベタ */
  variant?: 'default' | 'red' | 'ink'
  /** 一文の下に添えるサブコピー */
  subtitle?: string
  /** 一文の上に出す小さな英字 (例: KEY MESSAGE) */
  label?: string
  /** 下に置く画像のパス。::visual:: スロットがあればそちらを優先する */
  image?: string
  /** テキストの揃え。スイススタイルの基本は左揃え */
  align?: 'left' | 'center'
  /** false で label の上の太線を消す */
  decor?: boolean
}>()

const { $frontmatter } = useSlideContext()
const title = computed(() => $frontmatter.title as string | undefined)
const style = computed(() => handleBackground(background))
const slots = useSlots()
const hasVisual = computed(() => Boolean(slots.visual) || Boolean(image))
const tone = computed(() => toneOf(variant))
</script>

<template>
  <div class="slidev-layout statement" :class="[`is-${tone}`, `is-align-${align}`]" :style="style">
    <div class="swiss-content swiss-statement__text">
      <span v-if="decor" class="swiss-statement__bar" aria-hidden="true" />
      <p v-if="label" class="swiss-eyebrow swiss-statement__label">{{ label }}</p>
      <h1 v-if="title" class="swiss-display swiss-statement__title">{{ title }}</h1>
      <p v-if="subtitle" class="swiss-statement__subtitle">{{ subtitle }}</p>
      <div v-if="$slots.default" class="swiss-statement__body">
        <slot />
      </div>
    </div>
    <div v-if="hasVisual" class="swiss-content swiss-statement__visual">
      <slot name="visual">
        <img :src="withBase(image)" alt="">
      </slot>
    </div>
  </div>
</template>

<style scoped>
.statement {
  --swiss-statement-text: var(--swiss-ink);
  --swiss-statement-sub: var(--swiss-ink-soft);
  --swiss-statement-accent: var(--swiss-red);
  --swiss-statement-label: var(--swiss-red-ink);
  --swiss-statement-rule: var(--swiss-line);

  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
}

.swiss-statement__text {
  max-width: 82%;
}

.is-align-center .swiss-statement__text {
  align-self: center;
  text-align: center;
}

.swiss-statement__bar {
  display: block;
  width: 4rem;
  height: 0.5rem;
  margin-bottom: 1.2rem;
  background: var(--swiss-statement-accent);
}

.is-align-center .swiss-statement__bar {
  margin-inline: auto;
}

.slidev-layout .swiss-statement__label {
  margin-bottom: 1rem;
  color: var(--swiss-statement-label);
}

.slidev-layout .swiss-statement__title {
  color: var(--swiss-statement-text);
  font-size: 3.6rem;
  line-height: 1.12;
}

.slidev-layout .swiss-statement__subtitle {
  margin: 1.1rem 0 0;
  color: var(--swiss-statement-sub);
  font-family: var(--swiss-font-display);
  font-size: 1.1rem;
  font-weight: 500;
}

.swiss-statement__body {
  margin-top: 1.4rem;
  padding-top: 1rem;
  border-top: var(--swiss-rule) solid var(--swiss-statement-rule);
  color: var(--swiss-statement-text);
  line-height: 1.8;
}

.swiss-statement__body :deep(p) {
  margin: 0;
}

.swiss-statement__visual {
  display: flex;
  margin-top: 2rem;
}

.is-align-center .swiss-statement__visual {
  justify-content: center;
}

.swiss-statement__visual :deep(img) {
  max-height: 10rem;
  object-fit: contain;
}

/* --- variant: red / ink --- 画面全体をベタにして文字を白抜きにする。
   赤のベタでは太線を墨に、墨のベタでは太線を赤にして、アクセントを残す */
.statement.is-red,
.statement.is-ink {
  --swiss-statement-text: var(--swiss-paper-strong);
  --swiss-statement-sub: rgba(255, 255, 255, 0.82);
  --swiss-statement-label: var(--swiss-paper-strong);
  --swiss-statement-rule: rgba(255, 255, 255, 0.6);
}

.statement.is-red {
  --swiss-statement-accent: var(--swiss-ink);

  background: var(--swiss-red);
}

.statement.is-ink {
  --swiss-statement-accent: var(--swiss-red);

  background: var(--swiss-ink);
}

.is-red .swiss-statement__body :deep(em),
.is-red .swiss-statement__body :deep(strong),
.is-ink .swiss-statement__body :deep(em),
.is-ink .swiss-statement__body :deep(strong) {
  color: inherit;
  text-decoration: underline;
  text-underline-offset: 0.25em;
}
</style>
