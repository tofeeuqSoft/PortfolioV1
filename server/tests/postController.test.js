import { test } from 'node:test';
import assert from 'node:assert/strict';
import { estimateReadingTime } from '../controllers/postController.js';

test('empty content returns at least 1 minute', () => {
  assert.equal(estimateReadingTime(''), 1);
  assert.equal(estimateReadingTime('   '), 1);
});

test('short content rounds to 1 minute', () => {
  assert.equal(estimateReadingTime('hello world'), 1);
});

test('about 200 words is 1 minute', () => {
  const words = Array.from({ length: 200 }, () => 'word').join(' ');
  assert.equal(estimateReadingTime(words), 1);
});

test('about 400 words is 2 minutes', () => {
  const words = Array.from({ length: 400 }, () => 'word').join(' ');
  assert.equal(estimateReadingTime(words), 2);
});

test('about 1000 words is 5 minutes', () => {
  const words = Array.from({ length: 1000 }, () => 'word').join(' ');
  assert.equal(estimateReadingTime(words), 5);
});
