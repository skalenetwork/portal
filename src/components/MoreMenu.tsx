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
 * @file MoreMenu.tsx
 * @copyright SKALE Labs 2023-Present
 */

import { useState, type MouseEvent } from 'react'
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'

import { Link } from 'react-router-dom'

import { DOCS_PORTAL_URL, SKALE_FORUM_URL } from '../core/constants'
import {
  EllipsisVertical,
  FileText,
  ListOrdered,
  BookOpen,
  MessagesSquare,
  ExternalLink,
  MessageCircle,
  HelpCircle
} from 'lucide-react'

export default function MoreMenu() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  return (
    <div>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <Tooltip arrow title="Useful links">
          <IconButton
            id="basic-button"
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
            className="ml-1.5! h-9 w-9 rounded-full bg-card! text-foreground! hover:bg-muted"
          >
            <EllipsisVertical className="text-foreground h-4 w-4" />
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
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
        <div className="md:hidden">
          <MenuItem
            onClick={() => {
              handleClose()
              window.zE('messenger', 'open')
            }}
            className="flex items-center px-2.5! py-2! text-sm! font-sans! font-semibold! text-foreground! hover:bg-muted! rounded-lg!"
          >
            <MessageCircle className="mr-2.5 h-[17px] w-[17px] text-muted-foreground" />
            Open support chat
          </MenuItem>
        </div>
        <div className="md:hidden">
          <Link to="/other/faq" className="undec">
            <MenuItem
              onClick={handleClose}
              className="flex items-center px-2.5! py-2! text-sm! font-sans! font-semibold! text-foreground! hover:bg-muted! rounded-lg!"
            >
              <HelpCircle className="mr-2.5 h-[17px] w-[17px] text-muted-foreground" />
              Bridge FAQ
            </MenuItem>
          </Link>
        </div>
        <Link to="/other/terms-of-service" className="undec">
          <MenuItem
            onClick={handleClose}
            className="flex items-center px-2.5! py-2! text-sm! font-sans! font-semibold! text-foreground! hover:bg-muted! rounded-lg!"
          >
            <FileText className="mr-2.5 h-[17px] w-[17px] text-muted-foreground" />
            Terms of service
          </MenuItem>
        </Link>
        <Link to="/other/changelog" className="undec">
          <MenuItem
            onClick={handleClose}
            className="flex items-center px-2.5! py-2! text-sm! font-sans! font-semibold! text-foreground! hover:bg-muted! rounded-lg!"
          >
            <ListOrdered className="mr-2.5 h-[17px] w-[17px] text-muted-foreground" />
            Changelog
          </MenuItem>
        </Link>
        <a className="undec" target="_blank" href={DOCS_PORTAL_URL} rel="noreferrer">
          <MenuItem
            onClick={handleClose}
            className="flex items-center px-2.5! py-2! text-sm! font-sans! font-semibold! text-foreground! hover:bg-muted! rounded-lg!"
          >
            <div className="flex">
              <BookOpen className="mr-2.5 h-[17px] w-[17px] text-muted-foreground" />
            </div>
            <div className="flex grow">SKALE Network Docs</div>
            <div className="flex ml-2.5">
              <ExternalLink className="h-[17px] w-[17px] text-muted-foreground" />
            </div>
          </MenuItem>
        </a>
        <a className="undec" target="_blank" href={SKALE_FORUM_URL} rel="noreferrer">
          <MenuItem
            onClick={handleClose}
            className="flex items-center px-2.5! py-2! text-sm! font-sans! font-semibold! text-foreground! hover:bg-muted! rounded-lg!"
          >
            <div className="flex">
              <MessagesSquare className="mr-2.5 h-[17px] w-[17px] text-muted-foreground" />
            </div>
            <div className="flex grow">SKALE Forum </div>
            <div className="flex ml-2.5">
              <ExternalLink className="h-[17px] w-[17px] text-muted-foreground" />
            </div>
          </MenuItem>
        </a>
      </Menu>
    </div>
  )
}
