import { describe, expect, test } from 'bun:test'
import { encodeFunctionData, toFunctionSelector, type Abi } from 'viem'
import { ERC_ABIS, erc20Abi, erc721Abi, erc1155Abi, erc20WrapperAbi } from '@/core/abi'

const ADDRESS = '0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed'
const ALL: Array<[string, Abi]> = Object.entries(ERC_ABIS)

describe('ERC ABIs', () => {
  test('every token type maps to a distinct-or-shared abi array', () => {
    expect(ERC_ABIS.eth).toBe(ERC_ABIS.erc20)
    expect(Object.keys(ERC_ABIS).sort()).toEqual([
      'erc1155',
      'erc20',
      'erc20wrap',
      'erc721',
      'erc721meta',
      'eth'
    ])
  })

  test('carry no legacy solidity keys', () => {
    for (const [name, abi] of ALL)
      for (const entry of abi) {
        expect(entry, name).not.toHaveProperty('constant')
        expect(entry, name).not.toHaveProperty('payable')
      }
  })

  test('every function and constructor declares stateMutability', () => {
    for (const [name, abi] of ALL)
      for (const entry of abi)
        if (entry.type === 'function' || entry.type === 'constructor')
          expect(entry, `${name}:${(entry as any).name ?? 'constructor'}`).toHaveProperty(
            'stateMutability'
          )
  })

  test('pinned selectors match the canonical ERC signatures', () => {
    expect(toFunctionSelector('transfer(address,uint256)')).toBe('0xa9059cbb')
    expect(toFunctionSelector('approve(address,uint256)')).toBe('0x095ea7b3')
    expect(toFunctionSelector('balanceOf(address)')).toBe('0x70a08231')
    expect(encodeFunctionData({ abi: erc20Abi, functionName: 'approve', args: [ADDRESS, 1n] })).toBe(
      '0x095ea7b30000000000000000000000005aaeb6053f3e94c9b9a09f33669435e7ef1beaed0000000000000000000000000000000000000000000000000000000000000001'
    )
  })

  test('viem can encode against each abi', () => {
    expect(
      encodeFunctionData({ abi: erc721Abi, functionName: 'ownerOf', args: [1n] })
    ).toStartWith('0x6352211e')
    expect(
      encodeFunctionData({ abi: erc1155Abi, functionName: 'balanceOf', args: [ADDRESS, 1n] })
    ).toStartWith('0x00fdd58e')
    expect(
      encodeFunctionData({ abi: erc20WrapperAbi, functionName: 'depositFor', args: [ADDRESS, 1n] })
    ).toStartWith('0x2f4f21e2')
  })
})
