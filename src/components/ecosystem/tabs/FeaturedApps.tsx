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
 * @file FeaturedApps.tsx
 * @copyright SKALE Labs 2025-Present
 */

import React, { useMemo } from 'react'
import { Box, Button } from '@mui/material'
import { Link } from 'react-router-dom'
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded'
import { SkPaper } from '@skalenetwork/metaport'
import AppCard from '../AppCardV2'
import Carousel from '../../Carousel'
import { type types, metadata } from '@/core'
import { useLikedApps } from '../../../LikedAppsContext'
import { isTrending, isNewApp } from '../../../core/ecosystem/utils'

interface FeaturedAppsProps {
  featuredApps: types.AppWithChainAndName[]
  skaleNetwork: types.SkaleNetwork
  chainsMeta: types.ChainsMetadataMap
  trendingApps: types.AppWithChainAndName[]
  newApps: types.AppWithChainAndName[]
  useCarousel?: boolean
  gray?: boolean
  showSeeMoreButton?: boolean
  chainName?: string
}

const FeaturedApps: React.FC<FeaturedAppsProps> = ({
  featuredApps,
  skaleNetwork,
  chainsMeta,
  newApps,
  trendingApps,
  useCarousel = false,
  gray = true,
  showSeeMoreButton = false,
  chainName
}) => {
  const { getMostLikedApps, getAppId, getMostLikedRank } = useLikedApps()
  const trendingAppIds = useMemo(() => getMostLikedApps(), [getMostLikedApps])
  const filteredFeaturedApps = useMemo(() => {
    const filtered = featuredApps.filter((app) => {
      const chainData = chainsMeta[app.chain]?.apps?.[app.appName]
      return chainData?.featured === true
    })
    return filtered
  }, [featuredApps, chainsMeta])

  const renderAppCard = (app: types.AppWithChainAndName) => {
    const isNew = isNewApp({ chain: app.chain, app: app.appName }, newApps)
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
        isNew={isNew}
        isFeatured={true}
        gray={gray}
      />
    )
  }

  if (useCarousel) {
    return <Carousel>{featuredApps.map(renderAppCard)}</Carousel>
  }

  if (featuredApps.length === 0) {
    return (
      <SkPaper gray className="titleSection">
        <div className="mt-5 mb-5">
          <p className="text-base text-secondary cmn.pCent">
            🚫 No featured apps match your current filters
          </p>
        </div>
      </SkPaper>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
        {filteredFeaturedApps.map((app) => (
          <div key={`${app.chain}-${app.appName}`} className="col-span-1">
            <Box className="flex justify-center items-center h-full">{renderAppCard(app)}</Box>
          </div>
        ))}
      </div>
      {showSeeMoreButton &&
        chainName !== null &&
        chainName !== undefined &&
        chainName.trim() !== '' && (
          <Box className="flex flex-col mt-5">
            <Link
              to={`/ecosystem?search=${encodeURIComponent(metadata.getAlias(chainsMeta, chainName))}`}
              style={{ textDecoration: 'none' }}
            >
              <Button
                size="medium"
                startIcon={<AddCircleRoundedIcon />}
                className="btn-action pl-20 pr-20"
              >
                See more
              </Button>
            </Link>
          </Box>
        )}
    </>
  )
}

export default FeaturedApps
