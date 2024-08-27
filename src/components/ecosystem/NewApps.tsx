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
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */
/**
 * @file NewApps.tsx
 * @copyright SKALE Labs 2024-Present
 */

import React, { useMemo } from 'react'
import { Grid, Box } from '@mui/material'
import { cls, cmn, SkPaper } from '@skalenetwork/metaport'
import AppCard from './AppCardV2'
import Carousel from '../Carousel'
import { type types } from '@/core'
import { useLikedApps } from '../../LikedAppsContext'

interface NewAppsProps {
  newApps: types.AppWithChainAndName[]
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
  const { getTrendingApps, getAppId, getTrendingRank } = useLikedApps()
  const trendingAppIds = useMemo(() => getTrendingApps(), [getTrendingApps])

  const renderAppCard = (app: types.AppWithChainAndName) => {
    const appId = getAppId(app.chain, app.appName)
    return (
      <AppCard
        key={`${app.chain}-${app.appName}`}
        skaleNetwork={skaleNetwork}
        schainName={app.chain}
        appName={app.appName}
        chainsMeta={chainsMeta}
        trending={getTrendingRank(trendingAppIds, appId)}
      />
    )
  }

  if (useCarousel) {
    return <Carousel>{newApps.map(renderAppCard)}</Carousel>
  }

  if (newApps.length === 0) {
    return (
      <SkPaper gray className="titleSection">
        <div className={cls(cmn.mtop20, cmn.mbott20)}>
          <p className={cls(cmn.p, cmn.p3, cmn.pSec, cmn.pCent)}>
            No new apps match your current filters
          </p>
        </div>
      </SkPaper>
    )
  }

  return (
    <Grid container spacing={2}>
      {newApps.map((app) => (
        <Grid key={`${app.chain}-${app.appName}`} item xs={12} sm={6} md={4} lg={4}>
          <Box className={cls('fl-centered dappCard')}>{renderAppCard(app)}</Box>
        </Grid>
      ))}
    </Grid>
  )
}

export default NewApps
