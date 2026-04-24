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
 * @file BridgeMenu.tsx
 * @copyright SKALE Labs 2025-Present
 */

import { useState, type MouseEvent } from 'react'
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'

import { Link } from 'react-router-dom'
import { ArrowLeft, EllipsisVertical, History, Wallet } from 'lucide-react'

type BridgePage = 'bridge' | 'history' | 'balance'

export default function BridgeMenu({ currentPage = 'bridge' }: { currentPage?: BridgePage }) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const showBackButton = currentPage !== 'bridge'

  return (
    <div className="flex items-center gap-1.5">
      {showBackButton && (
        <Tooltip arrow title="Back to Bridge">
          <IconButton
            component={Link}
            to="/bridge"
            className="h-9 w-9 rounded-full bg-card! text-foreground! hover:bg-muted"
          >
            <ArrowLeft className="text-foreground h-4 w-4" />
          </IconButton>
        </Tooltip>
      )}
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <Tooltip arrow title="Bridge options">
          <IconButton
            aria-controls={open ? 'bridge-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
            className="h-9 w-9 rounded-full bg-card! text-foreground! hover:bg-muted"
          >
            <EllipsisVertical className="text-foreground h-4 w-4" />
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="bridge-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            className:
              'mt-2.5! rounded-md! text-foreground! shadow-sm! border-none! [&_.MuiList-root]:bg-card! [&_.MuiList-root]:p-1.5!'
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Link to="/bridge/history" className="undec mb-1 block">
          <MenuItem
            onClick={handleClose}
            className={`flex items-center px-2.5! py-2! text-sm! font-sans! font-semibold! rounded-lg! ${currentPage === 'history' ? 'bg-foreground/10! text-foreground!' : 'text-foreground! hover:bg-muted-foreground/10!'}`}
          >
            <History
              className={`mr-2.5 h-[17px] w-[17px] ${currentPage === 'history' ? 'text-foreground' : 'text-muted-foreground'}`}
            />
            History
          </MenuItem>
        </Link>
        <Link to="/bridge/balance" className="undec">
          <MenuItem
            onClick={handleClose}
            className={`flex items-center px-2.5! py-2! text-sm! font-sans! font-semibold! rounded-lg! ${currentPage === 'balance' ? 'bg-foreground/10! text-foreground!' : 'text-foreground! hover:bg-muted-foreground/10!'}`}
          >
            <Wallet
              className={`mr-2.5 h-[17px] w-[17px] ${currentPage === 'balance' ? 'text-foreground' : 'text-muted-foreground'}`}
            />
            Bridge Balance
          </MenuItem>
        </Link>
      </Menu>
    </div>
  )
}
