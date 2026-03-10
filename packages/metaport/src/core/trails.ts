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
 * @file trails.ts
 * @copyright SKALE Labs 2026-Present
 */

import { Logger, type ILogObj } from 'tslog'
import { Interface } from 'ethers'
import { encodeFunctionData } from 'viem'
import {
  TradeType,
  TrailsApi,
  RouteProvider,
  IntentStatus,
  TransactionStatus,
  type QuoteIntentRequest,
  type QuoteIntentResponse,
  type WaitIntentReceiptResponse,
  type IntentReceipt
} from '@0xtrails/api'

export type { QuoteIntentResponse, WaitIntentReceiptResponse, IntentReceipt }

export const TRAILS_ROUTER_PLACEHOLDER_AMOUNT =
  0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefn

const TRAILS_ROUTER_ADDRESS = '0xF8A739B9F24E297a98b7aba7A9cdFDBD457F6fF8'

const log = new Logger<ILogObj>({ name: 'metaport:core:trails' })

const DEPOSIT_ERC20_DIRECT_ABI = [
  {
    type: 'function',
    name: 'depositERC20Direct',
    inputs: [
      { type: 'string', name: 'schainName' },
      { type: 'address', name: 'erc20OnMainnet' },
      { type: 'uint256', name: 'amount' },
      { type: 'address', name: 'receiver' }
    ],
    outputs: []
  }
]

const depositBoxIface = new Interface(DEPOSIT_ERC20_DIRECT_ABI)

const TRAILS_ROUTER_ABI = [
  {
    type: 'function',
    name: 'injectAndCall',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'token', type: 'address' },
      { name: 'target', type: 'address' },
      { name: 'callData', type: 'bytes' },
      { name: 'amountOffset', type: 'uint256' },
      { name: 'placeholder', type: 'bytes32' }
    ],
    outputs: []
  }
] as const

function getAmountOffset(calldata: string, placeholder: bigint): number {
  const hex = placeholder.toString(16).padStart(64, '0')
  const offset = calldata.toLowerCase().indexOf(hex.toLowerCase())
  if (offset === -1) return -1
  return (offset - 2) / 2
}

export function wrapWithTrailsRouter(
  token: string,
  target: string,
  calldata: string
): { callData: `0x${string}`; toAddress: string } {
  const amountOffset = getAmountOffset(calldata, TRAILS_ROUTER_PLACEHOLDER_AMOUNT)
  if (amountOffset === -1) {
    throw new Error('Placeholder amount not found in calldata')
  }

  const placeholderBytes32 =
    `0x${TRAILS_ROUTER_PLACEHOLDER_AMOUNT.toString(16).padStart(64, '0')}` as `0x${string}`

  const encoded = encodeFunctionData({
    abi: TRAILS_ROUTER_ABI,
    functionName: 'injectAndCall',
    args: [
      token as `0x${string}`,
      target as `0x${string}`,
      calldata as `0x${string}`,
      BigInt(amountOffset),
      placeholderBytes32
    ]
  })

  return {
    callData: encoded,
    toAddress: TRAILS_ROUTER_ADDRESS
  }
}

let trailsApi: TrailsApi | null = null

function getTrailsApi(): TrailsApi {
  if (!trailsApi) {
    trailsApi = new TrailsApi(import.meta.env.VITE_TRAILS_API_KEY)
  }
  return trailsApi
}

export function encodeDepositERC20Direct(
  schainName: string,
  erc20OnMainnet: string,
  amount: bigint,
  receiver: string
): string {
  return depositBoxIface.encodeFunctionData('depositERC20Direct', [
    schainName,
    erc20OnMainnet,
    amount,
    receiver
  ])
}

export interface TrailsQuoteParams {
  ownerAddress: string
  originChainId: number
  originTokenAddress: string
  originTokenAmount: bigint
  destinationChainId: number
  destinationTokenAddress: string
  destinationToAddress?: string
  destinationCallData?: string
  destinationCallValue?: bigint
}

export async function quoteIntent(params: TrailsQuoteParams): Promise<QuoteIntentResponse> {
  const req: Record<string, unknown> = {
    ownerAddress: params.ownerAddress,
    originChainId: params.originChainId,
    originTokenAddress: params.originTokenAddress,
    originTokenAmount: params.originTokenAmount,
    destinationChainId: params.destinationChainId,
    destinationTokenAddress: params.destinationTokenAddress,
    tradeType: TradeType.EXACT_INPUT,
    options: {
      slippageTolerance: 0.005,
      bridgeProvider: RouteProvider.RELAY
    }
  }
  if (params.destinationToAddress) {
    req.destinationToAddress = params.destinationToAddress
  }
  if (params.destinationCallData) {
    req.destinationCallData = params.destinationCallData
  }
  if (params.destinationCallValue !== undefined) {
    req.destinationCallValue = params.destinationCallValue
  }
  log.info('quoteIntent request', JSON.stringify(req, (_, v) => typeof v === 'bigint' ? v.toString() : v, 2))
  const response = await getTrailsApi().quoteIntent(req as unknown as QuoteIntentRequest)
  log.info('quoteIntent response intent id:', response.intent?.salt?.toString())
  return response
}

export async function commitIntent(
  quoteResponse: QuoteIntentResponse
): Promise<string> {
  const response = await getTrailsApi().commitIntent({
    intent: quoteResponse.intent
  })
  return response.intentId
}

export async function executeIntent(
  intentId: string,
  depositTransactionHash: string
): Promise<void> {
  await getTrailsApi().executeIntent({
    intentId,
    depositTransactionHash
  })
}

const FAILED_STATUSES = new Set([
  IntentStatus.FAILED,
  IntentStatus.ABORTED,
  IntentStatus.REFUNDED
])

export async function waitReceipt(
  intentId: string
): Promise<WaitIntentReceiptResponse> {
  let lastReceiptStates: Array<TransactionStatus> | undefined
  while (true) {
    const response = await getTrailsApi().waitIntentReceipt({ intentId, lastReceiptStates })
    const status = response.intentReceipt.status
    if (FAILED_STATUSES.has(status)) {
      throw new Error(`Intent ${status.toLowerCase()}: the cross-chain transfer could not be completed`)
    }
    if (response.done) return response
    lastReceiptStates = response.receiptStates
  }
}

export async function getIntentReceipt(
  intentId: string
): Promise<IntentReceipt> {
  const response = await getTrailsApi().getIntentReceipt({ intentId })
  return response.intentReceipt
}
