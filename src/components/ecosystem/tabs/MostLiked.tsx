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
 * @file MostLikedApps.tsx
 * @copyright SKALE Labs 2024-Present
 */

import React, { useMemo } from 'react'
import { type types } from '@/core'
import AppCard from '../AppCardV2'
import { Box, Grid } from '@mui/material'
import { cls, cmn, SkPaper } from '@skalenetwork/metaport'
import Carousel from '../../Carousel'
import { isNewApp, isTrending } from '../../../core/ecosystem/utils'
import { getAppMeta } from '../../../core/ecosystem/apps'

interface MostLikedAppsProps {
  skaleNetwork: types.SkaleNetwork
  chainsMeta: types.ChainsMetadataMap
  useCarousel?: boolean
  newApps: types.AppWithChainAndName[]
  filteredApps: types.AppWithChainAndName[]
  trendingApps: types.AppWithChainAndName[]
}

const MostLikedApps: React.FC<MostLikedAppsProps> = ({
  skaleNetwork,
  chainsMeta,
  useCarousel,
  newApps,
  filteredApps,
  trendingApps
}) => {
  const apps = useMemo(
    () => filteredApps.filter((app) => getAppMeta(chainsMeta, app.chain, app.appName)),
    [filteredApps, chainsMeta]
  )

  const renderAppCard = (app: types.AppWithChainAndName) => {
    const isNew = isNewApp({ chain: app.chain, app: app.appName }, newApps)
    return (
      <Box key={`${app.chain}-${app.appName}`} className={cls('fl-centered dappCard')}>
        <AppCard
          skaleNetwork={skaleNetwork}
          schainName={app.chain}
          appName={app.appName}
          chainsMeta={chainsMeta}
          isNew={isNew}
          mostLiked={1}
          trending={isTrending(trendingApps, app.chain, app.appName)}
        />
      </Box>
    )
  }

  if (apps.length === 0) {
    return (
      <SkPaper gray className="titleSection">
        <div className={cls(cmn.mtop20, cmn.mbott20)}>
          <p className={cls(cmn.p, cmn.p3, cmn.pSec, cmn.pCent)}>
            No trending apps match your current filters
          </p>
        </div>
      </SkPaper>
    )
  }

  if (useCarousel) {
    return <Carousel>{apps.map(renderAppCard)}</Carousel>
  }

  return (
    <Grid container spacing={2}>
      {apps.map((app) => (
        <Grid key={`${app.chain}-${app.appName}`} item xs={12} sm={6} md={4} lg={4}>
          {renderAppCard(app)}
        </Grid>
      ))}
    </Grid>
  )
}

export default React.memo(MostLikedApps)
