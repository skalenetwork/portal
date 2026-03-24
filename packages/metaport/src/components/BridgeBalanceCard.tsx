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
 * @file BridgeBalanceCard.tsx
 * @copyright SKALE Labs 2025-Present
 */

import React, { useEffect, useCallback } from 'react'
import { constants, units, metadata } from '@/core'
import { useAccount, useWalletClient, useSwitchChain } from 'wagmi'

import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'

import { withdraw, recharge } from '../core/actions/bridge_balance'
import {
  BALANCE_UPDATE_INTERVAL_MS,
  COMMUNITY_POOL_DECIMALS,
  MINIMUM_RECHARGE_AMOUNT
} from '../core/constants'
import { CHAINS_META } from '../core/metadata'
import { styles } from '../core/css'

import { useBridgeBalanceStore } from '../store/BridgeBalanceStore'
import { useMetaportStore } from '../store/MetaportStore'
import SkPaper from './SkPaper'
import ChainIcon from './ChainIcon'
import Tile from './Tile'
import {
  ChevronDown,
  ChevronsDown,
  ChevronUp,
  CircleCheck,
  Coins,
  TriangleAlert,
  Wallet
} from 'lucide-react'
import { useThemeMode } from './ThemeProvider'
import TokenIcon from './TokenIcon'

function formatBalance(value: bigint | null | undefined): string {
  if (value === undefined || value === null) return ''
  return `${units.truncateDecimals(units.formatBalance(value, constants.DEFAULT_ERC20_DECIMALS), COMMUNITY_POOL_DECIMALS)} ETH`
}

export default function BridgeBalanceCard(props: {
  chainName: string
  showHeader?: boolean
  defaultExpanded?: boolean
}) {
  const { address, chainId } = useAccount()
  const { data: walletClient } = useWalletClient({ chainId })
  const { switchChainAsync } = useSwitchChain()

  const chainState = useBridgeBalanceStore((state) => state.chains[props.chainName])
  const setAmount = useBridgeBalanceStore((state) => state.setAmount)
  const setLoading = useBridgeBalanceStore((state) => state.setLoading)
  const updateChain = useBridgeBalanceStore((state) => state.updateChain)

  const mpc = useMetaportStore((state) => state.mpc)
  const setErrorMessage = useMetaportStore((state) => state.setErrorMessage)

  const { mode } = useThemeMode()

  const [expanded, setExpanded] = React.useState(
    props.defaultExpanded ?? !props.showHeader
  )

  const skaleNetwork = mpc.config.skaleNetwork
  const chainsMeta = CHAINS_META[skaleNetwork]
  const alias = metadata.getAlias(skaleNetwork, chainsMeta, props.chainName)

  const cpData = chainState?.cpData
  const loading = chainState?.loading
  const amount = chainState?.amount ?? ''

  const refreshData = useCallback(() => {
    if (address) updateChain(address, props.chainName, mpc)
  }, [address, props.chainName, mpc])

  useEffect(() => {
    refreshData()
    const intervalId = setInterval(refreshData, BALANCE_UPDATE_INTERVAL_MS)
    return () => clearInterval(intervalId)
  }, [refreshData])

  const accountBalanceEther = cpData?.accountBalance
    ? units.fromWei(cpData.accountBalance, constants.DEFAULT_ERC20_DECIMALS)
    : null

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (parseFloat(event.target.value) < 0) {
      setAmount(props.chainName, '')
      return
    }
    setAmount(props.chainName, event.target.value)
  }

  function getRechargeBtnText() {
    if (loading === 'recharge') return 'Topping up...'
    if (loading === 'activate') return 'Activating...'
    if (Number(amount) > Number(accountBalanceEther))
      return `Low balance: ${units.truncateDecimals(accountBalanceEther!, COMMUNITY_POOL_DECIMALS)} ETH`
    if (amount === '' || amount === '0' || !amount) return 'Enter an amount'
    if (Number(amount) < MINIMUM_RECHARGE_AMOUNT) return `Min ${MINIMUM_RECHARGE_AMOUNT}`
    return `Top up ${amount} ETH`
  }

  function getWithdrawBtnText() {
    if (loading === 'withdraw') return 'Withdrawing...'
    return 'Withdraw all'
  }

  function withdrawCP() {
    withdraw(
      mpc,
      walletClient,
      props.chainName,
      cpData.balance,
      address,
      switchChainAsync,
      (l) => setLoading(props.chainName, l),
      setErrorMessage,
      async () => {
        setLoading(props.chainName, false)
        setErrorMessage(null)
      }
    ).then(refreshData)
  }

  async function rechargeCP() {
    await recharge(
      mpc,
      walletClient,
      props.chainName,
      amount,
      address,
      switchChainAsync,
      (l) => setLoading(props.chainName, l),
      setErrorMessage,
      async () => {
        setLoading(props.chainName, false)
        setErrorMessage(null)
      }
    )
    refreshData()
  }

  if (!cpData) return null

  const isLoaded = cpData.exitGasOk !== null

  const skeleton = (
    <div className="animate-pulse">
      <div className="h-12 rounded-xl bg-secondary-foreground/10 mb-4" />
      <div className="h-20 rounded-lg bg-secondary-foreground/10" />
      <div className="flex gap-2.5 mt-4">
        <div className="grow h-12 rounded-full bg-secondary-foreground/10" />
        <div className="w-32 h-12 rounded-full bg-secondary-foreground/10" />
      </div>
    </div>
  )

  const content = isLoaded ? (
    <div>
      <div
        className={`flex items-center gap-3 mb-2.5 py-3.5 px-4 rounded-xl ${cpData.exitGasOk ? 'bg-emerald-500/10' : 'bg-amber-500/10'}`}
      >
        <div
          className={`flex items-center justify-center rounded-full p-1.5 ${cpData.exitGasOk ? 'bg-emerald-500/15' : 'bg-amber-500/15'}`}
        >
          {cpData.exitGasOk ? (
            <CircleCheck size={18} className="text-emerald-500" />
          ) : (
            <TriangleAlert size={18} className="text-amber-500" />
          )}
        </div>
        <p
          className={`text-sm font-semibold m-0 ${cpData.exitGasOk ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}
        >
          {cpData.exitGasOk ? 'Bridge balance OK' : 'Top up bridge balance'}
        </p>
      </div>
      <Tile
        grow
        text="Bridge Balance"
        size="lg"
        value={formatBalance(cpData.balance)}
        icon={<Wallet size={14} />}
        childrenRi={(cpData.balance !== 0n || loading === 'withdraw') && (
          <Button
            variant="contained"
            size="small"
            className="normal-case! text-sm font-semibold py-2.5! px-4! rounded shadow-none bg-amber-500/10! text-amber-600! dark:text-amber-400! disabled:bg-secondary-foreground/5! disabled:text-muted-foreground! flex! items-center! gap-2!"
            onClick={withdrawCP}
            startIcon={<ChevronsDown size={16} />}
            disabled={!!loading || cpData.balance === 0n}
          >
            {getWithdrawBtnText()}
          </Button>
        )}
      />
      <Tile
        grow
        text="Top up amount"
        className={`mt-2.5 ${styles.inputAmount} ${mode === 'light' && styles.inputAmountLight}`}
        children={
          <div className='flex items-center mt-1 -m-2'>
            <div className='bg-card/80 p-2 rounded-lg pl-4 grow'>
              <div className="flex items-center amountInput [&_input]:text-2xl!">
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

              </div>
            </div>
            <TokenIcon tokenSymbol='eth' className='ml-2.5' />
            <div className="text-xl font-bold text-foreground ml-1.5 mr-2.5">ETH</div>
          </div>
        }
        icon={<Coins size={14} />}
      />
      <div className="flex gap-2.5 mt-2.5">
        <Button
          variant="contained"
          className="grow btnMd normal-case! text-sm font-semibold text-accent! bg-accent-foreground! disabled:bg-accent-foreground/50! py-3.5 px-4 rounded shadow-none flex! items-center! gap-2!"
          onClick={rechargeCP}
          disabled={
            !!loading ||
            !cpData.accountBalance ||
            Number(amount) > Number(accountBalanceEther) ||
            Number(amount) < MINIMUM_RECHARGE_AMOUNT ||
            amount === '' ||
            amount === '0' ||
            !amount
          }
          startIcon={<Coins size={16} />}
        >
          {getRechargeBtnText()}
        </Button>
      </div>
    </div>
  ) : (
    skeleton
  )

  if (!props.showHeader) return content

  return (
    <SkPaper gray className="mb-2.5">
      <button
        type="button"
        className="w-full flex items-center justify-between p-2 cursor-pointer bg-transparent border-none text-left"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <ChainIcon skaleNetwork={skaleNetwork} chainName={props.chainName} size="sm" />
          <div>
            <p className="text-sm font-semibold text-foreground m-0">{alias}</p>
            <p className="text-xs text-muted-foreground font-bold m-0 mt-0.5">
              {isLoaded ? formatBalance(cpData.balance) : 'Loading...'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!expanded &&
            (isLoaded ? (
              cpData.exitGasOk ? (
                <div className="flex items-center gap-1.5 rounded-full py-1 px-2.5 bg-emerald-500/10">
                  <CircleCheck size={13} className="text-emerald-500" />
                  <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    OK
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 rounded-full py-1 px-2.5 bg-amber-500/10">
                  <TriangleAlert size={13} className="text-amber-500" />
                  <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                    Top up
                  </span>
                </div>
              )
            ) : (
              <div className="w-4 h-4 rounded-full bg-secondary-foreground/20 animate-pulse" />
            ))}
          {expanded ? (
            <ChevronUp size={17} className="text-secondary-foreground" />
          ) : (
            <ChevronDown size={17} className="text-secondary-foreground" />
          )}
        </div>
      </button>
      {expanded && <div className="pt-2">{content}</div>}
    </SkPaper>
  )
}
