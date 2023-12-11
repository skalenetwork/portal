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
 * @file ConnectWallet.tsx
 * @copyright SKALE Labs 2023-Present
 */

import Button from '@mui/material/Button'
import LooksRoundedIcon from '@mui/icons-material/LooksRounded'
import { cmn, cls, SkPaper, RainbowConnectButton } from '@skalenetwork/metaport'

export default function ConnectWallet(props: { tile?: boolean; className?: string }) {
  return (
    <div className={cls(props.className)}>
      <SkPaper gray={!props.tile} className={cls(['titleSection', props.tile])}>
        <div className={cls(cmn.mtop20, cmn.mbott20)}>
          <p className={cls(cmn.p, cmn.p3, cmn.pSec, cmn.pCent)}>Connect your wallet to continue</p>
          <div className={cls(cmn.flex)}>
            <div className={cls(cmn.flex, cmn.flexg)}></div>
            <div className={cls(cmn.flex)}>
              <RainbowConnectButton.Custom>
                {({ openConnectModal }) => {
                  return (
                    <Button
                      onClick={() => {
                        openConnectModal()
                      }}
                      variant="contained"
                      className={cls(cmn.pCent, cmn.mtop10, cmn.flex, 'btn')}
                    >
                      <LooksRoundedIcon className={cls(cmn.mri10)} />
                      Connect wallet
                    </Button>
                  )
                }}
              </RainbowConnectButton.Custom>
            </div>
            <div className={cls(cmn.flex, cmn.flexg)}></div>
          </div>
        </div>
      </SkPaper>
    </div>
  )
}
