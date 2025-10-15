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
 * @file ChainsSection.tsx
 * @copyright SKALE Labs 2024-Present
 */

import React, { ReactElement } from 'react'
import { Grid } from '@mui/material'
import { cls, cmn } from '@skalenetwork/metaport'
import { type types, metadata } from '@/core'

import ChainCard from './ChainCard'
import Headline from '../Headline'

interface ChainsSectionProps {
  name: string
  schains: types.ISChain[]
  chainsMeta: types.ChainsMetadataMap
  metrics: types.IMetrics | null
  skaleNetwork: types.SkaleNetwork
  icon: ReactElement | undefined
  size?: 'md' | 'lg'
}

const ChainsSection: React.FC<ChainsSectionProps> = ({
  name,
  schains,
  chainsMeta,
  metrics,
  skaleNetwork,
  icon,
  size = 'md'
}) => {
  const gridSize = size === 'lg' ? { xs: 12, md: 6 } : { xs: 12, md: 4 }

  const sortedSchains = [...schains].sort((a, b) => {
    const aliasA = metadata.getAlias(chainsMeta, a.name).toLowerCase()
    const aliasB = metadata.getAlias(chainsMeta, b.name).toLowerCase()
    return aliasA.localeCompare(aliasB)
  })

  return (
    <div className={cls(cmn.mtop20)}>
      <Headline className={cls(cmn.mbott10, cmn.mtop5)} text={name} icon={icon} />
      <Grid container spacing={2}>
        {sortedSchains.map((schain) => (
          <Grid key={schain.name} size={gridSize}>
            <ChainCard
              skaleNetwork={skaleNetwork}
              schain={schain}
              chainsMeta={chainsMeta}
              transactions={
                metrics && metrics.metrics[schain.name] && metrics.metrics[schain.name].chain_stats
                  ? metrics.metrics[schain.name].chain_stats.transactions_today
                  : null
              }
            />
          </Grid>
        ))}
      </Grid>
    </div>
  )
}

export default ChainsSection
