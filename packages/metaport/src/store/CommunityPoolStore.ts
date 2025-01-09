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
 * @file CommunityPoolStore.ts
 * @copyright SKALE Labs 2023-Present
 */

import { create } from 'zustand'
import { MainnetChain, SChain } from '@skalenetwork/ima-js'

import * as interfaces from '../core/interfaces'
import { getEmptyCommunityPoolData, getCommunityPoolData } from '../core/community_pool'
import MetaportCore from '../core/metaport'

interface CommunityPoolState {
  cpData: interfaces.CommunityPoolData
  setCpData: (cpData: interfaces.CommunityPoolData) => void
  loading: string | false
  setLoading: (loading: string | false) => void
  amount: string
  setAmount: (amount: string) => void
  updateCPData: (address: string, chainName1: string, chainName2: string, mpc: MetaportCore) => void
  chainName: string
  mainnet: MainnetChain
  sChain: SChain
}

export const useCPStore = create<CommunityPoolState>()((set, get) => ({
  cpData: getEmptyCommunityPoolData(),
  setCpData: (cpData: interfaces.CommunityPoolData) => set(() => ({ cpData: cpData })),
  loading: false,
  setLoading: (loading: string | false) => set(() => ({ loading: loading })),
  amount: '',
  setAmount: (amount: string) =>
    set(() => {
      return { amount: amount }
    }),

  mainnet: null,
  sChain: null,
  chainName: null,

  updateCPData: async (
    address: string,
    chainName1: string,
    chainName2: string,
    mpc: MetaportCore
  ) => {
    if (!chainName1 || !chainName2) return
    if (!get().mainnet) {
      set({ mainnet: mpc.mainnet() })
    }
    if (!get().sChain || get().chainName !== chainName1) {
      set({ sChain: mpc.schain(chainName1) })
    }
    const cpData = await getCommunityPoolData(
      address,
      chainName1,
      chainName2,
      get().mainnet,
      get().sChain
    )

    const currentAmount = get().amount
    set({
      chainName: chainName1,
      cpData: cpData,
      amount:
        cpData.recommendedRechargeAmount && currentAmount === ''
          ? cpData.recommendedRechargeAmount.toString()
          : currentAmount
    })
  }
}))
