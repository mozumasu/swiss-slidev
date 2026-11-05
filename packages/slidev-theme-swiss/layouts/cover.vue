<script setup lang="ts">
import { useSlideContext } from '@slidev/client'
import { handleBackground } from '@slidev/client/layoutHelper.ts'
import { computed } from 'vue'
import { withBase } from '../utils/withBase.ts'

// 表紙。上端に太い罫線と小さな英字 (eyebrow)、下に左揃えの大きなタイトル → 罫線 → リード文と発表者名。
// 右上に大きな赤い円を置き、画面の端で見切れさせる。タイトルは円に重なってよい。
// title は Slidev の予約フィールドで props に届かないため frontmatter から読む。
// 改行や強調を入れたいときは ::title:: スロットに書く (*強調* は赤になる)
const { background, eyebrow, subtitle, avatar, titleSize, decor = true } = defineProps<{
  background?: string
  /** 上端の小さな英字 (イベント名・日付など) */
  eyebrow?: string
  /** 右下の行 (発表者名など)。改行はそのまま反映する */
  subtitle?: string
  /** subtitle の左に出す丸いアイコン (public/ のルート絶対パスか URL) */
  avatar?: string
  /** タイトルの文字サイズ (CSS の長さ)。長いタイトルで小さくする */
  titleSize?: string
  /** false で赤い円を消す */
  decor?: boolean
}>()

const { $frontmatter } = useSlideContext()
const title = computed(() => $frontmatter.title as string | undefined)
const style = computed(() => handleBackground(background))
const avatarSrc = computed(() => withBase(avatar))
</script>

<template>
  <div class="slidev-layout cover" :style="style">
    <span v-if="decor" class="swiss-decor cover__circle" aria-hidden="true" />
    <div class="swiss-content cover__inner">
      <header class="cover__head">
        <hr class="swiss-rule is-bold">
        <p v-if="eyebrow" class="swiss-eyebrow cover__eyebrow">{{ eyebrow }}</p>
      </header>
      <div class="cover__main">
        <h1 v-if="title || $slots.title" class="swiss-display cover__title" :style="titleSize ? { fontSize: titleSize } : undefined">
          <slot name="title">{{ title }}</slot>
        </h1>
        <hr class="swiss-rule">
        <div class="swiss-grid cover__foot">
          <div v-if="$slots.default" class="cover__lead">
            <slot />
          </div>
          <div v-if="subtitle || avatarSrc" class="cover__author">
            <img v-if="avatarSrc" class="cover__avatar" :src="avatarSrc" alt="">
            <p v-if="subtitle" class="cover__subtitle">{{ subtitle }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cover {
  position: relative;
  overflow: hidden;
}

.cover__circle {
  top: -9rem;
  right: -6rem;
  width: 25rem;
  aspect-ratio: 1;
  border-radius: 50%;
  background: var(--swiss-red);
}

.cover__inner {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.slidev-layout .cover__eyebrow {
  margin-top: 0.6rem;
}

.cover__main {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.cover__title {
  max-width: 85%;
  margin-bottom: 1.4rem;
  white-space: pre-line;
}

.cover__title :deep(p) {
  margin: 0;
  font-size: inherit;
  line-height: inherit;
}

.cover__title :deep(em) {
  color: var(--swiss-red-ink);
  font-style: normal;
}

.cover__foot {
  margin-top: 0.8rem;
  align-items: start;
}

.cover__lead {
  grid-column: 1 / 8;
  color: var(--swiss-ink);
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.6;
}

.cover__lead :deep(p) {
  margin: 0;
}

/* 発表者。アイコンと名前を右端にそろえて横に並べる */
.cover__author {
  grid-column: 9 / 13;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.7rem;
}

.cover__avatar {
  flex: none;
  width: 2.6rem;
  height: 2.6rem;
  border-radius: 50%;
  object-fit: cover;
}

.slidev-layout .cover__subtitle {
  margin: 0;
  font-family: var(--swiss-font-display);
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.5;
  text-align: right;
  white-space: pre-line;
}
</style>
