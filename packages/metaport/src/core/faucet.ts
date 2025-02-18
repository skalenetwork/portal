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
 * @file faucet.ts
 * @copyright SKALE Labs 2023-Present
 */

import { Wallet, JsonRpcProvider, AbiCoder, TransactionResponse } from 'ethers'
import { type types, constants, FAUCET_DATA } from '@/core'
import SkalePowMiner from './miner'
import MetaportCore from './metaport'

function getAddress(chainName: string, skaleNetwork: types.SkaleNetwork) {
  if (!isFaucetAvailable(chainName, skaleNetwork)) return constants.ZERO_ADDRESS
  const faucet: { [x: string]: { [x: string]: string } } = FAUCET_DATA[skaleNetwork]
  return faucet[chainName].address
}

function getFunc(chainName: string, skaleNetwork: types.SkaleNetwork) {
  if (!isFaucetAvailable(chainName, skaleNetwork)) return constants.ZERO_FUNCSIG_FAUCET
  const faucet: { [x: string]: { [x: string]: string } } = FAUCET_DATA[skaleNetwork]
  return faucet[chainName].func
}

export function isFaucetAvailable(chainName: string, skaleNetwork: types.SkaleNetwork) {
  if (!FAUCET_DATA[skaleNetwork]) return false
  const keys = Object.keys(FAUCET_DATA[skaleNetwork])
  return keys.includes(chainName)
}

function getFuncData(chainName: string, address: string, skaleNetwork: types.SkaleNetwork) {
  const faucetAddress = getAddress(chainName, skaleNetwork)
  const functionSig = getFunc(chainName, skaleNetwork)
  const encoder = new AbiCoder()
  const functionParam = encoder.encode(['address'], [address])
  return { to: faucetAddress, data: functionSig + functionParam.slice(2) }
}

export async function getSFuel(
  chainName: string,
  address: types.AddressType,
  mpc: MetaportCore
): Promise<TransactionResponse> {
  const endpoint = mpc.endpoint(chainName)
  const miner = new SkalePowMiner()
  const provider = new JsonRpcProvider(endpoint)
  const wallet = Wallet.createRandom().connect(provider)
  let nonce: number = await wallet.getNonce()
  const mineFreeGasResult = await miner.mineGasForTransaction(nonce, 1000000, wallet.address)
  const { to, data } = getFuncData(chainName, address, mpc.config.skaleNetwork)
  return await wallet.sendTransaction({
    from: wallet.address,
    to,
    data,
    nonce,
    gasPrice: mineFreeGasResult
  })
}
