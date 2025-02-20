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

import { Logger, type ILogObj } from 'tslog'
import { dc, type types, constants } from '@/core'

const log = new Logger<ILogObj>({ name: 'metaport:core:transfer_steps' })

export function getStepsMetadata(
  config: types.mp.Config,
  token: dc.TokenData,
  to: string
): dc.StepMetadata[] {
  const steps: dc.StepMetadata[] = []
  if (token === undefined || token === null || to === null || to === '') return steps

  const toChain = token.connections[to].hub ?? to
  const hubTokenOptions = config.connections[toChain][token.type][token.keyname].chains[token.chain]
  const destTokenOptions = config.connections[to][token.type][token.keyname].chains[token.chain]
  const isCloneToClone = token.isClone(to) && destTokenOptions.clone

  log.info(`Setting toChain: ${toChain}`)

  if (token.connections[toChain].wrapper) {
    steps.push(new dc.WrapStepMetadata(token.chain, to))
  }
  steps.push(
    new dc.TransferStepMetadata(
      dc.getActionType(token.chain, toChain, token.type),
      token.chain,
      toChain
    )
  )
  if (hubTokenOptions.wrapper && !isCloneToClone) {
    steps.push(new dc.UnwrapStepMetadata(token.chain, toChain))
  }
  if (token.connections[to].hub) {
    const tokenOptionsHub = config.connections[toChain][token.type][token.keyname].chains[to]
    if (tokenOptionsHub.wrapper && !isCloneToClone) {
      steps.push(new dc.WrapStepMetadata(toChain, to))
    }
    steps.push(new dc.TransferStepMetadata(dc.getActionType(toChain, to, token.type), toChain, to))
  }
  if (to === constants.MAINNET_CHAIN_NAME && token.keyname === 'eth') {
    steps.push(new dc.UnlockStepMetadata(token.chain, to))
  }

  log.info(`Action steps metadata:`)
  log.info(steps)
  return steps
}
