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
 * @file explorer.ts
 * @copyright SKALE Labs 2023-Present
 */

import { type types, endpoints, constants } from '@/core'

function getMainnetExplorerUrl(skaleNetwork: string) {
  return endpoints.MAINNET_EXPLORER_URLS[skaleNetwork]
}

function getSChainExplorerUrl(skaleNetwork: string) {
  return endpoints.BASE_EXPLORER_URLS[skaleNetwork]
}

export function getExplorerUrl(skaleNetwork: types.SkaleNetwork, chainName: string): string {
  if (chainName === constants.MAINNET_CHAIN_NAME) return getMainnetExplorerUrl(skaleNetwork)
  return constants.HTTPS_PREFIX + chainName + '.' + getSChainExplorerUrl(skaleNetwork)
}

export function getTxUrl(
  chainName: string,
  skaleNetwork: types.SkaleNetwork,
  txHash: string
): string {
  const explorerUrl = getExplorerUrl(skaleNetwork, chainName)
  return `${explorerUrl}/tx/${txHash}`
}

export function addressUrl(explorerUrl: string, address: string): string {
  return `${explorerUrl}/address/${address}`
}

export function getExplorerUrlForAddress(
  network: types.SkaleNetwork,
  chainName: string,
  address: string
): string {
  return addressUrl(getExplorerUrl(network, chainName), address)
}

export function getTotalAppCounters(
  countersArray: types.IAppCounters | null
): types.IAddressCounters | null {
  if (countersArray === null) return null
  const totalCounters: types.IAddressCounters = {
    gas_usage_count: '0',
    token_transfers_count: '0',
    transactions_count: '0',
    validations_count: '0',
    transactions_today: 0,
    transactions_last_7_days: 0,
    transactions_last_30_days: 0
  }
  for (const address in countersArray) {
    if (countersArray.hasOwnProperty(address)) {
      const addressCounters = countersArray[address as types.AddressType]
      if (addressCounters.gas_usage_count === undefined) continue
      totalCounters.gas_usage_count = (
        parseInt(totalCounters.gas_usage_count) + parseInt(addressCounters.gas_usage_count)
      ).toString()
      totalCounters.token_transfers_count = (
        parseInt(totalCounters.token_transfers_count) +
        parseInt(addressCounters.token_transfers_count)
      ).toString()
      totalCounters.transactions_count = (
        parseInt(totalCounters.transactions_count) + parseInt(addressCounters.transactions_count)
      ).toString()
      totalCounters.validations_count = (
        parseInt(totalCounters.validations_count) + parseInt(addressCounters.validations_count)
      ).toString()
      totalCounters.transactions_today += addressCounters.transactions_today
      totalCounters.transactions_last_7_days += addressCounters.transactions_last_7_days
      totalCounters.transactions_last_30_days += addressCounters.transactions_last_30_days
    }
  }
  return totalCounters
}

export function getTopAppsByTransactions(
  metrics: types.IMetricsChainMap,
  topN: number
): Array<types.IAppId> {
  let appsWithCounters = []
  for (let chain in metrics) {
    for (let app in metrics[chain].apps_counters) {
      let counters = getTotalAppCounters(metrics[chain].apps_counters[app])
      if (counters !== null) {
        appsWithCounters.push({
          app,
          chain,
          totalTransactions: Number(counters.transactions_count)
        })
      }
    }
  }
  appsWithCounters.sort((a, b) => b.totalTransactions - a.totalTransactions)
  return appsWithCounters.slice(0, topN)
}
