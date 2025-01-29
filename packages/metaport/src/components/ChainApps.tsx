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
 * @file ChainApps.ts
 * @copyright SKALE Labs 2024-Present
 */

import { ReactElement, useState } from 'react'
import { types, metadata } from '@/core'
import { Button } from '@mui/material'
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded'
import RemoveCircleRoundedIcon from '@mui/icons-material/RemoveCircleRounded'

import { cls, cmn, styles } from '../core/css'

import ChainAppBtn from './ChainAppBtn'

import { sortObjectByKeys } from '../core/helper'
import { CHAINS_META } from '../core/metadata'

export default function ChainApps(props: {
  skaleNetwork: types.SkaleNetwork
  chainName: string
  handle?: (schainName: string, app?: string) => void
  size?: 'sm' | 'md'
  prim?: boolean
}) {
  const [show, setShow] = useState<boolean>(false)

  const chainsMeta = CHAINS_META[props.skaleNetwork]
  const apps = metadata.getChainApps(chainsMeta, props.chainName)
  if (!apps || !Object.keys(apps) || Object.keys(apps).length === 0) return <div></div>

  const size = props.size ?? 'sm'

  const appButtons: ReactElement[] = []

  for (const appName in sortObjectByKeys(apps)) {
    appButtons.push(
      <ChainAppBtn
        skaleNetwork={props.skaleNetwork}
        chainName={props.chainName}
        appName={appName}
        handle={props.handle}
        size={size}
        prim={props.prim}
        key={props.chainName + appName}
      />
    )
  }

  return (
    <div className={cls(styles.sk__chainApps, cmn.mri10, cmn.flex, cmn.flexcv)}>
      <div className={cls(cmn.mtop10, cmn.mbott10)}>
        {show ? appButtons : appButtons.length === 4 ? appButtons : appButtons.slice(0, 3)}
        {appButtons.length > 4 && (
          <Button
            onClick={() => {
              setShow(!show)
            }}
            size="small"
            className={cls([cmn.mleft10, size === 'sm'], [cmn.mleft20, size === 'md'], cmn.mbott5)}
          >
            <div
              className={cls(
                cmn.flex,
                cmn.flexcv,
                cmn.mri10,
                [cmn.mleft5, size === 'sm'],
                [cmn.mleft10, size === 'md'],
                [cmn.mbott5, size === 'sm'],
                [cmn.mtop5, size === 'sm'],
                [cmn.mbott10, size === 'md'],
                [cmn.mtop10, size === 'md']
              )}
            >
              {show ? (
                <RemoveCircleRoundedIcon
                  className={cls(
                    cmn.pPrim,
                    [styles.chainIconxs, size === 'sm'],
                    [styles.chainIconsm, size === 'md']
                  )}
                />
              ) : (
                <AddCircleRoundedIcon
                  className={cls(
                    cmn.pPrim,
                    [styles.chainIconxs, size === 'sm'],
                    [styles.chainIconsm, size === 'md']
                  )}
                />
              )}

              <p
                className={cls(
                  cmn.p,
                  [cmn.p3, size === 'md'],
                  [cmn.p4, size === 'sm'],
                  cmn.pPrim,
                  cmn.p600,
                  cmn.mleft10
                )}
              >
                Show {show ? 'less' : 'more'} apps
              </p>
            </div>
          </Button>
        )}
      </div>
    </div>
  )
}
