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

import { isHexString, getNumber, randomBytes, keccak256, toBeHex, toBigInt } from 'ethers'
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
  ): Promise<any> {
    let address = from
    nonce = isHexString(nonce) ? getNumber(nonce) : (nonce as number)
    gas = isHexString(gas) ? getNumber(gas) : (gas as number)
    return await this.mineFreeGas(gas as number, address, nonce as number)
  }

  public async mineFreeGas(gasAmount: number, address: string, nonce: number): Promise<BigInt> {
    let nonceHash = toBigInt(keccak256(toBeHex(nonce, 32)))
    let addressHash = toBigInt(keccak256(address))
    let nonceAddressXOR = nonceHash ^ addressHash
    let divConstant = MAX_NUMBER / this.difficulty
    let candidate: Uint8Array
    let iterations = 0
    const start = performance.now()
    while (true) {
      candidate = randomBytes(32)
      let candidateHash = toBigInt(keccak256(candidate))
      let resultHash = nonceAddressXOR ^ candidateHash
      let externalGas = divConstant / resultHash
      if (externalGas >= gasAmount) {
        break
      }
      // every 2k iterations, yield to the event loop
      if (iterations++ % 2_000 === 0) {
        await new Promise<void>((resolve) => setTimeout(resolve, 0))
      }
    }
    const end = performance.now()
    console.log(`PoW execution time: ${end - start} ms`)
    return toBigInt(candidate)
  }
}
