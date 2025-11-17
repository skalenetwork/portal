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
 * @file Chain.ts
 * @copyright SKALE Labs 2023-Present
 */

import { types, metadata } from '@/core'
import ChainIcon from './ChainIcon'

import { dec } from '../core/css'
import { CHAINS_META } from '../core/metadata'

export default function Chain(props: {
  skaleNetwork: types.SkaleNetwork
  chainName: string
  className?: string
  bold?: boolean
  app?: string
  size?: types.Size
  decIcon?: boolean
  prim?: boolean
}) {
  const size = props.size ?? 'sm'
  const prim = props.prim ?? true
  const chainsMeta = CHAINS_META[props.skaleNetwork]
  return (
    <div className="flex items-center">
      <ChainIcon
        skaleNetwork={props.skaleNetwork}
        chainName={props.chainName}
        app={props.app}
        size={props.decIcon ? dec(props.size) : props.size}
      />
      <p
        className={`
          ${size === 'xs' ? 'text-xs' : ''} 
          ${size === 'sm' ? 'text-sm' : ''} 
          ${size === 'md' ? 'text-base' : ''} 
          ${size === 'lg' ? 'text-xl' : ''}
          ${size === 'xs' ? 'ml-1.5' : ''} 
          ${size === 'sm' ? 'ml-2.5' : ''} 
          ${size === 'md' ? 'ml-4' : ''} 
          ${size === 'lg' ? 'ml-5' : ''}
          ${!props.bold ? 'font-semibold' : 'font-bold'}
          capitalize
          ${prim ? 'text-primary' : 'text-gray-400'}
        `}
      >
        {metadata.getAlias(chainsMeta, props.chainName, props.app)}
      </p>
    </div>
  )
}
