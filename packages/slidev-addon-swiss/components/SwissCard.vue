<script setup lang="ts">
// 上端に太い罫線を引いた四角いカード。角丸と影は付けない。
// label は左上の小さな英字 (番号など)、title は本文の上の太い見出し、本文はスロット
const { title, label, color = 'paper' } = defineProps<{
  title?: string
  /** 左上に出す小さな英字 (例: 01 / MISSION) */
  label?: string
  /** paper: 白地に墨の罫線 / ink: 墨のベタに白い文字 / red: 赤のベタに白い文字 / line: 罫線だけ (地は透明) */
  color?: 'paper' | 'ink' | 'red' | 'line'
}>()
</script>

<template>
  <div class="swiss-card" :class="`is-${color}`">
    <p v-if="label" class="swiss-card__label">{{ label }}</p>
    <p v-if="title" class="swiss-card__title">{{ title }}</p>
    <div class="swiss-card__content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.swiss-card {
  --swiss-card-bg: var(--swiss-paper-strong, #fff);
  --swiss-card-text: var(--swiss-ink, #111);
  --swiss-card-sub: var(--swiss-ink-soft, #5a5a5a);
  --swiss-card-rule: var(--swiss-ink, #111);
  --swiss-card-label: var(--swiss-red, #e30613);

  display: flex;
  flex-direction: column;
  padding: 1.1rem 1.3rem 1.3rem;
  border-top: var(--swiss-rule-bold, 4px) solid var(--swiss-card-rule);
  background: var(--swiss-card-bg);
  color: var(--swiss-card-text);
  text-align: left;
}

.swiss-card.is-ink {
  --swiss-card-bg: var(--swiss-ink, #111);
  --swiss-card-text: var(--swiss-paper-strong, #fff);
  --swiss-card-sub: rgba(255, 255, 255, 0.78);
  --swiss-card-rule: var(--swiss-red, #e30613);
}

.swiss-card.is-red {
  --swiss-card-bg: var(--swiss-red, #e30613);
  --swiss-card-text: var(--swiss-paper-strong, #fff);
  --swiss-card-sub: rgba(255, 255, 255, 0.9);
  --swiss-card-rule: var(--swiss-ink, #111);
  --swiss-card-label: var(--swiss-paper-strong, #fff);
}

.swiss-card.is-line {
  --swiss-card-bg: transparent;

  padding-inline: 0;
}

.swiss-card p {
  margin: 0;
}

.swiss-card__label {
  margin-bottom: 0.9rem !important;
  color: var(--swiss-card-label);
  font-family: var(--swiss-font-display, sans-serif);
  font-size: 0.68rem;
  font-variant-numeric: tabular-nums;
  font-weight: 700;
  letter-spacing: var(--swiss-tracking-caps, 0.14em);
  text-transform: uppercase;
}

.swiss-card__title {
  margin-bottom: 0.5rem !important;
  font-family: var(--swiss-font-display, sans-serif);
  font-size: 1.9rem;
  font-weight: 800;
  letter-spacing: var(--swiss-tracking-tight, -0.02em);
  line-height: 1.1;
}

.swiss-card__content {
  color: var(--swiss-card-sub);
  font-size: 0.85rem;
  line-height: 1.7;
}

/* 本文に何か書いたときは、地の色に合わせて文字色を引き継ぐ */
.swiss-card__content :deep(p) {
  margin: 0;
}

.swiss-card.is-ink .swiss-card__content :deep(strong),
.swiss-card.is-red .swiss-card__content :deep(strong) {
  color: inherit;
}
</style>
