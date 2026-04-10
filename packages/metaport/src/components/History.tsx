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
 * @file History.ts
 * @copyright SKALE Labs 2023-Present
 */

import { types } from '@/core'

import TokenIcon from './TokenIcon'
import TransactionData from './TransactionData'
import ChainIcon from './ChainIcon'
import { timeAgo } from '../core/time'
import { getExplorerUrlForAddress, shortenAddress } from '../core/explorer'
import { Blocks, CircleAlert, Check, XCircle, Clock, ArrowRight } from 'lucide-react'
import Avatar from 'boring-avatars'
import { metadata } from '@/core'
import IconButton from '@mui/material/IconButton'
import trailsLogo from '../assets/trails_logo.svg'
import mesonLogo from '../assets/meson_logo.png'
import { explorerUrl as mesonExplorerUrl } from '../core/meson'
import Tooltip from '@mui/material/Tooltip'

import { useMetaportStore } from '../store/MetaportStore'
import { CHAINS_META } from '../core/metadata'

function isTrailsTransfer(transfer: types.mp.TransferHistory): boolean {
  return !!transfer.trailsIntentId
}

function isMesonTransfer(transfer: types.mp.TransferHistory): boolean {
  return !!transfer.mesonSwapId
}

function isUnfinished(transfer: types.mp.TransferHistory): boolean {
  if (isTrailsTransfer(transfer)) return false
  if (isMesonTransfer(transfer)) return false
  return transfer.address === undefined || transfer.transactions.length === 0
}

function isTrailsFailed(transfer: types.mp.TransferHistory): boolean {
  return isTrailsTransfer(transfer) && transfer.trailsStatus !== 'succeeded'
}

function isMesonFailed(transfer: types.mp.TransferHistory): boolean {
  return isMesonTransfer(transfer) && transfer.mesonStatus !== 'succeeded'
}

function transferTimestamp(transfer: types.mp.TransferHistory): string {
  if (isUnfinished(transfer)) return 'Unfinished'
  if (isTrailsTransfer(transfer) && transfer.transactions.length === 0) {
    return isTrailsFailed(transfer) ? 'Failed' : 'Completed'
  }
  if (isMesonTransfer(transfer) && transfer.transactions.length === 0) {
    return isMesonFailed(transfer) ? 'Failed' : 'Completed'
  }
  const last = transfer.transactions[transfer.transactions.length - 1]
  return timeAgo(last.timestamp)
}

function shortenValue(value: string | number, length: number = 8): string {
  const str = String(value)
  if (str.length <= length) return str
  return `${str.slice(0, 4)}...${str.slice(-2)}`
}

export default function History(props: {
  size?: types.Size
  limit?: number
  summaryOnly?: boolean
  hideCurrent?: boolean
  className?: string
  itemClassName?: string
}) {
  const transactionsHistory = useMetaportStore((state) => state.transactionsHistory)
  const transfersHistory = useMetaportStore((state) => state.transfersHistory)

  const mpc = useMetaportStore((state) => state.mpc)

  const summaryOnly = props.summaryOnly ?? props.size === 'sm'
  const size = props.size ?? 'sm'
  const network = mpc.config.skaleNetwork

  const chainsMeta = CHAINS_META[network]

  if (transactionsHistory.length === 0 && transfersHistory.length === 0) return

  const visibleCount =
    (transactionsHistory.length !== 0 && !props.hideCurrent ? 1 : 0) +
    Math.min(props.limit ?? transfersHistory.length, transfersHistory.length)
  const gridCols = visibleCount === 1 ? 'md:grid-cols-1' : 'md:grid-cols-2'

  return (
    <div
      className={`${props.className ?? ''} ${size === 'sm' ? `flex flex-col gap-2 md:grid ${gridCols}` : ''}`}
    >
      {transactionsHistory.length !== 0 && !props.hideCurrent && (
        <div className="mb-2.5 bg-card! rounded-3xl p-4">
          <p className="text-sm font-semibold text-foreground mb-3">Current transfer</p>
          <div className="bg-muted-foreground/15 dark:bg-muted-foreground/10 p-4 rounded-2xl space-y-2">
            {transactionsHistory.map((transactionData: types.mp.TransactionHistory) => (
              <TransactionData
                key={transactionData.transactionHash}
                transactionData={transactionData}
                config={mpc.config}
              />
            ))}
          </div>
        </div>
      )}
      {transfersHistory
        .slice()
        .reverse()
        .slice(0, props.limit ?? transfersHistory.length)
        .map((transfer: types.mp.TransferHistory, key: number) => {
          const unfinished = isUnfinished(transfer)
          const failed = isTrailsFailed(transfer) || isMesonFailed(transfer)
          const pending = (isTrailsTransfer(transfer) || isMesonTransfer(transfer)) && !failed && transfer.transactions.length > 0
          
          let statusColorClass = 'text-secondary-foreground'
          let statusBgClass = ''
          let StatusIcon = null

          if (unfinished || failed) {
            statusColorClass = 'text-destructive'
            statusBgClass = 'bg-destructive/10 dark:bg-destructive/20'
            StatusIcon = unfinished ? CircleAlert : XCircle
          } else if (pending) {
            statusColorClass = 'text-amber-500 dark:text-amber-400'
            statusBgClass = 'bg-amber-500/10 dark:bg-amber-500/20'
            StatusIcon = Clock
          } else {
            statusColorClass = 'text-emerald-500 dark:text-emerald-400'
            statusBgClass = 'bg-emerald-100 dark:bg-emerald-400/15'
   
            StatusIcon = Check
          }

          const hasProvider = isTrailsTransfer(transfer) || isMesonTransfer(transfer)

          return (
            <div
              key={key}
              className={`${props.itemClassName ?? (size === 'sm' ? 'xs' : 'mb-2.5')} bg-card ${hasProvider ? 'rounded-3xl' : 'rounded-full'} p-2`}
            >
              {hasProvider ? (
                <>
                  <div className="flex items-center justify-between p-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <TokenIcon
                        tokenSymbol={transfer.tokenKeyname}
                        size={size === 'sm' ? 'sm' : 'lg'}
                      />
                      <div className="min-w-0 flex-1">
                        <Tooltip title={`${transfer.amount} ${transfer.tokenKeyname}`} arrow>
                          <p
                            className={`${size === 'sm' ? 'text-base' : 'text-lg'} font-bold text-foreground uppercase m-0 leading-tight`}
                          >
                            {size === 'sm' ? (
                              <>
                                <span className="max-md:hidden">{shortenValue(transfer.amount)}</span>
                                <span className="md:hidden">{transfer.amount}</span>
                              </>
                            ) : (
                              transfer.amount
                            )}{' '}
                            {transfer.tokenKeyname}
                          </p>
                        </Tooltip>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-[26px] h-[26px] rounded-full flex items-center justify-center ${statusBgClass} ${statusColorClass}`}>
                        <StatusIcon size={14} />
                      </div>
                    </div>
                  </div>
                  <div className={`${size === 'sm' ? 'mx-2' : 'mx-4'} w-px self-stretch bg-border`} />
                    
                  <div className="p-2 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <ChainRow
                        chainName={transfer.chainName1}
                        network={network}
                        chainsMeta={chainsMeta}
                        responsive={size === 'sm'}
                      />
                      <div>
                        <div className="flex justify-center items-center text-muted-foreground">
                          <ArrowRight size={14}/>
                        </div>
                      </div>
                      <ChainRow
                        chainName={transfer.chainName2}
                        network={network}
                        chainsMeta={chainsMeta}
                        responsive={size === 'sm'}
                      />
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {isTrailsTransfer(transfer) && (
                        <a
                          href={`https://app.trails.build/intent/${transfer.trailsIntentId}`}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="flex items-center hover:opacity-80 transition-opacity"
                        >
                          <img src={trailsLogo} alt="Trails" className="h-3 rounded-sm" />
                        </a>
                      )}
                      {isMesonTransfer(transfer) && (
                        <a
                          href={mesonExplorerUrl(transfer.mesonSwapId!)}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="flex items-center hover:opacity-80 transition-opacity"
                        >
                          <img src={mesonLogo} alt="Meson" className="h-3 rounded-sm" />
                        </a>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-between p-2 pl-3 xs:pl-2">
                  <div className="flex items-center gap-3.5 min-w-0 pr-2">
                    <TokenIcon
                      tokenSymbol={transfer.tokenKeyname}
                      size={size === 'sm' ? 'sm' : 'lg'}
                    />
                    <div className="flex flex-col min-w-0 gap-0.5">
                      <Tooltip title={`${transfer.amount} ${transfer.tokenKeyname}`} arrow>
                        <p
                          className={`${size === 'sm' ? 'text-base' : 'text-lg'} font-bold text-foreground uppercase m-0 leading-tight truncate`}
                        >
                          {size === 'sm' ? (
                            <>
                              <span className="max-md:hidden">{shortenValue(transfer.amount)}</span>
                              <span className="md:hidden">{transfer.amount}</span>
                            </>
                          ) : (
                            transfer.amount
                          )}{' '}
                          {transfer.tokenKeyname}
                        </p>
                      </Tooltip>
                      <p className="text-sm font-semibold text-muted-foreground m-0 leading-tight">
                        {transferTimestamp(transfer)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3.5 pr-2 pl-1 border-l border-border shrink-0">
                    <div className="flex flex-col gap-1.5 min-w-[70px]">
                      <ChainRow
                        chainName={transfer.chainName1}
                        network={network}
                        chainsMeta={chainsMeta}
                        responsive={size === 'sm'}
                      />
                      <ChainRow
                        chainName={transfer.chainName2}
                        network={network}
                        chainsMeta={chainsMeta}
                        responsive={size === 'sm'}
                      />
                    </div>
                  </div>
                </div>
              )}
              {!summaryOnly && transfer.address && (
                <div className="bg-muted-foreground/10 px-4 py-3 rounded-3xl mt-2 flex items-center">
                  <Avatar
                    variant="marble"
                    name={transfer.address}
                    size={30}
                    colors={[
                      '#efeecc',
                      '#fe8b05',
                      '#fe0557',
                      '#400403',
                      '#0aabba',
                      '#c8b6ff',
                      '#90E0EF',
                      '#F786AA',
                      '#256EFF',
                      '#31E981',
                      '#ffbf81'
                    ]}
                  />
                  <div className="ml-5 grow">
                    <p className="text-xs text-secondary-foreground">Sender</p>
                    <p className="text-sm font-medium text-foreground">
                      {shortenAddress(transfer.address)}
                    </p>
                  </div>
                  <IconButton
                    href={getExplorerUrlForAddress(
                      chainsMeta[transfer.chainName2],
                      network,
                      transfer.chainName2,
                      transfer.address
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    size="small"
                    className="ml-2.5 ease-in-out transition-transform duration-150 active:scale-[0.97]"
                    sx={{
                      backgroundColor: 'var(--card)',
                      width: 30,
                      height: 30,
                      '& svg': { width: 15, height: 15 },
                      '&:hover': { backgroundColor: 'var(--card)' }
                    }}
                  >
                    <Blocks className="text-foreground" />
                  </IconButton>
                </div>
              )}
              {!summaryOnly && transfer.transactions.length > 0 && (
                <div className="bg-muted-foreground/10 p-4 rounded-3xl space-y-2 mt-1">
                  {transfer.transactions.map((transactionData: types.mp.TransactionHistory) => (
                    <TransactionData
                      key={transactionData.transactionHash}
                      transactionData={transactionData}
                      config={mpc.config}
                    />
                  ))}
                </div>
              )}
            </div>
          )
        })}
    </div>
  )
}

function ChainRow(props: {
  chainName: string
  network: types.SkaleNetwork
  chainsMeta: types.ChainsMetadataMap
  short?: boolean
  responsive?: boolean
}) {
  return (
    <div className="flex items-center gap-1.5">
      <ChainIcon
        skaleNetwork={props.network}
        chainName={props.chainName}
        size="xxs"
        chainsMeta={props.chainsMeta}
      />
      {props.responsive ? (
        <>
          <span className="text-xs font-semibold text-muted-foreground capitalize max-md:hidden">
            {metadata.getAlias(props.network, props.chainsMeta, props.chainName, undefined, true)}
          </span>
          <span className="text-xs font-semibold text-muted-foreground capitalize md:hidden">
            {metadata.getAlias(props.network, props.chainsMeta, props.chainName, undefined, false)}
          </span>
        </>
      ) : (
        <span className="text-xs font-semibold text-muted-foreground capitalize">
          {metadata.getAlias(props.network, props.chainsMeta, props.chainName, undefined, props.short)}
        </span>
      )}
    </div>
  )
}
