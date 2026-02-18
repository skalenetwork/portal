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
 * @file ProfileModalActions.tsx
 * @copyright SKALE Labs 2024-Present
 */

import React from 'react'
import { Button } from '@mui/material'
import { RainbowConnectButton, useWagmiDisconnect } from '@skalenetwork/metaport'
import SkStack from '../SkStack'
import { PowerOff, Rainbow, SquareArrowOutUpRight } from 'lucide-react'

interface ProfileModalActionsProps {
  address: string
  isMobile: boolean
  className?: string
}

const ProfileModalActions: React.FC<ProfileModalActionsProps> = ({
  address,
  isMobile,
  className
}) => {
  const { disconnect } = useWagmiDisconnect()

  return (
    <SkStack className={`${className} profileModalActions`}>
      <Button
        variant="text"
        startIcon={<SquareArrowOutUpRight size={14} />}
        className="btn btnSm bg-muted! text-foreground!"
        onClick={() => window.open(`https://etherscan.io/address/${address}`, '_blank')}
        fullWidth={isMobile}
      >
        View on Etherscan
      </Button>

      <RainbowConnectButton.Custom>
        {({ openAccountModal }) => (
          <Button
            variant="text"
            startIcon={<Rainbow size={14} />}
            className="btn btnSm bg-muted! text-foreground!"
            onClick={openAccountModal}
            fullWidth={isMobile}
          >
            Manage Wallet
          </Button>
        )}
      </RainbowConnectButton.Custom>

      <Button
        variant="text"
        startIcon={<PowerOff size={14} />}
        className="btn btnSm bg-muted! text-foreground!"
        onClick={() => disconnect()}
        fullWidth={isMobile}
      >
        Disconnect
      </Button>
    </SkStack>
  )
}

export default ProfileModalActions
