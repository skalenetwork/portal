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
 * @file RecommendedApps.tsx
 * @copyright SKALE Labs 2024-Present
 */

import React, { useMemo } from 'react'
import { Grid, Box } from '@mui/material'
import { cls } from '@skalenetwork/metaport'

import { type types } from '@/core'

import { isNewApp, isTrending, isFeatured } from '../../core/ecosystem/utils'
import { findSimilarApps, type SimilarApp } from '../../core/ecosystem/similarApps'

import AppCardV2 from './AppCardV2'
import Carousel from '../Carousel'
import { useLikedApps } from '../../LikedAppsContext'

interface RecommendedAppsProps {
  skaleNetwork: types.SkaleNetwork
  chainsMeta: types.ChainsMetadataMap
  allApps: types.AppWithChainAndName[]
  currentApp?: types.AppWithChainAndName
  favoriteApps?: types.AppWithChainAndName[]
  newApps: types.AppWithChainAndName[]
  trendingApps: types.AppWithChainAndName[]
  featuredApps?: types.AppWithChainAndName[]
  useCarousel?: boolean
  className?: string
  gray?: boolean
}

const RecommendedApps: React.FC<RecommendedAppsProps> = ({
  skaleNetwork,
  chainsMeta,
  allApps,
  currentApp,
  favoriteApps,
  newApps,
  trendingApps,
  featuredApps = [],
  useCarousel = false,
  className,
  gray = false
}) => {
  const { getMostLikedApps, getAppId, getMostLikedRank } = useLikedApps()
  const mostLikedAppIds = useMemo(() => getMostLikedApps(), [getMostLikedApps])

  const similarApps = useMemo(() => {
    return findSimilarApps(currentApp, allApps, favoriteApps)
  }, [currentApp, allApps, favoriteApps])

  if (similarApps.length === 0) return null

  const renderAppCard = (app: SimilarApp) => {
    const appId = getAppId(app.chain, app.appName)
    return (
      <Box key={`${app.chain}-${app.appName}`} className={cls('fl-centered dappCard')}>
        <AppCardV2
          skaleNetwork={skaleNetwork}
          schainName={app.chain}
          appName={app.appName}
          chainsMeta={chainsMeta}
          isNew={isNewApp({ chain: app.chain, app: app.appName }, newApps)}
          mostLiked={getMostLikedRank(mostLikedAppIds, appId)}
          trending={isTrending(trendingApps, app.chain, app.appName)}
          isFeatured={isFeatured({ chain: app.chain, app: app.appName }, featuredApps)}
          gray={gray}
        />
      </Box>
    )
  }
  if (useCarousel) {
    return <Carousel className={className}>{similarApps.map(renderAppCard)}</Carousel>
  }
  return (
    <Grid container spacing={2} className={className}>
      {similarApps.map((app) => (
        <Grid key={`${app.chain}-${app.appName}`} item xs={12} sm={6} md={4} lg={4}>
          {renderAppCard(app)}
        </Grid>
      ))}
    </Grid>
  )
}

export default React.memo(RecommendedApps)
