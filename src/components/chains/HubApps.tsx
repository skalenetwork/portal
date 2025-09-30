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
 * @file HubApps.tsx
 * @copyright SKALE Labs 2024-Present
 */

import { ReactElement } from 'react'
import { type types, helper } from '@/core'

import { Grid } from '@mui/material'

import AppCard from '../ecosystem/AppCard'

export default function HubApps(props: {
  skaleNetwork: types.SkaleNetwork
  schainName: string
  chainsMeta: types.ChainsMetadataMap
}) {
  const chainMeta = props.chainsMeta[props.schainName]
  const appCards: ReactElement[] = []

  if (!chainMeta.apps) return

  for (const appName in helper.sortObjectByKeys(chainMeta.apps)) {
    if (chainMeta.apps.hasOwnProperty(appName)) {
      appCards.push(
        <Grid key={appName} className="fl-centered dappCard" size={{ xs: 6, sm: 6, md: 4, lg: 3 }}>
          <AppCard
            skaleNetwork={props.skaleNetwork}
            schainName={props.schainName}
            appName={appName}
            chainsMeta={props.chainsMeta}
          />
        </Grid>
      )
    }
  }

  return (
    <Grid container spacing={2} style={{ marginTop: '-30px' }}>
      {appCards}
    </Grid>
  )
}
