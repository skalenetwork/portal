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

interface RecommendedAppsProps {
  skaleNetwork: types.SkaleNetwork
  chainsMeta: types.ChainsMetadataMap
  allApps: types.AppWithChainAndName[]
  currentApp?: types.AppWithChainAndName
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
  newApps,
  trendingApps,
  featuredApps = [],
  useCarousel = false,
  className,
  gray = false
}) => {
  const similarApps = useMemo(() => {
    return findSimilarApps(currentApp, allApps)
  }, [currentApp, allApps])

  if (similarApps.length === 0) return null

  const renderAppCard = (app: SimilarApp) => {
    return (
      <Box key={`${app.chain}-${app.appName}`} className={cls('fl-centered dappCard')}>
        <AppCardV2
          skaleNetwork={skaleNetwork}
          schainName={app.chain}
          appName={app.appName}
          chainsMeta={chainsMeta}
          isNew={isNewApp({ chain: app.chain, app: app.appName }, newApps)}
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
        <Grid key={`${app.chain}-${app.appName}`} size={{ xs: 12, sm: 6, md: 4, lg: 4 }}>
          {renderAppCard(app)}
        </Grid>
      ))}
    </Grid>
  )
}

export default React.memo(RecommendedApps)
