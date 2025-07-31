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
  * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
  * GNU Affero General Public License for more details.
  *
  * You should have received a copy of the GNU Affero General Public License
  * along with this program. If not, see <https://www.gnu.org/licenses/>.
  */
/**
 * @file SeeMoreButton.tsx
 * @copyright SKALE Labs 2025-Present
 */

import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@mui/material'
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded'
import { cls, cmn } from '@skalenetwork/metaport'
import { type types, metadata } from '@/core'

interface SeeMoreButtonProps {
  to?: string
  text?: string
  chainsMeta?: types.ChainsMetadataMap
  schainName?: string
  basePath?: string
}

const SeeMoreButton: React.FC<SeeMoreButtonProps> = ({ 
  to,
  text = "See more",
  chainsMeta,
  schainName,
  basePath = "/ecosystem"
}) => {
  const generateSearchParam = (shortAlias: string | undefined): string => {
    return shortAlias ? shortAlias.charAt(0).toUpperCase() + shortAlias.slice(1) : ''
  }

  const getNavigationPath = (): string => {
    if (to) {
      return to
    }
    
    if (chainsMeta && schainName) {
      const shortAlias = metadata.getChainShortAlias(chainsMeta, schainName)
      const searchParam = generateSearchParam(shortAlias)
      return searchParam ? `${basePath}?search=${searchParam}` : basePath
    }
    
    return basePath
  }
  return (
    <div className={cls(cmn.flex, cmn.mtop10, cmn.flexc, cmn.fullWidth)}>
      <Link to={getNavigationPath()}>
        <Button
          size="medium"
          color="secondary"
          variant="contained"
          className={cls('btn', cmn.mtop20, 'secondary', 'seeMoreButton')}
          startIcon={<AddCircleOutlineRoundedIcon />}
        >
          {text}
        </Button>
      </Link>
    </div>
  )
}

export default SeeMoreButton
