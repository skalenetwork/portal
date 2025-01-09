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
 * @file helper.ts
 * @copyright SKALE Labs 2022-Present
 */

import { TokenData } from '../dataclasses/TokenData'
import * as interfaces from '../interfaces/index'

import { eqArrays } from '../helper'

export function getEmptyTokenDataMap(): interfaces.TokenDataTypesMap {
  return { eth: {}, erc20: {}, erc721: {}, erc721meta: {}, erc1155: {} }
}

export function getAvailableTokenNumers(availableTokens): number[] {
  return Object.entries(availableTokens).map(([_key, value]) => Object.entries(value).length)
}

export function getAvailableTokensTotal(availableTokens): number {
  return getAvailableTokenNumers(availableTokens).reduce((a, b) => a + b, 0)
}

export function getDefaultToken(availableTokens: interfaces.TokenDataTypesMap): TokenData {
  if (availableTokens === undefined) return
  const availableTokenNumers = getAvailableTokenNumers(availableTokens)
  // if (eqArrays(availableTokenNumers, [1, 0, 0, 0, 0])) return availableTokens.eth.eth;
  if (eqArrays(availableTokenNumers, [0, 1, 0, 0, 0])) {
    return Object.values(availableTokens.erc20)[0]
  }
  if (eqArrays(availableTokenNumers, [0, 0, 1, 0, 0])) {
    return Object.values(availableTokens.erc721)[0]
  }
  if (eqArrays(availableTokenNumers, [0, 0, 0, 1, 0])) {
    return Object.values(availableTokens.erc721meta)[0]
  }
  if (eqArrays(availableTokenNumers, [0, 0, 0, 0, 1])) {
    return Object.values(availableTokens.erc1155)[0]
  }
}
