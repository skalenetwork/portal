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
 * @file MetaportState.ts
 * @copyright SKALE Labs 2023-Present
 */

import { Logger, type ILogObj } from 'tslog'
import { WalletClient } from 'viem'
import { create } from 'zustand'
import { dc, types, constants } from '@/core'

import { MetaportState } from './MetaportState'

import MetaportCore from '../core/metaport'
import { getEmptyTokenDataMap } from '../core/tokens/helper'
import { DEFAULT_ERROR_MSG, TRANSFER_ERROR_MSG } from '../core/constants'
import { ACTIONS } from '../core/actions'
import { MainnetChain, SChain } from '../core/contracts'
import { ActionConstructor } from '../core/actions/action'

const log = new Logger<ILogObj>({ name: 'metaport:core:state' })

export const useMetaportStore = create<MetaportState>()((set, get) => ({
  ima1: null,
  ima2: null,
  setIma1: (ima: MainnetChain | SChain) => set(() => ({ ima1: ima })),
  setIma2: (ima: MainnetChain | SChain) => set(() => ({ ima2: ima })),

  _imaCache: {},

  mpc: null,
  setMpc: (mpc: MetaportCore) => set(() => ({ mpc: mpc })),

  tokenId: null,
  setTokenId: (tokenId: number) =>
    set(() => {
      return { tokenId: tokenId }
    }),

  amount: '',
  setAmount: (amount: string, address: `0x${string}`) =>
    set((state) => {
      state.check(amount, address)
      return {
        amount: amount
      }
    }),

  unwrapAll: async (
    address: `0x${string}`,
    switchChain: any,
    walletClient: WalletClient,
    tokens: types.mp.TokenDataMap
  ) => {
    log.info('Running unwrapAll')
    set({ loading: true })
    try {
      for (const key of Object.keys(tokens)) {
        const stepMetadata = get().stepsMetadata[get().currentStep]
        const action = await (ACTIONS.unwrap_stuck.create as any)(
          get().mpc,
          stepMetadata.from,
          stepMetadata.to,
          address,
          get().amount,
          get().tokenId,
          tokens[key],
          get().setAmountErrorMessage,
          get().setBtnText,
          switchChain,
          walletClient
        )
        await action.execute()
      }
    } catch (err) {
      console.error(err)
      const msg = err.message ? err.message : DEFAULT_ERROR_MSG
      set({
        errorMessage: new dc.TransactionErrorMessage(msg, get().errorMessageClosedFallback)
      })
      return
    } finally {
      set({ loading: false })
    }
  },

  execute: async (address: `0x${string}`, switchChain: any, walletClient: WalletClient) => {
    log.info('Running execute')
    if (get().stepsMetadata[get().currentStep]) {
      set({
        loading: true,
        transferInProgress: true
      })
      try {
        const stepMetadata = get().stepsMetadata[get().currentStep]
        const ActionClass: ActionConstructor = ACTIONS[stepMetadata.type]
        const action = await (ActionClass.create as any)(
          get().mpc,
          stepMetadata.from,
          stepMetadata.to,
          address,
          get().amount,
          get().tokenId,
          get().token,
          get().setAmountErrorMessage,
          get().setBtnText,
          switchChain,
          walletClient
        )
        await action.execute()
      } catch (err) {
        console.error(err)
        const msg = err.message
        let headline
        if (err.code && err.code === 'ACTION_REJECTED') {
          headline = 'Transaction signing was rejected'
        } else {
          headline = TRANSFER_ERROR_MSG
        }
        if (err.info && err.info.error && err.info.error.data && err.info.error.data.message) {
          headline = err.info.error.data.message
        }
        if (err.shortMessage) {
          headline = err.shortMessage
        }
        set({
          errorMessage: new dc.TransactionErrorMessage(
            msg,
            get().errorMessageClosedFallback,
            headline,
            true
          )
        })
        return
      } finally {
        set({ loading: false })
      }

      const isTransferFinished = get().currentStep + 1 === get().stepsMetadata.length

      if (isTransferFinished) {
        get().setTransfersHistory([
          ...get().transfersHistory,
          {
            transactions: get().transactionsHistory,
            chainName1: get().chainName1,
            chainName2: get().chainName2,
            amount: get().amount,
            tokenKeyname: get().token.keyname,
            address: address
          }
        ])
      }

      set({
        transferInProgress: !isTransferFinished,
        currentStep: get().currentStep + 1
      })
    }
  },

  errorMessageClosedFallback() {
    set({ loading: false, errorMessage: undefined, transferInProgress: get().currentStep !== 0 })
  },

  startOver() {
    set({
      loading: false,
      errorMessage: undefined,
      amount: '',
      tokenId: null,
      currentStep: 0,
      transferInProgress: false,
      destTokenBalance: null
    })
  },

  check: async (amount: string, address: types.AddressType) => {
    if (get().stepsMetadata[get().currentStep] && address) {
      set({
        loading: true,
        btnText: 'Checking balance...'
      })
      try {
        const stepMetadata = get().stepsMetadata[get().currentStep]
        const ActionClass: ActionConstructor = ACTIONS[stepMetadata.type]
        const action = await (ActionClass.create as any)(
          get().mpc,
          stepMetadata.from,
          stepMetadata.to,
          address,
          amount,
          get().tokenId,
          get().token,
          get().setAmountErrorMessage,
          get().setBtnText,
          null,
          null
        )
        await action.preAction()
      } catch (err) {
        console.error(err)
        const msg = err.code && err.fault ? `${err.code} - ${err.fault}` : 'Something went wrong'
        set({
          errorMessage: new dc.TransactionErrorMessage(
            err.message,
            get().errorMessageClosedFallback,
            msg,
            false
          )
        })
      } finally {
        set({ loading: false })
      }
    }
    set({ loading: false })
  },

  currentStep: 0,
  setCurrentStep: (currentStep: number) => set(() => ({ currentStep: currentStep })),

  stepsMetadata: [],
  setStepsMetadata: (steps: dc.StepMetadata[]) => set(() => ({ stepsMetadata: steps })),

  chainName1: '',
  chainName2: '',

  appName1: null,
  appName2: null,

  setAppName1: (name: string) => set(() => ({ appName1: name })),
  setAppName2: (name: string) => set(() => ({ appName2: name })),

  destChains: [],

  setChainName1: async (name: string, customToken?: dc.TokenData) => {
    const result = await get().mpc.chainChanged(name, get().chainName2, customToken ?? get().token)
    set(result)
  },

  setChainName2: async (name: string, customToken?: dc.TokenData) => {
    const result = await get().mpc.chainChanged(get().chainName1, name, customToken ?? get().token)
    set(result)
  },

  addressChanged: () => {
    if (get().currentStep !== 0) {
      get().setTransfersHistory([
        ...get().transfersHistory,
        {
          transactions: get().transactionsHistory,
          chainName1: get().chainName1,
          chainName2: get().chainName2,
          amount: get().amount,
          tokenKeyname: get().token.keyname,
          address: undefined
        }
      ])
    }
    set({
      tokenBalances: {},
      wrappedTokenBalances: {},
      currentStep: 0,
      amount: '',
      transferInProgress: false
    })
  },

  tokens: getEmptyTokenDataMap(),

  token: null,

  setToken: async (token: dc.TokenData | null) => {
    set(get().mpc.tokenChanged(get().chainName1, get().ima2, token, get().chainName2))
  },

  wrappedTokens: getEmptyTokenDataMap(),
  tokenContracts: {},
  tokenBalances: {},

  wrappedTokenContracts: {},
  wrappedTokenBalances: {},

  destTokenContract: null,
  destTokenBalance: null,

  updateDestTokenBalance: async (address: string) => {
    if (!address) {
      set({ destTokenBalance: null })
      return
    }
    if (get().destTokenContract) {
      const balance = await get().mpc.tokenBalance(get().destTokenContract, address)
      set({ destTokenBalance: balance })
    } else {
      if (
        get().token &&
        get().token.type === dc.TokenType.eth &&
        get().chainName2 === constants.MAINNET_CHAIN_NAME
      ) {
        set({ destTokenBalance: await get().ima2.ethBalance(address) })
      }
    }
  },

  updateTokenBalances: async (address: string) => {
    if (!address) {
      set({ tokenBalances: {} })
      return
    }
    const tokenBalances = await get().mpc.tokenBalances(get().tokenContracts, address)
    if (get().chainName1 === constants.MAINNET_CHAIN_NAME) {
      tokenBalances.eth = await get().ima1.ethBalance(address)
    }
    set({
      tokenBalances: tokenBalances
    })
  },

  updateWrappedTokenBalances: async (address: string) => {
    if (!address) {
      set({ wrappedTokenBalances: {} })
      return
    }
    set({
      wrappedTokenBalances: await get().mpc.tokenBalances(get().wrappedTokenContracts, address)
    })
  },

  amountErrorMessage: null,
  setAmountErrorMessage: (em: string) => set(() => ({ amountErrorMessage: em })),

  errorMessage: null,
  setErrorMessage: (em: dc.ErrorMessage) => set(() => ({ errorMessage: em })),

  loading: false,
  setLoading: (loading: boolean) => set(() => ({ loading: loading })),

  transferInProgress: false,
  setTransferInProgress: (inProgress: boolean) => set(() => ({ transferInProgress: inProgress })),

  btnText: null,
  setBtnText: (btnText: string) => set(() => ({ btnText: btnText })),

  transactionsHistory: [],
  setTransactionsHistory: (transactionsHistory: types.mp.TransactionHistory[]) => {
    set({ transactionsHistory: transactionsHistory })
  },

  addTransaction(transaction: types.mp.TransactionHistory): void {
    const history = get().transactionsHistory
    history.push(transaction)
    set({ transactionsHistory: [...history] })
  },
  clearTransactionsHistory(): void {
    set({ transactionsHistory: [], transfersHistory: [] })
  },

  transfersHistory: [],
  setTransfersHistory: (transfersHistory: types.mp.TransferHistory[]) => {
    set({
      transfersHistory: transfersHistory,
      transactionsHistory: []
    })
  }
}))
