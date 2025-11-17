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
 * @file ChainActions.tsx
 * @copyright SKALE Labs 2024-Present
 */

import React from 'react'
import { IconButton, Tooltip } from '@mui/material'
import { explorer } from '@skalenetwork/metaport'
import { type types } from '@/core'
import LanguageIcon from '@mui/icons-material/Language'
import ViewInArRoundedIcon from '@mui/icons-material/ViewInArRounded'

interface ChainActionsProps {
  chainMeta?: types.ChainMetadata
  schainName: string
  skaleNetwork: types.SkaleNetwork
  className?: string
}

const ChainActions: React.FC<ChainActionsProps> = ({
  chainMeta,
  schainName,
  skaleNetwork,
  className
}) => {
  const explorerUrl = explorer.getExplorerUrl(skaleNetwork, schainName)

  return (
    <div className={`flex items-center mt-2.5 ${className}`}>
      {
        chainMeta && chainMeta.url && (
          <Tooltip title="Website">
            <IconButton
              size="small"
              href={chainMeta.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary"
            >
              <LanguageIcon className="text-secondary-foreground/60" fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      }
      <Tooltip title="Block Explorer">
        <IconButton
          size="small"
          href={explorerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary"
        >
          <ViewInArRoundedIcon className="text-secondary-foreground/60" fontSize="small" />
        </IconButton>
      </Tooltip>
    </div >
  )
}

export default ChainActions
