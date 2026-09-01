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

import { type TransactionResponse, type ContractMethod, type Signer } from 'ethers'
import { Logger, type ILogObj } from 'tslog'
import { types } from '@/core'

const log = new Logger<ILogObj>({ name: 'metaport:core:transactions' })

export async function sendTransaction(
  signer: Signer,
  func: ContractMethod,
  args: any[],
  name: string,
  confirmations = 1,
  value?: bigint
): Promise<types.mp.TxResponse> {
  log.info('💡 Sending transaction: ' + name)
  const tx = await func.populateTransaction(...args)
  if (value !== undefined) {
    tx.value = value
  }
  const response: TransactionResponse = await signer.sendTransaction(tx)
  log.info(
    `⏳ ${name} mining - tx: ${response.hash}, nonce: ${response.nonce}, gasLimit: ${response.gasLimit}`
  )
  await response.wait(confirmations)
  log.info('✅ ' + name + ' mined - tx: ' + response.hash)
  return { response }
}
