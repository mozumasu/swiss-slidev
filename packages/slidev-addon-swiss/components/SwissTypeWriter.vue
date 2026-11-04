<script setup lang="ts">
import { useNav } from '@slidev/client'
import { computed } from 'vue'
import { toCharacters, typingSchedule } from '../utils/typewriter.ts'

// テキストを 1 文字ずつ打って出す。v-click を付けると、クリックで打ち始める。
// 全文を最初から並べて透明にしておくので、打っている途中で折り返しの位置が動かない。
// PDF / PNG の書き出しでは最初から全文を出す
const { text, speed = 55, delay = 200, caret = false, animate = true } = defineProps<{
  text: string
  /** 1 文字あたりの間隔 (ms) */
  speed?: number
  /** 打ち始めるまでの待ち時間 (ms) */
  delay?: number
  /** カーソルを出す。true は打ち終えても点滅を続け、'typing' は打ち終えたら消す */
  caret?: boolean | 'typing'
  /** false で最初から全文を出す */
  animate?: boolean
}>()

const { isPrintMode } = useNav()
const animated = computed(() => animate && !isPrintMode.value)

const characters = computed(() => {
  const list = toCharacters(text)
  const times = typingSchedule(list.length, speed, delay)
  return list.map((char, i) => ({
    char,
    style: {
      '--swiss-type-at': `${times[i]}ms`,
      '--swiss-type-gap': `${Math.max(speed, 1)}ms`,
    },
  }))
})
</script>

<template>
  <span
    class="swiss-type"
    :class="{ 'is-animated': animated, 'has-caret': caret, 'is-caret-once': caret === 'typing' }"
    :aria-label="text"
  >
    <span
      v-for="(c, i) in characters"
      :key="i"
      class="swiss-type__char"
      :class="{ 'is-last': i === characters.length - 1 }"
      :style="c.style"
      aria-hidden="true"
    >{{ c.char }}</span>
  </span>
</template>

<style scoped>
.swiss-type__char {
  position: relative;
}

.is-animated .swiss-type__char {
  animation: swiss-type-show 1ms linear var(--swiss-type-at) both;
}

/* クリック待ちの間は動かさない。隠れている状態が外れると、最初から打ち始める */
:global(.slidev-vclick-hidden) .swiss-type.is-animated .swiss-type__char,
.swiss-type.is-animated:global(.slidev-vclick-hidden) .swiss-type__char {
  animation: none;
}

@keyframes swiss-type-show {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* カーソルは赤の縦棒。各文字の右に、次の文字が出るまでの間だけ出す */
.has-caret.is-animated .swiss-type__char::after {
  content: '';
  position: absolute;
  top: 0.1em;
  right: -0.1em;
  bottom: 0.05em;
  width: 0.08em;
  background: var(--swiss-red, #e30613);
  opacity: 0;
  animation: swiss-type-caret var(--swiss-type-gap) step-end var(--swiss-type-at);
}

/* 打ち終えたら最後の文字の右で点滅を続ける */
.has-caret.is-animated .swiss-type__char.is-last::after {
  animation: swiss-type-blink 1s step-end var(--swiss-type-at) infinite;
}

/* caret="typing": 打ち終えたら少し残して消す */
.has-caret.is-caret-once.is-animated .swiss-type__char.is-last::after {
  animation: swiss-type-caret 0.4s step-end var(--swiss-type-at);
}

:global(.slidev-vclick-hidden) .has-caret.is-animated .swiss-type__char::after,
.has-caret.is-animated:global(.slidev-vclick-hidden) .swiss-type__char::after {
  animation: none;
}

@keyframes swiss-type-caret {
  from,
  to {
    opacity: 1;
  }
}

@keyframes swiss-type-blink {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .is-animated .swiss-type__char,
  .has-caret.is-animated .swiss-type__char::after {
    animation: none;
  }
}
</style>
