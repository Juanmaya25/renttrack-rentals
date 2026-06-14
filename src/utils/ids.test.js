import { describe, it, expect } from 'vitest';
import { nextId } from './ids.js';

describe('nextId', () => {
  it('returns 1 for an empty array', () => {
    expect(nextId([])).toBe(1);
  });

  it('returns max id + 1', () => {
    expect(nextId([{ id: 1 }, { id: 6 }, { id: 3 }])).toBe(7);
  });

  it('works for a single-element array', () => {
    expect(nextId([{ id: 10 }])).toBe(11);
  });
});
