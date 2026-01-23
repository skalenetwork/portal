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

import { ArrowUpRight, Check, ExternalLink, LockOpen, SendToBack } from 'lucide-react'


import { getTxUrl } from '../../core/explorer'

import localStyles from './TransactionData.module.scss'
import { CHAINS_META } from '../../core/metadata'

type ActionStateIconMap = {
  [key in types.mp.ActionState]: ReactElement | null
}

type ActionStateAliasMap = {
  [key in types.mp.ActionState]: string | null
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
  unlock: null
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
  unlock: null
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
  return (
    <div className="flex items-center mb-2">
      <div>
        <span className= "relative flex items-center justify-center">
          <span className= "w-[30px] h-[30px] rounded-full bg-muted absolute" />
          <span className= "flex items-center justify-center text-foreground w-[30px] h-[30px] z-10">
            {actionIcons[props.transactionData.txName]}
          </span>
        </span>
      </div>
      <div className="ml-5 grow flex">
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
          <ExternalLink className="text-foreground" />
        </IconButton>
      </div>
    </div>
  )
}
