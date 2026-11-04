// 画面全体をベタにするレイアウトの色 (statement / section の variant)。
// Vue / Slidev ランタイムに依存しない純粋関数

export type Tone = 'default' | 'red' | 'ink'

/** 全面をベタにできるレイアウト */
const SOLID_LAYOUTS = new Set(['statement', 'section'])

/** variant の値を色にそろえる。知らない値は既定にする */
export function toneOf(variant: unknown): Tone {
  if (variant === 'red')
    return 'red'
  if (variant === 'ink')
    return 'ink'
  return 'default'
}

/** そのスライドが全面のベタか (プログレスバーなど、上に重ねる部品の色を変えるのに使う) */
export function solidToneOf(layout: unknown, frontmatter: Record<string, unknown> | undefined): Tone {
  if (typeof layout !== 'string' || !SOLID_LAYOUTS.has(layout))
    return 'default'
  return toneOf(frontmatter?.variant)
}
