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
 * @file IMetaportState.ts
 * @copyright SKALE Labs 2023-Present
 */

import { Contract } from 'ethers'
import { WalletClient } from 'viem'
import { UseSwitchChainReturnType } from 'wagmi'
import { dc, types } from '@/core'

import MetaportCore from '../core/metaport'
import { MainnetChain, SChain } from '../core/contracts'

export interface MetaportState {
  ima1: MainnetChain | SChain
  setIma1: (ima: MainnetChain | SChain) => void

  ima2: MainnetChain | SChain
  setIma2: (ima: MainnetChain | SChain) => void

  mpc: MetaportCore
  setMpc: (mpc: MetaportCore) => void

  amount: string
  setAmount: (amount: string, address: `0x${string}`) => void

  tokenId: number
  setTokenId: (tokenId: number) => void

  execute: (
    address: string,
    switchChain: UseSwitchChainReturnType['switchChainAsync'],
    walletClient: WalletClient
  ) => void

  unwrapAll: (
    address: string,
    switchChain: UseSwitchChainReturnType['switchChainAsync'],
    walletClient: WalletClient,
    tokens: types.mp.TokenDataMap
  ) => void

  check: (amount: string, address: `0x${string}`) => void

  currentStep: number
  setCurrentStep: (currentStep: number) => void

  stepsMetadata: dc.StepMetadata[]
  setStepsMetadata: (steps: dc.StepMetadata[]) => void

  chainName1: string
  chainName2: string

  setChainName1: (name: string) => void
  setChainName2: (name: string) => void

  addressChanged: () => void

  appName1: string
  appName2: string

  setAppName1: (name: string) => void
  setAppName2: (name: string) => void

  destChains: string[]

  tokens: types.mp.TokenDataTypesMap

  token: dc.TokenData | null
  setToken: (token: dc.TokenData | null) => void

  tokenContracts: types.mp.TokenContractsMap
  tokenBalances: types.mp.TokenBalancesMap
  updateTokenBalances: (address: string) => Promise<void>

  wrappedTokens: types.mp.TokenDataTypesMap
  wrappedTokenContracts: types.mp.TokenContractsMap
  wrappedTokenBalances: types.mp.TokenBalancesMap
  updateWrappedTokenBalances: (address: string) => Promise<void>

  destTokenContract: Contract
  destTokenBalance: bigint
  updateDestTokenBalance: (address: string) => Promise<void>

  amountErrorMessage: string
  setAmountErrorMessage: (amountErrorMessage: string) => void

  errorMessage: dc.ErrorMessage
  setErrorMessage: (errorMessage: dc.ErrorMessage) => void

  loading: boolean
  setLoading: (loading: boolean) => void

  transferInProgress: boolean
  setTransferInProgress: (loading: boolean) => void

  btnText: string
  setBtnText: (btnText: string) => void

  transactionsHistory: types.mp.TransactionHistory[]
  setTransactionsHistory: (transactionsHistory: types.mp.TransactionHistory[]) => void
  addTransaction: (transaction: types.mp.TransactionHistory) => void
  clearTransactionsHistory: () => void

  transfersHistory: types.mp.TransferHistory[]
  setTransfersHistory: (transfersHistory: types.mp.TransferHistory[]) => void

  errorMessageClosedFallback: () => void
  startOver: () => void
}
