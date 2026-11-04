<script setup lang="ts">
import { withBase } from 'slidev-theme-swiss/utils/withBase.ts'
import { computed } from 'vue'

// 丸いアイコンの横に、四角い吹き出しでひとことを添える (発表者のつぶやき・聴衆の疑問・会話など)。
// 本文は slot で渡し、<code> は赤の等幅になる。
// size: lg は答えとして大きく置く版。pinned を付けると、スライドの下端中央に固定する。
// side: right でアイコンを右に置き、会話の相手側にする。color: red / ink でベタの吹き出しにする
const { image, name, size = 'md', side = 'left', color = 'paper', pinned = false } = defineProps<{
  /** アイコンの画像 (public/ のルート絶対パスか URL)。#icon スロットがあればそちらを優先する */
  image?: string
  /** アイコンの下に出す小さな名前 */
  name?: string
  size?: 'md' | 'lg'
  /** アイコンを置く側 */
  side?: 'left' | 'right'
  /** paper: 白地に墨の罫線 / red: 赤のベタ / ink: 墨のベタ */
  color?: 'paper' | 'red' | 'ink'
  /** スライドの下端中央に固定する */
  pinned?: boolean
}>()

const src = computed(() => withBase(image))
</script>

<template>
  <div
    class="swiss-speech"
    :class="[`is-${size}`, `is-${side}`, `is-${color}`, { 'is-pinned': pinned }]"
  >
    <span v-if="src || $slots.icon" class="swiss-speech__person">
      <span class="swiss-speech__icon">
        <slot name="icon">
          <img :src="src" alt="">
        </slot>
      </span>
      <span v-if="name" class="swiss-speech__name">{{ name }}</span>
    </span>
    <div class="swiss-speech__text">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.swiss-speech {
  --swiss-speech-icon: 3.4rem;
  --swiss-speech-tail: 0.6rem;
  --swiss-speech-bg: var(--swiss-paper-strong, #fff);
  --swiss-speech-text: var(--swiss-ink, #111);
  --swiss-speech-line: var(--swiss-ink, #111);

  display: flex;
  align-items: flex-start;
  gap: 1rem;
  max-width: 100%;
}

.swiss-speech.is-right {
  flex-direction: row-reverse;
}

.swiss-speech.is-red {
  --swiss-speech-bg: var(--swiss-red, #e30613);
  --swiss-speech-text: var(--swiss-paper-strong, #fff);
  --swiss-speech-line: var(--swiss-red, #e30613);
}

.swiss-speech.is-ink {
  --swiss-speech-bg: var(--swiss-ink, #111);
  --swiss-speech-text: var(--swiss-paper-strong, #fff);
  --swiss-speech-line: var(--swiss-ink, #111);
}

/* スライド全体を基準に下端中央へ固定する (2 カラムの列の中に書いても位置が変わらない) */
.swiss-speech.is-pinned {
  position: fixed;
  left: 50%;
  bottom: 2.4rem;
  z-index: 5;
  transform: translateX(-50%);
  width: max-content;
  max-width: 80%;
}

.swiss-speech__person {
  flex: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
}

/* アイコンは丸く切り抜く (profile の写真と同じ見せ方) */
.swiss-speech__icon {
  width: var(--swiss-speech-icon);
  height: var(--swiss-speech-icon);
  overflow: hidden;
  border-radius: 50%;
}

.swiss-speech__icon :deep(img) {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.swiss-speech__name {
  color: var(--swiss-ink-soft, #5a5a5a);
  font-family: var(--swiss-font-display, sans-serif);
  font-size: 0.58rem;
  font-weight: 700;
  letter-spacing: var(--swiss-tracking-caps, 0.14em);
  text-transform: uppercase;
  white-space: nowrap;
}

/* 吹き出し本体。しっぽは丸いアイコンの中心の高さから、アイコンへ向けて出す */
.swiss-speech__text {
  position: relative;
  min-width: 0;
  padding: 0.65rem 1.1rem;
  border: var(--swiss-rule, 1px) solid var(--swiss-speech-line);
  background: var(--swiss-speech-bg);
  color: var(--swiss-speech-text);
  font-size: 0.95rem;
  font-weight: 500;
  line-height: 1.7;
}

.swiss-speech__text::before {
  content: '';
  position: absolute;
  top: calc(var(--swiss-speech-icon) / 2 - var(--swiss-speech-tail) * 0.8 - 1px);
  left: calc(var(--swiss-speech-tail) * -1);
  width: var(--swiss-speech-tail);
  height: calc(var(--swiss-speech-tail) * 1.6);
  background: var(--swiss-speech-line);
  clip-path: polygon(100% 0, 0 50%, 100% 100%);
}

.swiss-speech.is-right .swiss-speech__text::before {
  left: auto;
  right: calc(var(--swiss-speech-tail) * -1);
  clip-path: polygon(0 0, 100% 50%, 0 100%);
}

.swiss-speech__text :deep(p) {
  margin: 0;
  line-height: inherit;
}

.swiss-speech__text :deep(code) {
  padding: 0.05em 0.3em;
  border-radius: 0;
  background: color-mix(in srgb, var(--swiss-red, #e30613) 10%, transparent);
  box-shadow: none;
  color: var(--swiss-red-ink, #c80511);
}

.swiss-speech.is-red .swiss-speech__text :deep(code),
.swiss-speech.is-ink .swiss-speech__text :deep(code) {
  background: rgba(255, 255, 255, 0.18);
  color: var(--swiss-paper-strong, #fff);
}

/* --- lg: 答えとして大きく置く --- */
.swiss-speech.is-lg {
  --swiss-speech-icon: 5rem;
  --swiss-speech-tail: 0.9rem;
}

.swiss-speech.is-lg .swiss-speech__text {
  padding: 1rem 1.6rem;
  font-family: var(--swiss-font-display, sans-serif);
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.45;
}
</style>
