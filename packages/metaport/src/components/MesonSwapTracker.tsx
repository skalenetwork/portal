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
 * @file MesonSwapTracker.tsx
 * @copyright SKALE Labs 2026-Present
 */

import { useEffect, useState, useRef } from 'react'
import { Check, Loader2, CircleDot, AlertTriangle, Route, ExternalLink } from 'lucide-react'

import SkPaper from './SkPaper'
import mesonLogo from '../assets/meson_logo.png'
import { useMetaportStore } from '../store/MetaportStore'
import {
  checkSwapStatus,
  isSwapTerminal,
  isSwapFailed,
  isSwapSucceeded,
  swapStatusLabel,
  explorerUrl,
  type MesonSwapStatus
} from '../core/meson'

const POLL_INTERVAL_MS = 3000

type StepState = 'pending' | 'active' | 'done' | 'failed'

function stepColors(state: StepState): { bg: string; text: string } {
  switch (state) {
    case 'done':
      return {
        bg: 'bg-emerald-100 dark:bg-emerald-400/15',
        text: 'text-emerald-500 dark:text-emerald-400'
      }
    case 'failed':
      return {
        bg: 'bg-red-100 dark:bg-red-400/15',
        text: 'text-red-500 dark:text-red-400'
      }
    case 'active':
      return {
        bg: 'bg-sky-100 dark:bg-blue-400/15',
        text: 'text-sky-500 dark:text-blue-400'
      }
    default:
      return { bg: 'bg-muted', text: 'text-foreground' }
  }
}

function StepIcon({ state }: { state: StepState }) {
  const colors = stepColors(state)
  let icon = <CircleDot size={14} />
  if (state === 'done') icon = <Check size={14} />
  else if (state === 'failed') icon = <AlertTriangle size={14} />
  else if (state === 'active') icon = <Loader2 size={14} className="animate-spin" />
  return (
    <span className="relative flex items-center justify-center">
      <span className={`w-[35px] h-[35px] rounded-full ${colors.bg} absolute`} />
      <span className={`flex items-center justify-center ${colors.text} w-[35px] h-[35px] z-10`}>
        {icon}
      </span>
    </span>
  )
}

interface SwapStep {
  label: string
  subtitle: string
  state: StepState
}

function buildSteps(status: MesonSwapStatus | null, error: string | null): SwapStep[] {
  const failed = !!error || (status !== null && isSwapFailed(status))
  const succeeded = status !== null && isSwapSucceeded(status)
  const terminal = status !== null && isSwapTerminal(status)

  const submittedState: StepState = status ? 'done' : 'active'
  const processingState: StepState = failed
    ? 'failed'
    : succeeded
      ? 'done'
      : status && !terminal
        ? 'active'
        : 'pending'
  const deliverState: StepState = succeeded
    ? 'done'
    : failed
      ? 'failed'
      : 'pending'

  return [
    {
      label: 'Swap submitted',
      subtitle: status ? swapStatusLabel(status) : 'Submitting…',
      state: submittedState
    },
    {
      label: 'Processing',
      subtitle: failed
        ? error ?? `Swap ${status?.toLowerCase()}`
        : succeeded
          ? 'Done'
          : status
            ? swapStatusLabel(status)
            : 'Waiting',
      state: processingState
    },
    {
      label: succeeded ? 'Completed' : failed ? 'Failed' : 'Delivering',
      subtitle: succeeded ? 'Funds delivered' : failed ? 'Transfer could not be completed' : 'Waiting',
      state: deliverState
    }
  ]
}

function StepRow({ step }: { step: SwapStep }) {
  return (
    <div className="flex items-center py-2">
      <StepIcon state={step.state} />
      <div className="ml-3.5 grow">
        <p className="text-sm capitalize text-foreground font-medium m-0">{step.label}</p>
        <p className="text-xs text-secondary-foreground m-0">{step.subtitle}</p>
      </div>
    </div>
  )
}

export default function MesonSwapTracker() {
  const mesonSwapId = useMetaportStore((state) => state.mesonSwapId)
  const mesonTrackerReady = useMetaportStore((state) => state.mesonTrackerReady)
  const [status, setStatus] = useState<MesonSwapStatus | null>(null)
  const [error, setError] = useState<string | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!mesonSwapId || !mesonTrackerReady) return

    const poll = async () => {
      try {
        const resp = await checkSwapStatus(mesonSwapId)
        const s = resp.result.status
        setStatus(s)
        if (isSwapTerminal(s)) {
          if (intervalRef.current) clearInterval(intervalRef.current)
          if (isSwapFailed(s)) {
            setError(`Swap ${s.toLowerCase()}`)
          }
        }
      } catch {
        setError('Failed to check swap status')
        if (intervalRef.current) clearInterval(intervalRef.current)
      }
    }

    poll()
    intervalRef.current = setInterval(poll, POLL_INTERVAL_MS)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [mesonSwapId, mesonTrackerReady])

  if (!mesonSwapId || !mesonTrackerReady) return null

  const steps = buildSteps(status, error)

  return (
    <SkPaper gray className="mt-3 p-5.5!">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1">
          <Route size={13} className="text-secondary-foreground" />
          <span className="text-xs text-secondary-foreground font-medium">Routed via</span>
          <a
            href="https://meson.fi/"
            target="_blank"
            rel="noreferrer noopener"
            className="flex items-center"
          >
            <img src={mesonLogo} alt="Meson" className="h-5 rounded-sm" />
          </a>
        </div>
        <a
          href={explorerUrl(mesonSwapId)}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex items-center gap-1 text-xs font-medium text-secondary-foreground hover:text-foreground bg-muted rounded-full px-2.5 py-0.5 transition-colors"
        >
          View on Meson
          <ExternalLink size={11} />
        </a>
      </div>

      <div className="-mb-2">
        {steps.map((step, i) => (
          <StepRow key={i} step={step} />
        ))}
      </div>
    </SkPaper>
  )
}
