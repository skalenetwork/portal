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

import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded'
import { type MetaportCore, ChainIcon, mp_metadata } from '@skalenetwork/metaport'

import { PORTAL_URLS } from '../core/constants'
import { constants } from '@/core'

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
        className="ml-1.5"
      >
        <Tooltip arrow title="Switch SKALE Network">
          <Button
            onClick={handleClick}
            className="flex h-9 px-3 items-center text-foreground! bg-card! text-xs! capitalize! rounded-full min-w-0!"
          >
            <ChainIcon
              skaleNetwork={props.mpc.config.skaleNetwork}
              chainName={constants.MAINNET_CHAIN_NAME}
              size="xs"
              className="mr-2.5"
              chainsMeta={mp_metadata.CHAINS_META[props.mpc.config.skaleNetwork]}
            />
            {props.mpc.config.skaleNetwork.replace(/-/g, ' ')}
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
              <MenuItem onClick={handleClose} style={{ padding: '10px 4px 10px 8px' }}>
                <ChainIcon
                  skaleNetwork={network as any}
                  chainName={constants.MAINNET_CHAIN_NAME}
                  size="xs"
                  className="mr-2.5"
                  chainsMeta={
                    mp_metadata.CHAINS_META[network as keyof typeof mp_metadata.CHAINS_META]
                  }
                />
                SKALE <div className="capitalize ml-1.5">{network.replace(/-/g, ' ')} Portal</div>
                <div className="flex-grow"></div>
                <KeyboardArrowRightRoundedIcon
                  className="ml-2.5 w-4 h-4"
                  style={{ opacity: 0.5 }}
                />
              </MenuItem>
            </a>
          ) : null
        )}
      </Menu>
    </div>
  )
}
