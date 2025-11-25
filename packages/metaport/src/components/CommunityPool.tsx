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

import React, { useEffect } from 'react'
import { constants, units } from '@/core'

import { useAccount, useWalletClient, useSwitchChain } from 'wagmi'

import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import TextField from '@mui/material/TextField'

import SkPaper from './SkPaper'

import Button from '@mui/material/Button'

import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded'
import TransitEnterexitRoundedIcon from '@mui/icons-material/TransitEnterexitRounded'
import AccountBalanceWallet from '@mui/icons-material/AccountBalanceWallet'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'
import RecommendIcon from '@mui/icons-material/Recommend'

import { withdraw, recharge } from '../core/community_pool'
import {
  BALANCE_UPDATE_INTERVAL_MS,
  COMMUNITY_POOL_DECIMALS,
  MINIMUM_RECHARGE_AMOUNT
} from '../core/constants'

import { styles } from '../core/css'

import { useCPStore } from '../store/CommunityPoolStore'
import { useCollapseStore } from '../store/Store'
import { useMetaportStore } from '../store/MetaportStore'
import { Collapse } from '@mui/material'
import TokenIcon from './TokenIcon'
import Tile from './Tile'

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

  const expandedCP = useCollapseStore((state) => state.expandedCP)
  const setExpandedCP = useCollapseStore((state) => state.setExpandedCP)

  let chainName
  if (token && chainName2) {
    chainName = chainName1
    if (token.connections[chainName2] && token.connections[chainName2].hub)
      chainName = token.connections[chainName2].hub
  }

  const handleChange = (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedCP(isExpanded ? panel : false)
  }

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (parseFloat(event.target.value) < 0) {
      setAmount('')
      return
    }
    setAmount(event.target.value)
  }

  useEffect(() => {
    updateCPData(address, chainName, chainName2, mpc)
  }, [])

  useEffect(() => {
    updateCPData(address, chainName, chainName2, mpc)
    const intervalId = setInterval(() => {
      updateCPData(address, chainName, chainName2, mpc)
    }, BALANCE_UPDATE_INTERVAL_MS)

    return () => {
      clearInterval(intervalId) // Clear interval on component unmount
    }
  }, [chainName, chainName2, address])

  const text = cpData.exitGasOk ? 'Exit gas wallet OK' : 'Recharge exit gas wallet'
  const icon = cpData.exitGasOk ? (
    <CheckCircleIcon color="success" />
  ) : (
    <ErrorIcon color="warning" />
  )
  const accountBalanceEther = cpData.accountBalance
    ? units.fromWei(cpData.accountBalance, constants.DEFAULT_ERC20_DECIMALS)
    : null

  function getRechargeBtnText() {
    if (loading === 'recharge') return 'Recharging...'
    if (loading === 'activate') return 'Activating account...'
    if (Number(amount) > Number(accountBalanceEther)) return 'Insufficient ETH balance'
    if (amount === '' || amount === '0' || !amount) return 'Enter an amount'
    if (Number(amount) < MINIMUM_RECHARGE_AMOUNT)
      return `Recharge amount should be bigger than ${MINIMUM_RECHARGE_AMOUNT}`
    return 'Recharge exit gas wallet'
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
    setExpandedCP(false)
  }

  if (!address) return null;
  return (
    <div className={!expandedCP ? "mt-2.5" : ""}>
      <Accordion
        disabled={!!loading}
        expanded={expandedCP === 'panel1'}
        onChange={handleChange('panel1')}
      >
        <AccordionSummary
          className="py-2.5 px-6"
          expandIcon={<ExpandMoreRoundedIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <div className="flex w-full items-center">
            <div className="flex items-center justify-center mr-2.5">{icon}</div>
            <p className="text-sm text-primary font-semibold capitalize mr-2.5">{text}</p>
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <SkPaper background="transparent" className="px-5">
            <p className="m-0 text-sm text-red-400 flex grow">
              This wallet is used to pay for gas fees on transactions that are send to the Ethereum
              Mainnet. You may withdraw funds from your SKALE Gas Wallet at anytime.
            </p>
            {cpData.recommendedRechargeAmount ? (
              <p className="m-0 text-sm text-red-400 flex grow mt-2.5">
                Minimum recommended recharge amount for your wallet is{' '}
                {cpData.recommendedRechargeAmount} ETH.
              </p>
            ) : null}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
              <div className="col-span-1">
                <Tile
                  text="ETH Balance"
                  className={styles.inputAmount}
                  icon={<TokenIcon tokenSymbol="eth" size="xs" />}
                  grow
                  size="md"
                  value={
                    cpData.accountBalance !== undefined && cpData.accountBalance !== null
                      ? `${units.truncateDecimals(units.formatBalance(cpData.accountBalance, constants.DEFAULT_ERC20_DECIMALS), COMMUNITY_POOL_DECIMALS)} ETH`
                      : ''
                  }
                />
              </div>
              <div className="col-span-1">
                <Tile
                  grow
                  text="Exit Wallet Balance"
                  size="md"
                  value={
                    cpData.balance !== undefined && cpData.balance !== null
                      ? `${units.truncateDecimals(units.formatBalance(cpData.balance, constants.DEFAULT_ERC20_DECIMALS), COMMUNITY_POOL_DECIMALS)} ETH`
                      : ''
                  }
                  icon={<AccountBalanceWallet />}
                />
              </div>
              <div className="col-span-1">
                <Tile
                  grow
                  text="Enter amount to recharge"
                  className={styles.inputAmount}
                  children={
                    <div className="flex items-center amountInput">
                      <div className="grow">
                        <TextField
                          inputProps={{ step: '0.1', lang: 'en-US' }}
                          inputRef={(input) => input?.focus()}
                          type="number"
                          variant="standard"
                          placeholder="0.00"
                          value={amount}
                          onChange={handleAmountChange}
                          disabled={!!loading}
                          style={{ width: '100%' }}
                        />
                      </div>
                      <div className="text-xl font-bold mr-2.5">ETH</div>
                    </div>
                  }
                  icon={<TransitEnterexitRoundedIcon style={{ rotate: '315deg' }} />}

                />
              </div>
              <div className="col-span-1">
                <Tile
                  disabled={!!loading}
                  value={cpData.recommendedRechargeAmount !== undefined ? String(cpData.recommendedRechargeAmount) : ''}
                  text="Recommended"
                  icon={<RecommendIcon />}
                  color={true ? undefined : 'error'}
                  grow
                  childrenRi={
                    <div className="flex items-center">
                      <Button
                        className="btnSm outlined ml-5 flex items-center"
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
            <div className="mb-5 mt-5">
              <Button
                variant="contained"
                color="primary"
                size="medium"
                className="w-full normal-case text-sm leading-6 tracking-wider font-semibold py-3.5 px-4 min-h-[44px] rounded shadow-none mt-1.5"
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
              <Collapse in={cpData.balance !== 0n || loading === 'withdraw'}>
                <div className="mt-1.5">
                  <Button
                    variant="text"
                    color="warning"
                    size="small"
                    className="w-full normal-case text-sm leading-6 tracking-wider font-semibold py-3.5 px-4 min-h-[44px] rounded shadow-none mt-1.5"
                    onClick={withdrawCP}
                    disabled={!!loading || !chainName || cpData.balance === 0n}
                  >
                    {getWithdrawBtnText()}
                  </Button>
                </div>
              </Collapse>
            </div>
          </SkPaper>
        </AccordionDetails>
      </Accordion>
    </div>
  )
}
