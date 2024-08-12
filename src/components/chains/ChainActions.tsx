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
import { cls, cmn } from '@skalenetwork/metaport'
import { type types } from '@/core'
import LanguageIcon from '@mui/icons-material/Language'
import ViewInArRoundedIcon from '@mui/icons-material/ViewInArRounded'
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined'
import { getExplorerUrl } from '../../core/explorer'

interface ChainActionsProps {
  chainMeta: types.ChainMetadata
  schainName: string
  skaleNetwork: types.SkaleNetwork
  onConnectChain: () => void
  className?: string
}

const ChainActions: React.FC<ChainActionsProps> = ({
  chainMeta,
  schainName,
  skaleNetwork,
  onConnectChain,
  className
}) => {
  const explorerUrl = getExplorerUrl(skaleNetwork, schainName)
  const isMd = false

  return (
    <div className={cls(cmn.flex, cmn.flexcv, cmn.mtop10, className)}>
      {chainMeta.url && (
        <Tooltip title="Website">
          <IconButton
            size="small"
            href={chainMeta.url}
            target="_blank"
            rel="noopener noreferrer"
            className={cls([cmn.pPrim, isMd], ['bgBlack', isMd])}
          >
            <LanguageIcon className={cls(cmn.pSec)} fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
      <Tooltip title="Block Explorer">
        <IconButton
          size="small"
          href={explorerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cls([cmn.pPrim, isMd], ['bgBlack', isMd])}
        >
          <ViewInArRoundedIcon className={cls(cmn.pSec)} fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Connect to Chain">
        <IconButton
          size="small"
          onClick={() => onConnectChain()}
          className={cls([cmn.pPrim, isMd], ['bgBlack', isMd])}
        >
          <AddCircleOutlineOutlinedIcon className={cls(cmn.pSec)} fontSize="small" />
        </IconButton>
      </Tooltip>
    </div>
  )
}

export default ChainActions
