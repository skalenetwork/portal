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
 * @file bridge_balance.ts
 * @copyright SKALE Labs 2025-Present
 */

import { constants, type types } from '@/core'

export function getBridgeBalanceChains(config: types.mp.Config): string[] {
  const mainnetConnections = config.connections[constants.MAINNET_CHAIN_NAME]
  if (!mainnetConnections) return []
  const directChains = new Set<string>()
  for (const tokenType of Object.values(mainnetConnections)) {
    for (const token of Object.values(tokenType)) {
      if (!token.chains) continue
      for (const [chainName, chainConfig] of Object.entries(token.chains)) {
        if (!chainConfig.hub) {
          directChains.add(chainName)
        }
      }
    }
  }
  return Array.from(directChains)
}
