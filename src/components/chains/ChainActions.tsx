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
import { Button } from '@mui/material'
import { explorer } from '@skalenetwork/metaport'
import { type types } from '@/core'
import { Blocks, Globe } from 'lucide-react'

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
  const explorerUrl = explorer.getExplorerUrl(chainMeta, skaleNetwork, schainName)

  return (
    <div className={`flex items-center mt-2.5 ${className}`}>
      {chainMeta && chainMeta.url && (
        <Button
          size="small"
          href={chainMeta.url}
          target="_blank"
          rel="noopener noreferrer"
          startIcon={<Globe size={17} className="text-foreground" />}
          className="font-sans! shadow-xs! border! border-accent-foreground/5! bg-secondary-foreground/10! py-2! px-3! capitalize! text-foreground! font-semibold! text-xs! mr-2! ease-in-out transition-transform duration-150 active:scale-[0.97] hover:scale-[1.02]"
        >
          Website
        </Button>
      )}
      <Button
        size="small"
        href={explorerUrl}
        target="_blank"
        rel="noopener noreferrer"
        startIcon={<Blocks size={17} className="text-foreground" />}
        className="font-sans! shadow-xs! border! border-accent-foreground/5! bg-secondary-foreground/10! py-2! px-3! capitalize! text-foreground! font-semibold! text-xs! mr-2! ease-in-out transition-transform duration-150 active:scale-[0.97] hover:scale-[1.02]"
      >
        Explorer
      </Button>
    </div>
  )
}

export default ChainActions
