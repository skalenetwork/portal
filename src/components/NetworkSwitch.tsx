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
 * @file NetworkSwitch.tsx
 * @copyright SKALE Labs 2023-Present
 */

import { useState } from 'react'

import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'

import SensorsRoundedIcon from '@mui/icons-material/SensorsRounded'
import ChangeCircleRoundedIcon from '@mui/icons-material/ChangeCircleRounded'
import { cls, styles, cmn, type MetaportCore } from '@skalenetwork/metaport'

import { PORTAL_URLS } from '../core/constants'

export default function NetworkSwitch(props: { mpc: MetaportCore }) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <div>
      <Box
        sx={{ alignItems: 'center', textAlign: 'center', display: { xs: 'none', sm: 'flex' } }}
        className={cls(cmn.mleft5)}
      >
        <Tooltip arrow title="Switch SKALE Network">
          <Button
            onClick={handleClick}
            className={cls('mp__btnConnect', styles.paperGrey, cmn.pPrim, cmn.flex, cmn.cap)}
          >
            <SensorsRoundedIcon className={cmn.mri5} style={{ height: '18px', width: '18px' }} />
            {props.mpc.config.skaleNetwork === 'staging'
              ? 'testnet'
              : props.mpc.config.skaleNetwork}
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
        {Object.keys(PORTAL_URLS).map((network: string) =>
          props.mpc.config.skaleNetwork !== network ? (
            <a rel="noreferrer" href={PORTAL_URLS[network]} className="undec" key={network}>
              <MenuItem onClick={handleClose}>
                <ChangeCircleRoundedIcon className={cmn.mri10} />
                Switch to{' '}
                <div className={cls(cmn.cap, cmn.mleft5)}>
                  {' '}
                  {network === 'staging' ? 'testnet' : network} Portal
                </div>
              </MenuItem>
            </a>
          ) : null
        )}
      </Menu>
    </div>
  )
}
