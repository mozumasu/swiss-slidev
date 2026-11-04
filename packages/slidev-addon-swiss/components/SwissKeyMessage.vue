<script setup lang="ts">
// 見出しの直下に置く、スライドの主張を 1 行で示すキーメッセージ。
// スイススタイルに合わせて中央ではなく左揃えにし、左端に赤い太線を引く。
// slot 内の <em> / <strong> は赤で強調する。md の *強調* / **強調** を使うときは
// 1 行で書かず、slot の前後に空行を入れる (1 行だと md として解釈されない)。改行したい位置には <br> を置く
</script>

<template>
  <div class="swiss-key-message">
    <slot />
  </div>
</template>

<style scoped>
.swiss-key-message {
  max-width: 88%;
  margin: 0 0 1.6rem;
  padding-left: 1rem;
  border-left: var(--swiss-rule-bold, 4px) solid var(--swiss-red, #e30613);
  color: var(--swiss-ink, #111);
  font-family: var(--swiss-font-display, sans-serif);
  font-size: 1.45rem;
  font-weight: 700;
  letter-spacing: var(--swiss-tracking-tight, -0.02em);
  line-height: 1.45;
}

/* slot 内の md が <p> で包まれても余白が増えないようにする */
.swiss-key-message :deep(p) {
  margin: 0;
  line-height: inherit;
}

.swiss-key-message :deep(em),
.swiss-key-message :deep(strong) {
  color: var(--swiss-red-ink, #c80511);
  font-style: normal;
  font-weight: inherit;
}
</style>
