import { describe, expect, test } from 'bun:test'
import { decodeFunctionResult, encodeFunctionResult, type Abi } from 'viem'
import { getLedgerPaymentId, getCreditStationSources } from '@/lib/credit-station'

const ADDR = '0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed'
const HASH = `0x${'ab'.repeat(32)}` as const

// the real on-chain shape, read from the deployed CreditStation ABI
const GET_PAYMENT_INFO = [
  {
    type: 'function',
    name: 'getPaymentInfo',
    stateMutability: 'view',
    inputs: [{ name: 'paymentId', type: 'uint256' }],
    outputs: [
      {
        name: 'payment',
        type: 'tuple',
        components: [
          { name: 'schainHash', type: 'bytes32' },
          { name: 'from', type: 'address' },
          { name: 'to', type: 'address' },
          { name: 'blockNumber', type: 'uint256' },
          { name: 'tokenAddress', type: 'address' },
          { name: 'value', type: 'uint256' }
        ]
      }
    ]
  }
] as const satisfies Abi

describe('getPaymentInfo decode shape', () => {
  test('viem decodes the single named tuple to an object, not an array', () => {
    const payment = {
      schainHash: HASH,
      from: ADDR,
      to: ADDR,
      blockNumber: 42n,
      tokenAddress: ADDR,
      value: 1000n
    } as const
    const data = encodeFunctionResult({
      abi: GET_PAYMENT_INFO,
      functionName: 'getPaymentInfo',
      result: payment
    })
    const decoded = decodeFunctionResult({
      abi: GET_PAYMENT_INFO,
      functionName: 'getPaymentInfo',
      data
    })

    // named access is what toPayment relies on
    expect(decoded.schainHash).toBe(HASH)
    expect(decoded.blockNumber).toBe(42n)
    expect(decoded.value).toBe(1000n)

    // positional access, which the ethers code used, is now undefined
    expect((decoded as any)[0]).toBeUndefined()
    expect(Array.isArray(decoded)).toBe(false)
  })
})

describe('payment ids', () => {
  test('strips the source prefix from the upper bits', () => {
    const prefix = 7n << 192n
    expect(getLedgerPaymentId(prefix + 123n)).toBe(123n)
    expect(getLedgerPaymentId(123n)).toBe(123n)
    expect(getLedgerPaymentId(0n)).toBe(0n)
  })
})

describe('credit station sources', () => {
  test('every configured source carries the fields the loader needs', () => {
    for (const network of ['mainnet', 'testnet', 'base', 'base-sepolia-testnet'] as const)
      for (const source of getCreditStationSources(network)) {
        expect(source.id).toBeTruthy()
        expect(source.chainName).toBeTruthy()
        expect(source.contractAddress).toMatch(/^0x[0-9a-fA-F]{40}$/)
        expect(source.skaleContractsProject).toMatch(/credit-station$/)
      }
  })
})
