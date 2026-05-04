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
 * @file BridgeBalanceStore.ts
 * @copyright SKALE Labs 2025-Present
 */

import { create } from 'zustand'
import { constants, types } from '@/core'
import { getEmptyCommunityPoolData, getCommunityPoolData } from '../core/community_pool'
import MetaportCore from '../core/metaport'
import { MainnetChain, SChain } from '../core/contracts'

interface ChainState {
  cpData: types.mp.CommunityPoolData
  loading: string | false
  amount: string
}

interface BridgeBalanceState {
  chains: Record<string, ChainState>
  accountBalance: bigint | null
  mainnet: MainnetChain | null
  schains: Record<string, SChain>

  setAmount: (chainName: string, amount: string) => void
  setLoading: (chainName: string, loading: string | false) => void
  initChains: (chainNames: string[]) => void
  updateAllChains: (address: string, chainNames: string[], mpc: MetaportCore) => Promise<void>
  updateChain: (address: string, chainName: string, mpc: MetaportCore) => Promise<void>
}

function emptyChainState(): ChainState {
  return {
    cpData: getEmptyCommunityPoolData(),
    loading: false,
    amount: ''
  }
}

export const useBridgeBalanceStore = create<BridgeBalanceState>()((set, get) => ({
  chains: {},
  accountBalance: null,
  mainnet: null,
  schains: {},

  setAmount: (chainName: string, amount: string) =>
    set((state) => ({
      chains: {
        ...state.chains,
        [chainName]: { ...state.chains[chainName], amount }
      }
    })),

  setLoading: (chainName: string, loading: string | false) =>
    set((state) => ({
      chains: {
        ...state.chains,
        [chainName]: { ...state.chains[chainName], loading }
      }
    })),

  initChains: (chainNames: string[]) => {
    const chains: Record<string, ChainState> = {}
    for (const name of chainNames) {
      chains[name] = get().chains[name] ?? emptyChainState()
    }
    set({ chains })
  },

  updateChain: async (address: string, chainName: string, mpc: MetaportCore) => {
    let mainnet = get().mainnet
    if (!mainnet) {
      mainnet = await mpc.mainnet()
      set({ mainnet })
    }

    let sChain = get().schains[chainName]
    if (!sChain) {
      sChain = await mpc.schain(chainName)
      set((state) => ({ schains: { ...state.schains, [chainName]: sChain } }))
    }

    const cpData = await getCommunityPoolData(
      address,
      chainName,
      constants.MAINNET_CHAIN_NAME,
      mainnet,
      sChain
    )

    set((state) => {
      const current = state.chains[chainName]
      const amount =
        !current?.amount && cpData.recommendedRechargeAmount
          ? String(cpData.recommendedRechargeAmount)
          : current?.amount ?? ''
      return {
        accountBalance: cpData.accountBalance ?? state.accountBalance,
        chains: {
          ...state.chains,
          [chainName]: {
            ...current,
            cpData,
            amount
          }
        }
      }
    })
  },

  updateAllChains: async (address: string, chainNames: string[], mpc: MetaportCore) => {
    for (const chainName of chainNames) {
      try {
        await get().updateChain(address, chainName, mpc)
      } catch (e) {
        console.error(`Failed to update bridge balance for ${chainName}`, e)
      }
    }
  }
}))
