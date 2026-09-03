/**
 * @license
 * SKALE Metaport
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

/**
 * @file transactions.ts
 * @copyright SKALE Labs 2023-Present
 */

import { type ContractMethod } from 'ethers'
import { publicActions, type Hex, type WalletClient } from 'viem'
import { Logger, type ILogObj } from 'tslog'
import { types } from '@/core'

const log = new Logger<ILogObj>({ name: 'metaport:core:transactions' })

export interface PopulatedTx {
  to?: string | null
  data?: string | null
  value?: bigint | null
  gasLimit?: bigint | null
}

export async function sendRawTransaction(
  walletClient: WalletClient,
  tx: PopulatedTx,
  fees?: { maxFeePerGas: bigint; maxPriorityFeePerGas: bigint }
): Promise<Hex> {
  return await walletClient.sendTransaction({
    account: walletClient.account!,
    chain: null,
    to: tx.to as Hex,
    data: tx.data as Hex,
    value: tx.value ?? undefined,
    gas: tx.gasLimit ?? undefined,
    ...fees
  })
}

export async function confirmTransaction(
  walletClient: WalletClient,
  hash: Hex,
  name: string,
  confirmations = 1
): Promise<types.mp.TxResponse> {
  const client = walletClient.extend(publicActions)
  const receipt = await client.waitForTransactionReceipt({ hash, confirmations, timeout: 0 })
  if (receipt.status !== 'success') throw new Error(`${name} reverted on chain: ${hash}`)
  const { timestamp } = await client.getBlock({ blockNumber: receipt.blockNumber })
  log.info('✅ ' + name + ' mined - tx: ' + hash)
  return { hash, blockNumber: receipt.blockNumber, timestamp: Number(timestamp) }
}

export async function sendTransaction(
  walletClient: WalletClient,
  func: ContractMethod,
  args: any[],
  name: string,
  confirmations = 1,
  value?: bigint
): Promise<types.mp.TxResponse> {
  log.info('💡 Sending transaction: ' + name)
  const tx = await func.populateTransaction(...args)
  if (value !== undefined) tx.value = value
  const hash = await sendRawTransaction(walletClient, tx)
  log.info(`⏳ ${name} mining - tx: ${hash}`)
  return await confirmTransaction(walletClient, hash, name, confirmations)
}
