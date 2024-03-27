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

import debug from 'debug'
import { type Contract } from 'ethers'

import { type IValidatorArray, type IValidator } from '../interfaces'

debug.enable('*')
const log = debug('portal:core:validators')

export const ESCROW_VALIDATORS = [
  43, 46, 54, 37, 48, 49, 42, 41, 47, 40, 52, 35, 36, 39, 50, 45, 51
]

async function getValidatorsRaw(
  validatorService: Contract,
  numberOfValidators: bigint[]
): Promise<Array<IValidatorArray | boolean>> {
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

export async function getValidators(
  validatorService: Contract,
  sorted: boolean = true
): Promise<IValidator[]> {
  const numberOfValidators = await validatorService.numberOfValidators()
  log('getValidators: ', numberOfValidators)
  const rawValidators: Array<IValidatorArray | boolean | any[]> = await getValidatorsRaw(
    validatorService,
    numberOfValidators
  )
  const validatorsData: IValidator[] = []
  for (let i = 0; i < rawValidators.length; i += 3) {
    const IValidatorArray: IValidatorArray = rawValidators[i] as IValidatorArray
    const isTrusted: boolean = rawValidators[i + 1] as boolean
    const linkedNodeAddresses = rawValidators[i + 2] as string[]
    validatorsData.push({
      name: IValidatorArray[0],
      validatorAddress: IValidatorArray[1],
      requestedAddress: IValidatorArray[2],
      description: IValidatorArray[3],
      feeRate: IValidatorArray[4],
      registrationTime: IValidatorArray[5],
      minimumDelegationAmount: IValidatorArray[6],
      acceptNewRequests: IValidatorArray[7],
      trusted: isTrusted,
      id: i / 3 + 1,
      linkedNodes: linkedNodeAddresses.length
    })
  }
  return sorted ? sortValidators(validatorsData) : validatorsData
}

function sortValidators(validatorsData: IValidator[]): IValidator[] {
  validatorsData.sort((a, b) => {
    if (a.trusted !== b.trusted) {
      return a.trusted ? -1 : 1
    }
    if (a.acceptNewRequests !== b.acceptNewRequests) {
      return a.acceptNewRequests ? -1 : 1
    }

    // if (ESCROW_VALIDATORS.includes(a.id) !== ESCROW_VALIDATORS.includes(b.id)) {
    //   return a.acceptNewRequests ? -1 : 1
    // }

    const nameComparison = a.name.localeCompare(b.name)
    if (nameComparison !== 0) {
      return nameComparison
    }
    return 0
  })
  return validatorsData
}

export function filterValidators(
  validators: IValidator[],
  ids: number[],
  internal: boolean
): IValidator[] {
  return validators.filter(
    (val) => (ids.includes(val.id) && internal) || (!ids.includes(val.id) && !internal)
  )
}

export function getValidatorById(validators: IValidator[], id: bigint): IValidator | undefined {
  return validators.find((val) => Number(val.id) === Number(id))
}
