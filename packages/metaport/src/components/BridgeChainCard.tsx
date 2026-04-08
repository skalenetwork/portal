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
 * @file BridgeChainCard.tsx
 * @copyright SKALE Labs 2025-Present
 */

import { type types, metadata } from '@/core'
import SkPaper from './SkPaper'

import ChainIcon from './ChainIcon'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import {
  getChainDescription,
  getChainCardBackgroundColor,
  getContrastTextColor,
  extractFirstSentence
} from '../utils/helper'
import { styles } from '../core/css'
import { useThemeMode } from './ThemeProvider'

interface ChainCardProps {
  skaleNetwork: types.SkaleNetwork
  chainName: string
  chainsMeta: types.ChainsMetadataMap
  onClick: () => void
  disabled: boolean
  from: boolean
}

export default function BridgeChainCard(props: ChainCardProps) {
  const { skaleNetwork, chainName, chainsMeta, onClick, disabled } = props
  const chainDescription = getChainDescription(skaleNetwork, chainsMeta, chainName)
  const { mode } = useThemeMode()

  const backgroundColor = getChainCardBackgroundColor(
    skaleNetwork,
    disabled,
    chainsMeta,
    chainName,
    mode
  )
  const firstSentence = extractFirstSentence(chainDescription)
  const descriptionColor = getContrastTextColor(backgroundColor)

  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'))

  const iconSize = isSmallScreen ? 'lg' : 'xl'

  return (
    <div
      onClick={disabled ? undefined : onClick}
      className={disabled ? '' : 'cursor-pointer transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]'}
      style={{ height: 297 }}
    >
      <SkPaper
        className={`${'flex items-center justify-center'} ${styles.fullHeight}`}
        background={backgroundColor}
      >
        <div
          className={`mb-2.5 mt-0 w-full ${styles.fullHeight}`}
          style={{ position: 'relative', zIndex: 1 }}
        >
          <div className="rounded-3xl">
            <div className="flex items-center mt-3"></div>
            <div
              className={`rounded-3xl flex items-center justify-center mt-0 ${styles.fullHeight}`}
            >
              <ChainIcon
                skaleNetwork={skaleNetwork}
                chainName={chainName}
                size={iconSize}
                chainsMeta={chainsMeta}
                bg={false}
              />
            </div>
          </div>
          <p className="text-foreground font-semibold text-xl text-center" style={{ color: descriptionColor }}>
            {metadata.getAlias(skaleNetwork, chainsMeta, chainName, undefined)}
          </p>
          <p className="font-medium p-2 text-xs text-center opacity-70!" style={{ color: descriptionColor }}>{firstSentence}</p>
        </div>
      </SkPaper>
    </div>
  )
}
