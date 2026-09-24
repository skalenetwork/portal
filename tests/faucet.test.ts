import { describe, expect, test } from 'bun:test'
import { getFuncData, isFaucetAvailable } from '@/bridge/core/faucet'
import { constants } from '@/core'

const CHAIN = 'honorable-steel-rasalhague'
const ADDRESS = '0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed'

describe('faucet', () => {
  test('availability', () => {
    expect(isFaucetAvailable(CHAIN, 'mainnet')).toBe(true)
    expect(isFaucetAvailable('no-such-chain', 'mainnet')).toBe(false)
    expect(isFaucetAvailable(CHAIN, 'base')).toBe(false)
  })

  test('encodes the pinned calldata', () => {
    expect(getFuncData(CHAIN, ADDRESS, 'mainnet')).toEqual({
      to: '0x02891b34B7911A9C68e82C193cd7A6fBf0c3b30A',
      data: '0x0c11dedd0000000000000000000000005aaeb6053f3e94c9b9a09f33669435e7ef1beaed'
    })
  })

  test('falls back to the zero target when no faucet exists', () => {
    const { to, data } = getFuncData('no-such-chain', ADDRESS, 'mainnet')
    expect(to).toBe(constants.ZERO_ADDRESS)
    expect(data.startsWith(constants.ZERO_FUNCSIG_FAUCET)).toBe(true)
  })
})
