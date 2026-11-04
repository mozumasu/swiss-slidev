import assert from 'node:assert/strict'
import { test } from 'node:test'
import { solidToneOf, toneOf } from './tone.ts'

test('toneOf は red / ink を返す', () => {
  assert.equal(toneOf('red'), 'red')
  assert.equal(toneOf('ink'), 'ink')
})

test('toneOf は知らない値と未指定を default にする', () => {
  assert.equal(toneOf(undefined), 'default')
  assert.equal(toneOf('default'), 'default')
  assert.equal(toneOf('blue'), 'default')
  assert.equal(toneOf(1), 'default')
})

test('solidToneOf は statement / section の variant だけを見る', () => {
  assert.equal(solidToneOf('statement', { variant: 'red' }), 'red')
  assert.equal(solidToneOf('section', { variant: 'ink' }), 'ink')
  assert.equal(solidToneOf('qa', { variant: 'stack' }), 'default')
  assert.equal(solidToneOf('default', { variant: 'red' }), 'default')
})

test('solidToneOf は frontmatter や layout が無くても default を返す', () => {
  assert.equal(solidToneOf('statement', undefined), 'default')
  assert.equal(solidToneOf(undefined, { variant: 'red' }), 'default')
})
