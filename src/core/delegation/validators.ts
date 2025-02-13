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
 * @file validators.ts
 * @copyright SKALE Labs 2024-Present
 */

import { Logger, type ILogObj } from 'tslog'
import { type Contract } from 'ethers'
import { types } from '@/core'
import { DelegationState } from './delegations'

const log = new Logger<ILogObj>({ name: 'portal:core:validators' })

export const ESCROW_VALIDATORS = [
  43, 46, 54, 37, 48, 49, 42, 41, 47, 40, 52, 35, 36, 39, 50, 45, 51, 68, 30
]

const STATUS_ORDER = {
  [DelegationState.PROPOSED]: 1,
  [DelegationState.ACCEPTED]: 2,
  [DelegationState.DELEGATED]: 3,
  [DelegationState.COMPLETED]: 4,
  [DelegationState.CANCELED]: 5,
  [DelegationState.REJECTED]: 6,
  [DelegationState.UNDELEGATION_REQUESTED]: 7
}

export type SortType = 'id' | 'status'

export function sortDelegations(
  delegations: types.st.IDelegation[],
  sortBy: SortType
): types.st.IDelegation[] {
  return [...delegations].sort((a, b) => {
    if (sortBy === 'id') {
      return Number(b.id) - Number(a.id)
    } else {
      const aStatus = Number(a.stateId) as DelegationState
      const bStatus = Number(b.stateId) as DelegationState
      const statusComparison = STATUS_ORDER[aStatus] - STATUS_ORDER[bStatus]
      if (statusComparison === 0) {
        return Number(b.id) - Number(a.id)
      }

      return statusComparison
    }
  })
}

async function getValidatorsRaw(
  validatorService: Contract,
  numberOfValidators: bigint[]
): Promise<Array<types.st.IValidatorArray | boolean>> {
  const validatorIds = Array.from(Array(Number(numberOfValidators)).keys())
  return await Promise.all(
    validatorIds
      .map((validatorId) => [
        validatorService.validators(validatorId + 1),
        validatorService.isAuthorizedValidator(validatorId + 1),
        validatorService.getNodeAddresses(validatorId + 1)
      ])
      .flat()
  )
}

export async function getValidatorRaw(
  validatorService: Contract,
  validatorId: number
): Promise<[types.st.IValidatorArray, boolean, string[]]> {
  const [validatorData, isAuthorized, nodeAddresses] = await Promise.all([
    validatorService.validators(validatorId),
    validatorService.isAuthorizedValidator(validatorId),
    validatorService.getNodeAddresses(validatorId)
  ])
  return [validatorData, isAuthorized, nodeAddresses]
}

function formatValidator(
  validatorData: types.st.IValidatorArray,
  isAuthorized: boolean,
  nodeAddresses: string[],
  validatorId: number
): types.st.IValidator {
  return {
    name: validatorData[0],
    validatorAddress: validatorData[1],
    requestedAddress: validatorData[2],
    description: validatorData[3],
    feeRate: validatorData[4],
    registrationTime: validatorData[5],
    minimumDelegationAmount: validatorData[6],
    acceptNewRequests: validatorData[7],
    trusted: isAuthorized,
    id: validatorId,
    linkedNodes: nodeAddresses.length
  }
}

export async function getValidators(
  validatorService: Contract,
  sorted: boolean = true
): Promise<types.st.IValidator[]> {
  const numberOfValidators = await validatorService.numberOfValidators()
  log.info('getValidators: ', numberOfValidators)
  const rawValidators: Array<types.st.IValidatorArray | boolean | any[]> = await getValidatorsRaw(
    validatorService,
    numberOfValidators
  )
  const validatorsData: types.st.IValidator[] = []
  for (let i = 0; i < rawValidators.length; i += 3) {
    const validatorArray: types.st.IValidatorArray = rawValidators[i] as types.st.IValidatorArray
    const isTrusted: boolean = rawValidators[i + 1] as boolean
    const linkedNodeAddresses = rawValidators[i + 2] as string[]
    validatorsData.push(formatValidator(validatorArray, isTrusted, linkedNodeAddresses, i / 3 + 1))
  }
  return sorted ? sortValidators(validatorsData) : validatorsData
}

export async function getValidator(
  validatorService: Contract,
  address: types.AddressType
): Promise<types.st.IValidator | undefined> {
  try {
    const validatorId = await validatorService.getValidatorId(address)
    const [validatorData, isAuthorized, nodeAddresses] = await getValidatorRaw(
      validatorService,
      validatorId
    )
    return formatValidator(validatorData, isAuthorized, nodeAddresses, Number(validatorId))
  } catch (error: any) {
    if (
      error?.message?.includes('Validator address does not exist') ||
      error?.message?.includes('ValidatorAddressDoesNotExist')
    ) {
      return undefined
    }
    throw error
  }
}

function sortValidators(validatorsData: types.st.IValidator[]): types.st.IValidator[] {
  validatorsData.sort((a, b) => {
    if (a.trusted !== b.trusted) {
      return a.trusted ? -1 : 1
    }
    if (a.acceptNewRequests !== b.acceptNewRequests) {
      return a.acceptNewRequests ? -1 : 1
    }

    const nameComparison = a.name.localeCompare(b.name)
    if (nameComparison !== 0) {
      return nameComparison
    }
    return 0
  })
  return validatorsData
}

export function filterValidators(
  validators: types.st.IValidator[],
  ids: number[],
  internal: boolean
): types.st.IValidator[] {
  return validators.filter(
    (val) => (ids.includes(val.id) && internal) || (!ids.includes(val.id) && !internal)
  )
}

export function getValidatorById(
  validators: types.st.IValidator[],
  id: bigint
): types.st.IValidator | undefined {
  return validators.find((val) => Number(val.id) === Number(id))
}
