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
 * @file UserRecommendations.tsx
 * @copyright SKALE Labs 2024-Present
 */

import React from 'react'
import { cmn, cls } from '@skalenetwork/metaport'
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded'

import { type types } from '@/core'

import RecommendedApps from '../ecosystem/RecommendedApps'
import { useAuth } from '../../AuthContext'
import { useApps } from '../../useApps'
import Headline from '../Headline'

const UserRecommendations: React.FC<{
  skaleNetwork: types.SkaleNetwork
  chainsMeta: types.ChainsMetadataMap
  metrics: types.IMetrics | null
}> = ({ skaleNetwork, chainsMeta, metrics }) => {
  const { isSignedIn } = useAuth()
  const { allApps, favoriteApps, newApps, trendingApps } = useApps(chainsMeta, metrics)

  const showRecommendations = isSignedIn && favoriteApps.length > 0
  if (!showRecommendations) return null

  return (
    <div className={cls(cmn.mbott10, cmn.mtop20, cmn.ptop20)}>
      <Headline
        className={cls(cmn.mbott10)}
        text="Recommended for you"
        icon={<AutoAwesomeRoundedIcon color="primary" />}
      />
      <RecommendedApps
        skaleNetwork={skaleNetwork}
        chainsMeta={chainsMeta}
        allApps={allApps}
        favoriteApps={favoriteApps}
        newApps={newApps}
        trendingApps={trendingApps}
        useCarousel={true}
        gray
      />
    </div>
  )
}

export default UserRecommendations
