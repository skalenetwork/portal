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
 * @file paymaster.ts
 * @copyright SKALE Labs 2022-Present
 */

import { Contract, id } from 'ethers'
import { skaleContracts } from '@skalenetwork/skale-contracts-ethers-v6'
import { type types, contracts } from '@/core'

import MetaportCore from '../metaport'

export const DEFAULT_PAYMASTER_INFO: types.pm.PaymasterInfo = {
  maxReplenishmentPeriod: 0n,
  oneSklPrice: 0n,
  schainPricePerMonth: 0n,
  skaleToken: '',
  schain: {
    name: '',
    paidUntil: 0n
  }
}

export function getPaymasterChain(skaleNetwork: types.SkaleNetwork): string {
  return contracts.PAYMASTER_CONTRACTS[skaleNetwork].chain
}

export function getPaymasterAddress(skaleNetwork: types.SkaleNetwork): string {
  return contracts.PAYMASTER_CONTRACTS[skaleNetwork].address
}

export async function getPaymaster(mpc: MetaportCore): Promise<Contract> {
  const paymasterAddress = getPaymasterAddress(mpc.config.skaleNetwork)
  const paymasterChain = getPaymasterChain(mpc.config.skaleNetwork)
  const provider = mpc.provider(paymasterChain)

  const network = await skaleContracts.getNetworkByProvider(provider)
  const projectInstance = await network.getProject('paymaster')
  const instance = await projectInstance.getInstance(paymasterAddress)
  return (await instance.getContract('Paymaster')) as Contract
}

export async function getPaymasterInfo(
  paymaster: Contract,
  targetChainName: string,
  skaleNetwork: types.SkaleNetwork
): Promise<types.pm.PaymasterInfo> {
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
