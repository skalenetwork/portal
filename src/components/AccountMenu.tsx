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

import { cls, styles, cmn, RainbowConnectButton } from '@skalenetwork/metaport'
import { helper } from '@/core'

export default function AccountMenu(props: any) {
    const { openProfileModal } = props

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
        <Tooltip arrow title="Click to open profile">
          <Button
            onClick={openProfileModal}
            className={cls(styles.paperGrey, cmn.pPrim, 'mp__btnConnect', cmn.flex)}
          >
            <div className={cls(cmn.mri5, cmn.flex)}>
              <Jazzicon diameter={20} seed={jsNumberForAddress(props.address)} />
            </div>
            {helper.shortAddress(props.address)}
          </Button>
        </Tooltip>
      )}
    </Box>
  )
}
