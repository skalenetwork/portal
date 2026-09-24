import { describe, expect, test } from 'bun:test'
import { Contract } from 'ethers'
import { confirmTransaction, sendRawTransaction } from '@/bridge/core/transactions'

const TO = '0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed'

const abi = [
  'function deposit(string schainName) payable',
  'function withdrawFunds(string schainName, uint256 amount)'
]
const contract = new Contract(TO, abi)

function recordingClient() {
  const sent: any[] = []
  return {
    sent,
    account: { address: TO },
    async sendTransaction(params: any) {
      sent.push(params)
      return '0xhash'
    }
  } as any
}

describe('sendRawTransaction', () => {
  test('carries value from an ethers overrides object', async () => {
    const tx = await contract.deposit.populateTransaction('europa', {
      address: TO,
      value: 12345n
    } as any)
    const client = recordingClient()
    await sendRawTransaction(client, tx)
    expect(client.sent[0].value).toBe(12345n)
    expect(client.sent[0].to).toBe(TO)
  })

  test('maps the ethers gasLimit override onto viem gas', async () => {
    const tx = await contract.withdrawFunds.populateTransaction('europa', 99n, {
      address: TO,
      gasLimit: 1000000n
    } as any)
    const client = recordingClient()
    await sendRawTransaction(client, tx)
    expect(client.sent[0].gas).toBe(1000000n)
  })

  test('omits value and gas when the call carries no overrides', async () => {
    const tx = await contract.withdrawFunds.populateTransaction('europa', 99n)
    const client = recordingClient()
    await sendRawTransaction(client, tx)
    expect(client.sent[0].value).toBeUndefined()
    expect(client.sent[0].gas).toBeUndefined()
  })

  test('applies explicit fee overrides', async () => {
    const tx = await contract.withdrawFunds.populateTransaction('europa', 99n)
    const client = recordingClient()
    await sendRawTransaction(client, tx, {
      maxFeePerGas: 100n,
      maxPriorityFeePerGas: 10n
    })
    expect(client.sent[0].maxFeePerGas).toBe(100n)
    expect(client.sent[0].maxPriorityFeePerGas).toBe(10n)
  })
})

function confirmingClient(status: 'success' | 'reverted') {
  return {
    account: { address: TO },
    extend() {
      return {
        async waitForTransactionReceipt({ timeout }: any) {
          received.timeout = timeout
          return { status, blockNumber: 42n }
        },
        async getBlock() {
          return { timestamp: 1710262826n }
        }
      }
    }
  } as any
}
const received: { timeout?: number } = {}

describe('confirmTransaction', () => {
  test('throws when the transaction reverted on chain', async () => {
    await expect(
      confirmTransaction(confirmingClient('reverted'), '0xdead', 'test:tx')
    ).rejects.toThrow('reverted on chain')
  })

  test('returns hash, block and timestamp on success', async () => {
    const res = await confirmTransaction(confirmingClient('success'), '0xbeef', 'test:tx')
    expect(res).toEqual({ hash: '0xbeef', blockNumber: 42n, timestamp: 1710262826 })
  })

  test('waits without a deadline, unlike the viem 180s default', async () => {
    await confirmTransaction(confirmingClient('success'), '0xbeef', 'test:tx')
    expect(received.timeout).toBe(0)
  })
})
