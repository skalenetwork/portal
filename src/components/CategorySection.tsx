/**
 * @license
 * SKALE bridge-ui
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

/**
 * @file CategorySection.tsx
 * @copyright SKALE Labs 2022-Present
 */

import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'

import ChainCard from './ChainCard'
import { cls, cmn, interfaces, styles, getChainAlias } from '@skalenetwork/metaport'

import { CATEGORY_ICON } from './CategoryBadge'

export default function CategorySection(props: {
  schains: any
  category: string
  skaleNetwork: interfaces.SkaleNetwork
}) {
  if (!props.schains || props.schains.length === 0) return
  const schains = props.schains.sort((a: any[], b: any[]) => {
    const aliasA = getChainAlias(props.skaleNetwork, a[0])
    const aliasB = getChainAlias(props.skaleNetwork, b[0])
    return aliasA.localeCompare(aliasB)
  })
  return (
    <div>
      <div className={cls(cmn.flex, cmn.flexcv, cmn.mtop20, cmn.mbott20)}>
        <div className={cls(cmn.mri5, cmn.flexcv, cmn.flex, styles.chainIcons)}>
          {CATEGORY_ICON[props.category]}
        </div>
        <h3 className={cls(cmn.nom, cmn.cap)}>{props.category}</h3>
      </div>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={3}>
          {schains.map((schain: any[]) => (
            <Grid
              key={schain[0]}
              className="fl-centered dappCard"
              item
              lg={3}
              md={4}
              sm={6}
              xs={12}
            >
              <ChainCard skaleNetwork={props.skaleNetwork} schain={schain} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </div>
  )
}
