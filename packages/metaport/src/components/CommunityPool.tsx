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
 * @file CommunityPool.ts
 * @copyright SKALE Labs 2023-Present
 */

import React, { useEffect, useMemo } from 'react'
import { constants, units } from '@/core'

import { useAccount, useWalletClient, useSwitchChain } from 'wagmi'

import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'

import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'

import { withdraw, recharge } from '../core/community_pool'
import {
  BALANCE_UPDATE_INTERVAL_MS,
  COMMUNITY_POOL_DECIMALS,
  MINIMUM_RECHARGE_AMOUNT
} from '../core/constants'

import { styles } from '../core/css'

import { useCPStore } from '../store/CommunityPoolStore'
import { useMetaportStore } from '../store/MetaportStore'
import TokenIcon from './TokenIcon'
import Tile from './Tile'
import { ArrowDown, ThumbsUp, Wallet } from 'lucide-react'
import { useThemeMode } from './ThemeProvider'

function formatBalance(value: bigint | null | undefined): string {
  if (value === undefined || value === null) return ''
  return `${units.truncateDecimals(units.formatBalance(value, constants.DEFAULT_ERC20_DECIMALS), COMMUNITY_POOL_DECIMALS)} ETH`
}

export default function CommunityPool() {
  const { address, chainId } = useAccount()
  const { data: walletClient } = useWalletClient({ chainId })
  const { switchChainAsync } = useSwitchChain()

  const cpData = useCPStore((state) => state.cpData)
  const loading = useCPStore((state) => state.loading)
  const setLoading = useCPStore((state) => state.setLoading)
  const amount = useCPStore((state) => state.amount)
  const setAmount = useCPStore((state) => state.setAmount)
  const updateCPData = useCPStore((state) => state.updateCPData)

  const chainName1 = useMetaportStore((state) => state.chainName1)
  const chainName2 = useMetaportStore((state) => state.chainName2)
  const token = useMetaportStore((state) => state.token)

  const mpc = useMetaportStore((state) => state.mpc)
  const setErrorMessage = useMetaportStore((state) => state.setErrorMessage)

  const { mode } = useThemeMode()

  const chainName = useMemo(() => {
    if (token && chainName2) {
      const base = chainName1
      if (token.connections[chainName2]?.hub) return token.connections[chainName2].hub
      return base
    }
    if (chainName1 && chainName1 !== constants.MAINNET_CHAIN_NAME) return chainName1
    const firstChain = mpc.config.chains.find((c: string) => c !== constants.MAINNET_CHAIN_NAME)
    return firstChain ?? null
  }, [token, chainName1, chainName2, mpc.config.chains])

  const targetChain = chainName2 || constants.MAINNET_CHAIN_NAME

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (parseFloat(event.target.value) < 0) {
      setAmount('')
      return
    }
    setAmount(event.target.value)
  }

  useEffect(() => {
    updateCPData(address, chainName, targetChain, mpc)
  }, [])

  useEffect(() => {
    updateCPData(address, chainName, targetChain, mpc)
    const intervalId = setInterval(() => {
      updateCPData(address, chainName, targetChain, mpc)
    }, BALANCE_UPDATE_INTERVAL_MS)

    return () => {
      clearInterval(intervalId)
    }
  }, [chainName, targetChain, address])

  const accountBalanceEther = cpData.accountBalance
    ? units.fromWei(cpData.accountBalance, constants.DEFAULT_ERC20_DECIMALS)
    : null

  function getRechargeBtnText() {
    if (loading === 'recharge') return 'Topping up...'
    if (loading === 'activate') return 'Activating account...'
    if (Number(amount) > Number(accountBalanceEther)) return 'Insufficient ETH balance'
    if (amount === '' || amount === '0' || !amount) return 'Enter an amount'
    if (Number(amount) < MINIMUM_RECHARGE_AMOUNT)
      return `Amount should be at least ${MINIMUM_RECHARGE_AMOUNT}`
    return 'Top up bridge balance'
  }

  function getWithdrawBtnText() {
    if (loading === 'withdraw') return 'Withdrawing...'
    return 'Withdraw all'
  }

  function withdrawCP() {
    withdraw(
      mpc,
      walletClient,
      chainName,
      cpData.balance,
      address,
      switchChainAsync,
      setLoading,
      setErrorMessage,
      async () => {
        setLoading(false)
        setErrorMessage(null)
      }
    )
  }

  async function rechargeCP() {
    await recharge(
      mpc,
      walletClient,
      chainName,
      amount,
      address,
      switchChainAsync,
      setLoading,
      setErrorMessage,
      async () => {
        setLoading(false)
        setErrorMessage(null)
      }
    )
  }

  if (!address) return null
  return (
    <div>
      <div className="flex items-center mb-4 p-3 rounded-lg bg-background">
        <div className="flex items-center justify-center mr-2.5">
          {cpData.exitGasOk ? <CheckCircleIcon color="success" /> : <ErrorIcon color="warning" />}
        </div>
        <p className="text-sm text-foreground font-semibold m-0">
          {cpData.exitGasOk ? 'Bridge balance OK' : 'Top up bridge balance'}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
        <div className="col-span-1">
          <Tile
            text="ETH Balance"
            className={styles.inputAmount}
            icon={<TokenIcon tokenSymbol="eth" size="xs" />}
            grow
            size="md"
            value={formatBalance(cpData.accountBalance)}
          />
        </div>
        <div className="col-span-1">
          <Tile
            grow
            text="Bridge Balance"
            size="md"
            value={formatBalance(cpData.balance)}
            icon={<Wallet size={14} />}
          />
        </div>
      </div>
      <div className="mt-5 p-4 rounded-lg bg-background">
        <p className="text-xs text-secondary-foreground font-medium mb-3 mt-0">Top up amount</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          <div className="col-span-1">
            <Tile
              grow
              text="Enter amount"
              className={`${styles.inputAmount} ${mode == 'light' && styles.inputAmountLight}`}
              children={
                <div className="flex items-center amountInput">
                  <div className="grow">
                    <TextField
                      inputProps={{ step: '0.1', lang: 'en-US' }}
                      type="number"
                      variant="standard"
                      placeholder="0.00"
                      value={amount}
                      onChange={handleAmountChange}
                      disabled={!!loading}
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div className="text-2xl font-bold text-foreground mr-2.5">ETH</div>
                </div>
              }
              icon={<ArrowDown size={14} />}
            />
          </div>
          <div className="col-span-1">
            <Tile
              disabled={!!loading}
              value={
                cpData.recommendedRechargeAmount !== undefined
                  ? String(cpData.recommendedRechargeAmount)
                  : ''
              }
              text="Recommended"
              icon={<ThumbsUp size={14} />}
              grow
              className="h-full!"
              childrenRi={
                <div className="flex items-center">
                  <Button
                    className="bg-secondary-foreground/10! flex items-center! text-[10px]! py-1! px-3! min-w-0! text-foreground! mr-2!"
                    onClick={() => {
                      if (!cpData.recommendedRechargeAmount) return
                      setAmount(String(cpData.recommendedRechargeAmount))
                    }}
                  >
                    Add
                  </Button>
                </div>
              }
            />
          </div>
        </div>
        <Button
          variant="contained"
          className="w-full mt-4! btnMd normal-case! text-sm font-semibold text-accent! bg-accent-foreground! disabled:bg-accent-foreground/50! py-3.5 px-4 rounded shadow-none"
          onClick={rechargeCP}
          disabled={
            !!loading ||
            !cpData.accountBalance ||
            Number(amount) > Number(accountBalanceEther) ||
            Number(amount) < MINIMUM_RECHARGE_AMOUNT ||
            amount === '' ||
            amount === '0' ||
            !amount ||
            !chainName
          }
        >
          {getRechargeBtnText()}
        </Button>
      </div>
      {(cpData.balance !== 0n || loading === 'withdraw') && (
        <Button
          variant="text"
          color="warning"
          size="small"
          className="w-full normal-case! text-sm font-semibold py-3.5! px-4! rounded shadow-none mt-2.5! bg-amber-500/10! text-amber-500!"
          onClick={withdrawCP}
          disabled={!!loading || !chainName || cpData.balance === 0n}
        >
          {getWithdrawBtnText()}
        </Button>
      )}
      {cpData.recommendedRechargeAmount ? (
        <p className="text-xs text-muted-foreground font-medium mt-4 text-center">
          Minimum recommended amount is {cpData.recommendedRechargeAmount} ETH
        </p>
      ) : null}
    </div>
  )
}
