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
 * @file ChainAppBtn.ts
 * @copyright SKALE Labs 2024-Present
 */

import { Button } from '@mui/material'
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded'

import { cls, cmn, styles } from '../core/css'
import { SkaleNetwork } from '../core/interfaces'
import { getChainAlias } from '../core/metadata'

import ChainIcon from './ChainIcon'

export default function ChainAppBtn(props: {
  skaleNetwork: SkaleNetwork
  appName: string
  chainName: string
  handle?: (schainName: string, app?: string) => void
  size?: 'sm' | 'md'
  prim?: boolean
}) {
  const size = props.size ?? 'sm'
  const iconSize = props.size === 'sm' ? 'xs' : 'sm'
  const prim = props.prim ?? size === 'md'

  return (
    <Button
      key={props.appName}
      onClick={() => props.handle(props.chainName, props.appName)}
      size="small"
      color="inherit"
      className={cls([cmn.mleft10, size === 'sm'], [cmn.mleft20, size === 'md'], cmn.mbott5)}
    >
      <div
        className={cls(
          cmn.flex,
          cmn.flexcv,
          cmn.mri5,
          [cmn.mleft5, size === 'sm'],
          [cmn.mleft10, size === 'md'],
          [cmn.mbott5, size === 'sm'],
          [cmn.mtop5, size === 'sm'],
          [cmn.mbott10, size === 'md'],
          [cmn.mtop10, size === 'md']
        )}
      >
        <ChainIcon
          className={cls(cmn.mleft20d)}
          skaleNetwork={props.skaleNetwork}
          chainName={props.chainName}
          app={props.appName}
          size={iconSize}
        />
        <p
          className={cls(
            cmn.p,
            [cmn.p3, size === 'md'],
            [cmn.p4, size === 'sm'],
            [cmn.pSec, !prim],
            [cmn.pPrim, prim],
            cmn.p600,
            cmn.mleft10
          )}
        >
          {getChainAlias(props.skaleNetwork, props.chainName, props.appName)}
        </p>
        <div className={cls(cmn.flex, cmn.flexg)}></div>
        <KeyboardArrowRightRoundedIcon
          className={cls(
            cmn.pSec,
            [styles.chainIconxs, size === 'sm'],
            [styles.chainIcons, size === 'md'],
            [cmn.mleft5, size === 'md']
          )}
        />
      </div>
    </Button>
  )
}
