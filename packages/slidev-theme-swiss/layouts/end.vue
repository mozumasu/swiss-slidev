<script setup lang="ts">
import { handleBackground } from '@slidev/client/layoutHelper.ts'
import { computed } from 'vue'

// 締めのスライド。左下に大きなメッセージ (既定は Thank you) と赤い正方形の句点を置く。
// スロットはメッセージの下の補足 (SNS アカウントなど)
const { background, message = 'Thank you', decor = true } = defineProps<{
  background?: string
  message?: string
  /** false で右下の赤い円を消す */
  decor?: boolean
}>()

const style = computed(() => handleBackground(background))
</script>

<template>
  <div class="slidev-layout end" :style="style">
    <span v-if="decor" class="swiss-decor end__circle" aria-hidden="true" />
    <div class="swiss-content end__inner">
      <hr class="swiss-rule is-bold">
      <div class="end__main">
        <p class="swiss-display end__message">
          {{ message }}<span class="end__dot" aria-hidden="true" />
        </p>
        <hr class="swiss-rule">
        <div v-if="$slots.default" class="end__note">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.end {
  position: relative;
  overflow: hidden;
}

.end__circle {
  right: -7rem;
  bottom: -11rem;
  width: 24rem;
  aspect-ratio: 1;
  border-radius: 50%;
  background: var(--swiss-red);
}

.end__inner {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.end__main {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  max-width: 70%;
}

.slidev-layout .end__message {
  margin-bottom: 1.4rem;
  font-size: 6.5rem;
}

.end__dot {
  display: inline-block;
  width: 0.16em;
  height: 0.16em;
  margin-left: 0.06em;
  background: var(--swiss-red);
}

.end__note {
  margin-top: 0.8rem;
  font-family: var(--swiss-font-display);
  font-weight: 700;
}

.end__note :deep(p) {
  margin: 0;
}
</style>
