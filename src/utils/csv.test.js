import { describe, it, expect } from 'vitest';
import { toCSV } from './csv.js';

describe('toCSV', () => {
  it('returns an empty string for no rows', () => {
    expect(toCSV([])).toBe('');
  });

  it('builds a header row from object keys', () => {
    const csv = toCSV([{ prop: 'Apto 301', tenant: 'Carlos' }]);
    expect(csv.split('\n')[0]).toBe('prop,tenant');
  });

  it('quotes values and escapes embedded double quotes', () => {
    const csv = toCSV([{ note: 'Pago "parcial"' }]);
    expect(csv.split('\n')[1]).toBe('"Pago ""parcial"""');
  });

  it('serialises every payment row', () => {
    const csv = toCSV([{ id: 1 }, { id: 2 }, { id: 3 }]);
    expect(csv.split('\n')).toHaveLength(4); // header + 3 rows
  });
});
