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
import {
  getIntentReceipt,
  type TxStep,
  isIntentTerminal,
  isIntentFailed,
  isTxActive,
  isTxDone,
  isTxFailed,
  txStatusLabel,
  buildReceiptSteps
} from '../core/trails'
import { getTxUrl } from '../core/explorer'
import { CHAINS_META } from '../core/metadata'
import { chainIdToName } from '../core/network'
import { useMetaportStore } from '../store/MetaportStore'
import { dc, metadata, types } from '@/core'
import localStyles from './TransactionData/TransactionData.module.scss'

const POLL_INTERVAL_MS = 3000

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
      <span className={`w-[35px] h-[35px] rounded-full ${colors.bg} absolute`} />
      <span className={`flex items-center justify-center ${colors.text} w-[35px] h-[35px] z-10`}>
        {icon}
      </span>
    </span>
  )
}

function TxStepRow({ step, skaleNetwork }: { step: TxStep; skaleNetwork: types.SkaleNetwork }) {
  const chainsMeta = CHAINS_META[skaleNetwork]
  const chainName = step.chainName ?? chainIdToName(step.chainId)
  const displayName = metadata.getAlias(skaleNetwork, chainsMeta, chainName)
  const url = step.txnHash
    ? getTxUrl(chainsMeta[chainName], chainName, skaleNetwork, step.txnHash)
    : null
  return (
    <div className="flex items-center py-2">
      <div>
        <StepIcon status={step.status} />
      </div>
      <div className="ml-3.5 grow flex items-center justify-between">
        <div>
          <p className="text-sm capitalize text-foreground font-medium m-0">{step.label}</p>
          <p className="text-xs text-secondary-foreground m-0">{txStatusLabel(step.status)}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <ChainIcon
          skaleNetwork={skaleNetwork}
          chainName={chainName}
          size="xs"
        />
        <span className="text-xs text-secondary-foreground">
          {displayName}
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

export default function TrailsIntentTracker() {
  const intentId = useMetaportStore((state) => state.trailsIntentId)
  const mpc = useMetaportStore((state) => state.mpc)
  const skaleNetwork: types.SkaleNetwork = mpc?.config?.skaleNetwork ?? 'mainnet'
  const stepsMetadata = useMetaportStore((state) => state.stepsMetadata)
  const chainName2 = useMetaportStore((state) => state.chainName2)
  const trailsImaCompleted = useMetaportStore((state) => state.trailsImaCompleted)

  const [receipt, setReceipt] = useState<Awaited<ReturnType<typeof getIntentReceipt>> | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const setTrackerReady = (ready: boolean) => useMetaportStore.setState({ trailsTrackerReady: ready })

  useEffect(() => {
    if (!intentId) {
      setReceipt(null)
      setTrackerReady(false)
      return
    }

    let cancelled = false

    const poll = async () => {
      try {
        const r = await getIntentReceipt(intentId)
        if (cancelled) return
        setReceipt(r)
        setTrackerReady(true)
        if (isIntentTerminal(r.status)) {
          if (intervalRef.current) clearInterval(intervalRef.current)
          if (isIntentFailed(r.status)) {
            useMetaportStore.setState({ transferInProgress: false, loading: false })
          }
        }
      } catch {
        if (cancelled) return
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
  if (!receipt) return null

  const steps = receipt ? buildReceiptSteps(receipt) : []
  const trailsSucceeded = receipt?.status === IntentStatus.SUCCEEDED

  const isExt2S = stepsMetadata.some((s) => s.type === dc.ActionType.trails_ext2s)

  if (isExt2S && trailsSucceeded) {
    steps.push({
      label: `Deliver`,
      chainId: 0,
      status: trailsImaCompleted ? TransactionStatus.SUCCEEDED : TransactionStatus.MINING,
      chainName: chainName2
    })
  }

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
        <a
          href={`https://app.trails.build/intent/${intentId}`}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex items-center gap-1 text-xs font-medium text-secondary-foreground hover:text-foreground bg-muted rounded-full px-2.5 py-0.5 transition-colors"
        >
          View on Trails
          <ExternalLink size={11} />
        </a>
      </div>

      {steps.length === 0 && (
        <div className="flex items-center gap-2 py-3">
          <Loader2 size={14} className="text-muted-foreground animate-spin" />
          <span className="text-xs text-muted-foreground">Loading intent details…</span>
        </div>
      )}

      {steps.length > 0 && (
        <div className="-mb-2">
          {steps.map((step, i) => (
            <TxStepRow key={i} step={step} skaleNetwork={skaleNetwork} />
          ))}
        </div>
      )}

    </SkPaper>
  )
}
