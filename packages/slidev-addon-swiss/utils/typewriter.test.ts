import assert from 'node:assert/strict'
import { test } from 'node:test'
import { toCharacters, typingSchedule } from './typewriter.ts'

test('toCharacters は見た目の 1 文字ごとに分ける', () => {
  assert.deepEqual(toCharacters('abc'), ['a', 'b', 'c'])
  assert.deepEqual(toCharacters('問い'), ['問', 'い'])
  assert.deepEqual(toCharacters('があ'), ['が', 'あ'])
  assert.deepEqual(toCharacters(''), [])
})

test('typingSchedule は delay から speed ずつ進む', () => {
  assert.deepEqual(typingSchedule(3, 50, 100), [100, 150, 200])
})

test('typingSchedule は 0 文字なら空を返す', () => {
  assert.deepEqual(typingSchedule(0, 50, 100), [])
  assert.deepEqual(typingSchedule(-1, 50, 100), [])
})

test('typingSchedule は正の数でない speed / delay を 0 として扱う', () => {
  assert.deepEqual(typingSchedule(2, -10, Number.NaN), [0, 0])
})
