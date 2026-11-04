import { defineShikiSetup } from '@slidev/types'

// コードブロックのハイライト。白地で投影しても読めるよう、文字の色が濃くコントラストの高いテーマを使う。
// デッキ側で setup/shiki.ts を置けば上書きできる
export default defineShikiSetup(() => ({
  themes: {
    light: 'github-light',
    dark: 'github-dark',
  },
}))
