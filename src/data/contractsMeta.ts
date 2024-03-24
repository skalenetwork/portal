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

import { type interfaces } from '@skalenetwork/metaport'

export const CONTRACTS_META: { [key in interfaces.SkaleNetwork]: any } = {
  mainnet: {
    auto: true
  },
  staging: {
    auto: false,
    manager: '',
    allocator: '',
    grants: null
  },
  legacy: {
    auto: true
  },
  regression: {
    auto: true
  },
  testnet: {
    auto: false,
    manager: '0x8d3D60BFD4c82B3043e5001b7B38B640A2F27CEb',
    allocator: '0xDC2F6568608C8dABe101914489A25b07567C96bC',
    grants: '0x3982411D90792aCDaCBa37b1fE2f23E4A3E97429'
  }
}
