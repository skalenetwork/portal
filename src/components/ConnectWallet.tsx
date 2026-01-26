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

import { Button } from '@mui/material'
import { SkPaper, useWagmiAccount, RainbowConnectButton } from '@skalenetwork/metaport'
import { Rainbow } from 'lucide-react'

export default function ConnectWallet(props: {
  tile?: boolean
  className?: string
  customText?: string
}) {
  const { address } = useWagmiAccount()
  return (
    <div className={props.className}>
      <SkPaper gray={!props.tile} className="bg-muted!">
        <div className="mt-5 mb-5">
          <p className="text-sm text-muted-foreground font-semibold mb-1 text-center">
            {props.customText ?? 'Connect your wallet to continue'}
          </p>
          <div className="flex">
            <div className="flex grow"></div>
            <div className="flex">
              <RainbowConnectButton.Custom>
                {({ openConnectModal }) => {
                  return (
                    <Button
                      onClick={() => openConnectModal()}
                      variant="contained"
                      className="text-center mt-2.5! flex btn bg-accent-foreground! text-accent!"
                    >
                      <Rainbow size={17}  className="mr-2.5" />
                      {address ? 'Sign in' : 'Connect Wallet'}
                    </Button>
                  )
                }}
              </RainbowConnectButton.Custom>
            </div>
            <div className="flex grow"></div>
          </div>
        </div>
      </SkPaper>
    </div>
  )
}
