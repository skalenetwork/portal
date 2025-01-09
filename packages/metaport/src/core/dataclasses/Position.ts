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
 * @file Position.ts
 * @copyright SKALE Labs 2022-Present
 */

import { DEFAULT_MP_MARGIN } from '../constants'

export interface Position {
  top: string
  right: string
  bottom: string
  left: string
}

export interface PositionMap {
  [positionName: string]: Position
}

export const Positions: PositionMap = {
  topLeft: { top: DEFAULT_MP_MARGIN, left: DEFAULT_MP_MARGIN, right: 'auto', bottom: 'auto' },
  topRight: { top: DEFAULT_MP_MARGIN, left: 'auto', right: DEFAULT_MP_MARGIN, bottom: 'auto' },
  bottomRight: { top: 'auto', left: 'auto', right: DEFAULT_MP_MARGIN, bottom: DEFAULT_MP_MARGIN },
  bottomLeft: { top: 'auto', left: DEFAULT_MP_MARGIN, right: 'auto', bottom: DEFAULT_MP_MARGIN }
}
