<script setup lang="ts">
import { useNav } from '@slidev/client'
import { computed } from 'vue'
import { useTocItems } from './composables/useTocItems.ts'
import { findActiveNo } from './utils/toc.ts'

// ウィンドウ右端にカーソルを寄せると出る目次ドロワー。
// 項目は frontmatter の `toc: ラベル` (無ければスライドタイトルの階層)。書き出し・プレゼンターでは出さない
const { currentPage, go, isPresenter, isPrintMode } = useNav()
const { items } = useTocItems()

const activeNo = computed(() => findActiveNo(items.value, currentPage.value))

// クリックしたリンクにフォーカスが残ると :focus-within でドロワーが開きっぱなしになる
function select(no: number, e: Event) {
  ;(e.currentTarget as HTMLElement).blur()
  go(no)
}
</script>

<template>
  <!-- Global Layer はスライドキャンバス (16:9 に縮尺・中央寄せ) の中に描かれるため、
       body に出してウィンドウの右端に固定する。キャンバスの縮尺を受けないので寸法は px で書く -->
  <Teleport to="body">
    <nav
      v-if="!isPrintMode && !isPresenter && items.length"
      class="swiss-toc-drawer"
      aria-label="目次"
    >
      <span class="swiss-toc-drawer__grip" aria-hidden="true" />
      <div class="swiss-toc-drawer__panel">
        <p class="swiss-toc-drawer__title">Contents</p>
        <ol class="swiss-toc-drawer__list">
          <li
            v-for="(item, i) in items"
            :key="item.no"
            class="swiss-toc-drawer__item"
            :class="{ 'is-active': item.no === activeNo }"
          >
            <span class="swiss-toc-drawer__no">{{ String(i + 1).padStart(2, '0') }}</span>
            <a href="#" @click.prevent="select(item.no, $event)">{{ item.label }}</a>
            <ol v-if="item.children.length" class="swiss-toc-drawer__children">
              <li
                v-for="child in item.children"
                :key="child.no"
                class="swiss-toc-drawer__child"
                :class="{ 'is-active': child.no === activeNo }"
              >
                <a href="#" @click.prevent="select(child.no, $event)">{{ child.label }}</a>
              </li>
            </ol>
          </li>
        </ol>
      </div>
    </nav>
  </Teleport>
</template>

<style scoped>
/* 右端の細い透明帯が当たり判定。パネルはその子なので、引き出した後に
   パネル上へカーソルが移っても :hover が切れない */
.swiss-toc-drawer {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 16px;
  z-index: 100;
  color: var(--swiss-ink);
  font-family: var(--swiss-font-body);
}

/* ドロワーがあることを控えめに示す赤い縦棒 */
.swiss-toc-drawer__grip {
  position: absolute;
  top: 50%;
  right: 6px;
  width: 3px;
  height: 48px;
  transform: translateY(-50%);
  background: var(--swiss-red);
  opacity: 0.5;
  transition: opacity 0.15s ease;
}

.swiss-toc-drawer:hover .swiss-toc-drawer__grip,
.swiss-toc-drawer:focus-within .swiss-toc-drawer__grip {
  opacity: 0;
}

/* パネルは紙の地に、上端の太い墨の罫線と左端の細い罫線 */
.swiss-toc-drawer__panel {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 300px;
  padding: 28px 28px 40px;
  overflow-y: auto;
  background: var(--swiss-paper);
  border-top: 6px solid var(--swiss-ink);
  border-left: 1px solid var(--swiss-ink);
  transform: translateX(100%);
  transition: transform 0.25s var(--swiss-ease);
}

.swiss-toc-drawer:hover .swiss-toc-drawer__panel,
.swiss-toc-drawer:focus-within .swiss-toc-drawer__panel {
  transform: translateX(0);
}

.swiss-toc-drawer__title {
  margin: 0 0 16px;
  font-family: var(--swiss-font-display);
  font-size: 26px;
  font-weight: 900;
  letter-spacing: -0.03em;
  line-height: 1;
}

.swiss-toc-drawer__list {
  list-style: none;
  margin: 0;
  padding: 0;
  border-top: 1px solid var(--swiss-ink);
}

.swiss-toc-drawer__item {
  display: grid;
  grid-template-columns: 28px 1fr;
  column-gap: 10px;
  align-items: baseline;
  padding: 10px 0;
  border-bottom: 1px solid var(--swiss-line-soft);
  font-size: 14px;
  font-weight: 700;
  line-height: 1.4;
}

.swiss-toc-drawer__no {
  color: var(--swiss-ink-faint);
  font-family: var(--swiss-font-display);
  font-size: 12px;
  font-variant-numeric: tabular-nums;
  font-weight: 700;
}

.swiss-toc-drawer__item.is-active > .swiss-toc-drawer__no {
  color: var(--swiss-red);
}

/* 子項目は番号なしで、親ラベルの開始位置に揃えて控えめに並べる */
.swiss-toc-drawer__children {
  grid-column: 2;
  list-style: none;
  margin: 4px 0 0;
  padding: 0;
}

.swiss-toc-drawer__child {
  padding: 3px 0;
  color: var(--swiss-ink-soft);
  font-size: 13px;
  font-weight: 500;
}

.swiss-toc-drawer a {
  color: inherit;
  text-decoration: none;
}

.swiss-toc-drawer a:hover,
.swiss-toc-drawer .is-active > a {
  color: var(--swiss-red-ink);
}
</style>
