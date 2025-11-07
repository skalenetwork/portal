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
 * @file FavoriteApps.tsx
 * @copyright SKALE Labs 2024-Present
 */

import { useMemo } from 'react'
import { types } from '@/core'
import { useLikedApps } from '../../../LikedAppsContext'
import AppCard from '../AppCardV2'
import Button from '@mui/material/Button'

import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded'
import { SkPaper } from '@skalenetwork/metaport'
import Carousel from '../../Carousel'
import ConnectWallet from '../../ConnectWallet'
import { Link } from 'react-router-dom'
import { isFeatured, isNewApp, isTrending } from '../../../core/ecosystem/utils'

export default function FavoriteApps(props: {
  skaleNetwork: types.SkaleNetwork
  chainsMeta: types.ChainsMetadataMap
  useCarousel?: boolean
  newApps: types.AppWithChainAndName[]
  filteredApps: types.AppWithChainAndName[]
  trendingApps: types.AppWithChainAndName[]
  featuredApps: types.AppWithChainAndName[]
  favoriteApps: types.AppWithChainAndName[]
  isSignedIn: boolean
  error: string | null
}) {
  const { getMostLikedApps, getAppId, getMostLikedRank } = useLikedApps()
  const mostLikedAppIds = useMemo(() => getMostLikedApps(), [getMostLikedApps])

  if (!props.isSignedIn) return <ConnectWallet customText="Sign in to see your favorite dApps" />
  if (props.error) return <div>Error: {props.error}</div>

  const appCards = props.filteredApps.map((app) => {
    const mostLikedRank = getMostLikedRank(mostLikedAppIds, getAppId(app.chain, app.appName))
    const isNew = isNewApp({ chain: app.chain, app: app.appName }, props.newApps)
    const isFeaturedApps = isFeatured({ chain: app.chain, app: app.appName }, props.featuredApps)

    return (
      <div key={`${app.appName}-${app.chain}`} className="col-span-1">
        <AppCard
          key={`${app.chain}-${app.appName}`}
          schainName={app.chain}
          appName={app.appName}
          skaleNetwork={props.skaleNetwork}
          chainsMeta={props.chainsMeta}
          isNew={isNew}
          mostLiked={mostLikedRank}
          trending={isTrending(props.trendingApps, app.chain, app.appName)}
          isFeatured={isFeaturedApps}
        />
      </div>
    )
  })
  if (appCards.length === 0)
    return (
      <SkPaper gray className="titleSection">
        <div className="mt-5 mb-5">
          <p className="text-base text-secondary text-center">
            {props.favoriteApps.length === 0
              ? "You don't have any favorites yet"
              : '🚫 No favorite apps match your current filters'}
          </p>
          {props.useCarousel && (
            <div className="flex">
              <div className="flex-grow"></div>
              <div className="flex">
                <Link to="/ecosystem">
                  <Button
                    startIcon={<GridViewRoundedIcon />}
                    variant="contained"
                    className="text-center mt-10 flex btn"
                  >
                    Explore dApps
                  </Button>
                </Link>
              </div>
              <div className="flex flex-grow"></div>
            </div>
          )}
        </div>
      </SkPaper>
    )

  if (props.useCarousel) {
    return <Carousel>{appCards}</Carousel>
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
      {appCards}
    </div>
  )
}
