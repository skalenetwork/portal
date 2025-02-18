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
 * @file TokenBalance.ts
 * @copyright SKALE Labs 2023-Present
 */

import { units } from '@/core'
import { cls, cmn } from '../core/css'

export default function TokenBalance(props: {
  balance: bigint
  symbol: string
  decimals?: number
  truncate?: number
  primary?: boolean
  size?: 'xs' | 'sm'
}) {
  if (props.balance === undefined || props.balance === null) return
  let balance = units.formatBalance(props.balance, props.decimals)
  if (props.truncate) {
    balance = units.truncateDecimals(balance, props.truncate)
  }
  let size = props.size ?? 'xs'
  return (
    <div className={cls(cmn.flex, cmn.flexcv)}>
      <p
        className={cls(
          cmn.p,
          [cmn.p4, size === 'xs'],
          [cmn.p3, size === 'sm'],
          [cmn.pSec, !props.primary],
          [cmn.pPrim, props.primary],
          cmn.flex,
          cmn.flexcv,
          cmn.mri5
        )}
      >
        {balance} {props.symbol}
      </p>
    </div>
  )
}
