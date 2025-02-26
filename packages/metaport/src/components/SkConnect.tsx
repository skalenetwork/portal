/**
 * @license
 * SKALE Metaport
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
/**
 * @file WidgetUI.ts
 * @copyright SKALE Labs 2023-Present
 */

import { ConnectButton } from '@rainbow-me/rainbowkit'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'

import Button from '@mui/material/Button'
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded'

import { cls, cmn, styles } from '../core/css'

import { useMetaportStore } from '../store/MetaportStore'

export default function SkConnect() {
  const transferInProgress = useMetaportStore((state) => state.transferInProgress)
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted
      }) => {
        const ready = mounted && authenticationStatus !== 'loading'
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === 'authenticated')
        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none'
              }
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <div>
                    <Button
                      variant="contained"
                      color="primary"
                      size="medium"
                      className={cls(styles.btnAction, cmn.mtop20)}
                      onClick={openConnectModal}
                    >
                      Connect Wallet
                    </Button>
                  </div>
                )
              }
              if (chain.unsupported) {
                return (
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    className={cls(styles.btnAction, cmn.mbott5, cmn.fullWidth)}
                    onClick={openChainModal}
                  >
                    Wrong network
                  </Button>
                )
              }
              return (
                <div className={cls(cmn.flex)}>
                  <div className={cls(cmn.flexg, cmn.flex)}></div>
                  <div>
                    <Button
                      disabled={transferInProgress}
                      size="small"
                      className={cls(styles.btnChain, cmn.flex, cmn.flexcv, cmn.pPrim)}
                      onClick={openAccountModal}
                      style={{ color: 'white' }}
                    >
                      <div className={cls(cmn.mri5, cmn.flex)}>
                        <Jazzicon diameter={16} seed={jsNumberForAddress(account.address)} />
                      </div>
                      {account.displayName}
                      <ExpandMoreRoundedIcon className={styles.chainIconxs} />
                    </Button>
                  </div>
                </div>
              )
            })()}
          </div>
        )
      }}
    </ConnectButton.Custom>
  )
}
