import { describe, expect, test } from 'bun:test'
import {
  parseAmount,
  toWei,
  fromWei,
  formatBalance,
  truncateDecimals,
  formatAmount,
  displayBalance,
  displaySklValueUsd
} from '@/core/units'

describe('fromWei', () => {
  test('pinned conversions', () => {
    expect(fromWei(10n ** 18n, 18)).toBe('1')
    expect(fromWei(0n, 18)).toBe('0')
    expect(fromWei(1n, 18)).toBe('0.000000000000000001')
    expect(fromWei(1500000000000000000n, 18)).toBe('1.5')
    expect(fromWei(123456789n, 6)).toBe('123.456789')
    expect(fromWei(10n ** 24n, 18)).toBe('1000000')
  })

  test('whole numbers carry no trailing .0', () => {
    expect(fromWei(10n ** 18n, 18).includes('.')).toBe(false)
  })
})

describe('formatBalance', () => {
  test('pinned conversions', () => {
    expect(formatBalance(10n ** 18n)).toBe('1')
    expect(formatBalance(0n)).toBe('0')
    expect(formatBalance(1500000000000000000n, 18)).toBe('1.5')
    expect(formatBalance(123456789n, 6)).toBe('123.456789')
  })
})

describe('toWei', () => {
  test('pinned conversions', () => {
    expect(toWei('1', 18)).toBe(10n ** 18n)
    expect(toWei('1.5', 18)).toBe(1500000000000000000n)
    expect(toWei('0.000000000000000001', 18)).toBe(1n)
    expect(toWei('1.5', 6)).toBe(1500000n)
    expect(toWei('0', 18)).toBe(0n)
  })

  test('rejects more decimals than the token has', () => {
    expect(() => toWei('1.9999999', 6)).toThrow()
    expect(() => toWei('1.2345678901234567890123', 18)).toThrow()
  })

  test('rejects over-precision for every sub-18-decimal bridge token', () => {
    expect(() => toWei('1.9999999', 6)).toThrow()
    expect(() => toWei('9.9999999', 6)).toThrow()
    expect(() => toWei('0.0000004', 6)).toThrow()
    expect(() => toWei('1.123456789', 8)).toThrow()
    expect(() => toWei('0.000000004', 8)).toThrow()
    expect(toWei('0.00000001', 8)).toBe(1n)
  })

  test('never rounds: an over-precise amount is rejected, not adjusted', () => {
    expect(() => toWei('1.9999999', 6)).toThrow()
    expect(toWei('1.999999', 6)).toBe(1999999n)
  })

  test('rejects malformed input', () => {
    expect(() => toWei('', 18)).toThrow()
    expect(() => toWei('abc', 18)).toThrow()
    expect(() => toWei('1e3', 18)).toThrow()
  })
})

describe('truncateDecimals', () => {
  test('pinned conversions', () => {
    expect(truncateDecimals('1.0', 2)).toBe('1.0')
    expect(truncateDecimals('1.23456', 3)).toBe('1.234')
    expect(truncateDecimals('1,23456', 3)).toBe('1,234')
    expect(truncateDecimals('', 2)).toBe('')
    expect(truncateDecimals('0.0', 4)).toBe('0.0')
  })

  test('a value with no fraction keeps no trailing delimiter', () => {
    expect(truncateDecimals('1', 2)).toBe('1')
    expect(truncateDecimals('0', 4)).toBe('0')
    expect(truncateDecimals('1.5', 0)).toBe('1')
  })
})

describe('displayBalance', () => {
  test('pinned output', () => {
    expect(displayBalance(10n ** 18n)).toBe('1')
    expect(displayBalance(1500000000000000000n, 'skl')).toBe('1.5 SKL')
    expect(displayBalance(0n)).toBe('0')
    expect(displayBalance(123456789n, 'usdc', 6)).toBe('123.456 USDC')
  })
})

describe('displaySklValueUsd', () => {
  test('pinned output', () => {
    expect(displaySklValueUsd(10n ** 18n, 10n ** 17n)).toBe('0.1 USD')
    expect(displaySklValueUsd(0n, 10n ** 18n)).toBe('0 USD')
    expect(displaySklValueUsd(3n * 10n ** 18n, 25n * 10n ** 16n)).toBe('0.75 USD')
  })
})

describe('parseAmount', () => {
  test('accepts amounts within the token precision', () => {
    expect(parseAmount('1', 18)).toBe(10n ** 18n)
    expect(parseAmount('1.5', 6)).toBe(1500000n)
    expect(parseAmount('1.123456', 6)).toBe(1123456n)
    expect(parseAmount('0.00000001', 8)).toBe(1n)
    expect(parseAmount('0', 18)).toBe(0n)
    expect(parseAmount('.5', 18)).toBe(5n * 10n ** 17n)
    expect(parseAmount('1.', 18)).toBe(10n ** 18n)
  })

  test('accepts trailing zeros past the token precision', () => {
    expect(parseAmount('1.0000000', 6)).toBe(1000000n)
    expect(parseAmount('100.00000000', 6)).toBe(100000000n)
    expect(parseAmount('0.010000000', 8)).toBe(1000000n)
    expect(parseAmount('1.000000000000000000', 6)).toBe(1000000n)
  })

  test('rejects over-precision rather than rounding it', () => {
    expect(parseAmount('1.9999999', 6)).toBeNull()
    expect(parseAmount('9.9999999', 6)).toBeNull()
    expect(parseAmount('0.0000004', 6)).toBeNull()
    expect(parseAmount('1.123456789', 8)).toBeNull()
    expect(parseAmount('1.2345678901234567890123', 18)).toBeNull()
  })

  test('rejects malformed input without throwing', () => {
    for (const bad of ['', '.', 'abc', '1e3', '-1', '1.2.3', ' 1', '0x1'])
      expect(parseAmount(bad, 18)).toBeNull()
  })
})

describe('formatAmount', () => {
  test('groups the integer part and preserves the fraction exactly', () => {
    expect(formatAmount('1000')).toBe('1,000')
    expect(formatAmount('1000.5')).toBe('1,000.5')
    expect(formatAmount('1')).toBe('1')
    expect(formatAmount('0')).toBe('0')
    expect(formatAmount('1.123456789012345678')).toBe('1.123456789012345678')
    expect(formatAmount('.5')).toBe('0.5')
  })

  test('uses the locale decimal separator, never a bare dot', () => {
    const sep =
      new Intl.NumberFormat().formatToParts(1.1).find((p) => p.type === 'decimal')?.value ?? '.'
    const group = (1234).toLocaleString().replace(/[0-9]/g, '').charAt(0)
    expect(formatAmount('1234.56')).toBe(`1${group}234${sep}56`)
    expect(sep === group).toBe(false)
  })

  test('groups exactly, without float rounding', () => {
    expect(formatAmount('123456789012345678901')).toBe('123,456,789,012,345,678,901')
  })

  test('passes non-numeric input through untouched, empty reads as zero', () => {
    expect(formatAmount('abc')).toBe('abc')
    expect(formatAmount('1e3')).toBe('1e3')
    expect(formatAmount('')).toBe('0')
  })
})
