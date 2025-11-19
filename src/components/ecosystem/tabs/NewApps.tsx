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

import React from 'react'
import { Box } from '@mui/material'
import { SkPaper } from '@skalenetwork/metaport'
import AppCard from '../AppCardV2'
import Carousel from '../../Carousel'
import { type types } from '@/core'
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
  const renderAppCard = (app: types.AppWithChainAndName) => {
    return (
      <AppCard
        key={`${app.chain}-${app.appName}`}
        skaleNetwork={skaleNetwork}
        schainName={app.chain}
        appName={app.appName}
        chainsMeta={chainsMeta}
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
        <div className="mt-5 mb-5">
          <p className="text-base text-secondary-foreground/60 text-center">
            🚫 No new apps match your current filters
          </p>
        </div>
      </SkPaper>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
      {newApps.map((app) => (
        <div key={`${app.chain}-${app.appName}`} className="col-span-1">
          <Box className="flex justify-center items-center h-full">{renderAppCard(app)}</Box>
        </div>
      ))}
    </div>
  )
}

export default NewApps
