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
 * @file SourceSelector.tsx
 * @copyright SKALE Labs 2025-Present
 */

import { ButtonBase } from '@mui/material'
import { ChainIcon } from '@skalenetwork/metaport'
import { contracts, metadata, type types } from '@/core'

interface SourceSelectorProps {
  sources: contracts.CreditStationSource[]
  selectedId: string | undefined
  onSelect: (sourceId: string) => void
  skaleNetwork: types.SkaleNetwork
  chainsMeta: types.ChainsMetadataMap
  disabled?: boolean
}

export default function SourceSelector({
  sources,
  selectedId,
  onSelect,
  skaleNetwork,
  chainsMeta,
  disabled
}: SourceSelectorProps) {
  if (sources.length === 0) {
    return (
      <div className="rounded-full bg-card px-4 py-2 text-sm font-semibold text-muted-foreground">
        No sources
      </div>
    )
  }

  return (
    <div className="inline-flex items-center gap-1 rounded-full bg-background p-1">
      {sources.map((source) => {
        const isSelected = source.id === selectedId
        const alias =
          metadata.getAlias(skaleNetwork, chainsMeta, source.chainName, undefined, true) ||
          source.displayName
        return (
          <ButtonBase
            key={source.id}
            disabled={disabled}
            onClick={() => onSelect(source.id)}
            className={`rounded-full! min-w-[124px]! px-3.5! py-2.5! transition-all! ease-in-out! duration-150! active:scale-[0.97]! ${isSelected
                ? 'bg-accent-foreground! text-accent!'
                : 'hover:bg-muted-foreground/10! text-foreground!'
              }`}
          >
            <div className="flex items-center gap-2">
              <ChainIcon chainName={source.chainName} skaleNetwork={skaleNetwork} size="xs" />
              <span
                className={`font-bold text-sm ${isSelected ? 'text-accent' : 'text-foreground'
                  }`}
              >
                {alias}
              </span>
            </div>
          </ButtonBase>
        )
      })}
    </div>
  )
}
