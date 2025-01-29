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
import { types, constants } from '@/core'

const log = new Logger<ILogObj>({ name: 'metaport:core:transactions' })

export async function sendTransaction(
  signer: Signer,
  func: ContractMethod,
  args: any[],
  name: string
): Promise<types.mp.TxResponse> {
  log.info('💡 Sending transaction: ' + name);
  try {
    const tx = await func.populateTransaction(...args)
    const response: TransactionResponse = await signer.sendTransaction(tx)
    log.info(`⏳ ${name} mining - tx: ${response.hash}, nonce: ${response.nonce}, gasLimit: ${response.gasLimit}`);
    await response.wait()
    log.info('✅ ' + name + ' mined - tx: ' + response.hash);
    return { status: true, err: undefined, response: response }
  } catch (err) {
    console.error(err)
    const msg = err.message
    let name
    if (err.code && err.code === 'ACTION_REJECTED') {
      name = 'Transaction signing was rejected'
    } else {
      name = constants.TRANSACTION_ERROR_MSG
    }
    const revertMsg = parseErrorMessage(err.message)
    if (revertMsg) name = revertMsg
    if (err.info && err.info.error && err.info.error.data && err.info.error.data.message) {
      name = err.info.error.data.message
    }
    if (err.shortMessage) {
      name = err.shortMessage
    }
    return { status: false, err: { name, msg }, response: undefined }
  }
}

function parseErrorMessage(input: string | undefined): string | null {
  if (!input) return null
  const startDelimiter = 'execution reverted: "'
  const endDelimiter = '"'
  const startIndex = input.indexOf(startDelimiter)
  if (startIndex === -1) return null
  const endIndex = input.indexOf(endDelimiter, startIndex + startDelimiter.length)
  if (endIndex === -1) return null
  return input.substring(startIndex + startDelimiter.length, endIndex)
}
