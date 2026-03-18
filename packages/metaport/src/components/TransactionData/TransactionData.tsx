/**
 * @license
 * SKALE Metaport
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
 * @file TransactionData.ts
 * @copyright SKALE Labs 2023-Present
 */

import { ReactElement } from 'react'
import { types } from '@/core'

import IconButton from '@mui/material/IconButton'

import { ArrowUpRight, Blocks, Check, LockOpen, SendToBack } from 'lucide-react'

import { getTxUrl } from '../../core/explorer'

import localStyles from './TransactionData.module.scss'
import { CHAINS_META } from '../../core/metadata'

type ActionStateIconMap = {
  [key in types.mp.ActionState]: ReactElement | null
}

type ActionStateAliasMap = {
  [key in types.mp.ActionState]: string | null
}

type ActionColorMap = {
  [key in types.mp.ActionState]: { bg: string; text: string }
}

const actionColors: ActionColorMap = {
  approveDone: {
    bg: 'bg-emerald-100 dark:bg-emerald-400/15',
    text: 'text-emerald-500 dark:text-emerald-400'
  },
  approveWrapDone: {
    bg: 'bg-emerald-100 dark:bg-emerald-400/15',
    text: 'text-emerald-500 dark:text-emerald-400'
  },
  transferDone: { bg: 'bg-sky-100 dark:bg-blue-400/15', text: 'text-sky-500 dark:text-blue-400' },
  transferETHDone: {
    bg: 'bg-sky-100 dark:bg-blue-400/15',
    text: 'text-sky-500 dark:text-blue-400'
  },
  wrapDone: {
    bg: 'bg-violet-100 dark:bg-violet-400/15',
    text: 'text-violet-500 dark:text-violet-400'
  },
  unwrapDone: {
    bg: 'bg-fuchsia-100 dark:bg-violet-400/15',
    text: 'text-fuchsia-500 dark:text-violet-400'
  },
  unlockDone: {
    bg: 'bg-amber-100 dark:bg-amber-400/15',
    text: 'text-amber-500 dark:text-amber-400'
  },
  rechargeDone: { bg: 'bg-teal-100 dark:bg-teal-400/15', text: 'text-teal-500 dark:text-teal-400' },
  receivedETH: { bg: 'bg-muted', text: 'text-foreground' },
  init: { bg: 'bg-muted', text: 'text-foreground' },
  approve: { bg: 'bg-muted', text: 'text-foreground' },
  transfer: { bg: 'bg-muted', text: 'text-foreground' },
  received: { bg: 'bg-muted', text: 'text-foreground' },
  transferETH: { bg: 'bg-muted', text: 'text-foreground' },
  approveWrap: { bg: 'bg-muted', text: 'text-foreground' },
  wrap: { bg: 'bg-muted', text: 'text-foreground' },
  unwrap: { bg: 'bg-muted', text: 'text-foreground' },
  switch: { bg: 'bg-muted', text: 'text-foreground' },
  unlock: { bg: 'bg-muted', text: 'text-foreground' },
  recharge: { bg: 'bg-muted', text: 'text-foreground' },
  trailsQuoting: { bg: 'bg-muted', text: 'text-foreground' },
  trailsCommitting: { bg: 'bg-muted', text: 'text-foreground' },
  trailsDeposit: { bg: 'bg-muted', text: 'text-foreground' },
  trailsExecuting: { bg: 'bg-muted', text: 'text-foreground' },
  trailsWaiting: { bg: 'bg-muted', text: 'text-foreground' }
}

const actionIcons: ActionStateIconMap = {
  approveDone: <Check size={14} />,
  transferDone: <ArrowUpRight size={14} />,
  transferETHDone: <ArrowUpRight size={14} />,
  approveWrapDone: <Check size={14} />,
  wrapDone: <SendToBack size={14} />,
  unwrapDone: <SendToBack size={14} />,
  unlockDone: <LockOpen size={14} />,
  receivedETH: null,
  init: null,
  approve: null,
  transfer: null,
  received: null,
  transferETH: null,
  approveWrap: null,
  wrap: null,
  unwrap: null,
  switch: null,
  unlock: null,
  recharge: null,
  rechargeDone: <Check size={14} />,
  trailsQuoting: null,
  trailsCommitting: null,
  trailsDeposit: null,
  trailsExecuting: null,
  trailsWaiting: null
}

const actionAliases: ActionStateAliasMap = {
  approveDone: 'Approve',
  transferDone: 'Transfer',
  transferETHDone: 'Transfer ETH',
  approveWrapDone: 'Approve wrap',
  wrapDone: 'Wrap',
  unwrapDone: 'Unwrap',
  unlockDone: 'Unlock ETH',
  receivedETH: null,
  init: null,
  approve: null,
  transfer: null,
  received: null,
  transferETH: null,
  approveWrap: null,
  wrap: null,
  unwrap: null,
  switch: null,
  unlock: null,
  recharge: null,
  rechargeDone: 'Bridge balance topped up',
  trailsQuoting: null,
  trailsCommitting: null,
  trailsDeposit: null,
  trailsExecuting: null,
  trailsWaiting: null
}

export default function TransactionData(props: {
  transactionData: types.mp.TransactionHistory
  config: types.mp.Config
}) {
  const chainsMeta = CHAINS_META[props.config.skaleNetwork]
  const chainMeta = chainsMeta[props.transactionData.chainName]
  const explorerUrl = getTxUrl(
    chainMeta,
    props.transactionData.chainName,
    props.config.skaleNetwork,
    props.transactionData.transactionHash
  )
  const colors = actionColors[props.transactionData.txName]
  return (
    <div className="flex items-center">
      <div>
        <span className="relative flex items-center justify-center">
          <span className={`w-[35px] h-[35px] rounded-full ${colors.bg} absolute`} />
          <span
            className={`flex items-center justify-center ${colors.text} w-[35px] h-[35px] z-10`}
          >
            {actionIcons[props.transactionData.txName]}
          </span>
        </span>
      </div>
      <div className="ml-3.5 grow flex items-center justify-between">
        <div>
          <p className="text-sm capitalize text-foreground font-medium">
            {actionAliases[props.transactionData.txName]}
          </p>
          <p className="text-xs text-secondary-foreground">
            {new Date(props.transactionData.timestamp * 1000).toUTCString()}
          </p>
        </div>
      </div>
      <div>
        <IconButton
          id="basic-button"
          href={explorerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`ml-2.5 ${localStyles.sk__openExplorerBtn}`}
        >
          <Blocks className="text-foreground" />
        </IconButton>
      </div>
    </div>
  )
}
