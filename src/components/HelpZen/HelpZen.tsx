import React, { useEffect } from 'react'
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded'

import { cls, styles, cmn } from '@skalenetwork/metaport'

export default function HelpZen() {
  const [open, setOpen] = React.useState<boolean>(false)

  useEffect(() => {
    window.zE('messenger', 'close')
    window.zE('messenger:on', 'open', () => {
      setOpen(true)
    })
    window.zE('messenger:on', 'close', () => {
      setOpen(false)
    })
  }, [])

  function handleClick() {
    window.zE('messenger', open ? 'close' : 'open')
  }

  return (
    <React.Fragment>
      <Box
        className={cmn.mleft5}
        sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}
      >
        <Tooltip arrow title={open ? 'Hide support chat' : 'Open support chat'}>
          <IconButton
            id="basic-button"
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
            className={cls(styles.paperGrey, cmn.pPrim)}
            style={{ width: '34px', height: '34px' }}
          >
            <HelpOutlineRoundedIcon
              className={cls(cmn.pPrim)}
              style={{ height: '18px', width: '18px' }}
            />
          </IconButton>
        </Tooltip>
      </Box>
    </React.Fragment>
  )
}
