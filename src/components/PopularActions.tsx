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
 * MERCHANTABILITY and FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

/**
 * @file PopularActions.tsx
 * @copyright SKALE Labs 2025-Present
 */

import { Link } from 'react-router-dom'
import Grid from '@mui/material/Grid'
import StarIcon from '@mui/icons-material/Star'

import { cls, cmn, SkPaper } from '@skalenetwork/metaport'
import { types, metadata } from '@/core'

import Logo from './Logo'

export default function PopularActions(props: {
  skaleNetwork: types.SkaleNetwork
  chainsMeta: types.ChainsMetadataMap
  chainName: string
}) {
  const shortAlias = metadata.getChainShortAlias(props.chainsMeta, props.chainName)

  const chainMeta = props.chainsMeta[props.chainName]

  const actions = metadata.getActions(props.chainsMeta, props.chainName)

  if (!actions) {
    return null
  }

  const getActionDescription = (action: types.ChainAction) => {
    if (action.description) {
      return action.description.split('.')[0] + '.'
    }

    const appMeta = chainMeta?.apps?.[action.app]
    const appDescription = appMeta?.description || 'Description not available'
    return appDescription.split('.')[0] + '.'
  }

  return (
    <div>
      <div className={cls(cmn.ptop20, cmn.flex)}></div>
      <div className={cls(cmn.flex, cmn.flexcv, cmn.mbott10, cmn.p, cmn.p600, cmn.pSec)}>
        <StarIcon color="primary" className={cls(cmn.mri10)} />
        Popular Actions
      </div>
      <div className={cls(cmn.flex, cmn.flexRow, cmn.flexcv)}>
        <Grid container spacing={2}>
          {actions.map((action) => (
            <Grid size={{ xs: 12, md: 6 }}>
              <Link
                to={
                  chainMeta.apps?.[action.app].social?.website ||
                  `/ecosystem/${shortAlias}/${action.app}`
                }
                className={cls(cmn.flex, cmn.fullWidth)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <SkPaper gray className={cls(cmn.fullWidth, 'hoverable')} key={action.text}>
                  <div className={cls(cmn.flex, cmn.flexcv)}>
                    <Logo
                      chainsMeta={props.chainsMeta}
                      skaleNetwork={props.skaleNetwork}
                      chainName={props.chainName}
                      appName={action.app}
                    />
                    <div>
                      <div
                        className={cls(
                          text-sm,
                          'shortP',
                          cmn.p700,
                          cmn.pPrim,
                          cmn.mleft10,
                          cmn.mri10
                        )}
                      >
                        {action.text}
                      </div>
                      <div className={cls(text-xs, cmn.pSec, cmn.mri10, cmn.mleft10)}>
                        {getActionDescription(action)}
                      </div>
                    </div>
                  </div>
                </SkPaper>
              </Link>
            </Grid>
          ))}
        </Grid>
      </div>
    </div>
  )
}
