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
 * @file PortalState.ts
 * @copyright SKALE Labs 2025-Present
 */

import { types } from '@/core'
import { type MetaportCore } from '@skalenetwork/metaport'

export type PortalState = {
  schains: types.ISChain[]
  metrics: types.IMetrics | null
  stats: types.IStats | null
  validator: types.st.IValidator | null | undefined
  validatorDelegations: types.st.IDelegation[] | null
  customAddress: types.AddressType | undefined
  sc: types.st.ISkaleContractsMap | null
  loadCalled: boolean

  chainsMeta: types.ChainsMetadataMap | null
  termsAccepted: boolean
  stakingTermsAccepted: boolean
  validators: types.st.IValidator[]
  si: types.st.StakingInfoMap

  setCustomAddress: (address: types.AddressType | undefined) => void
  setTermsAccepted: (accepted: boolean) => void
  setStakingTermsAccepted: (accepted: boolean) => void
  initSkaleContracts: (mpc: MetaportCore) => Promise<void>
  loadChains: (mpc: MetaportCore) => Promise<void>
  loadMetrics: (mpc: MetaportCore) => Promise<void>
  loadStats: (mpc: MetaportCore) => Promise<void>
  loadValidator: (address: types.AddressType | undefined) => Promise<void>
  loadData: (mpc: MetaportCore, address: types.AddressType | undefined) => Promise<void>
  loadMetadata: (mpc: MetaportCore) => Promise<void>
  loadValidators: () => Promise<void>
  loadStakingInfo: (address: types.AddressType | undefined) => Promise<void>
}
