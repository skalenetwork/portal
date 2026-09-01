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
 * @file DisplayStore.ts
 * @copyright SKALE Labs 2023-Present
 */

import { type types } from '@/core'
import { useCollapseStore } from '../store/Store'
import { useMetaportStore } from '../store/MetaportStore'
import { useSFuelStore } from '../store/SFuelStore'

export type DisplayFunctions = {
  showFrom: () => boolean
  showTo: () => boolean
  showSwitch: () => boolean
  showInput: () => boolean
  showStepper: (address: types.AddressType) => boolean
  showWT: (address: types.AddressType) => boolean
  showTH: (address: types.AddressType) => boolean
}

export const useDisplayFunctions = (): DisplayFunctions => {
  const expandedFrom = useCollapseStore((state) => state.expandedFrom)
  const expandedTo = useCollapseStore((state) => state.expandedTo)
  const expandedTokens = useCollapseStore((state) => state.expandedTokens)
  const expandedTH = useCollapseStore((state) => state.expandedTH)
  const expandedWT = useCollapseStore((state) => state.expandedWT)

  const token = useMetaportStore((state) => state.token)
  const errorMessage = useMetaportStore((state) => state.errorMessage)

  const hubChainData = useSFuelStore((state) => state.hubChainData)
  const hubOk = (hubChainData && hubChainData.ok) || !hubChainData

  const showFrom = (): boolean => {
    return !expandedTo && !expandedTokens && !errorMessage && !expandedTH
  }

  const showTo = (): boolean => {
    return !expandedFrom && !expandedTokens && !errorMessage && !expandedWT && !expandedTH
  }

  const showInput = (): boolean => {
    return !expandedFrom && !expandedTo && !errorMessage && !expandedWT && !expandedTH
  }

  const showSwitch = (): boolean => {
    return (
      !expandedFrom && !expandedTo && !expandedTokens && !errorMessage && !expandedWT && !expandedTH
    )
  }

  const showStepper = (address: types.AddressType): boolean => {
    return (
      !expandedFrom &&
      !expandedTo &&
      !expandedTokens &&
      !errorMessage &&
      hubOk &&
      !expandedWT &&
      !expandedTH &&
      !!address
    )
  }

  const showWT = (address: types.AddressType): boolean => {
    return (
      !expandedFrom &&
      !expandedTo &&
      !expandedTokens &&
      !errorMessage &&
      !expandedTH &&
      !!address &&
      !!token
    )
  }

  const showTH = (address: types.AddressType): boolean => {
    return (
      !expandedFrom && !expandedTo && !expandedTokens && !errorMessage && !expandedWT && !!address
    )
  }

  return {
    showFrom,
    showTo,
    showInput,
    showSwitch,
    showStepper,
    showWT,
    showTH
  }
}
