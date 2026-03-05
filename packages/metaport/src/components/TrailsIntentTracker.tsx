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
 * @file TrailsIntentTracker.tsx
 * @copyright SKALE Labs 2026-Present
 */

import { useEffect, useState, useRef } from 'react'
import {
  Check,
  Loader2,
  CircleDot,
  AlertTriangle,
  Blocks,
  Route,
  ExternalLink
} from 'lucide-react'
import { TransactionStatus, IntentStatus } from '@0xtrails/api'
import IconButton from '@mui/material/IconButton'

import SkPaper from './SkPaper'
import ChainIcon from './ChainIcon'
import trailsLogo from '../assets/trails_logo.svg'
import { getIntentReceipt, type IntentReceipt } from '../core/trails'
import { useMetaportStore } from '../store/MetaportStore'
import localStyles from './TransactionData/TransactionData.module.scss'

const POLL_INTERVAL_MS = 3000

const EXPLORER_URLS: Record<number, string> = {
  1: 'https://etherscan.io',
  10: 'https://optimistic.etherscan.io',
  137: 'https://polygonscan.com',
  8453: 'https://basescan.org',
  42161: 'https://arbiscan.io',
  84532: 'https://sepolia.basescan.org',
  17000: 'https://holesky.etherscan.io'
}

const CHAIN_ID_TO_NAME: Record<number, string> = {
  1: 'mainnet',
  10: 'ext-op-mainnet',
  137: 'ext-polygon',
  8453: 'mainnet',
  42161: 'ext-arbitrum',
  84532: 'mainnet',
  17000: 'mainnet'
}

const CHAIN_DISPLAY_NAME: Record<number, string> = {
  1: 'Ethereum',
  10: 'Optimism',
  137: 'Polygon',
  8453: 'Base',
  42161: 'Arbitrum',
  84532: 'Base Sepolia',
  17000: 'Holesky'
}

function txUrl(chainId: number, hash: string): string | null {
  const base = EXPLORER_URLS[chainId]
  if (!base) return null
  return `${base}/tx/${hash}`
}

function chainInternalName(chainId: number): string {
  return CHAIN_ID_TO_NAME[chainId] ?? 'mainnet'
}

interface TxStep {
  label: string
  chainId: number
  status: TransactionStatus
  txnHash?: string
}

function isTerminal(status: IntentStatus): boolean {
  return (
    status === IntentStatus.SUCCEEDED ||
    status === IntentStatus.FAILED ||
    status === IntentStatus.ABORTED ||
    status === IntentStatus.REFUNDED
  )
}

function isIntentFailed(status: IntentStatus): boolean {
  return (
    status === IntentStatus.FAILED ||
    status === IntentStatus.ABORTED ||
    status === IntentStatus.REFUNDED
  )
}

function isTxActive(status: TransactionStatus): boolean {
  return (
    status === TransactionStatus.PENDING ||
    status === TransactionStatus.RELAYING ||
    status === TransactionStatus.SENT ||
    status === TransactionStatus.MINING
  )
}

function isTxDone(status: TransactionStatus): boolean {
  return status === TransactionStatus.SUCCEEDED
}

function isTxFailed(status: TransactionStatus): boolean {
  return (
    status === TransactionStatus.FAILED ||
    status === TransactionStatus.ABORTED ||
    status === TransactionStatus.REVERTED ||
    status === TransactionStatus.ERRORED
  )
}

function statusLabel(status: TransactionStatus): string {
  switch (status) {
    case TransactionStatus.UNKNOWN:
    case TransactionStatus.ON_HOLD:
      return 'Waiting'
    case TransactionStatus.PENDING:
      return 'Pending'
    case TransactionStatus.RELAYING:
      return 'Relaying'
    case TransactionStatus.SENT:
      return 'Sent'
    case TransactionStatus.MINING:
      return 'Mining'
    case TransactionStatus.SUCCEEDED:
      return 'Confirmed'
    case TransactionStatus.FAILED:
    case TransactionStatus.ABORTED:
    case TransactionStatus.REVERTED:
    case TransactionStatus.ERRORED:
      return 'Failed'
    default:
      return 'Unknown'
  }
}

function stepColors(status: TransactionStatus): { bg: string; text: string } {
  if (isTxDone(status)) {
    return {
      bg: 'bg-emerald-100 dark:bg-emerald-400/15',
      text: 'text-emerald-500 dark:text-emerald-400'
    }
  }
  if (isTxFailed(status)) {
    return {
      bg: 'bg-red-100 dark:bg-red-400/15',
      text: 'text-red-500 dark:text-red-400'
    }
  }
  if (isTxActive(status)) {
    return {
      bg: 'bg-sky-100 dark:bg-blue-400/15',
      text: 'text-sky-500 dark:text-blue-400'
    }
  }
  return { bg: 'bg-muted', text: 'text-foreground' }
}

function StepIcon({ status }: { status: TransactionStatus }) {
  const colors = stepColors(status)
  let icon = <CircleDot size={14} />
  if (isTxDone(status)) icon = <Check size={14} />
  else if (isTxFailed(status)) icon = <AlertTriangle size={14} />
  else if (isTxActive(status)) icon = <Loader2 size={14} className="animate-spin" />
  return (
    <span className="relative flex items-center justify-center">
      <span className={`w-[30px] h-[30px] rounded-full ${colors.bg} absolute`} />
      <span className={`flex items-center justify-center ${colors.text} w-[30px] h-[30px] z-10`}>
        {icon}
      </span>
    </span>
  )
}

function TxStepRow({ step, skaleNetwork }: { step: TxStep; skaleNetwork: string }) {
  const url = step.txnHash ? txUrl(step.chainId, step.txnHash) : null
  return (
    <div className="flex items-center py-2">
      <div>
        <StepIcon status={step.status} />
      </div>
      <div className="ml-5 grow flex items-center justify-between">
        <div>
          <p className="text-sm capitalize text-foreground font-medium m-0">{step.label}</p>
          <p className="text-xs text-secondary-foreground m-0">{statusLabel(step.status)}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <ChainIcon
          skaleNetwork={skaleNetwork as any}
          chainName={chainInternalName(step.chainId)}
          size="xs"
        />
        <span className="text-xs text-secondary-foreground">
          {CHAIN_DISPLAY_NAME[step.chainId] ?? `Chain ${step.chainId}`}
        </span>
        {url && (
          <IconButton
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={`bg-muted! ${localStyles.sk__openExplorerBtn}`}
          >
            <Blocks className="text-foreground" />
          </IconButton>
        )}
      </div>
    </div>
  )
}

function buildSteps(receipt: IntentReceipt): TxStep[] {
  const steps: TxStep[] = []
  const deposit = receipt.depositTransaction
  if (deposit) {
    steps.push({
      label: 'Deposit',
      chainId: deposit.chainId,
      status: deposit.status,
      txnHash: deposit.txnHash
    })
  }
  const origin = receipt.originTransaction
  if (origin) {
    steps.push({
      label: 'Swap & Bridge',
      chainId: origin.chainId,
      status: origin.status,
      txnHash: origin.txnHash
    })
  }
  const destination = receipt.destinationTransaction
  if (destination) {
    steps.push({
      label: 'Execute',
      chainId: destination.chainId,
      status: destination.status,
      txnHash: destination.txnHash
    })
  }
  return steps
}

export default function TrailsIntentTracker() {
  const intentId = useMetaportStore((state) => state.trailsIntentId)
  const mpc = useMetaportStore((state) => state.mpc)
  const skaleNetwork = mpc?.config?.skaleNetwork ?? 'mainnet'

  const [receipt, setReceipt] = useState<IntentReceipt | null>(null)
  const [error, setError] = useState<string | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const setTrackerReady = (ready: boolean) => useMetaportStore.setState({ trailsTrackerReady: ready })

  useEffect(() => {
    if (!intentId) {
      setReceipt(null)
      setError(null)
      setTrackerReady(false)
      return
    }

    let cancelled = false

    const poll = async () => {
      try {
        const r = await getIntentReceipt(intentId)
        if (cancelled) return
        setReceipt(r)
        setError(null)
        setTrackerReady(true)
        if (isTerminal(r.status)) {
          if (intervalRef.current) clearInterval(intervalRef.current)
          if (isIntentFailed(r.status)) {
            useMetaportStore.setState({ transferInProgress: false, loading: false })
          }
        }
      } catch (err) {
        if (cancelled) return
        setError(err instanceof Error ? err.message : String(err))
      }
    }

    poll()
    intervalRef.current = setInterval(poll, POLL_INTERVAL_MS)

    return () => {
      cancelled = true
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [intentId])

  if (!intentId) return null
  if (error && !receipt) return null

  const steps = receipt ? buildSteps(receipt) : []
  const intentStatus = receipt?.status
  const failed = intentStatus ? isIntentFailed(intentStatus) : false
  const succeeded = intentStatus === IntentStatus.SUCCEEDED

  return (
    <SkPaper gray className="mt-3 p-5.5!">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1">
          <Route size={13} className="text-secondary-foreground" />
          <span className="text-xs text-secondary-foreground font-medium">Routed via</span>
          <a
            href="https://trails.build/"
            target="_blank"
            rel="noreferrer noopener"
            className="flex items-center"
          >
            <img src={trailsLogo} alt="Trails" className="h-5 rounded-sm" />
          </a>
        </div>
        {succeeded && (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-500 bg-emerald-500/10 rounded-full px-2.5 py-0.5">
            <Check size={12} />
            Completed
          </span>
        )}
        {failed && (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-red-500 bg-red-500/10 rounded-full px-2.5 py-0.5">
            <AlertTriangle size={12} />
            Failed
          </span>
        )}
        {!succeeded && !failed && (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-500 bg-blue-500/10 rounded-full px-2.5 py-0.5">
            <Loader2 size={12} className="animate-spin" />
            In progress
          </span>
        )}
      </div>

      {steps.length === 0 && (
        <div className="flex items-center gap-2 py-3">
          <Loader2 size={14} className="text-muted-foreground animate-spin" />
          <span className="text-xs text-muted-foreground">Loading intent details…</span>
        </div>
      )}

      {steps.length > 0 && (
        <div>
          {steps.map((step, i) => (
            <TxStepRow key={i} step={step} skaleNetwork={skaleNetwork} />
          ))}
        </div>
      )}

      <a
        href={`https://app.trails.build/intent/${intentId}`}
        target="_blank"
        rel="noreferrer noopener"
        className="flex items-center justify-center gap-1.5 mt-3 pt-3 text-xs text-secondary-foreground hover:text-foreground transition-colors"
      >
        View on Trails
        <ExternalLink size={11} />
      </a>
    </SkPaper>
  )
}
