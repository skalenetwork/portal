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
import { dc, types, constants, units, notify } from '@/core'

import { MetaportState } from './MetaportState'

import MetaportCore from '../core/metaport'
import { getEmptyTokenDataMap } from '../core/tokens/helper'
import { DEFAULT_ERROR_MSG, TRANSFER_ERROR_MSG } from '../core/constants'
import { ACTIONS } from '../core/actions'
import { MainnetChain, SChain } from '../core/contracts'
import { ActionConstructor } from '../core/actions/action'
import { isTrailsAction } from '../core/actions/trails'
import { isMesonAction } from '../core/actions/meson'
import { getEmptyCommunityPoolData, getCommunityPoolData } from '../core/community_pool'

const log = new Logger<ILogObj>({ name: 'metaport:core:state' })
let checkRequestId = 0

export const useMetaportStore = create<MetaportState>()((set, get) => ({
  ima1: null,
  ima2: null,
  setIma1: (ima: MainnetChain | SChain) => set(() => ({ ima1: ima })),
  setIma2: (ima: MainnetChain | SChain) => set(() => ({ ima2: ima })),

  _imaCache: {},

  cpData: getEmptyCommunityPoolData(),
  setCpData: (cpData: types.mp.CommunityPoolData) => set({ cpData }),
  _cpMainnet: null as MainnetChain | null,
  _cpSChain: null as SChain | null,
  _cpChainName: null as string | null,
  updateCPData: async (address: string, chainName1: string, chainName2: string) => {
    if (!chainName1 || !chainName2 || chainName1 === constants.MAINNET_CHAIN_NAME) return
    const mpc = get().mpc
    if (!get()._cpMainnet) {
      set({ _cpMainnet: await mpc.mainnet() })
    }
    if (!get()._cpSChain || get()._cpChainName !== chainName1) {
      set({ _cpSChain: await mpc.schain(chainName1), _cpChainName: chainName1 })
    }
    const cpData = await getCommunityPoolData(
      address,
      chainName1,
      chainName2,
      get()._cpMainnet,
      get()._cpSChain
    )
    set({ cpData })
  },

  trailsQuote: null,
  trailsQuoteError: null,
  trailsIntentId: null,
  trailsTrackerReady: false,
  trailsImaCompleted: false,

  mesonQuote: null,
  mesonQuoteError: null,
  mesonSwapId: null,
  mesonTrackerReady: false,
  mesonSwapStatus: null,

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
        amount: amount,
        trailsQuote: null,
        trailsQuoteError: null,
        trailsIntentId: null,
        trailsTrackerReady: false,
        trailsImaCompleted: false,
        mesonQuote: null,
        mesonQuoteError: null,
        mesonSwapId: null,
        mesonTrackerReady: false,
        mesonSwapStatus: null
      }
    }),

  unwrapAll: async (
    address: `0x${string}`,
    switchChain: any,
    walletClient: WalletClient,
    tokens: types.mp.TokenDataMap
  ) => {
    log.info('Running unwrapAll')
    set({ loading: true, errorMessage: undefined })
    notify.temporaryInfo('Unwrapping all tokens...')
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
      notify.temporarySuccess('Tokens unwrapped successfully')
    } catch (err) {
      console.error(err)
      const msg = err.message ? err.message : DEFAULT_ERROR_MSG
      const errorMessage = new dc.TransactionErrorMessage(msg, get().errorMessageClosedFallback)
      notify.permanentError(errorMessage.headline || errorMessage.text || 'Bridge transfer failed')
      set({ errorMessage })
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
        if (isTrailsAction(action)) {
          action.trailsQuote = get().trailsQuote
          action.setTrailsIntentId = (id: string) => set({ trailsIntentId: id })
          action.setTrailsImaCompleted = () => set({ trailsImaCompleted: true })
        }
        if (isMesonAction(action)) {
          action.mesonQuote = get().mesonQuote
          action.setMesonSwapId = (id: string) => set({ mesonSwapId: id, mesonTrackerReady: true })
          action.setMesonSwapStatus = (status) => set({ mesonSwapStatus: status })
        }
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
        headline = headline.charAt(0).toUpperCase() + headline.slice(1)

        notify.permanentError(headline)

        set({
          loading: false,
          errorMessage: new dc.TransactionErrorMessage(
            msg,
            get().errorMessageClosedFallback,
            headline,
            true
          )
        })
        return
      }

      set({ currentStep: get().currentStep + 1 })

      const isTransferFinished = get().currentStep === get().stepsMetadata.length
      if (isTransferFinished) {
        const entry: types.mp.TransferHistory = {
          transactions: get().transactionsHistory,
          chainName1: get().chainName1,
          chainName2: get().chainName2,
          amount: get().amount,
          tokenKeyname: get().token.keyname,
          address: address
        }
        const intentId = get().trailsIntentId
        if (intentId) {
          entry.trailsIntentId = intentId
          entry.trailsStatus = 'succeeded'
        }
        const mesonSwapId = get().mesonSwapId
        if (mesonSwapId) {
          entry.mesonSwapId = mesonSwapId
          entry.mesonStatus = 'succeeded'
        }
        get().setTransfersHistory([...get().transfersHistory, entry])

        const symbol = entry.tokenKeyname?.toUpperCase() ?? 'tokens'
        const displayAmount = entry.amount.includes('.') ? entry.amount : Number(entry.amount).toLocaleString()
        notify.temporarySuccess(`${displayAmount} ${symbol} transferred`)

        set({ loading: false, transferInProgress: false })
        return
      }
      const stepMetadata = get().stepsMetadata[get().currentStep]
      if (stepMetadata.type !== dc.ActionType.recharge) {
        set({ loading: false })
        return
      }

      log.info('Auto-advancing past recharge step')
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
      destTokenBalance: null,
      trailsQuote: null,
      trailsQuoteError: null,
      trailsIntentId: null,
      trailsTrackerReady: false,
      trailsImaCompleted: false,
      mesonQuote: null,
      mesonQuoteError: null,
      mesonSwapId: null,
      mesonTrackerReady: false,
      mesonSwapStatus: null
    })
  },

  check: async (amount: string, address: types.AddressType, options?: { silent?: boolean }) => {
    const silent = options?.silent ?? false
    const requestId = ++checkRequestId
    if (get().stepsMetadata[get().currentStep] && address) {
      if (!silent) {
        set({
          loading: true,
          btnText: 'Checking balance...'
        })
      }
      try {
        const stepMetadata = get().stepsMetadata[get().currentStep]

        let checkStep = stepMetadata
        if (stepMetadata.type === dc.ActionType.recharge) {
          await get().updateCPData(address, stepMetadata.from, stepMetadata.to)
          if (requestId !== checkRequestId) return
          if (get().cpData.exitGasOk) {
            log.info('Bridge balance OK, skipping recharge step')
            set({ currentStep: get().currentStep + 1 })
          } else if (get().cpData.recommendedRechargeAmount) {
            const rechargeWei = units.toWei(String(get().cpData.recommendedRechargeAmount), constants.DEFAULT_ERC20_DECIMALS)
            if (get().cpData.accountBalance != null && get().cpData.accountBalance < rechargeWei) {
              stepMetadata.btnText = 'Insufficient ETH for top up'
            } else {
              stepMetadata.btnText = `Top up ${get().cpData.recommendedRechargeAmount} ETH`
            }
            set({ stepsMetadata: [...get().stepsMetadata] })
          }
          const nextStep = get().stepsMetadata[get().currentStep]
          if (nextStep) checkStep = nextStep
        }

        const trailsCheck =
          checkStep.type === dc.ActionType.trails_ext2m ||
          checkStep.type === dc.ActionType.trails_ext2s ||
          checkStep.type === dc.ActionType.trails_m2ext

        const mesonCheck =
          checkStep.type === dc.ActionType.meson_ext2s ||
          checkStep.type === dc.ActionType.meson_s2ext

        const trailsM2ExtStep = get().stepsMetadata.find(
          (s) => s.type === dc.ActionType.trails_m2ext
        )

        if (!silent) {
          set({
            loading: true,
            btnText: trailsCheck || trailsM2ExtStep || mesonCheck ? 'Getting quote...' : 'Checking balance...'
          })
        }

        const ActionClass: ActionConstructor = ACTIONS[checkStep.type]
        const action = await (ActionClass.create as any)(
          get().mpc,
          checkStep.from,
          checkStep.to,
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
        if (requestId !== checkRequestId) {
          return
        }

        if (isTrailsAction(action)) {
          set({ trailsQuote: action.trailsQuote, trailsQuoteError: action.trailsQuoteError })
        } else if (trailsM2ExtStep) {
          const TrailsClass: ActionConstructor = ACTIONS[trailsM2ExtStep.type]
          const trailsAction = await (TrailsClass.create as any)(
            get().mpc,
            trailsM2ExtStep.from,
            trailsM2ExtStep.to,
            address,
            amount,
            get().tokenId,
            get().token,
            () => { },
            get().setBtnText,
            null,
            null
          )
          await trailsAction.preAction()
          if (requestId !== checkRequestId) return
          if (isTrailsAction(trailsAction)) {
            set({
              trailsQuote: trailsAction.trailsQuote,
              trailsQuoteError: trailsAction.trailsQuoteError
            })
          }
        } else {
          set({ trailsQuote: null, trailsQuoteError: null })
        }

        if (isMesonAction(action)) {
          set({ mesonQuote: action.mesonQuote, mesonQuoteError: action.mesonQuoteError })
        } else {
          set({ mesonQuote: null, mesonQuoteError: null })
        }
      } catch (err) {
        console.error(err)
        if (!silent && requestId === checkRequestId) {
          const msg = err.code && err.fault ? `${err.code} - ${err.fault}` : 'Something went wrong'

          notify.permanentError(msg)

          set({
            errorMessage: new dc.TransactionErrorMessage(
              err.message,
              get().errorMessageClosedFallback,
              msg,
              false
            )
          })
        }
      } finally {
        if (!silent && requestId === checkRequestId) {
          set({ loading: false })
        }
      }
    }
    if (!silent && requestId === checkRequestId) {
      set({ loading: false })
    }
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
    set({ ...result, trailsQuote: null, trailsQuoteError: null, trailsIntentId: null, trailsTrackerReady: false, trailsImaCompleted: false, mesonQuote: null, mesonQuoteError: null, mesonSwapId: null, mesonTrackerReady: false, mesonSwapStatus: null })
  },

  setChainName2: async (name: string, customToken?: dc.TokenData) => {
    const result = await get().mpc.chainChanged(get().chainName1, name, customToken ?? get().token)
    set({ ...result, trailsQuote: null, trailsQuoteError: null, trailsIntentId: null, trailsTrackerReady: false, trailsImaCompleted: false, mesonQuote: null, mesonQuoteError: null, mesonSwapId: null, mesonTrackerReady: false, mesonSwapStatus: null })
  },

  swapChains: async () => {
    const result = await get().mpc.chainChanged(get().chainName2, get().chainName1, get().token)
    set({ ...result, trailsQuote: null, trailsQuoteError: null, trailsIntentId: null, trailsTrackerReady: false, trailsImaCompleted: false, mesonQuote: null, mesonQuoteError: null, mesonSwapId: null, mesonTrackerReady: false, mesonSwapStatus: null })
  },

  addressChanged: () => {
    if (get().transferInProgress) {
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
    set({
      ...get().mpc.tokenChanged(get().chainName1, get().ima2, token, get().chainName2),
      trailsQuote: null,
      trailsQuoteError: null,
      trailsIntentId: null,
      trailsTrackerReady: false,
      trailsImaCompleted: false,
      mesonQuote: null,
      mesonQuoteError: null,
      mesonSwapId: null,
      mesonTrackerReady: false,
      mesonSwapStatus: null
    })
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
