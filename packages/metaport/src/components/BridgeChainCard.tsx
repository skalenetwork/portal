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
  extractFirstSentence
} from '../utils/helper'
import { styles } from '../core/css'

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
  const mode = document.documentElement.classList.contains('dark') ? 'dark' : 'light'


  const backgroundColor = getChainCardBackgroundColor(skaleNetwork, disabled, chainsMeta, chainName, mode)
  const firstSentence = extractFirstSentence(chainDescription)

  const disabledText = props.from ? 'Destination chain' : 'Source chain'

  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'))

  const iconSize = isSmallScreen ? 'lg' : 'xl'

  return (
    <div onClick={disabled ? undefined : onClick} style={{ height: 287 }}>
      <SkPaper
        gray={disabled}
        className={`${'flex items-center justify-center mt-5'} ${!disabled ? 'cursor-pointer' : ''} ${disabled ? styles.disabledCard : ''} ${styles.fullHeight}`}
        background={backgroundColor}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, transparent 20%, rgba(0, 0, 0, 0.7) 100%)',
            borderRadius: 'inherit',
            pointerEvents: 'none'
          }}
        />
        <div className={`mb-2.5 mt-5 w-full ${styles.fullHeight}`} style={{ position: 'relative', zIndex: 1 }}>
          <div className="mb-2.5 mt-5 rounded-3xl">
            <div className="flex items-center mt-5"></div>
            <div className={`rounded-3xl flex items-center justify-center mt-5 ${styles.fullHeight}`}>
              <ChainIcon skaleNetwork={skaleNetwork} chainName={chainName} size={iconSize} chainsMeta={chainsMeta} bg={false} />
            </div>
          </div>

          <p className="text-primary font-semibold text-xl text-center">
            {metadata.getAlias(skaleNetwork, chainsMeta, chainName, undefined, true)}
          </p>

          {disabled && (
            <div className="flex items-center mt-2.5 mb-5">
              <div className="grow"></div>
              <SkPaper gray className="p-0">
                <p
                  className="text-xs font-semibold text-gray-400 mt-1.5 mb-1.5 ml-2.5 mr-2.5 truncate"
                >
                  {disabledText}
                </p>
              </SkPaper>
              <div className="grow"></div>
            </div>
          )}
          {!disabled && <p className="text-gray-400 text-xs text-center">{firstSentence}</p>}
        </div>
      </SkPaper>
    </div>
  )
}
