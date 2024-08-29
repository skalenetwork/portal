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
 * @file TokenBalanceTile.tsx
 * @copyright SKALE Labs 2024-Present
 */

import { Contract } from 'ethers'
import { WalletClient } from 'viem'
import { useState, useEffect } from 'react'

import {
  cmn,
  cls,
  TokenIcon,
  useWagmiAccount,
  MetaportCore,
  dataclasses,
  enforceNetwork,
  useWagmiWalletClient,
  useWagmiSwitchNetwork
} from '@skalenetwork/metaport'

import { Button } from '@mui/material'

import Tile from './Tile'

import { DEFAULT_UPDATE_INTERVAL_MS, USDC_DECIMALS } from '../core/constants'
import { formatBalance } from '../core/helper'
import { watchAsset } from '../core/watchAsset'

export default function TokenBalanceTile(props: { mpc: MetaportCore; chain: string }) {
  const [loading, setLoading] = useState<boolean>(false)
  const [tokenContract, setTokenContract] = useState<Contract | undefined>()
  const [balance, setBalance] = useState<bigint | undefined>()

  const { address } = useWagmiAccount()
  const { data: walletClient } = useWagmiWalletClient()
  const { switchChainAsync } = useWagmiSwitchNetwork()

  useEffect(() => {
    setTokenContract(
      props.mpc.tokenContract(
        props.chain,
        'usdc',
        dataclasses.TokenType.erc20,
        props.mpc.provider(props.chain)
      )
    )
  }, [])

  useEffect(() => {
    loadTokenBalance()
    const intervalId = setInterval(loadTokenBalance, DEFAULT_UPDATE_INTERVAL_MS)
    return () => {
      clearInterval(intervalId)
    }
  }, [tokenContract, address])

  async function loadTokenBalance() {
    if (!tokenContract || !address) return
    setBalance(await props.mpc.tokenBalance(tokenContract, address))
  }

  async function addToken() {
    if (!tokenContract) return

    setLoading(true)
    try {
      const { chainId } = await props.mpc.provider(props.chain).getNetwork()
      await enforceNetwork(
        chainId,
        walletClient as WalletClient,
        switchChainAsync!,
        props.mpc.config.skaleNetwork,
        props.chain
      )
      const address = await tokenContract.getAddress()
      await watchAsset(walletClient, address, Number(USDC_DECIMALS), 'USDC')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Tile
        className={cls(cmn.mtop10)}
        disabled={false}
        value={balance !== undefined ? formatBalance(balance, 'USDC', USDC_DECIMALS) : null}
        text="USDC on SKALE Europa"
        icon={<TokenIcon tokenSymbol="usdc" size="xs" />}
        childrenRi={
          <div className={cls(cmn.flexcv, cmn.flex)}>
            <Button
              disabled={loading}
              className={cls('btnSm', 'outlined', cmn.mleft20, cmn.flexcv)}
              onClick={() => {
                addToken()
              }}
            >
              {loading ? 'Confirm in wallet' : 'Add to wallet'}
            </Button>
          </div>
        }
      />
    </div>
  )
}
