import { describe, expect, test } from 'bun:test'
import { decodeFunctionResult, encodeFunctionResult, type Abi } from 'viem'

const ADDR = '0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed'

// shapes read from the checked-in skale-manager ABI in skale-network/releases
const ABI = [
  {
    type: 'function',
    name: 'getAndUpdateDelegatedAmount',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'holder', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    type: 'function',
    name: 'getAndUpdateEarnedBountyAmountOf',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'wallet', type: 'address' },
      { name: 'validatorId', type: 'uint256' }
    ],
    outputs: [
      { name: 'earned', type: 'uint256' },
      { name: 'endMonth', type: 'uint256' }
    ]
  },
  {
    type: 'function',
    name: 'getDelegation',
    stateMutability: 'view',
    inputs: [{ name: 'delegationId', type: 'uint256' }],
    outputs: [
      {
        name: '',
        type: 'tuple',
        components: [
          { name: 'holder', type: 'address' },
          { name: 'validatorId', type: 'uint256' },
          { name: 'amount', type: 'uint256' },
          { name: 'delegationPeriod', type: 'uint256' },
          { name: 'created', type: 'uint256' },
          { name: 'started', type: 'uint256' },
          { name: 'finished', type: 'uint256' },
          { name: 'info', type: 'string' }
        ]
      }
    ]
  }
] as const satisfies Abi

const roundTrip = (functionName: any, result: any) =>
  decodeFunctionResult({
    abi: ABI,
    functionName,
    data: encodeFunctionResult({ abi: ABI, functionName, result })
  })

describe('staking decode shapes', () => {
  test('a single unnamed output is unwrapped, so [0] is undefined', () => {
    const decoded = roundTrip('getAndUpdateDelegatedAmount', 1000n)
    expect(decoded).toBe(1000n)
    expect((decoded as any)[0]).toBeUndefined()
  })

  test('two outputs stay an array, so [0] is still correct', () => {
    const decoded = roundTrip('getAndUpdateEarnedBountyAmountOf', [5n, 7n])
    expect(Array.isArray(decoded)).toBe(true)
    expect((decoded as any)[0]).toBe(5n)
  })

  test('the all-named delegation tuple decodes to an object, not an array', () => {
    const decoded = roundTrip('getDelegation', {
      holder: ADDR,
      validatorId: 3n,
      amount: 100n,
      delegationPeriod: 2n,
      created: 10n,
      started: 11n,
      finished: 0n,
      info: 'note'
    }) as any
    expect(decoded.holder).toBe(ADDR)
    expect(decoded.amount).toBe(100n)
    expect(decoded.info).toBe('note')
    expect(decoded[0]).toBeUndefined()
    expect(Array.isArray(decoded)).toBe(false)
  })
})
