<script setup lang="ts">
import { withBase } from 'slidev-theme-swiss/utils/withBase.ts'

export interface StepItem {
  text: string
  /** 重要な項目として赤で強調する */
  highlight?: boolean
}

export interface Step {
  title: string
  /** card: 番号の横の小さな英字 (省略時は labelPrefix) */
  label?: string
  description?: string
  /** UnoCSS のアイコンクラス (例: i-carbon-rocket) */
  icon?: string
  /** アイコン代わりの画像パス */
  image?: string
  /** 小さな四角いタグ (機能名など) */
  tags?: string[]
  /** チェックリスト */
  items?: (string | StepItem)[]
}

// 手順を横に並べる
// variant
// - card: 大きな番号 + 太い罫線の下に見出しと説明。完了・現在の手順は番号を赤、罫線を墨にする
// - chevron: 矢羽根を横に連結し、current 番目までを赤のベタ、残りを白地にする
const { steps, variant = 'card', current, labelPrefix = 'Step' } = defineProps<{
  steps: Step[]
  variant?: 'card' | 'chevron'
  /**
   * 1 から数えて何番目までを完了・現在 (赤) にするか。省略時はすべて赤。
   * v-click で 1 つずつ進めるなら :current="$clicks + 1" とする
   */
  current?: number
  labelPrefix?: string
}>()

function isActive(index: number) {
  return current === undefined || index < current
}

function toItem(item: string | StepItem): StepItem {
  return typeof item === 'string' ? { text: item } : item
}
</script>

<template>
  <div
    class="swiss-steps"
    :class="`is-${variant}`"
    :style="{ '--swiss-steps-cols': steps.length }"
  >
    <!-- 列ごとに icon-<i> の slot でアイコン部分を差し替えられる (i は 0 始まり) -->
    <div
      v-for="(step, i) in steps"
      :key="i"
      class="swiss-steps__step"
      :class="{ 'is-active': isActive(i) }"
    >
      <template v-if="variant === 'card'">
        <p class="swiss-steps__head">
          <span class="swiss-steps__no">{{ String(i + 1).padStart(2, '0') }}</span>
          <span class="swiss-steps__label">{{ step.label ?? labelPrefix }}</span>
        </p>
        <div class="swiss-steps__card">
          <div v-if="step.icon || step.image || $slots[`icon-${i}`]" class="swiss-steps__icon">
            <slot :name="`icon-${i}`" :step="step">
              <span v-if="step.icon" :class="step.icon" />
              <img v-else-if="step.image" :src="withBase(step.image)" :alt="step.title">
            </slot>
          </div>
          <h3 class="swiss-steps__title">{{ step.title }}</h3>
          <p v-if="step.description" class="swiss-steps__description">{{ step.description }}</p>
          <ul v-if="step.tags?.length" class="swiss-steps__tags">
            <li v-for="tag in step.tags" :key="tag">{{ tag }}</li>
          </ul>
          <ul v-if="step.items?.length" class="swiss-steps__items">
            <li v-for="(item, j) in step.items.map(toItem)" :key="j" :class="{ 'is-highlight': item.highlight }">
              {{ item.text }}
            </li>
          </ul>
        </div>
      </template>

      <template v-else>
        <div class="swiss-steps__chevron">{{ step.title }}</div>
        <div v-if="step.icon || step.image || $slots[`icon-${i}`]" class="swiss-steps__icon">
          <slot :name="`icon-${i}`" :step="step">
            <span v-if="step.icon" :class="step.icon" />
            <img v-else-if="step.image" :src="withBase(step.image)" :alt="step.title">
          </slot>
        </div>
        <div class="swiss-steps__body">
          <p v-if="step.description" class="swiss-steps__description">{{ step.description }}</p>
          <ul v-if="step.tags?.length" class="swiss-steps__tags">
            <li v-for="tag in step.tags" :key="tag">{{ tag }}</li>
          </ul>
          <ul v-if="step.items?.length" class="swiss-steps__items">
            <li v-for="(item, j) in step.items.map(toItem)" :key="j" :class="{ 'is-highlight': item.highlight }">
              {{ item.text }}
            </li>
          </ul>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.swiss-steps {
  --swiss-steps-arrow: 1rem;

  display: grid;
  grid-template-columns: repeat(var(--swiss-steps-cols), minmax(0, 1fr));
  color: var(--swiss-ink, #111);
}

.swiss-steps p,
.swiss-steps h3,
.swiss-steps ul {
  margin: 0;
  padding: 0;
}

.swiss-steps li {
  margin: 0;
  list-style: none;
}

/* テーマの箇条書きの赤い正方形は、この部品では項目ごとに描き直す */
.swiss-steps li::before {
  content: none;
}

.swiss-steps__step {
  display: flex;
  flex-direction: column;
}

.swiss-steps__icon {
  display: flex;
  align-items: center;
  height: 2.6rem;
  font-size: 2.2rem;
  color: var(--swiss-ink, #111);
}

.swiss-steps__icon img {
  max-height: 100%;
  object-fit: contain;
}

.swiss-steps__title {
  font-family: var(--swiss-font-display, sans-serif);
  font-size: 1.35rem;
  font-weight: 800;
  letter-spacing: var(--swiss-tracking-tight, -0.02em);
  line-height: 1.2;
}

.swiss-steps__description {
  color: var(--swiss-ink-soft, #5a5a5a);
  font-size: 0.78rem;
  line-height: 1.7;
}

.swiss-steps__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
}

.swiss-steps__tags li {
  padding: 0.05rem 0.45rem;
  box-shadow: inset 0 0 0 1px var(--swiss-ink, #111);
  font-size: 0.6rem;
  font-weight: 500;
  letter-spacing: 0.02em;
  line-height: 1.6;
}

.swiss-steps__items {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  font-size: 0.8rem;
  text-align: left;
}

.swiss-steps__items li {
  position: relative;
  padding-left: 1em;
}

/* 項目の目印は文字と同じ色の短い横線。強調する項目は赤にする */
.swiss-steps .swiss-steps__items li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.8em;
  width: 0.5em;
  height: 2px;
  background: currentColor;
}

.swiss-steps__items li.is-highlight {
  color: var(--swiss-red-ink, #c80511);
  font-weight: 700;
}

.swiss-steps .swiss-steps__items li.is-highlight::before {
  background: var(--swiss-red, #e30613);
}

/* --- card --- */
.is-card {
  column-gap: var(--swiss-gutter, 1.25rem);
}

.swiss-steps__head {
  display: flex;
  align-items: baseline;
  gap: 0.6rem;
  margin-bottom: 0.4rem !important;
}

/* 番号は大きな等幅数字。完了・現在の手順だけ赤にする */
.swiss-steps__no {
  color: var(--swiss-ink-faint, #9a9893);
  font-family: var(--swiss-font-display, sans-serif);
  font-size: 2.6rem;
  font-variant-numeric: tabular-nums;
  font-weight: 900;
  letter-spacing: -0.04em;
  line-height: 1;
}

.is-card .is-active .swiss-steps__no {
  color: var(--swiss-red, #e30613);
}

.swiss-steps__label {
  color: var(--swiss-ink-soft, #5a5a5a);
  font-family: var(--swiss-font-display, sans-serif);
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: var(--swiss-tracking-caps, 0.14em);
  text-transform: uppercase;
}

.swiss-steps__card {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  padding-top: 0.9rem;
  border-top: var(--swiss-rule-bold, 4px) solid var(--swiss-line-soft, #d4d1ca);
}

.is-card .is-active .swiss-steps__card {
  border-top-color: var(--swiss-ink, #111);
}

.is-card .swiss-steps__step:not(.is-active) .swiss-steps__card {
  color: var(--swiss-ink-faint, #9a9893);
}

.is-card .swiss-steps__step:not(.is-active) .swiss-steps__description,
.is-card .swiss-steps__step:not(.is-active) .swiss-steps__items li.is-highlight {
  color: inherit;
}

/* --- chevron --- */
.swiss-steps__chevron {
  display: flex;
  align-items: center;
  height: 3rem;
  margin-right: calc(var(--swiss-steps-arrow) * -1);
  padding: 0 calc(var(--swiss-steps-arrow) * 1.6);
  background: var(--swiss-paper-strong, #fff);
  color: var(--swiss-ink, #111);
  clip-path: polygon(
    0 0,
    calc(100% - var(--swiss-steps-arrow)) 0,
    100% 50%,
    calc(100% - var(--swiss-steps-arrow)) 100%,
    0 100%,
    var(--swiss-steps-arrow) 50%
  );
  font-family: var(--swiss-font-display, sans-serif);
  font-size: 1.05rem;
  font-weight: 800;
  letter-spacing: -0.01em;
}

.is-chevron .swiss-steps__step:last-child .swiss-steps__chevron {
  margin-right: 0;
}

/* 隣の矢羽根との間に細い隙間を残す */
.is-chevron .swiss-steps__step + .swiss-steps__step .swiss-steps__chevron {
  margin-left: 4px;
}

.is-chevron .swiss-steps__step:first-child .swiss-steps__chevron {
  padding-left: 0.9rem;
  clip-path: polygon(
    0 0,
    calc(100% - var(--swiss-steps-arrow)) 0,
    100% 50%,
    calc(100% - var(--swiss-steps-arrow)) 100%,
    0 100%
  );
}

.is-chevron .is-active .swiss-steps__chevron {
  background: var(--swiss-red, #e30613);
  color: var(--swiss-paper-strong, #fff);
}

.is-chevron .swiss-steps__icon {
  margin: 1.1rem 0 0 0.9rem;
}

.is-chevron .swiss-steps__body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  min-height: 8rem;
  margin-top: 1rem;
  padding: 0.2rem 0.9rem;
}

/* 列の区切りは墨の細い縦線 */
.is-chevron .swiss-steps__step + .swiss-steps__step .swiss-steps__body {
  border-left: var(--swiss-rule, 1px) solid var(--swiss-line, #111);
}

.is-chevron .swiss-steps__step:not(.is-active) .swiss-steps__body {
  color: var(--swiss-ink-faint, #9a9893);
}

.is-chevron .swiss-steps__step:not(.is-active) .swiss-steps__description {
  color: inherit;
}
</style>
