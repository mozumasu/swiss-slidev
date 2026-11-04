<script setup lang="ts">
import { configs } from '@slidev/client'
import { computed } from 'vue'

// 全スライド共通の背景。生成りの紙を 1 枚だけ敷き、動きは付けない。
// headmatter の themeConfig.grid を true にすると、レイアウトの基準にしている 12 列の補助線を薄く重ねる
// (組んでいる途中に列へ揃っているかを確かめる用)。下端のプログレスバー (<SwissProgressBar>) もここに置く
const showGrid = computed(() => configs.themeConfig?.grid === true)
</script>

<template>
  <div class="swiss-bg" aria-hidden="true">
    <div v-if="showGrid" class="swiss-bg__grid">
      <span v-for="i in 12" :key="i" />
    </div>
  </div>
  <SwissProgressBar />
</template>

<style scoped>
.swiss-bg {
  position: absolute;
  inset: 0;
  background: var(--swiss-paper);
}

/* 補助線はスライドの余白の内側に、本文と同じ 12 列・同じ溝で引く */
.swiss-bg__grid {
  position: absolute;
  inset: 0 var(--swiss-slide-padding-x);
  display: grid;
  grid-template-columns: repeat(var(--swiss-columns), minmax(0, 1fr));
  column-gap: var(--swiss-gutter);
}

.swiss-bg__grid > span {
  background: color-mix(in srgb, var(--swiss-red) 7%, transparent);
}
</style>
