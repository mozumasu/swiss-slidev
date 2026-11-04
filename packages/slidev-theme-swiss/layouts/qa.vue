<script setup lang="ts">
import { useSlideContext } from '@slidev/client'
import { handleBackground } from '@slidev/client/layoutHelper.ts'
import { computed } from 'vue'

// 問いと答えを 1 枚で見せる (聴衆への問いかけ、よくある質問など)。
// title が問い (上の見出し)、本文 (md) が答え。答えはクリックで出す (click: false で最初から出す)。本文中の *強調* は赤になる。
// title の頭の「Q.」は赤の目印として分けて出す。
// variant: center は問いを上に残し、答えを残りの領域に大きく置く。
// variant: stack は問いと答えをひとかたまりにして縦中央に置き、間を墨の罫線で区切る。
// typing: true で問いを 1 文字ずつ打って出す。credit は答えの下に小さく添える出典で、答えの次のクリックで出る
const { background, variant = 'center', mark = 'A.', click = true, typing = false, credit } = defineProps<{
  background?: string
  variant?: 'center' | 'stack'
  /** 答えの頭に付ける赤い目印。mark: false で外すと、答えだけを中央揃えでさらに大きく出す */
  mark?: string | false
  /** 答えをクリックで出すか。false で最初から表示する */
  click?: boolean
  /** 問い (title) を、スライド表示時に 1 文字ずつカーソル付きで打って出す */
  typing?: boolean
  /** 答えの下に小さく添える出典・クレジット。答えの次のクリックで出る */
  credit?: string
}>()

const { $frontmatter } = useSlideContext()
const style = computed(() => handleBackground(background))

// title の頭に「Q.」が書いてあっても、目印と二重にならないよう外す
const QUESTION_MARK = /^Q[.．]\s*/
const question = computed(() => {
  const title = ($frontmatter.title as string | undefined) ?? ''
  return title.replace(QUESTION_MARK, '')
})
</script>

<template>
  <div class="slidev-layout qa" :class="[`is-${variant}`, mark ? 'has-mark' : 'no-mark']" :style="style">
    <hr class="swiss-rule is-bold">
    <div class="swiss-content swiss-qa__inner">
      <div class="swiss-grid swiss-qa__question">
        <span class="swiss-qa__q" aria-hidden="true">Q.</span>
        <h1 v-if="question" class="swiss-qa__title">
          <SwissTypeWriter v-if="typing" :text="question" caret="typing" :speed="55" :delay="300" />
          <template v-else>{{ question }}</template>
        </h1>
      </div>
      <div class="swiss-grid swiss-qa__body">
        <!-- v-click は false を渡すとクリック対象にならない -->
        <div v-click="click" class="swiss-qa__answer">
          <span v-if="mark" class="swiss-qa__mark">{{ mark }}</span>
          <div class="swiss-qa__text">
            <slot />
          </div>
        </div>
      </div>
    </div>
    <p v-if="credit" v-click class="swiss-qa__credit">{{ credit }}</p>
  </div>
</template>

<style scoped>
.qa {
  --swiss-qa-answer-size: 3rem;
  --swiss-qa-answer-line-height: 1.35;

  position: relative;
  display: flex;
  flex-direction: column;
}

/* 目印が無いぶん、答えだけをさらに大きく出す */
.qa.no-mark {
  --swiss-qa-answer-size: 4rem;
}

.qa.is-stack {
  --swiss-qa-answer-size: 2.6rem;
}

.swiss-qa__inner {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.is-stack .swiss-qa__inner {
  justify-content: center;
  padding-bottom: 2rem;
}

/* --- 問い: 左の 2 列に赤い Q.、右の 10 列に問い --- */
.swiss-qa__question {
  margin-top: 1rem;
  align-items: baseline;
}

.swiss-qa__q {
  grid-column: 1 / 3;
  color: var(--swiss-red);
  font-family: var(--swiss-font-display);
  font-size: 4rem;
  font-weight: 900;
  letter-spacing: -0.04em;
  line-height: 1;
}

.slidev-layout .swiss-qa__title {
  grid-column: 3 / 13;
  margin: 0;
  font-size: 2.4rem;
  line-height: 1.2;
}

/* --- 答え: 問いと同じ 3 列目から始める --- */
.is-center .swiss-qa__body {
  flex: 1;
  min-height: 0;
  align-content: center;
  /* 問いの高さぶんの補正。答えをスライド全体のほぼ中央に寄せる */
  padding-bottom: 3rem;
}

.is-stack .swiss-qa__body {
  margin-top: 2.2rem;
}

/* 目印をぶら下げて、答えの 2 行目以降を本文の頭に揃える */
.swiss-qa__answer {
  grid-column: 3 / 13;
  display: flex;
  align-items: baseline;
  gap: 0.35em;
  font-family: var(--swiss-font-display);
  font-size: var(--swiss-qa-answer-size);
  font-weight: 800;
  letter-spacing: var(--swiss-tracking-tight);
  line-height: var(--swiss-qa-answer-line-height);
}

/* 区切りの罫線は答えと一緒に出す (クリック前に線だけ残さない) */
.is-stack .swiss-qa__answer {
  padding-top: 2.2rem;
  border-top: var(--swiss-rule) solid var(--swiss-line);
}

.is-center.no-mark .swiss-qa__answer {
  grid-column: 1 / 13;
  justify-content: center;
  text-align: center;
}

.swiss-qa__mark {
  flex: none;
  color: var(--swiss-red);
}

.swiss-qa__text :deep(p) {
  margin: 0;
  font-size: inherit;
  line-height: inherit;
}

/* 答えの中の強調だけ赤にする */
.swiss-qa__text :deep(em),
.swiss-qa__text :deep(strong) {
  color: var(--swiss-red-ink);
  font-style: normal;
  font-weight: inherit;
}

/* 答えの位置を動かさないよう、出典は下端に絶対配置で置く */
.slidev-layout .swiss-qa__credit {
  position: absolute;
  left: var(--swiss-slide-padding-x);
  right: var(--swiss-slide-padding-x);
  bottom: var(--swiss-slide-padding-y);
  margin: 0;
  padding-top: 0.5rem;
  border-top: var(--swiss-rule) solid var(--swiss-line-soft);
  color: var(--swiss-ink-soft);
  font-size: 0.7rem;
  line-height: 1.5;
}
</style>
