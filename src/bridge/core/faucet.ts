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

import { createPublicClient, createWalletClient, encodeAbiParameters, http, type Hash, type Hex } from 'viem'
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts'
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

export function getFuncData(chainName: string, address: string, skaleNetwork: types.SkaleNetwork) {
  const functionParam = encodeAbiParameters(
    [{ type: 'address' }],
    [address as types.AddressType]
  )
  return {
    to: getAddress(chainName, skaleNetwork) as types.AddressType,
    data: (getFunc(chainName, skaleNetwork) + functionParam.slice(2)) as Hex
  }
}

export async function getSFuel(
  chainName: string,
  address: types.AddressType,
  mpc: MetaportCore
): Promise<Hash> {
  const transport = http(mpc.endpoint(chainName))
  const account = privateKeyToAccount(generatePrivateKey())
  const nonce = await createPublicClient({ transport }).getTransactionCount({
    address: account.address
  })
  const gasPrice = await new SkalePowMiner().mineGasForTransaction(nonce, 1000000, account.address)
  const { to, data } = getFuncData(chainName, address, mpc.config.skaleNetwork)
  return await createWalletClient({ account, transport }).sendTransaction({
    chain: null,
    to,
    data,
    nonce,
    gasPrice
  })
}
