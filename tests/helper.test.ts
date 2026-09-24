import { describe, expect, test } from 'bun:test'
import {
  addressesEqual,
  shortAddress,
  shortAmount,
  shortBalance,
  isZeroAddr,
  divideBigInts,
  roundDown,
  roundUp,
  maxBigInt,
  minBigInt,
  eqArrays,
  sortObjectByKeys
} from '@/core/helper'

const LOWER = '0x5aaeb6053f3e94c9b9a09f33669435e7ef1beaed'
const CHECKSUMMED = '0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed'
const BAD_CHECKSUM = '0x5AAeb6053F3E94C9b9A09f33669435E7Ef1BeAed'
const ZERO = '0x0000000000000000000000000000000000000000'

describe('addressesEqual', () => {
  test('compares case-insensitively via checksumming', () => {
    expect(addressesEqual(LOWER, CHECKSUMMED)).toBe(true)
    expect(addressesEqual(LOWER, LOWER)).toBe(true)
    expect(addressesEqual(LOWER, ZERO)).toBe(false)
  })

  test('tolerates a bad checksum but still rejects a malformed address', () => {
    expect(addressesEqual(CHECKSUMMED, BAD_CHECKSUM)).toBe(true)
    expect(() => addressesEqual('0x123', LOWER)).toThrow()
  })
})

describe('address helpers', () => {
  test('shortAddress', () => {
    expect(shortAddress(LOWER as `0x${string}`)).toBe('0x5a...ed')
    expect(shortAddress(undefined)).toBe('')
  })

  test('isZeroAddr', () => {
    expect(isZeroAddr(ZERO as `0x${string}`)).toBe(true)
    expect(isZeroAddr(LOWER as `0x${string}`)).toBe(false)
  })
})

describe('amount helpers', () => {
  test('shortAmount abbreviates long fractions only', () => {
    expect(shortAmount('1.0')).toBe('1.0')
    expect(shortAmount('1')).toBe('1')
    expect(shortAmount('1.12345')).toBe('1.12345')
    expect(shortAmount('0.123456789')).toBe('0.12...789')
  })

  test('shortBalance pinned output', () => {
    expect(shortBalance(10n ** 18n)).toBe('1')
    expect(shortBalance(0n)).toBe('0')
    expect(shortBalance(1n, 18)).toBe('0.00...001')
    expect(shortBalance(1500000000000000000n, 18)).toBe('1.5')
    expect(shortBalance(undefined)).toBe('')
  })
})

describe('numeric helpers', () => {
  test('divideBigInts', () => {
    expect(divideBigInts(10n ** 18n, 3n * 10n ** 18n)).toBe(0.3333)
    expect(divideBigInts(0n, 10n ** 18n)).toBe(0)
  })

  test('rounding', () => {
    expect(roundDown(1.23456, 2)).toBe(1.23)
    expect(roundUp(1.23456, 2)).toBe(1.23)
  })

  test('bigint min and max', () => {
    expect(maxBigInt(1n, 2n)).toBe(2n)
    expect(minBigInt(1n, 2n)).toBe(1n)
  })
})

describe('structural helpers', () => {
  test('eqArrays', () => {
    expect(eqArrays([1, 2], [1, 2])).toBe(true)
    expect(eqArrays([1, 2], [2, 1])).toBe(false)
  })

  test('sortObjectByKeys', () => {
    expect(Object.keys(sortObjectByKeys({ b: 1, a: 2 }))).toEqual(['a', 'b'])
  })
})
