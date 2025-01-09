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

import { useCollapseStore } from '../store/Store'
import { useMetaportStore } from '../store/MetaportStore'
import { useSFuelStore } from '../store/SFuelStore'

import { MAINNET_CHAIN_NAME } from '../core/constants'
import { AddressType } from '../core/interfaces'

export type DisplayFunctions = {
  showFrom: () => boolean
  showTo: () => boolean
  showSwitch: () => boolean
  showInput: () => boolean
  showStepper: (address: AddressType) => boolean
  showCP: () => boolean
  showWT: (address: AddressType) => boolean
  showTH: (address: AddressType) => boolean
}

export const useDisplayFunctions = (): DisplayFunctions => {
  const expandedFrom = useCollapseStore((state) => state.expandedFrom)
  const expandedTo = useCollapseStore((state) => state.expandedTo)
  const expandedTokens = useCollapseStore((state) => state.expandedTokens)
  const expandedCP = useCollapseStore((state) => state.expandedCP)
  const expandedTH = useCollapseStore((state) => state.expandedTH)
  const expandedWT = useCollapseStore((state) => state.expandedWT)

  const chainName2 = useMetaportStore((state) => state.chainName2)
  const token = useMetaportStore((state) => state.token)
  const errorMessage = useMetaportStore((state) => state.errorMessage)

  const fromChainData = useSFuelStore((state) => state.fromChainData)
  const toChainData = useSFuelStore((state) => state.toChainData)
  const hubChainData = useSFuelStore((state) => state.hubChainData)

  const fromOk = fromChainData && fromChainData.ok
  const toOk = toChainData && toChainData.ok
  const hubOk = (hubChainData && hubChainData.ok) || !hubChainData

  const sFuelOk = fromOk && toOk && hubOk

  const showFrom = (): boolean => {
    return !expandedTo && !expandedTokens && !errorMessage && !expandedCP && !expandedTH
  }

  const showTo = (): boolean => {
    return (
      !expandedFrom && !expandedTokens && !errorMessage && !expandedCP && !expandedWT && !expandedTH
    )
  }

  const showInput = (): boolean => {
    return (
      !expandedFrom && !expandedTo && !errorMessage && !expandedCP && !expandedWT && !expandedTH
    )
  }

  const showSwitch = (): boolean => {
    return (
      !expandedFrom &&
      !expandedTo &&
      !expandedTokens &&
      !errorMessage &&
      !expandedCP &&
      !expandedWT &&
      !expandedTH
    )
  }

  const showStepper = (address: AddressType): boolean => {
    return (
      !expandedFrom &&
      !expandedTo &&
      !expandedTokens &&
      !errorMessage &&
      !expandedCP &&
      sFuelOk &&
      !expandedWT &&
      !expandedTH &&
      !!address
    )
  }

  const showCP = (): boolean => {
    return (
      !expandedFrom &&
      !expandedTo &&
      !expandedTokens &&
      !expandedTH &&
      chainName2 === MAINNET_CHAIN_NAME &&
      !expandedWT &&
      !!token
    )
  }

  const showWT = (address: AddressType): boolean => {
    return (
      !expandedFrom &&
      !expandedTo &&
      !expandedTokens &&
      !errorMessage &&
      !expandedCP &&
      !expandedTH &&
      sFuelOk &&
      !!address &&
      !!token
    )
  }

  const showTH = (address: AddressType): boolean => {
    return (
      !expandedFrom &&
      !expandedTo &&
      !expandedTokens &&
      !errorMessage &&
      !expandedCP &&
      !expandedWT &&
      !!address
    )
  }

  return {
    showFrom,
    showTo,
    showInput,
    showSwitch,
    showStepper,
    showCP,
    showWT,
    showTH
  }
}
