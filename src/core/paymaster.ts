/**
 * @license
 * SKALE portal
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
/**
 * @file constants.ts
 * @copyright SKALE Labs 2022-Present
 */

import { Contract, id, InterfaceAbi } from 'ethers'
import { MetaportCore, interfaces } from '@skalenetwork/metaport'
import PAYMASTER_INFO from '../data/paymaster'

export interface PaymasterInfo {
  maxReplenishmentPeriod: bigint
  oneSklPrice: bigint
  schainPricePerMonth: bigint
  skaleToken: string
  schain: {
    name: string
    paidUntil: bigint
  }
  effectiveTimestamp?: bigint
}

export type DueDateStatus = 'primary' | 'warning' | 'error' | 'success'

export const DEFAULT_PAYMASTER_INFO: PaymasterInfo = {
  maxReplenishmentPeriod: 0n,
  oneSklPrice: 0n,
  schainPricePerMonth: 0n,
  skaleToken: '',
  schain: {
    name: '',
    paidUntil: 0n
  }
}

export function divideBigInts(a: bigint, b: bigint): number {
  return Number((a * 10000n) / b) / 10000
}

export function getPaymasterChain(skaleNetwork: interfaces.SkaleNetwork): string {
  return PAYMASTER_INFO.networks[skaleNetwork].chain
}

export function getPaymasterAddress(skaleNetwork: interfaces.SkaleNetwork): string {
  return PAYMASTER_INFO.networks[skaleNetwork].address
}

export function getPaymasterAbi(): InterfaceAbi {
  return PAYMASTER_INFO.abi
}

export function initPaymaster(mpc: MetaportCore): Contract {
  const network = mpc.config.skaleNetwork
  const paymasterAddress = getPaymasterAddress(network)
  const paymasterChain = getPaymasterChain(network)
  const provider = mpc.provider(paymasterChain)
  return new Contract(paymasterAddress, getPaymasterAbi(), provider)
}

export async function getPaymasterInfo(
  paymaster: Contract,
  targetChainName: string,
  skaleNetwork: interfaces.SkaleNetwork
): Promise<PaymasterInfo> {
  const rawData = await Promise.all([
    paymaster.maxReplenishmentPeriod(),
    paymaster.oneSklPrice(),
    paymaster.schainPricePerMonth(),
    paymaster.skaleToken(),
    paymaster.schains(id(targetChainName))
  ])

  let effectiveTimestamp
  if (skaleNetwork === 'legacy') {
    effectiveTimestamp = await paymaster.effectiveTimestamp()
  }

  return {
    maxReplenishmentPeriod: rawData[0],
    oneSklPrice: rawData[1],
    schainPricePerMonth: rawData[2],
    skaleToken: rawData[3],
    schain: {
      name: rawData[4][1],
      paidUntil: rawData[4][2]
    },
    effectiveTimestamp
  }
}

export function truncateDecimals(input: string, numDecimals: number): string {
  const delimiter = input.includes(',') ? ',' : '.'
  const [integerPart, decimalPart = ''] = input.split(delimiter)
  return `${integerPart}${delimiter}${decimalPart.slice(0, numDecimals)}`
}
