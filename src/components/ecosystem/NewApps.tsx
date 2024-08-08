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
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

/**
 * @file NewApps.tsx
 * @copyright SKALE Labs 2024-Present
 */

import React from 'react'
import { Grid, Box } from '@mui/material'
import { cls } from '@skalenetwork/metaport'
import AppCard from './AppCardV2'
import Carousel from '../Carousel'
import { type types } from '@/core'

interface NewAppsProps {
  newApps: { chain: string; app: string; added: number }[]
  skaleNetwork: types.SkaleNetwork
  chainsMeta: types.ChainsMetadataMap
  useCarousel?: boolean
}

const NewApps: React.FC<NewAppsProps> = ({
  newApps,
  skaleNetwork,
  chainsMeta,
  useCarousel = false
}) => {
  const appCards = newApps.map((app) => (
    <Box key={`${app.chain}-${app.app}`} className={cls('fl-centered dappCard')}>
      <AppCard
        skaleNetwork={skaleNetwork}
        schainName={app.chain}
        appName={app.app}
        chainsMeta={chainsMeta}
      />
    </Box>
  ))

  if (useCarousel) {
    return <Carousel>{appCards}</Carousel>
  }

  return (
    <Grid container spacing={2}>
      {newApps.map((app) => (
        <Grid key={`${app.chain}-${app.app}`} item xs={12} sm={6} md={4} lg={4}>
          <Box className={cls('fl-centered dappCard')}>
            <AppCard
              skaleNetwork={skaleNetwork}
              schainName={app.chain}
              appName={app.app}
              chainsMeta={chainsMeta}
            />
          </Box>
        </Grid>
      ))}
    </Grid>
  )
}

export default NewApps
