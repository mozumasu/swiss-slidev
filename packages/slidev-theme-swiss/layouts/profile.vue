<script setup lang="ts">
import type { ProfileLink, ProfileSection } from '../utils/profile.ts'
import { useSlideContext } from '@slidev/client'
import { computed } from 'vue'
import { isExternalUrl, normalizeProfileLinks, splitProfileName } from '../utils/profile.ts'
import { withBase } from '../utils/withBase.ts'
import Default from './default.vue'

// 自己紹介 (登壇資料の 2 枚目など)。default の枠 (柱の eyebrow・ページ番号) 付き。
// 写真 (image か ::avatar:: スロット)、赤い小見出し (title。既定は Profile) → 名前 → 所属 → リンクの行、
// 項目 (本文の md 箇条書き `- **Work** 説明` か sections prop) の 3 つを、variant で組み方を変えて並べる。
// - poster: 左の 8 列に大きな名前を下揃えで置き、右の 4 列の真ん中に丸い写真。項目は下に横一列 (既定)
// - split: 左の 5 列に写真と名前、右の 6 列に項目を縦に積む
// eyebrow / background は default レイアウトにそのまま渡る
const { image, name, affiliation, links, sections, variant = 'poster' } = defineProps<{
  /** 写真 (public/ のルート絶対パスか URL)。::avatar:: スロットがあればそちらを優先する */
  image?: string
  /** 名前。末尾の (yamada) のような括弧書きは少し小さく出す */
  name?: string
  /** 所属・役割。改行はそのまま反映する */
  affiliation?: string
  /** 所属の下のリンクの行。{ label, url? } か文字列の配列 */
  links?: (ProfileLink | string)[]
  /** 項目。本文 (md) があればそちらを優先する */
  sections?: ProfileSection[]
  /** 組み方 */
  variant?: 'poster' | 'split'
}>()

const { $frontmatter } = useSlideContext()
const title = computed(() => ($frontmatter.title as string | undefined) ?? 'Profile')
const nameParts = computed(() => splitProfileName(name))
const lines = computed(() => normalizeProfileLinks(links))
const avatarSrc = computed(() => withBase(image))
</script>

<template>
  <Default class="profile">
    <div class="swiss-grid swiss-profile" :class="`is-${variant}`">
      <div v-if="avatarSrc || $slots.avatar" class="swiss-profile__avatar-area">
        <div class="swiss-profile__avatar">
          <slot name="avatar">
            <img :src="avatarSrc" :alt="name ?? ''">
          </slot>
        </div>
      </div>
      <div class="swiss-profile__person">
        <h1 class="swiss-profile__title">{{ title }}</h1>
        <p v-if="nameParts.main" class="swiss-profile__name">
          {{ nameParts.main }}<small v-if="nameParts.note">{{ nameParts.note }}</small>
        </p>
        <p v-if="affiliation" class="swiss-profile__affiliation">{{ affiliation }}</p>
        <ul v-if="lines.length" class="swiss-profile__links">
          <li v-for="link in lines" :key="link.label">
            <a
              v-if="link.url"
              :href="link.url"
              :target="isExternalUrl(link.url) ? '_blank' : undefined"
              :rel="isExternalUrl(link.url) ? 'noopener noreferrer' : undefined"
            >{{ link.label }}</a>
            <span v-else>{{ link.label }}</span>
          </li>
        </ul>
      </div>
      <SwissFeatureList
        class="swiss-profile__sections"
        :direction="variant === 'split' ? 'column' : 'row'"
        :items="$slots.default ? undefined : sections"
      >
        <slot />
      </SwissFeatureList>
    </div>
  </Default>
</template>

<style scoped>
/* 3 つの部品を 12 列のグリッドに置き、variant ごとに置く列と行だけを変える */
.swiss-profile {
  --swiss-profile-avatar-size: 13rem;
  --swiss-profile-name-size: 4.2rem;

  height: 100%;
  padding-bottom: 0.5rem;
}

/* --- 部品の見た目 (どの variant でも同じ) --- */

/* 写真の区画。区画の中の真ん中に写真を置く */
.swiss-profile__avatar-area {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
  min-height: 0;
}

/* 写真は丸く切り抜く。四角で組む中で、人の写真だけを円にして目印にする。スロットで差し替えた画像も同じ */
.swiss-profile__avatar {
  width: var(--swiss-profile-avatar-size);
  max-width: 100%;
  aspect-ratio: 1;
  overflow: hidden;
  border-radius: 50%;
}

.swiss-profile__avatar :deep(img) {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.swiss-profile__person {
  min-width: 0;
}

/* 見出しは名前の上の赤い小見出しにして、名前を主役にする */
.slidev-layout .swiss-profile__title {
  margin: 0 0 0.6rem;
  color: var(--swiss-red-ink);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: var(--swiss-tracking-caps);
  line-height: 1.4;
  text-transform: uppercase;
}

.slidev-layout .swiss-profile__name {
  margin: 0;
  font-family: var(--swiss-font-display);
  font-size: var(--swiss-profile-name-size);
  font-weight: 900;
  line-height: 1.05;
  letter-spacing: var(--swiss-tracking-tight);
}

.swiss-profile__name small {
  margin-left: 0.3em;
  color: var(--swiss-ink-soft);
  font-size: 0.4em;
  font-weight: 500;
  letter-spacing: 0;
}

.slidev-layout .swiss-profile__affiliation {
  margin: 0.9rem 0 0;
  font-size: 1.05rem;
  font-weight: 500;
  line-height: 1.5;
  white-space: pre-line;
}

/* リンクは所属の下に 1 行で並べ、細い縦線で区切る */
.swiss-profile__links {
  display: flex;
  flex-wrap: wrap;
  margin: 0.6rem 0 0;
  padding: 0;
  list-style: none;
  color: var(--swiss-ink-soft);
  font-size: 0.8rem;
  line-height: 1.6;
}

.slidev-layout .swiss-profile__links li {
  margin: 0;
  padding: 0;
}

.slidev-layout .swiss-profile__links li::before {
  content: none;
}

.slidev-layout .swiss-profile__links li + li {
  margin-left: 0.8rem;
  padding-left: 0.8rem;
  border-left: var(--swiss-rule) solid var(--swiss-line-soft);
}

/* リンクも周りと同じ色。Slidev の a の点線の下線は消す */
.slidev-layout .swiss-profile__links a {
  color: inherit;
  border: none;
  text-decoration: none;
}

/* --- poster: 左の 8 列に名前を下揃え、右の 4 列の真ん中に写真。項目は下に横一列 --- */
.is-poster {
  grid-template-rows: minmax(0, 1fr) auto;
}

.is-poster .swiss-profile__person {
  grid-column: 1 / 9;
  grid-row: 1;
  align-self: end;
  padding-bottom: 2rem;
}

.is-poster .swiss-profile__avatar-area {
  grid-column: 9 / 13;
  grid-row: 1;
  padding-bottom: 2rem;
}

.is-poster .swiss-profile__sections {
  grid-column: 1 / 13;
  grid-row: 2;
}

/* --- split: 左の 5 列に写真と名前、右の 6 列に項目を縦に積む。左右とも上下の真ん中に置く --- */
.is-split {
  --swiss-profile-avatar-size: 9rem;
  --swiss-profile-name-size: 2.6rem;

  grid-template-rows: auto auto;
  align-content: center;
}

.is-split .swiss-profile__avatar-area {
  grid-column: 1 / 6;
  grid-row: 1;
  justify-content: flex-start;
  padding-bottom: 1.4rem;
}

.is-split .swiss-profile__person {
  grid-column: 1 / 6;
  grid-row: 2;
}

.is-split .swiss-profile__sections {
  grid-column: 7 / 13;
  grid-row: 1 / 3;
  align-self: center;
}
</style>
