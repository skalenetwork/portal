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
 * @file PortalStore.ts
 * @copyright SKALE Labs 2025-Present
 */

import { create } from 'zustand'
import { endpoints, metadata } from '@/core'
import { contracts, type MetaportCore } from '@skalenetwork/metaport'

import { formatSChains } from './core/chain'
import { getValidatorDelegations } from './core/delegation/staking'
import { getValidators, getValidator } from './core/delegation/validators'
import { getStakingInfoMap } from './core/delegation/staking'
import { STATS_API } from './core/constants'

import { PortalState } from './PortalState'

const usePortalStore = create<PortalState>()((set, get) => ({
  schains: [],
  metrics: null,
  stats: null,
  validator: null,
  validatorDelegations: null,
  customAddress: undefined,
  sc: null,
  loadCalled: false,

  chainsMeta: null,
  termsAccepted: false,
  stakingTermsAccepted: false,
  validators: [],
  si: { 0: null, 1: null, 2: null },

  setCustomAddress: (address) => set({ customAddress: address }),
  setTermsAccepted: (accepted) => set({ termsAccepted: accepted }),
  setStakingTermsAccepted: (accepted) => set({ stakingTermsAccepted: accepted }),

  initSkaleContracts: async (mpc: MetaportCore) => {
    if (get().loadCalled) return
    set({ loadCalled: true })
    try {
      const sc = await contracts.initContracts(mpc)
      set({ sc })
    } catch (e) {
      console.error('Failed to initialize SKALE contracts', e)
    }
  },

  loadChains: async (mpc: MetaportCore) => {
    try {
      const endpoint = endpoints.getProxyEndpoint(mpc.config.skaleNetwork)
      const response = await fetch(`https://${endpoint}/files/chains.json`)
      const chainsJson = await response.json()
      set({ schains: formatSChains(chainsJson) })
    } catch (e) {
      console.error('Failed to load chains', e)
    }
  },

  loadMetrics: async (mpc: MetaportCore) => {
    try {
      const endpoint = endpoints.getProxyEndpoint(mpc.config.skaleNetwork)
      const response = await fetch(`https://${endpoint}/files/metrics.json`)
      const metricsJson = await response.json()
      set({ metrics: metricsJson })
    } catch (e) {
      console.error('Failed to load metrics', e)
    }
  },

  loadStats: async (mpc: MetaportCore) => {
    const statsApi = STATS_API[mpc.config.skaleNetwork]
    if (!statsApi) return
    try {
      const response = await fetch(statsApi)
      const statsResp = await response.json()
      set({ stats: statsResp.payload })
    } catch (e) {
      console.error('Failed to load stats', e)
    }
  },

  loadValidator: async (address) => {
    const sc = get().sc
    if (!sc || !address) {
      set({ validator: null, validatorDelegations: null })
      return
    }
    try {
      const validatorData = await getValidator(sc.validatorService, address)
      set({ validator: validatorData })
      if (validatorData && validatorData.id) {
        const delegations = await getValidatorDelegations(sc, validatorData.id)
        set({ validatorDelegations: delegations })
      } else {
        set({ validator: undefined, validatorDelegations: null })
      }
    } catch (e) {
      console.error('Failed to load validator', e)
    }
  },

  loadData: async (mpc, address) => {
    await Promise.all([
      get().loadChains(mpc),
      get().loadMetrics(mpc),
      get().loadStats(mpc),
      get().loadValidator(address),
      get().loadMetadata(mpc)
    ])
  },

  loadMetadata: async (mpc: MetaportCore) => {
    try {
      const chainsMeta = await metadata.loadMeta(mpc.config.skaleNetwork)
      set({ chainsMeta: chainsMeta })
    } catch (e) {
      console.error('Failed to load metadata', e)
    }
  },

  loadValidators: async () => {
    const sc = get().sc
    if (!sc) return
    try {
      const validatorsData = await getValidators(sc.validatorService)
      set({ validators: validatorsData })
    } catch (e) {
      console.error('Failed to load validators', e)
    }
  },

  loadStakingInfo: async (address) => {
    const sc = get().sc
    if (!sc) return
    try {
      const si = await getStakingInfoMap(sc, address)
      set({ si })
    } catch (e) {
      console.error('Failed to load staking info', e)
    }
  }
}))

export default usePortalStore
