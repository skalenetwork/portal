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
 * @file CreditStationStatusTile.tsx
 * @copyright SKALE Labs 2025-Present
 */

import { useState, useEffect } from 'react'
import { Contract } from 'ethers'
import {
  type MetaportCore,
  Tile,
  useWagmiAccount,
  useWagmiWalletClient,
  useWagmiSwitchNetwork,
  sendTransaction
} from '@skalenetwork/metaport'
import { constants } from '@/core'
import { prepareSignerForWrite } from '../../core/credit-station'
import Button from '@mui/material/Button'
import { Badge, BadgeCheck, ToggleLeft, ToggleRight } from 'lucide-react'
import notify from '../../core/notify'

interface CreditStationStatusTileProps {
  mpc: MetaportCore
  creditStation: Contract | undefined
  setErrorMsg: (msg: string) => void
}

const CreditStationStatusTile: React.FC<CreditStationStatusTileProps> = ({
  mpc,
  creditStation,
  setErrorMsg
}) => {
  const [isPaused, setIsPaused] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const network = mpc.config.skaleNetwork
  const { chainId } = useWagmiAccount()
  const { data: walletClient } = useWagmiWalletClient({ chainId })
  const { switchChainAsync } = useWagmiSwitchNetwork()

  useEffect(() => {
    loadPausedStatus()
  }, [creditStation])

  async function loadPausedStatus() {
    if (!creditStation) return
    try {
      const paused = await creditStation.paused()
      setIsPaused(paused)
    } catch (error) {
      console.error('Error loading paused status:', error)
    }
  }

  async function togglePause() {
    if (!creditStation) return
    if (!creditStation.runner?.provider || !walletClient || !switchChainAsync) {
      setErrorMsg('Something is wrong with your wallet, try again')
      notify.permanentError('Something is wrong with your wallet, try again')
      return
    }
    setLoading(true)

    notify.temporaryInfo('Switching network...')
    try {
      const signer = await prepareSignerForWrite(
        creditStation,
        walletClient,
        switchChainAsync,
        network,
        constants.MAINNET_CHAIN_NAME
      )

      const method = isPaused ? creditStation.unpause : creditStation.pause
      const action = isPaused ? 'unpause' : 'pause'

      const res = await sendTransaction(signer, method, [], `creditStation:${action}`)
      if (!res.status) {
        const errMsg = res.err?.name || 'Transaction failed'
        setErrorMsg(errMsg)
        notify.permanentError(errMsg)
        return
      }

      notify.temporarySuccess(`Credit station ${action}d`)
      await loadPausedStatus()
    } catch (error) {
      setErrorMsg('Transaction failed')
      notify.permanentError('Transaction failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-2.5">
      <Tile
        size="md"
        grow
        text="Credit Station Status"
        value={isPaused ? 'Disabled' : 'Enabled'}
        icon={
          isPaused ? (
            <Badge size={17} className="text-red-600" />
          ) : (
            <BadgeCheck size={17} className="text-green-600" />
          )
        }
        childrenRi={
          <Button
            size="medium"
            startIcon={isPaused ? <ToggleRight size={17} /> : <ToggleLeft size={17} />}
            className="btnMd bg-secondary-foreground/10! text-foreground! ml-2.5"
            onClick={togglePause}
            disabled={loading || !creditStation}
          >
            {loading ? 'Processing...' : isPaused ? 'Enable' : 'Disable'}
          </Button>
        }
      />
    </div>
  )
}

export default CreditStationStatusTile
