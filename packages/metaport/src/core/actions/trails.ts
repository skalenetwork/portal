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
import type { Hash, Hex } from 'viem'
import type { Provider } from 'ethers'
import { type types, units } from '@/core'

import { Action } from './action'
import { checkERC20Balance } from './checks'
import { enforceNetwork, getExtChain, isExtChain, NETWORK_MAINNET_CHAINS } from '../network'
import {
  quoteIntent,
  commitIntent,
  executeIntent,
  waitReceipt,
  encodeDepositERC20Direct,
  wrapWithTrailsRouter,
  getTrailsRouterAddress,
  TRAILS_ROUTER_PLACEHOLDER_AMOUNT,
  type QuoteIntentResponse
} from '../trails'

const log = new Logger<ILogObj>({ name: 'metaport:core:actions:trails' })

export function isTrailsAction(
  action: Action
): action is TransferTrailsExt2M | TransferTrailsExt2S | TransferTrailsM2Ext {
  return (
    action instanceof TransferTrailsExt2M ||
    action instanceof TransferTrailsExt2S ||
    action instanceof TransferTrailsM2Ext
  )
}

function resolveChainId(chainName: string, skaleNetwork: types.SkaleNetwork): number {
  if (isExtChain(chainName)) {
    return getExtChain(chainName).id
  }
  return NETWORK_MAINNET_CHAINS[skaleNetwork].id
}

function resolveDestTokenAddress(
  config: types.mp.Config,
  chainName: string,
  tokenKeyname: string,
  tokenType: string
): string {
  const destChainName = isExtChain(chainName) ? chainName : 'mainnet'
  return config.connections[destChainName][tokenType][tokenKeyname].address
}

async function sendTrailsDeposit(
  action: Action,
  provider: Provider,
  chainName: string,
  depositTx: { to: string; data: string; value: bigint }
): Promise<Hash> {
  action.updateState('switch')
  const { chainId } = await provider.getNetwork()
  await enforceNetwork(
    chainId,
    action.walletClient,
    action._switchChain,
    action.mpc.config.skaleNetwork,
    chainName
  )
  action.updateState('trailsDeposit')
  return action.walletClient.sendTransaction({
    account: action.walletClient.account!,
    chain: null,
    to: depositTx.to as Hex,
    data: depositTx.data as Hex,
    value: depositTx.value
  } as unknown as Parameters<typeof action.walletClient.sendTransaction>[0])
}

export class TransferTrailsExt2M extends Action {
  trailsQuote: QuoteIntentResponse | null = null
  trailsQuoteError: string | null = null
  setTrailsIntentId: ((id: string) => void) | null = null
  setTrailsImaCompleted: (() => void) | null = null

  async execute() {
    this.updateState('init')

    const quote = this.trailsQuote
    if (!quote) throw new Error('No Trails quote available — run preAction first')

    this.updateState('trailsCommitting')
    const intentId = await commitIntent(quote)
    this.setTrailsIntentId?.(intentId)

    const depositTx = quote.intent.depositTransaction

    const txHash = await sendTrailsDeposit(this, this.sChain1!.provider, this.chainName1, depositTx)
    await this.sChain1!.provider.waitForTransaction(txHash, 1)

    this.updateState('trailsExecuting')
    await executeIntent(intentId, txHash)

    this.updateState('trailsWaiting')
    await waitReceipt(intentId)

    this.updateState('received')
    log.info('TransferTrailsExt2M:execute - intent fulfilled')
  }

  async preAction() {
    const checkResBalance = await checkERC20Balance(
      this.address,
      this.amount,
      this.token,
      this.sourceToken
    )
    if (!checkResBalance.res) {
      this.setAmountErrorMessage(checkResBalance.msg)
      this.trailsQuote = null
      return
    }
    this.setAmountErrorMessage(null)

    const originChainId = resolveChainId(this.chainName1, this.mpc.config.skaleNetwork)
    const destinationChainId = resolveChainId(this.chainName2, this.mpc.config.skaleNetwork)
    const amountWei = units.toWei(this.amount, this.token.meta.decimals)
    const destTokenAddress = resolveDestTokenAddress(
      this.mpc.config,
      this.chainName2,
      this.token.keyname,
      this.token.type
    )

    try {
      this.trailsQuote = await quoteIntent({
        ownerAddress: this.address,
        originChainId,
        originTokenAddress: this.token.address,
        originTokenAmount: amountWei,
        destinationChainId,
        destinationTokenAddress: destTokenAddress
      })
      this.trailsQuoteError = null
    } catch (err) {
      log.error('TransferTrailsExt2M:preAction - quote failed', err)
      this.trailsQuote = null
      this.trailsQuoteError = err instanceof Error ? err.message : String(err)
    }
  }
}

export class TransferTrailsExt2S extends Action {
  trailsQuote: QuoteIntentResponse | null = null
  trailsQuoteError: string | null = null
  setTrailsIntentId: ((id: string) => void) | null = null
  setTrailsImaCompleted: (() => void) | null = null

  async execute() {
    this.updateState('init')

    const quote = this.trailsQuote
    if (!quote) throw new Error('No Trails quote available — run preAction first')

    this.updateState('trailsCommitting')
    const intentId = await commitIntent(quote)
    this.setTrailsIntentId?.(intentId)

    const depositTx = quote.intent.depositTransaction

    const balanceOnDestination = await this.sChain2.getERC20Balance(this.destToken, this.address)

    const txHash = await sendTrailsDeposit(this, this.sChain1!.provider, this.chainName1, depositTx)
    await this.sChain1!.provider.waitForTransaction(txHash, 1)

    this.updateState('trailsExecuting')
    await executeIntent(intentId, txHash)

    this.updateState('trailsWaiting')
    await waitReceipt(intentId)

    await this.sChain2.waitERC20BalanceChange(this.destToken, this.address, balanceOnDestination)
    this.setTrailsImaCompleted?.()

    this.updateState('received')
    log.info('TransferTrailsExt2S:execute - intent fulfilled, tokens received on SKALE chain')
  }

  async preAction() {
    const checkResBalance = await checkERC20Balance(
      this.address,
      this.amount,
      this.token,
      this.sourceToken
    )
    if (!checkResBalance.res) {
      this.setAmountErrorMessage(checkResBalance.msg)
      this.trailsQuote = null
      return
    }
    this.setAmountErrorMessage(null)

    const originChainId = resolveChainId(this.chainName1, this.mpc.config.skaleNetwork)
    const mainnetChainId = NETWORK_MAINNET_CHAINS[this.mpc.config.skaleNetwork].id
    const amountWei = units.toWei(this.amount, this.token.meta.decimals)

    const mainnet = await this.mpc.mainnet()
    const depositBoxErc20 = await mainnet.erc20()
    const depositBoxAddress = await depositBoxErc20.getAddress()

    const mainnetTokenAddress = resolveDestTokenAddress(
      this.mpc.config,
      'mainnet',
      this.token.keyname,
      this.token.type
    )

    const rawCallData = encodeDepositERC20Direct(
      this.chainName2,
      mainnetTokenAddress,
      TRAILS_ROUTER_PLACEHOLDER_AMOUNT,
      this.address
    )

    const routerAddress = await getTrailsRouterAddress()
    const wrapped = wrapWithTrailsRouter(
      mainnetTokenAddress,
      depositBoxAddress,
      rawCallData,
      routerAddress
    )

    try {
      this.trailsQuote = await quoteIntent({
        ownerAddress: this.address,
        originChainId,
        originTokenAddress: this.token.address,
        originTokenAmount: amountWei,
        destinationChainId: mainnetChainId,
        destinationTokenAddress: mainnetTokenAddress,
        destinationToAddress: wrapped.toAddress,
        destinationCallData: wrapped.callData,
        destinationCallValue: 0n
      })
      this.trailsQuoteError = null
    } catch (err) {
      log.error('TransferTrailsExt2S:preAction - quote failed', err)
      this.trailsQuote = null
      this.trailsQuoteError = err instanceof Error ? err.message : String(err)
    }
  }
}

export class TransferTrailsM2Ext extends Action {
  trailsQuote: QuoteIntentResponse | null = null
  trailsQuoteError: string | null = null
  setTrailsIntentId: ((id: string) => void) | null = null
  setTrailsImaCompleted: (() => void) | null = null

  protected async initialize(): Promise<void> {
    this.mainnet = await this.mpc.mainnet()
    this.sourceToken = this.mpc.tokenContract(
      'mainnet',
      this.token.keyname,
      this.token.type,
      this.mainnet.provider
    )
  }

  async execute() {
    this.updateState('trailsQuoting')
    await this.preAction()

    const quote = this.trailsQuote
    if (!quote) throw new Error(this.trailsQuoteError ?? 'Failed to get Trails quote')

    this.updateState('trailsCommitting')
    const intentId = await commitIntent(quote)
    this.setTrailsIntentId?.(intentId)

    const depositTx = quote.intent.depositTransaction

    const txHash = await sendTrailsDeposit(this, this.mainnet.provider, 'mainnet', depositTx)
    await this.mainnet.provider.waitForTransaction(txHash, 1)

    this.updateState('trailsExecuting')
    await executeIntent(intentId, txHash)

    this.updateState('trailsWaiting')
    await waitReceipt(intentId)

    this.updateState('received')
    log.info('TransferTrailsM2Ext:execute - intent fulfilled')
  }

  async preAction() {
    this.setAmountErrorMessage(null)

    if (!this.amount || Number(this.amount) === 0) {
      this.trailsQuote = null
      return
    }

    const originChainId = NETWORK_MAINNET_CHAINS[this.mpc.config.skaleNetwork].id
    const destinationChainId = getExtChain(this.chainName2).id
    const amountWei = units.toWei(this.amount, this.token.meta.decimals)
    const destTokenAddress = resolveDestTokenAddress(
      this.mpc.config,
      this.chainName2,
      this.token.keyname,
      this.token.type
    )
    const mainnetTokenAddress = this.mpc.config.connections['mainnet'][this.token.type][this.token.keyname].address

    try {
      this.trailsQuote = await quoteIntent({
        ownerAddress: this.address,
        originChainId,
        originTokenAddress: mainnetTokenAddress,
        originTokenAmount: amountWei,
        destinationChainId,
        destinationTokenAddress: destTokenAddress
      })
      this.trailsQuoteError = null
    } catch (err) {
      log.error('TransferTrailsM2Ext:preAction - quote failed', err)
      this.trailsQuote = null
      this.trailsQuoteError = err instanceof Error ? err.message : String(err)
    }
  }
}
