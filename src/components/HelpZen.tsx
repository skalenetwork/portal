import { Link } from 'react-router-dom'

import { useEffect, useState, MouseEvent } from 'react'
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import QuestionMarkRoundedIcon from '@mui/icons-material/QuestionMarkRounded'
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined'
import MarkUnreadChatAltRoundedIcon from '@mui/icons-material/MarkUnreadChatAltRounded'
import { cls, styles, cmn } from '@skalenetwork/metaport'

export default function HelpZen() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [openZen, setOpenZen] = useState<boolean>(false)

  const open = Boolean(anchorEl)

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  function handleClickZen() {
    window.zE('messenger', openZen ? 'close' : 'open')
  }

  useEffect(() => {
    window.zE('messenger', 'close')
    window.zE('messenger:on', 'open', () => {
      setOpenZen(true)
    })
    window.zE('messenger:on', 'close', () => {
      setOpenZen(false)
    })
  }, [])

  return (
    <div>
      <Box
        className={cmn.mleft5}
        sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}
      >
        <Tooltip arrow title="Get help">
          <IconButton
            id="basic-button"
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
            className={cls(styles.paperGrey, cmn.pPrim)}
            style={{ width: '34px', height: '34px' }}
          >
            <QuestionMarkRoundedIcon
              className={cls(cmn.pPrim)}
              style={{ height: '15px', width: '15px' }}
            />
          </IconButton>
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
        <MenuItem onClick={handleClickZen}>
          <MarkUnreadChatAltRoundedIcon className={cmn.mri10} /> Open support chat
        </MenuItem>
        <Link to="/other/faq" className="undec fullWidth">
          <MenuItem onClick={handleClose}>
            <HelpOutlineOutlinedIcon className={cmn.mri10} /> Bridge FAQ
          </MenuItem>
        </Link>
      </Menu>
    </div>
  )
}
