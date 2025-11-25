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
  const gridClasses = size === 'lg' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-3'

  const sortedSchains = [...schains].sort((a, b) => {
    const aliasA = metadata.getAlias(skaleNetwork, chainsMeta, a.name).toLowerCase()
    const aliasB = metadata.getAlias(skaleNetwork, chainsMeta, b.name).toLowerCase()
    return aliasA.localeCompare(aliasB)
  })

  return (
    <div className="mt-1">
      <Headline className="mb-2.5 mt-5" text={name} icon={icon} />
      <div className={`grid ${gridClasses} gap-4`}>
        {sortedSchains.map((schain) => (
          <div key={schain.name} className="col-span-1">
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
          </div>
        ))}
      </div>
    </div>
  )
}

export default ChainsSection
