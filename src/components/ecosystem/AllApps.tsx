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
 * @file AllApps.tsx
 * @copyright SKALE Labs 2024-Present
 */

import React, { useMemo } from 'react'
import { Grid } from '@mui/material'
import { cls } from '@skalenetwork/metaport'
import { type types } from '@/core'
import AppCard from './AppCardV2'
import { AppWithChainAndName } from '../../core/ecosystem/apps'

interface AllAppsProps {
  apps: AppWithChainAndName[]
  skaleNetwork: types.SkaleNetwork
  chainsMeta: types.ChainsMetadataMap
  newApps: { chain: string; app: string; added: number }[]
}

const AllApps: React.FC<AllAppsProps> = React.memo(
  ({ apps, skaleNetwork, chainsMeta, newApps }) => {
    const memoizedApps = useMemo(() => {
      return apps.map((app) => (
        <Grid
          key={`${app.chain}-${app.appName}`}
          className={cls('fl-centered dappCard')}
          item
          lg={4}
          md={4}
          sm={6}
          xs={12}
        >
          <AppCard
            skaleNetwork={skaleNetwork}
            schainName={app.chain}
            appName={app.appName}
            chainsMeta={chainsMeta}
            newApps={newApps}
          />
        </Grid>
      ))
    }, [apps, skaleNetwork, chainsMeta, newApps])

    return (
      <Grid container spacing={2}>
        {memoizedApps}
      </Grid>
    )
  }
)

AllApps.displayName = 'AllApps'

export default AllApps
