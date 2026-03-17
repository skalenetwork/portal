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
 * @file meson.ts
 * @copyright SKALE Labs 2026-Present
 */

import { Logger, type ILogObj } from 'tslog'

const log = new Logger<ILogObj>({ name: 'metaport:core:meson' })

const MESON_MAINNET_RELAYER = 'https://relayer.meson.fi'
const MESON_TESTNET_RELAYER = 'https://testnet-relayer.meson.fi'

const PORTAL_TO_MESON_CHAIN: Record<string, string> = {
  'ext-arbitrum': 'arb',
  'ext-op-mainnet': 'opt',
  'ext-polygon': 'polygon',
  'ext-avalanche': 'avax',
  'ext-bsc': 'bnb',
  'ext-monad': 'monad',
  'ext-gnosis': 'gnosis',
  'elated-tan-skat': 'skale-europa',
  'honorable-steel-rasalhague': 'skale-calypso',
  'green-giddy-denebola': 'skale-nebula'
}

const PORTAL_TO_MESON_TOKEN: Record<string, string> = {
  usdc: 'usdc',
  usdt: 'usdt',
  eth: 'eth',
  wbtc: 'btc'
}

export function toMesonChain(portalChainName: string): string {
  const meson = PORTAL_TO_MESON_CHAIN[portalChainName]
  if (!meson) throw new Error(`Unsupported Meson chain: ${portalChainName}`)
  return meson
}

export function toMesonToken(portalTokenKeyname: string): string {
  const meson = PORTAL_TO_MESON_TOKEN[portalTokenKeyname]
  if (!meson) throw new Error(`Unsupported Meson token: ${portalTokenKeyname}`)
  return meson
}

function getRelayerUrl(testnet: boolean): string {
  return testnet ? MESON_TESTNET_RELAYER : MESON_MAINNET_RELAYER
}

export interface MesonPriceRequest {
  from: string
  to: string
  amount: string
  fromAddress: string
}

export interface MesonPriceResponse {
  result: {
    totalFee: string
    serviceFee: string
    lpFee: string
  }
}

export interface MesonEncodeRequest {
  from: string
  to: string
  amount: string
  fromAddress: string
  recipient: string
}

export interface MesonSigningRequest {
  message: string
  hash: string
}

export interface MesonEncodeTx {
  to: string
  data: string
  value: string
}

export interface MesonEncodeResponse {
  result: {
    encoded: string
    signingRequest: MesonSigningRequest
    fee: {
      totalFee: string
      serviceFee: string
      lpFee: string
    }
    tx?: MesonEncodeTx
    initiator: string
  }
}

export interface MesonSubmitResponse {
  result: {
    swapId: string
  }
}

export type MesonSwapStatus =
  | 'PENDING'
  | 'BONDED'
  | 'EXECUTING'
  | 'RELEASED'
  | 'CANCELLED'
  | 'EXPIRED'
  | 'UNLOCKED'

export interface MesonSwapStatusResponse {
  result: {
    swapId: string
    encoded: string
    from: { chain: string; token: string; amount: string; address: string }
    to: { chain: string; token: string; amount: string; address: string }
    created: number
    fee: { totalFee: string; serviceFee: string; lpFee: string }
    status: MesonSwapStatus
  }
}

export interface MesonQuote {
  fromChain: string
  fromToken: string
  toChain: string
  toToken: string
  amount: string
  fee: {
    totalFee: string
    serviceFee: string
    lpFee: string
  }
}

async function mesonFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...options?.headers
    }
  })
  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`Meson API error ${res.status}: ${body}`)
  }
  return res.json()
}

export async function getPrice(
  from: string,
  to: string,
  amount: string,
  fromAddress: string,
  testnet = false
): Promise<MesonPriceResponse> {
  const url = `${getRelayerUrl(testnet)}/api/v1/price`
  log.info('getPrice', { from, to, amount })
  return mesonFetch<MesonPriceResponse>(url, {
    method: 'POST',
    body: JSON.stringify({ from, to, amount, fromAddress })
  })
}

export async function encodeSwap(
  from: string,
  to: string,
  amount: string,
  fromAddress: string,
  recipient: string,
  testnet = false
): Promise<MesonEncodeResponse> {
  const url = `${getRelayerUrl(testnet)}/api/v1/swap`
  log.info('encodeSwap', { from, to, amount, fromAddress, recipient })
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ from, to, amount, fromAddress, recipient })
  })
  const body = await res.json()
  if (res.ok) return body as MesonEncodeResponse
  if (body?.error?.data?.swapData) {
    log.info('encodeSwap: extracting swapData from error response', body.error.message)
    return { result: body.error.data.swapData } as MesonEncodeResponse
  }
  throw new Error(`Meson API error ${res.status}: ${JSON.stringify(body)}`)
}

export async function submitSwap(
  encoded: string,
  fromAddress: string,
  recipient: string,
  signature: string,
  testnet = false
): Promise<MesonSubmitResponse> {
  const url = `${getRelayerUrl(testnet)}/api/v1/swap/${encoded}`
  log.info('submitSwap', { encoded })
  return mesonFetch<MesonSubmitResponse>(url, {
    method: 'POST',
    body: JSON.stringify({ fromAddress, recipient, signature })
  })
}

export async function checkSwapStatus(
  swapId: string,
  testnet = false
): Promise<MesonSwapStatusResponse> {
  const url = `${getRelayerUrl(testnet)}/api/v1/swap/${swapId}`
  return mesonFetch<MesonSwapStatusResponse>(url, { method: 'GET' })
}

const TERMINAL_STATUSES = new Set<MesonSwapStatus>(['RELEASED', 'CANCELLED', 'EXPIRED', 'UNLOCKED'])
const FAILED_STATUSES = new Set<MesonSwapStatus>(['CANCELLED', 'EXPIRED', 'UNLOCKED'])

export function isSwapTerminal(status: MesonSwapStatus): boolean {
  return TERMINAL_STATUSES.has(status)
}

export function isSwapFailed(status: MesonSwapStatus): boolean {
  return FAILED_STATUSES.has(status)
}

export function isSwapSucceeded(status: MesonSwapStatus): boolean {
  return status === 'RELEASED'
}

export function swapStatusLabel(status: MesonSwapStatus): string {
  switch (status) {
    case 'PENDING':
      return 'Pending'
    case 'BONDED':
      return 'Processing'
    case 'EXECUTING':
      return 'Executing'
    case 'RELEASED':
      return 'Completed'
    case 'CANCELLED':
      return 'Cancelled'
    case 'EXPIRED':
      return 'Expired'
    case 'UNLOCKED':
      return 'Refunded'
    default:
      return 'Unknown'
  }
}

export function explorerUrl(swapId: string, testnet = false): string {
  const base = testnet ? 'https://testnet-explorer.meson.fi' : 'https://explorer.meson.fi'
  return `${base}/swap/${swapId}`
}

const POLL_INTERVAL_MS = 3000
const POLL_TIMEOUT_MS = 600_000

export async function waitForSwap(
  swapId: string,
  testnet = false,
  onStatusUpdate?: (status: MesonSwapStatus) => void
): Promise<MesonSwapStatusResponse> {
  const start = Date.now()
  while (Date.now() - start < POLL_TIMEOUT_MS) {
    const resp = await checkSwapStatus(swapId, testnet)
    const status = resp.result.status
    onStatusUpdate?.(status)
    if (isSwapTerminal(status)) {
      if (isSwapFailed(status)) {
        throw new Error(`Meson swap ${status.toLowerCase()}: the cross-chain transfer could not be completed`)
      }
      return resp
    }
    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS))
  }
  throw new Error('Meson swap timed out waiting for completion')
}

export async function getMesonQuote(
  portalFromChain: string,
  portalToChain: string,
  portalTokenKeyname: string,
  amount: string,
  fromAddress: string,
  recipient: string,
  testnet = false
): Promise<MesonQuote> {
  const mesonFrom = `${toMesonChain(portalFromChain)}:${toMesonToken(portalTokenKeyname)}`
  const mesonTo = `${toMesonChain(portalToChain)}:${toMesonToken(portalTokenKeyname)}`

  const priceResp = await getPrice(mesonFrom, mesonTo, amount, fromAddress, testnet)
  const { totalFee, serviceFee, lpFee } = priceResp.result

  return {
    fromChain: mesonFrom,
    fromToken: toMesonToken(portalTokenKeyname),
    toChain: mesonTo,
    toToken: toMesonToken(portalTokenKeyname),
    amount,
    fee: { totalFee, serviceFee, lpFee }
  }
}
