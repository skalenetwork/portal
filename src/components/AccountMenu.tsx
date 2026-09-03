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
 * @file AccountMenu.tsx
 * @copyright SKALE Labs 2023-Present
 */

import Box from '@mui/material/Box'
import Button from '@/ui/Button'
import { openWallet } from '@/bridge'
import Tooltip from '@mui/material/Tooltip'
import { Wallet } from 'lucide-react'

import { helper } from '@/core'
import Avatar from 'boring-avatars'
import { AVATAR_COLORS } from '@/ui'

export default function AccountMenu(props: any) {
  const { openProfileModal } = props

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
      {!props.address ? (
        <Tooltip arrow title="Click to connect wallet">
          <div>
            <Button
              size="none"
              variant="secondary"
              onClick={() => openWallet()}
              className="flex h-9 px-3 items-center bg-card! text-xs! normal-case! rounded-full min-w-0!"
            >
              <Wallet size={16} className="mr-1.5" />
              Connect <span className="hidden md:inline! ml-1">wallet</span>
            </Button>
          </div>
        </Tooltip>
      ) : (
        <Tooltip arrow title="Click to open wallet details">
          <Button
            size="none"
            variant="secondary"
            onClick={openProfileModal}
            className="flex h-9 px-3 items-center bg-card! text-xs! normal-case! rounded-full min-w-0!"
          >
            <div className="mr-1.5 flex">
              <Avatar variant="marble" name={props.address} colors={AVATAR_COLORS} size={20} />
            </div>
            {helper.shortAddress(props.address)}
          </Button>
        </Tooltip>
      )}
    </Box>
  )
}
