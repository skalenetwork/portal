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
import { Button, Grid } from '@mui/material'
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded'
import { cls, cmn, SkPaper } from '@skalenetwork/metaport'
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
      <Grid
        key={`${app.appName}-${app.chain}`}
        className={cls('fl-centered dappCard')}
        item
        lg={4}
        md={4}
        sm={6}
        xs={12}
      >
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
      </Grid>
    )
  })

  if (appCards.length === 0)
    return (
      <SkPaper gray className="titleSection">
        <div className={cls(cmn.mtop20, cmn.mbott20)}>
          <p className={cls(cmn.p, cmn.p3, cmn.pSec, cmn.pCent)}>
            {props.filteredApps.length === 0
              ? "You don't have any favorites yet"
              : '🚫 No favorite apps match your current filters'}
          </p>
          {props.useCarousel && (
            <div className={cls(cmn.flex)}>
              <div className={cls(cmn.flex, cmn.flexg)}></div>
              <div className={cls(cmn.flex)}>
                <Link to="/ecosystem">
                  <Button
                    startIcon={<GridViewRoundedIcon />}
                    variant="contained"
                    className={cls(cmn.pCent, cmn.mtop10, cmn.flex, 'btn')}
                  >
                    Explore dApps
                  </Button>
                </Link>
              </div>
              <div className={cls(cmn.flex, cmn.flexg)}></div>
            </div>
          )}
        </div>
      </SkPaper>
    )

  if (props.useCarousel) {
    return <Carousel>{appCards}</Carousel>
  }

  return (
    <Grid container spacing={2}>
      {appCards}
    </Grid>
  )
}
