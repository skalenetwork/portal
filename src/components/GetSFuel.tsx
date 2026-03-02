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
 * @file GetSFuel.tsx
 * @copyright SKALE Labs 2024-Present
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { Box, Button, Tooltip } from '@mui/material'
import AutoModeRoundedIcon from '@mui/icons-material/AutoModeRounded'
import { type MetaportCore, Station, useWagmiAccount, useConnectModal } from '@skalenetwork/metaport'
import { type types } from '@/core'
import { usesFuel } from '../useSFuel'
import { Zap } from 'lucide-react'

function SingleChainSFuel({ chainName, mpc }: { chainName: string; mpc: MetaportCore }) {
  const { address } = useWagmiAccount()
  const { openConnectModal } = useConnectModal()

  const [sFuelOk, setSFuelOk] = useState(false)
  const [loading, setLoading] = useState(true)
  const [mining, setMining] = useState(false)
  const pendingMine = useRef(false)

  const faucetAvailable = new Station(chainName, mpc).isFaucetAvailable()

  const doMine = useCallback(async (addr: types.AddressType) => {
    const station = new Station(chainName, mpc)
    setMining(true)
    try {
      const { ok: mined } = await station.doPoW(addr)
      if (!mined) return
      await new Promise((r) => setTimeout(r, 3000))
      setLoading(true)
      const { ok } = await station.getData(addr)
      setSFuelOk(ok ?? false)
    } finally {
      setLoading(false)
      setMining(false)
    }
  }, [chainName, mpc])

  const checkBalance = useCallback(async () => {
    if (!address) return
    setLoading(true)
    try {
      const { ok } = await new Station(chainName, mpc).getData(address)
      setSFuelOk(ok ?? false)
      if (pendingMine.current && !(ok ?? false)) {
        pendingMine.current = false
        await doMine(address)
      } else {
        pendingMine.current = false
      }
    } finally {
      setLoading(false)
    }
  }, [address, chainName, mpc, doMine])

  useEffect(() => {
    if (!address) {
      setSFuelOk(false)
      setLoading(false)
      return
    }
    checkBalance()
  }, [address, checkBalance])

  async function handleClick() {
    if (!address) {
      pendingMine.current = true
      openConnectModal?.()
      return
    }
    if (sFuelOk) return
    await doMine(address)
  }

  function btnText() {
    if (!address) return 'Get sFUEL'
    if (mining) return 'Getting sFUEL'
    if (loading) return 'Checking sFUEL'
    return sFuelOk ? 'sFUEL OK' : 'Get sFUEL'
  }

  if (!faucetAvailable) return null

  return (
    <Button
      startIcon={
        sFuelOk && address ? (
          <Zap size={17} className="text-green-300 dark:text-green-600" />
        ) : (
          <Zap size={17} />
        )
      }
      className="w-full! md:w-fit! md:mr-3! capitalize! text-accent! bg-foreground! disabled:bg-muted-foreground/30! disabled:text-muted! text-xs! px-6! py-4! ease-in-out transition-transform duration-150 active:scale-[0.97]"
      onClick={handleClick}
      disabled={mining || loading}
    >
      {btnText()}
    </Button>
  )
}

export default function GetSFuel({ mpc, chainName }: { mpc: MetaportCore; chainName?: string }) {
  if (chainName) return <SingleChainSFuel chainName={chainName} mpc={mpc} />

  const { sFuelOk, isMining, mineSFuel, sFuelCompletionPercentage, loading } = usesFuel(mpc)
  const { address } = useWagmiAccount()
  if (!address) return null

  function btnText() {
    if (isMining) return `Getting sFUEL - ${sFuelCompletionPercentage}%`
    if (loading) return 'Checking sFUEL'
    return sFuelOk ? 'sFUEL OK' : 'Get sFUEL'
  }

  return (
    <Box sx={{ alignItems: 'center', textAlign: 'center', display: 'flex' }} className="ml-1.5">
      <Tooltip
        arrow
        placement="bottom"
        PopperProps={{ sx: { zIndex: 99999 } }}
        title={sFuelOk ? 'sFUEL balance is OK' : 'Click to get sFUEL for all chains'}
      >
        <Button
          onClick={sFuelOk ? undefined : mineSFuel}
          disabled={isMining || loading || sFuelOk}
          className="flex h-9 px-3 items-center text-foreground! bg-muted-foreground/10! text-xs! normal-case! rounded-full! min-w-0!"
          color="success"
        >
          {loading ? (
            <AutoModeRoundedIcon className="h-5 w-5 pr-1" />
          ) : (
            <Zap className="text-green-400 h-5 w-5 pr-1" />
          )}
          {btnText()}
        </Button>
      </Tooltip>
    </Box>
  )
}
