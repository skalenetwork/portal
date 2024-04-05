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

import { useState, type MouseEvent } from 'react'
import { Link } from 'react-router-dom'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'

import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'

import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward'
import HistoryIcon from '@mui/icons-material/History'
import SignalCellularAltOutlinedIcon from '@mui/icons-material/SignalCellularAltOutlined'
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded'
import LooksRoundedIcon from '@mui/icons-material/LooksRounded'

import { cls, styles, cmn, RainbowConnectButton } from '@skalenetwork/metaport'

export default function AccountMenu(props: any) {
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
        {!props.address ? (
          <Tooltip arrow title="Click to connect wallet">
            <div>
              <RainbowConnectButton.Custom>
                {({ openConnectModal }) => {
                  return (
                    <Button
                      onClick={() => {
                        openConnectModal()
                      }}
                      className={cls(styles.paperGrey, cmn.pPrim, 'mp__btnConnect', cmn.flex)}
                    >
                      <LooksRoundedIcon
                        className={cmn.mri5}
                        style={{ height: '18px', width: '18px' }}
                      />
                      Connect wallet
                    </Button>
                  )
                }}
              </RainbowConnectButton.Custom>
            </div>
          </Tooltip>
        ) : (
          <Tooltip arrow title="Account info">
            <Button
              onClick={handleClick}
              className={cls('mp__btnConnect', styles.paperGrey, cmn.pPrim, cmn.flex)}
            >
              <div className={cls(cmn.mri10, cmn.flexcv)} style={{ height: '20px' }}>
                <Jazzicon diameter={20} seed={jsNumberForAddress(props.address)} />
              </div>
              {props.address.substring(0, 5) +
                '...' +
                props.address.substring(props.address.length - 3)}
            </Button>
          </Tooltip>
        )}
      </Box>
      <Menu
        className="mp__moreMenu"
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0
            }
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <RainbowConnectButton.Custom>
          {({ openAccountModal }) => {
            return (
              <MenuItem
                onClick={() => {
                  openAccountModal()
                  handleClose()
                }}
              >
                <AccountCircleRoundedIcon className={cmn.mri10} /> Account info
              </MenuItem>
            )
          }}
        </RainbowConnectButton.Custom>
        <Link to="/bridge/history" className="undec fullWidth">
          <MenuItem onClick={handleClose}>
            <HistoryIcon className={cmn.mri10} /> Transfers history
          </MenuItem>
        </Link>
        <a
          className="undec fullWidth"
          target="_blank"
          href={'https://etherscan.io/address/' + props.address}
          rel="noreferrer"
        >
          <MenuItem onClick={handleClose}>
            <div className={cmn.flex}>
              <SignalCellularAltOutlinedIcon className={cmn.mri10} />
            </div>
            <div className={cls(cmn.flex, cmn.flexg)}>View on Etherscan</div>
            <div className={cls(cmn.flex, cmn.mleft10)}>
              <ArrowOutwardIcon className="menuIconRi" />
            </div>
          </MenuItem>
        </a>
      </Menu>
    </div>
  )
}
