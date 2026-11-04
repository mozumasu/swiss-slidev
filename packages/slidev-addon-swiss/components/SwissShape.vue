<script setup lang="ts">
// 幾何学的な図形の装飾 (円・正方形・帯・十字)。スイスのポスターのように、大きく置いて画面の端で見切れさせる。
// class="swiss-decor" を付けるとスライド上の好きな位置に置ける (位置は style の top / left など)
const { shape = 'circle', size = 160, color = 'red' } = defineProps<{
  shape?: 'circle' | 'square' | 'bar' | 'cross'
  /** 幅 (px)。bar は高さがこの 1/8 になる */
  size?: number
  color?: 'red' | 'ink' | 'line'
}>()
</script>

<template>
  <span
    class="swiss-shape"
    :class="[`is-${shape}`, `is-${color}`]"
    :style="{ '--swiss-shape-size': `${size}px` }"
    aria-hidden="true"
  />
</template>

<style scoped>
.swiss-shape {
  --swiss-shape-color: var(--swiss-red, #e30613);

  display: block;
  width: var(--swiss-shape-size);
  aspect-ratio: 1;
  background: var(--swiss-shape-color);
}

.swiss-shape.is-ink {
  --swiss-shape-color: var(--swiss-ink, #111);
}

/* 線だけの図形。地は透明にして墨の細い線で描く */
.swiss-shape.is-line {
  background: transparent;
  box-shadow: inset 0 0 0 1.5px var(--swiss-ink, #111);
}

.swiss-shape.is-circle {
  border-radius: 50%;
}

.swiss-shape.is-bar {
  aspect-ratio: 8;
}

/* 十字は 2 本の帯を重ねた形で切り抜く */
.swiss-shape.is-cross {
  clip-path: polygon(
    37.5% 0, 62.5% 0, 62.5% 37.5%, 100% 37.5%, 100% 62.5%, 62.5% 62.5%,
    62.5% 100%, 37.5% 100%, 37.5% 62.5%, 0 62.5%, 0 37.5%, 37.5% 37.5%
  );
}

.swiss-shape.is-cross.is-line {
  background: var(--swiss-ink, #111);
  box-shadow: none;
}
</style>
