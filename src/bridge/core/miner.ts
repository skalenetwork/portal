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
 * @file miner.ts
 * @copyright SKALE Labs 2023-Present
 */

import { bytesToBigInt, hexToBigInt, isHex, keccak256, numberToHex, type Hex } from 'viem'
import { MAX_NUMBER } from './constants'

interface Params {
  difficulty?: bigint
}

export default class SkalePowMiner {
  public difficulty: bigint = 1n

  constructor(params?: Params) {
    if (params && params.difficulty) this.difficulty = params.difficulty
  }

  public async mineGasForTransaction(
    nonce: string | number,
    gas: string | number,
    from: string
  ): Promise<bigint> {
    return await this.mineFreeGas(
      isHex(gas) ? Number(hexToBigInt(gas)) : (gas as number),
      from,
      isHex(nonce) ? Number(hexToBigInt(nonce)) : (nonce as number)
    )
  }

  public async mineFreeGas(gasAmount: number, address: string, nonce: number): Promise<bigint> {
    const nonceHash = hexToBigInt(keccak256(numberToHex(nonce, { size: 32 })))
    const addressHash = hexToBigInt(keccak256(address as Hex))
    const nonceAddressXOR = nonceHash ^ addressHash
    const divConstant = MAX_NUMBER / this.difficulty
    let candidate: Uint8Array
    let iterations = 0
    while (true) {
      candidate = crypto.getRandomValues(new Uint8Array(32))
      const candidateHash = hexToBigInt(keccak256(candidate))
      const resultHash = nonceAddressXOR ^ candidateHash
      const externalGas = divConstant / resultHash
      if (externalGas >= gasAmount) break
      // every 2k iterations, yield to the event loop
      if (iterations++ % 2_000 === 0) {
        await new Promise<void>((resolve) => setTimeout(resolve, 0))
      }
    }
    return bytesToBigInt(candidate)
  }
}
