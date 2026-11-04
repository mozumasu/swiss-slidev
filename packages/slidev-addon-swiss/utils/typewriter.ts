// <SwissTypeWriter> で使う純粋関数 (Vue / Slidev ランタイムに依存しない)

/** 見た目の 1 文字ごとに分ける。絵文字や濁点の結合文字を途中で切らない */
export function toCharacters(text: string): string[] {
  const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' })
  return [...segmenter.segment(text)].map(part => part.segment)
}

/** n 文字ぶんの、各文字が現れる時刻 (ms) を返す。speed / delay が正の数でなければ 0 として扱う */
export function typingSchedule(count: number, speed: number, delay: number): number[] {
  const step = speed > 0 ? speed : 0
  const start = delay > 0 ? delay : 0
  return Array.from({ length: Math.max(count, 0) }, (_, i) => start + i * step)
}
