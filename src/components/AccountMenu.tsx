import * as React from 'react'
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
import AppsOutlinedIcon from '@mui/icons-material/AppsOutlined'
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded'

import { cls, styles, cmn, RainbowConnectButton } from '@skalenetwork/metaport'

export default function AccountMenu(props: any) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  if (!props.address) return
  return (
    <React.Fragment>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <Tooltip arrow title="Click to expand">
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
        <Link to="/portfolio" className="undec fullWidth">
          <MenuItem onClick={handleClose}>
            <AppsOutlinedIcon className={cmn.mri10} /> Assets overview
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
    </React.Fragment>
  )
}
