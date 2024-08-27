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
 * @file TrendingApps.tsx
 * @copyright SKALE Labs 2024-Present
 */

import React from 'react'
import { type types } from '@/core'
import { useLikedApps } from '../../LikedAppsContext'
import AppCard from './AppCardV2'
import { Box, Grid } from '@mui/material'
import { cls } from '@skalenetwork/metaport'
import Carousel from '../Carousel'
import { isNewApp } from '../../core/ecosystem/utils'
import { getAppMeta } from '../../core/ecosystem/apps'

interface TrendingAppsProps {
  skaleNetwork: types.SkaleNetwork
  chainsMeta: types.ChainsMetadataMap
  useCarousel?: boolean
  newApps: types.AppWithTimestamp[]
}

const TrendingApps: React.FC<TrendingAppsProps> = ({
  skaleNetwork,
  chainsMeta,
  useCarousel,
  newApps
}) => {
  const { getTrendingApps, getAppInfoById } = useLikedApps()
  const trendingAppIds = getTrendingApps()

  const appCards = trendingAppIds.map((appId) => {
    const { chain, app } = getAppInfoById(appId)
    return (
      <Box key={appId} className={cls('fl-centered dappCard')}>
        <AppCard
          skaleNetwork={skaleNetwork}
          schainName={chain}
          appName={app}
          chainsMeta={chainsMeta}
        />
      </Box>
    )
  })

  if (useCarousel) return <Carousel>{appCards}</Carousel>

  return (
    <Grid container spacing={2}>
      {trendingAppIds.map((appId) => {
        const { chain, app } = getAppInfoById(appId)
        const isNew = isNewApp({ chain, app }, newApps)
        if (!getAppMeta(chainsMeta, chain, app)) return null
        return (
          <Grid key={appId} item xs={12} sm={6} md={4} lg={4}>
            <Box className={cls('fl-centered dappCard')}>
              <AppCard
                skaleNetwork={skaleNetwork}
                schainName={chain}
                appName={app}
                chainsMeta={chainsMeta}
                isNew={isNew}
              />
            </Box>
          </Grid>
        )
      })}
    </Grid>
  )
}

export default TrendingApps
