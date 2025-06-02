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
import { cls, cmn, SkPaper } from '@skalenetwork/metaport'
import StarIcon from '@mui/icons-material/Star'
import { types, metadata } from '@/core'
import Logo from './Logo'

import Grid from '@mui/material/Grid'

export default function PopularActions(props: {
  skaleNetwork: types.SkaleNetwork
  chainsMeta: types.ChainsMetadataMap
  chainName: string
}) {
  const shortAlias = metadata.getChainShortAlias(props.chainsMeta, props.chainName)

  const chainMeta = props.chainsMeta[props.chainName]
  const description = chainMeta?.description || 'Description not available'

  const actions = metadata.getActions(props.chainsMeta, props.chainName)

  console.log(actions)
  console.log(props.chainName)

  if (!actions) {
    return null
  }

  return (
    <div>
      <div className={cls(cmn.ptop20, cmn.flex)}></div>
      <div className={cls(cmn.flex, cmn.flexcv, cmn.mbott20)}>
        <StarIcon color="primary" />
        Popular Actions
      </div>
      <div className={cls(cmn.flex, cmn.flexRow, cmn.flexcv)}>
        <Grid container spacing={2}>
          {actions.map((action) => (
            <Grid item xs={12} md={6}>
              <SkPaper gray className={cmn.n} key={action.text}>
                <Link
                  to={`/ecosystem/${shortAlias}/${action.app}`}
                  className={cls('br__tileLogo', 'br__tileIns', cmn.flex)}
                >
                  <div className={cls(cmn.flex, cmn.flexcv, cmn.m10)}>
                    <Logo
                      chainsMeta={props.chainsMeta}
                      skaleNetwork={props.skaleNetwork}
                      chainName={props.chainName}
                      appName={action.app}
                    />
                    <div>
                      <div className={cls(cmn.p3, 'shortP', cmn.pPrim, cmn.mleft10, cmn.mri10)}>
                        {action.text}
                      </div>
                      <div className={cls(cmn.p5, cmn.pSec, cmn.mri10, cmn.mleft10)}>
                        {description.split('.')[0]}.
                      </div>
                    </div>
                  </div>
                </Link>
              </SkPaper>
            </Grid>
          ))}
        </Grid>
      </div>
    </div>
  )
}
