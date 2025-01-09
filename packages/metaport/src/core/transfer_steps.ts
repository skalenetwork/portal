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
 * @file transfer_steps.ts
 * @copyright SKALE Labs 2023-Present
 */

import debug from 'debug'

import {
  TokenData,
  WrapStepMetadata,
  UnwrapStepMetadata,
  TransferStepMetadata,
  UnlockStepMetadata,
  StepMetadata,
  getActionType
} from './dataclasses'

import { MetaportConfig } from './interfaces/index'

import { MAINNET_CHAIN_NAME } from './constants'

debug.enable('*')
const log = debug('metaport:core:transferSteps')

export function getStepsMetadata(
  config: MetaportConfig,
  token: TokenData,
  to: string
): StepMetadata[] {
  const steps: StepMetadata[] = []
  if (token === undefined || token === null || to === null || to === '') return steps

  const toChain = token.connections[to].hub ?? to
  const hubTokenOptions = config.connections[toChain][token.type][token.keyname].chains[token.chain]
  const destTokenOptions = config.connections[to][token.type][token.keyname].chains[token.chain]
  const isCloneToClone = token.isClone(to) && destTokenOptions.clone

  log(`Setting toChain: ${toChain}`)

  if (token.connections[toChain].wrapper) {
    steps.push(new WrapStepMetadata(token.chain, to))
  }
  steps.push(
    new TransferStepMetadata(getActionType(token.chain, toChain, token.type), token.chain, toChain)
  )
  if (hubTokenOptions.wrapper && !isCloneToClone) {
    steps.push(new UnwrapStepMetadata(token.chain, toChain))
  }
  if (token.connections[to].hub) {
    const tokenOptionsHub = config.connections[toChain][token.type][token.keyname].chains[to]
    if (tokenOptionsHub.wrapper && !isCloneToClone) {
      steps.push(new WrapStepMetadata(toChain, to))
    }
    steps.push(new TransferStepMetadata(getActionType(toChain, to, token.type), toChain, to))
  }
  if (to === MAINNET_CHAIN_NAME && token.keyname === 'eth') {
    steps.push(new UnlockStepMetadata(token.chain, to))
  }

  log(`Action steps metadata:`)
  log(steps)
  return steps
}
