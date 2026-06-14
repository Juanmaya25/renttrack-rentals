import { describe, it, expect } from 'vitest';
import { fmt } from './format.js';

describe('fmt', () => {
  it('formats a number as Colombian pesos with thousands separators', () => {
    expect(fmt(1800000)).toBe('$1.800.000');
  });

  it('returns $0 for null, undefined or NaN', () => {
    expect(fmt(null)).toBe('$0');
    expect(fmt(undefined)).toBe('$0');
    expect(fmt(NaN)).toBe('$0');
  });

  it('formats large portfolio totals', () => {
    expect(fmt(14900000)).toBe('$14.900.000');
  });
});
