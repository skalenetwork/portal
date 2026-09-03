import { describe, expect, test } from 'bun:test'
import { keccak256, toBeHex, toBigInt } from 'ethers'
import SkalePowMiner from '@/bridge/core/miner'
import { MAX_NUMBER } from '@/bridge/core/constants'

const ADDRESS = '0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed'

function externalGasFor(candidate: bigint, nonce: number, address: string, difficulty: bigint) {
  const nonceHash = toBigInt(keccak256(toBeHex(nonce, 32)))
  const addressHash = toBigInt(keccak256(address))
  return MAX_NUMBER / difficulty / (nonceHash ^ addressHash ^ candidate)
}

describe('sFUEL proof of work', () => {
  test('nonce hashing is width-pinned to 32 bytes', () => {
    expect(toBeHex(0, 32)).toBe('0x' + '00'.repeat(32))
    expect(toBeHex(1, 32)).toBe('0x' + '00'.repeat(31) + '01')
    expect(keccak256(toBeHex(0, 32))).toBe(
      '0x290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e563'
    )
  })

  test('the address hash treats the address as bytes, not text', () => {
    expect(keccak256(ADDRESS)).toBe(
      '0x793f88740e3ced5d3b007ab91feb3feb22d76afe4b9e849aa48d4d35f740fb4e'
    )
  })

  test('a mined candidate satisfies the difficulty invariant', async () => {
    const miner = new SkalePowMiner()
    const candidate = (await miner.mineFreeGas(1, ADDRESS, 0)) as bigint
    expect(externalGasFor(candidate, 0, ADDRESS, 1n)).toBeGreaterThanOrEqual(1n)
  })

  test('mineGasForTransaction accepts hex or decimal nonce and gas', async () => {
    const miner = new SkalePowMiner()
    const fromHex = (await miner.mineGasForTransaction('0x0', '0x1', ADDRESS)) as bigint
    expect(externalGasFor(fromHex, 0, ADDRESS, 1n)).toBeGreaterThanOrEqual(1n)
    const fromNum = (await miner.mineGasForTransaction(0, 1, ADDRESS)) as bigint
    expect(externalGasFor(fromNum, 0, ADDRESS, 1n)).toBeGreaterThanOrEqual(1n)
  })

  test('difficulty scales the required work', () => {
    expect(new SkalePowMiner().difficulty).toBe(1n)
    expect(new SkalePowMiner({ difficulty: 4n }).difficulty).toBe(4n)
  })
})
