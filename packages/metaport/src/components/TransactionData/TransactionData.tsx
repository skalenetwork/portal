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

import MoveUpIcon from '@mui/icons-material/MoveUp'
import MoveDownIcon from '@mui/icons-material/MoveDown'
import LockOpenIcon from '@mui/icons-material/LockOpen'
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import DoneRoundedIcon from '@mui/icons-material/DoneRounded'

import { getTxUrl } from '../../core/explorer'

import localStyles from './TransactionData.module.scss'
import { styles } from '../../core/css'
import { CHAINS_META } from '../../core/metadata'

type ActionStateIconMap = {
  [key in types.mp.ActionState]: ReactElement | null
}

type ActionStateAliasMap = {
  [key in types.mp.ActionState]: string | null
}

const actionIcons: ActionStateIconMap = {
  approveDone: <DoneRoundedIcon />,
  transferDone: <ArrowOutwardIcon />,
  transferETHDone: <ArrowOutwardIcon />,
  approveWrapDone: <DoneRoundedIcon />,
  wrapDone: <MoveDownIcon />,
  unwrapDone: <MoveUpIcon />,
  unlockDone: <LockOpenIcon />,
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
    <div className="flex items-center mt-1.5 mb-1.5 ml-1.5 mr-1.5">
      <div>
        <div
          className={`${localStyles.transactionDataIcon} flex items-center text-primary ${styles[`action_${props.transactionData.txName}`]}`}
        >
          {actionIcons[props.transactionData.txName]}
        </div>
      </div>
      <div className="ml-5 flex-grow flex">
        <div>
          <p className="text-base uppercase text-primary">
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
          <OpenInNewIcon className="text-primary" />
        </IconButton>
      </div>
    </div>
  )
}
