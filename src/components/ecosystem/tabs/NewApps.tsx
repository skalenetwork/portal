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
import AppCard from '../AppCardV2'
import Carousel from '../../Carousel'
import { type types } from '@/core'
import { useLikedApps } from '../../../LikedAppsContext'
import { isTrending, isFeatured } from '../../../core/ecosystem/utils'

interface NewAppsProps {
  newApps: types.AppWithChainAndName[]
  skaleNetwork: types.SkaleNetwork
  chainsMeta: types.ChainsMetadataMap
  trendingApps: types.AppWithChainAndName[]
  featuredApps: types.AppWithChainAndName[]
  useCarousel?: boolean
}

const NewApps: React.FC<NewAppsProps> = ({
  newApps,
  skaleNetwork,
  chainsMeta,
  trendingApps,
  featuredApps,
  useCarousel = false
}) => {
  const { getMostLikedApps, getAppId, getMostLikedRank } = useLikedApps()
  const trendingAppIds = useMemo(() => getMostLikedApps(), [getMostLikedApps])

  const renderAppCard = (app: types.AppWithChainAndName) => {
    const appId = getAppId(app.chain, app.appName)
    return (
      <AppCard
        key={`${app.chain}-${app.appName}`}
        skaleNetwork={skaleNetwork}
        schainName={app.chain}
        appName={app.appName}
        chainsMeta={chainsMeta}
        mostLiked={getMostLikedRank(trendingAppIds, appId)}
        trending={isTrending(trendingApps, app.chain, app.appName)}
        isFeatured={isFeatured({ chain: app.chain, app: app.appName }, featuredApps)}
        isNew={true}
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
          <p className={cls(cmn.p, cmn.p2, cmn.pSec, cmn.pCent)}>
            🚫 No new apps match your current filters
          </p>
        </div>
      </SkPaper>
    )
  }

  return (
    <Grid container spacing={2}>
      {newApps.map((app) => (
        <Grid
          key={`${app.chain}-${app.appName}`}
          size={{ xs: 12, sm: 6, md: 4, lg: 4 }}
        >
          <Box className={cls('fl-centered dappCard')}>{renderAppCard(app)}</Box>
        </Grid>
      ))}
    </Grid>
  )
}

export default NewApps
