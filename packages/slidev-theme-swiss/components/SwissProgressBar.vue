<script setup lang="ts">
import { useNav } from '@slidev/client'
import { computed, ref } from 'vue'
import { pageAt, progressRatio } from '../utils/toc.ts'
import { solidToneOf } from '../utils/tone.ts'

// スライド下端のプログレスバー。クリック・ドラッグでそのページへ移動する。
// global-bottom.vue から置き、PDF / PNG 書き出しには写さない
const { currentPage, total, go, isPrintMode, currentLayout, currentFrontmatter } = useNav()

// 全面が赤か墨のスライドでは、赤いバーが地に溶けないよう白にする
const onSolid = computed(() => solidToneOf(currentLayout.value, currentFrontmatter.value) !== 'default')

const progress = computed(() => progressRatio(currentPage.value, total.value))

const track = ref<HTMLElement>()
const dragging = ref(false)

function pageFromEvent(e: PointerEvent) {
  const rect = track.value!.getBoundingClientRect()
  return pageAt((e.clientX - rect.left) / rect.width, total.value)
}

function onPointerDown(e: PointerEvent) {
  dragging.value = true
  ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  go(pageFromEvent(e))
}

function onPointerMove(e: PointerEvent) {
  if (!dragging.value)
    return
  const page = pageFromEvent(e)
  if (page !== currentPage.value)
    go(page)
}

function onPointerUp() {
  dragging.value = false
}
</script>

<template>
  <div
    v-if="!isPrintMode"
    ref="track"
    class="swiss-progress"
    :class="{ 'is-dragging': dragging, 'is-on-solid': onSolid }"
    role="slider"
    :aria-valuemin="1"
    :aria-valuemax="total"
    :aria-valuenow="currentPage"
    aria-label="スライド位置"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
    @pointercancel="onPointerUp"
  >
    <div class="swiss-progress__bar" :style="{ transform: `scaleX(${progress})` }" />
  </div>
</template>

<style scoped>
/* スライドより前面に出す (global-bottom はスライドの下のレイヤーなので z-index を付ける) */
.swiss-progress {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 3px;
  z-index: 10;
  background: var(--swiss-line-soft);
  cursor: pointer;
  touch-action: none;
  transition: height 0.15s ease;
}

/* バー自体は細くて狙いにくいので、上に透明の当たり判定を広げる */
.swiss-progress::before {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 14px;
}

.swiss-progress:hover,
.swiss-progress.is-dragging {
  height: 6px;
}

/* 進んだ分はアクセントの赤のベタ */
.swiss-progress__bar {
  height: 100%;
  background: var(--swiss-red);
  transform-origin: left;
  transition: transform 0.45s var(--swiss-ease);
}

.swiss-progress.is-on-solid {
  background: rgba(255, 255, 255, 0.3);
}

.swiss-progress.is-on-solid .swiss-progress__bar {
  background: var(--swiss-paper-strong);
}

.swiss-progress.is-dragging .swiss-progress__bar {
  transition: none;
}
</style>
