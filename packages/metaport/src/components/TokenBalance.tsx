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
import { cls, cmn, styles } from '../core/css'
import TokenIcon from './TokenIcon'
import { Tooltip } from '@mui/material'

export default function TokenBalance(props: {
  balance: bigint
  symbol: string
  decimals?: number
  truncate?: number
  primary?: boolean
  size?: 'xs' | 'sm' | 'md'
}) {
  if (props.balance === undefined || props.balance === null) return
  let balanceFull = units.formatBalance(props.balance, props.decimals)
  let balance = balanceFull
  if (props.truncate) {
    balance = units.truncateDecimals(balanceFull, props.truncate)
  }
  let size = props.size ?? 'xs'
  return (
    <Tooltip arrow title={balanceFull + ' ' + props.symbol}>
      <div className={cls(cmn.flex, cmn.flexcv, styles.paperGrey, cmn.padd5, cmn.pleft10, cmn.pri10, cmn.bordRad)}>
        <p
          className={cls(
            cmn.pLightGrey,
            [cmn.p3, size === 'xs'],
            [cmn.p3, size === 'sm'],
            [cmn.p2, size === 'md'],
            [cmn.pSec, !props.primary],
            [cmn.pPrim, props.primary],
            cmn.flex,
            cmn.flexcv,
            cmn.nom,
            cmn.mri5
          )}
        >
          <TokenIcon tokenSymbol={props.symbol} size='xs' />
          <div className={cls(cmn.mri5)}></div>
          {balance} {props.symbol}
        </p>
      </div>
    </Tooltip>
  )
}
