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
 * @file HubsSection.tsx
 * @copyright SKALE Labs 2024-Present
 */

import { cls, cmn } from '@skalenetwork/metaport'
import { type types } from '@/core'

import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'

import HubCard from './HubCard'

export default function HubsSection(props: {
  schains: types.ISChain[]
  metrics: types.IMetrics | null
  category: string
  skaleNetwork: types.SkaleNetwork
  isXs: boolean
  chainsMeta: types.ChainsMetadataMap
}) {
  function getMaxLength(schain: string, chainsMeta: types.ChainsMetadataMap): number {
    return Object.keys(chainsMeta[schain].apps || {}).length
  }

  if (!props.schains || props.schains.length === 0) return
  props.schains.sort((chainA: any, chainB: any) => {
    const maxLengthA = getMaxLength(chainA.name, props.chainsMeta)
    const maxLengthB = getMaxLength(chainB.name, props.chainsMeta)
    return maxLengthB - maxLengthA
  })

  return (
    <div className={cls(cmn.mtop20)}>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          {props.schains.map((schain: types.ISChain) => (
            <Grid key={schain.name} className="fl-centered dappCard" item xs={12}>
              <HubCard
                isXs={props.isXs}
                skaleNetwork={props.skaleNetwork}
                schain={schain}
                metrics={props.metrics}
                chainsMeta={props.chainsMeta}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </div>
  )
}
