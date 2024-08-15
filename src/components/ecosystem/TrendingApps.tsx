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

import React, { useMemo } from 'react'
import { type types } from '@/core'
import { useLikedApps } from '../../LikedAppsContext'
import AppCard from './AppCardV2'
import { Box, Grid } from '@mui/material'
import { cls } from '@skalenetwork/metaport'
import Carousel from '../Carousel'
import { MAX_APPS_DEFAULT } from '../../core/constants'

interface TrendingAppsProps {
  skaleNetwork: types.SkaleNetwork
  chainsMeta: types.ChainsMetadataMap
  useCarousel?: boolean
}

const TrendingApps: React.FC<TrendingAppsProps> = ({ skaleNetwork, chainsMeta, useCarousel }) => {
  const { appLikes } = useLikedApps()

  const trendingApps = useMemo(() => {
    return Object.entries(appLikes)
      .sort(([, likesA], [, likesB]) => likesB - likesA)
      .slice(0, MAX_APPS_DEFAULT)
      .map(([appId, likes]) => {
        const [chainName, appName] = appId.split('--')
        return { chainName, appName, likes }
      })
  }, [appLikes])

  const appCards = trendingApps.map(({ chainName, appName }) => (
    <Box key={`${chainName}-${appName}`} className={cls('fl-centered dappCard')}>
      <AppCard
        skaleNetwork={skaleNetwork}
        schainName={chainName}
        appName={appName}
        chainsMeta={chainsMeta}
      />
    </Box>
  ))

  if (useCarousel) return <Carousel>{appCards}</Carousel>

  return (
    <Grid container spacing={2}>
      {trendingApps.map(({ chainName, appName }) => (
        <Grid key={`${chainName}-${appName}`} item xs={12} sm={6} md={4} lg={4}>
          <Box className={cls('fl-centered dappCard')}>
            <AppCard
              skaleNetwork={skaleNetwork}
              schainName={chainName}
              appName={appName}
              chainsMeta={chainsMeta}
            />
          </Box>
        </Grid>
      ))}
    </Grid>
  )
}

export default TrendingApps
