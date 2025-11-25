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
import { Tooltip } from '@mui/material'
import TokenIcon from './TokenIcon'
import MetaportCore from '../core/metaport'

export default function TokenBalance(props: {
  balance: bigint
  symbol: string
  decimals?: number
  truncate?: number
  primary?: boolean
  size?: 'xs' | 'sm' | 'md'
  mpc?: MetaportCore
}) {
  if (props.balance === undefined || props.balance === null) return
  let balanceFull = units.formatBalance(props.balance, props.decimals)
  let balance = balanceFull
  if (props.truncate) {
    balance = units.truncateDecimals(balanceFull, props.truncate)
  }
  let size = props.size ?? 'xs'
  let iconUrl = undefined
  if (props.mpc !== undefined) {
    iconUrl = props.mpc.config.tokens[props.symbol.toLowerCase()]?.iconUrl
  }
  return (
    <Tooltip arrow title={balanceFull + ' ' + props.symbol}>
      <p
        className={`
            ${size === 'xs' ? 'text-xs' : ''}
            ${size === 'sm' ? 'text-xs' : ''}
            ${size === 'md' ? 'text-base' : ''}
            ${!props.primary && 'text-muted-foreground!'}
            ${props.primary && 'text-foreground!'}
            flex items-center font-semibold
            bg-muted rounded-2xl p-2 pr-3.5
          `}
      >
        <div className="mr-1.5"></div>
        <span className='whitespace-nowrap'>
          {balance} {props.symbol}
        </span>
      </p>
    </Tooltip>
  )
}
