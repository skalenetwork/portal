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

import { useAccount } from 'wagmi'
import Avatar from 'boring-avatars'
import Button from '@mui/material/Button'
import { ChevronDown, Wallet } from 'lucide-react'

import { helper } from '@/core'
import { AVATAR_COLORS } from '@/ui'
import { useMetaportStore } from '../store/MetaportStore'
import { openWallet } from '../core/appkit'

export default function SkConnect() {
  const transferInProgress = useMetaportStore((state) => state.transferInProgress)
  const { address, chain } = useAccount()

  if (!address)
    return (
      <Button
        variant="contained"
        color="primary"
        size="medium"
        className="btn-action mt-5 w-full my-4! p-4! bg-accent-foreground! text-accent! capitalize!"
        onClick={() => openWallet()}
        startIcon={<Wallet size={17} />}
      >
        Connect Wallet
      </Button>
    )

  if (!chain)
    return (
      <Button
        variant="contained"
        color="error"
        size="small"
        className="btn-action mb-5 w-full"
        onClick={() => openWallet('Networks')}
      >
        Wrong network
      </Button>
    )

  return (
    <div className="flex">
      <div className="grow flex"></div>
      <Button
        disabled={transferInProgress}
        size="small"
        className="btn-chain flex items-center text-primary"
        onClick={() => openWallet('Account')}
        style={{ color: 'white' }}
      >
        <div className="mr-1.5 flex">
          <Avatar variant="marble" name={address} colors={AVATAR_COLORS} size={16} />
        </div>
        {helper.shortAddress(address)}
        <ChevronDown size={17} className="text-secondary-foreground" />
      </Button>
    </div>
  )
}
