import { describe, it, expect } from 'vitest';
import { formatCurrency } from '@/lib/utils';

describe('formatCurrency', () => {
  // Intl.NumberFormat in jsdom uses non-breaking space (U+00A0) between currency symbol and number
  // We normalize it for comparison
  const normalize = (str: string) => str.replace(/\u00A0/g, ' ');

  it('formats positive numbers as Indonesian Rupiah', () => {
    expect(normalize(formatCurrency(10000))).toBe('Rp 10.000');
    expect(normalize(formatCurrency(50000))).toBe('Rp 50.000');
    expect(normalize(formatCurrency(1000000))).toBe('Rp 1.000.000');
    expect(normalize(formatCurrency(2500000))).toBe('Rp 2.500.000');
  });

  it('formats zero correctly', () => {
    expect(normalize(formatCurrency(0))).toBe('Rp 0');
  });

it('formats large numbers correctly', () => {
    expect(normalize(formatCurrency(1000000000))).toBe('Rp 1.000.000.000');
    expect(normalize(formatCurrency(999999999))).toBe('Rp 999.999.999');
  });

  it('handles decimal numbers by rounding to whole IDR', () => {
    expect(normalize(formatCurrency(10000.5))).toBe('Rp 10.001');
    expect(normalize(formatCurrency(10000.49))).toBe('Rp 10.000');
    expect(normalize(formatCurrency(10000.99))).toBe('Rp 10.001');
  });

  it('formats negative numbers with minus sign', () => {
    expect(normalize(formatCurrency(-50000))).toBe('-Rp 50.000');
    expect(normalize(formatCurrency(-1000000))).toBe('-Rp 1.000.000');
  });

  it('formats small numbers correctly', () => {
    expect(normalize(formatCurrency(1))).toBe('Rp 1');
    expect(normalize(formatCurrency(10))).toBe('Rp 10');
    expect(normalize(formatCurrency(999))).toBe('Rp 999');
  });

  it('formats numbers with exact thousands correctly', () => {
    expect(normalize(formatCurrency(1000))).toBe('Rp 1.000');
    expect(normalize(formatCurrency(1000000))).toBe('Rp 1.000.000');
  });

  it('handles very large numbers', () => {
    expect(normalize(formatCurrency(999999999999))).toBe('Rp 999.999.999.999');
  });
});