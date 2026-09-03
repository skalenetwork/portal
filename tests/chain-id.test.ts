import { describe, expect, test } from 'bun:test'
import { getChainId, getChainIdInt } from '@/lib/chain'
import { getChainId as bridgeGetChainId } from '@/bridge/core/chain_id'
import { schainNameToHash } from '@/core/helper'

const CHAIN_IDS: Array<[string, string, number]> = [
  ['__offchain', '0x3f9870732a32f', 1118783266792239],
  ['affectionate-immediate-pollux', '0x3d28774d', 1026062157],
  ['aware-fake-trim-testnet', '0x3cd156dc', 1020352220],
  ['elated-tan-skat', '0x79f99296', 2046399126],
  ['fit-betelgeuse', '0x2f8d4b0d3abc9', 836542336838601],
  ['flippant-precious-ancha', '0x84756', 542550],
  ['fussy-smoggy-megrez', '0x2670f8a5', 644937893],
  ['giant-half-dual-testnet', '0x3a14269b', 974399131],
  ['green-giddy-denebola', '0x585eb4b1', 1482601649],
  ['honorable-steel-rasalhague', '0x5d456c62', 1564830818],
  ['jubilant-horrible-ancha', '0x135a9d92', 324705682],
  ['juicy-low-small-testnet', '0x561bf78b', 1444673419],
  ['lanky-ill-funny-testnet', '0x235ddd0', 37084624],
  ['light-vast-diphda', '0x7f8cb400', 2139927552],
  ['miniature-live-tabit', '0x7c9a1266', 2090472038],
  ['overcooked-profuse-gienah-cygni', '0x2ecaf306', 785052422],
  ['parallel-stormy-spica', '0x507aaa2a', 1350216234],
  ['talkative-victorious-rasalgethi', '0x236175a9', 593589673],
  ['vigilant-snappy-arcturus', '0xbb26fc0', 196243392],
  ['winged-bubbly-grumium', '0x46cea59d', 1187947933]
]

describe('chain id derivation', () => {
  test('getChainId matches the pinned hex for every known chain', () => {
    for (const [name, hex] of CHAIN_IDS) expect(getChainId(name)).toBe(hex)
  })

  test('getChainIdInt matches the pinned integer for every known chain', () => {
    for (const [name, , int] of CHAIN_IDS) expect(getChainIdInt(name)).toBe(int)
  })

  test('the bridge and lib derivations agree', () => {
    for (const [name, , int] of CHAIN_IDS) expect(bridgeGetChainId(name)).toBe(int)
  })

  test('every id fits exactly in a float64', () => {
    for (const [, , int] of CHAIN_IDS) expect(Number.isSafeInteger(int)).toBe(true)
  })

  test('ids derive from the first 13 hex digits of the name hash', () => {
    for (const [name, hex] of CHAIN_IDS) {
      expect(BigInt(hex)).toBe(BigInt('0x' + schainNameToHash(name).slice(2, 15)))
    }
  })
})

describe('schainNameToHash', () => {
  test('pinned hashes', () => {
    expect(schainNameToHash('__offchain')).toBe(
      '0x3f9870732a32f358c2472e14c5dd8548315221c80f1f96fd3f365dc4bc7e0b35'
    )
    expect(schainNameToHash('elated-tan-skat')).toBe(
      '0x0000079f99296b6e03a329124ad64458c087f20ba42432947c79ce9defdcaa1f'
    )
    expect(schainNameToHash('')).toBe(
      '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470'
    )
  })

  test('hashes a hex-shaped name as text, not as bytes', () => {
    expect(schainNameToHash('0x1234')).toBe(
      '0x1ac7d1b81b7ba1025b36ccb86723da6ee5a87259f1c2fd5abe69d3200b512ec8'
    )
    expect(schainNameToHash('0xdeadbeef')).toBe(
      '0x4f440a001006a49f24a7de53c04eca3f79aef851ac58e460c9630d044277c8b0'
    )
    expect(schainNameToHash('0x')).toBe(
      '0x39bef1777deb3dfb14f64b9f81ced092c501fee72f90e93d03bb95ee89df9837'
    )
  })
})
