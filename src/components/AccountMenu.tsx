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

import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'

import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import LooksRoundedIcon from '@mui/icons-material/LooksRounded'
import FiberManualRecordRoundedIcon from '@mui/icons-material/FiberManualRecordRounded'

import { cls, styles, cmn, RainbowConnectButton } from '@skalenetwork/metaport'

import { useAuth } from '../AuthContext'

export default function AccountMenu(props: any) {
  const { isSignedIn, openProfileModal } = useAuth()
  return (
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
                    className="styles.paperGrey, cmn.pPrim, 'mp__btnConnect', cmn.flex"
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
        <Tooltip arrow title={isSignedIn ? 'Conneced and signed-in' : 'Wallet connect, signed-out'}>
          <Button
            onClick={openProfileModal}
            className="'mp__btnConnect', styles.paperGrey, cmn.pPrim, cmn.flex"
          >
            <div
              className="cmn.mri5, cmn.flexcv"
              style={{ height: '20px', position: 'relative' }}
            >
              <Jazzicon diameter={20} seed={jsNumberForAddress(props.address)} />
              <div className="'icon-overlay', cmn.flex, cmn.flexcv">
                {isSignedIn ? (
                  <FiberManualRecordRoundedIcon
                    color="success"
                    className="styles.chainIconxs"
                  />
                ) : (
                  <FiberManualRecordRoundedIcon
                    color="warning"
                    className="styles.chainIconxs"
                  />
                )}
              </div>
            </div>
            {props.address.substring(0, 5) +
              '...' +
              props.address.substring(props.address.length - 3)}
          </Button>
        </Tooltip>
      )}
    </Box>
  )
}
