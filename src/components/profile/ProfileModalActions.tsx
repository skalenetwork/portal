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
import Button from '@/ui/Button'
import { openWallet } from '@/bridge'
import { useDisconnect } from 'wagmi'
import SkStack from '../SkStack'
import { PowerOff, Wallet, SquareArrowOutUpRight } from 'lucide-react'

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
  const { disconnect } = useDisconnect()

  return (
    <SkStack className={`${className} profileModalActions`}>
      <Button
        variant="secondary"
        size="sm"
        startIcon={<SquareArrowOutUpRight size={14} />}

        onClick={() => window.open(`https://etherscan.io/address/${address}`, '_blank')}
        fullWidth={isMobile}
      >
        View on Etherscan
      </Button>

      <Button
        variant="secondary"
        size="sm"
        startIcon={<Wallet size={14} />}

        onClick={() => openWallet('Account')}
        fullWidth={isMobile}
      >
        Manage Wallet
      </Button>

      <Button
        variant="secondary"
        size="sm"
        startIcon={<PowerOff size={14} />}

        onClick={() => disconnect()}
        fullWidth={isMobile}
      >
        Disconnect
      </Button>
    </SkStack>
  )
}

export default ProfileModalActions
