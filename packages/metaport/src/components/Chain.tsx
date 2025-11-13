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

import { cls, cmn } from '../core/css'
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
  from?: boolean
}) {
  const size = props.size ?? 'sm'
  const prim = props.prim ?? true
  const chainsMeta = CHAINS_META[props.skaleNetwork]
  return (
    <div className={cls(cmn.flex, cmn.flexcv, cmn.m5)}>
      <ChainIcon
        skaleNetwork={props.skaleNetwork}
        chainName={props.chainName}
        app={props.app}
        size='md'
        chainsMeta={chainsMeta}
      />
      <div
        className={cls(
          cmn.p,
          [cmn.mleft5, size === 'xs'],
          [cmn.mleft10, size === 'sm'],
          [cmn.mleft15, size === 'md'],
          [cmn.mleft20, size === 'lg'],
        )}
      >
        <p
          className={cls(
            cmn.p,
            [cmn.p5, size === 'xs'],
            [cmn.p5, size === 'sm'],
            [cmn.p4, size === 'md'],
            cmn.p500,
            cmn.pSec,
            cmn.pleft
          )}
        >
          {props.from ? 'From' : 'To'}
        </p>
        <p
          className={cls(
            cmn.p,
            [cmn.p4, size === 'xs'],
            [cmn.p3, size === 'sm'],
            [cmn.p2, size === 'md'],
            [cmn.p1, size === 'lg'],

            [cmn.p600, !props.bold],
            [cmn.p700, props.bold],
            cmn.cap,
            [cmn.pPrim, prim],
            [cmn.pSec, !prim]
          )}
        >
          {metadata.getAlias(props.skaleNetwork, chainsMeta, props.chainName, props.app)}
        </p>
      </div>

    </div>
  )
}
