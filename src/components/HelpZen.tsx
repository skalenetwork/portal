import { Link } from 'react-router-dom'

import { useEffect, useState, type MouseEvent } from 'react'
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import SkIconBtn from './SkIconBth'
import { CircleQuestionMark, MessageCircle, HelpCircle, Rainbow } from 'lucide-react'
import { Button, IconButton } from '@mui/material'

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
    <div className="hidden! md:block!">
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <IconButton
          size="small"
          className="ml-1.5! h-9 w-9 rounded-full bg-card! text-foreground! hover:bg-muted"
          onClick={handleClick}
        >
          <CircleQuestionMark className="text-foreground h-4 w-4" />
        </IconButton>
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
        <MenuItem
          onClick={handleClickZen}
          className="flex items-center px-2.5! py-2! text-sm! font-sans! font-semibold! text-foreground! hover:bg-muted! rounded-lg!"
        >
          <MessageCircle className="mr-2.5 h-[17px] w-[17px] text-muted-foreground" />
          Open support chat
        </MenuItem>
        <Link to="/other/faq" className="undec">
          <MenuItem
            onClick={handleClose}
            className="flex items-center px-2.5! py-2! text-sm! font-sans! font-semibold! text-foreground! hover:bg-muted! rounded-lg!"
          >
            <HelpCircle className="mr-2.5 h-[17px] w-[17px] text-muted-foreground" />
            Bridge FAQ
          </MenuItem>
        </Link>
      </Menu>
    </div>
  )
}
