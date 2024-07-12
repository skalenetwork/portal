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
 * @file CategorySection.tsx
 * @copyright SKALE Labs 2022-Present
 */

import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'

import ChainCard from './ChainCard'
import { type interfaces, getChainAlias } from '@skalenetwork/metaport'
import { IMetrics, ISChain } from '../core/types'

export default function CategorySection(props: {
  schains: any
  category: string
  skaleNetwork: interfaces.SkaleNetwork
  chainsMeta: interfaces.ChainsMetadataMap
  metrics?: IMetrics | null
}) {
  if (!props.schains || props.schains.length === 0) return
  const schains = props.schains.sort((a: ISChain, b: ISChain) => {
    const aliasA = getChainAlias(props.skaleNetwork, a.name)
    const aliasB = getChainAlias(props.skaleNetwork, b.name)
    return aliasA.localeCompare(aliasB)
  })
  const isHub = props.category === 'hubs'
  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          {schains.map((schain: ISChain) => (
            <Grid
              key={schain.name}
              className="fl-centered dappCard"
              item
              lg={isHub ? 6 : 3}
              xs={isHub ? 12 : 6}
            >
              <ChainCard
                skaleNetwork={props.skaleNetwork}
                schain={schain}
                chainsMeta={props.chainsMeta}
                transactions={
                  props.metrics &&
                  props.metrics.metrics[schain.name] &&
                  props.metrics.metrics[schain.name].chain_stats
                    ? props.metrics.metrics[schain.name].chain_stats.transactions_today
                    : null
                }
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </div>
  )
}
