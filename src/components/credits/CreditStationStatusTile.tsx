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
  enforceNetwork,
  useWagmiAccount,
  useWagmiWalletClient,
  useWagmiSwitchNetwork,
  sendTransaction,
  walletClientToSigner
} from '@skalenetwork/metaport'
import { constants } from '@/core'
import Button from '@mui/material/Button'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import DoDisturbOnRoundedIcon from '@mui/icons-material/DoDisturbOnRounded'
import ToggleOnRoundedIcon from '@mui/icons-material/ToggleOnRounded'
import ToggleOffRoundedIcon from '@mui/icons-material/ToggleOffRounded'

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
      return
    }

    setLoading(true)

    try {
      const { chainId } = await creditStation.runner.provider.getNetwork()
      await enforceNetwork(
        chainId,
        walletClient,
        switchChainAsync,
        network,
        constants.MAINNET_CHAIN_NAME
      )

      const signer = walletClientToSigner(walletClient)
      creditStation.connect(signer)

      const method = isPaused ? creditStation.unpause : creditStation.pause
      const action = isPaused ? 'unpause' : 'pause'

      await sendTransaction(signer, method, [], `creditStation:${action}`)

      await loadPausedStatus()
    } catch (error) {
      setErrorMsg('Transaction failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-2.5">
      <Tile
        size="lg"
        grow
        text="Credit Station Status"
        value={isPaused ? 'Disabled' : 'Enabled'}
        textColor={isPaused ? 'error' : 'success'}
        icon={
          isPaused ? (
            <DoDisturbOnRoundedIcon color="error" />
          ) : (
            <CheckCircleRoundedIcon color="success" />
          )
        }
        childrenRi={
          <Button
            size="medium"
            startIcon={isPaused ? <ToggleOnRoundedIcon /> : <ToggleOffRoundedIcon />}
            className="btnMd filled ml-2.5"
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
