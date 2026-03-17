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
import { type types, units } from '@/core'
import { type Contract, type Signer } from 'ethers'

import { Action } from './action'
import { checkERC20Balance } from './checks'
import {
  getMesonQuote,
  encodeSwap,
  submitSwap,
  waitForSwap,
  type MesonQuote,
  type MesonSwapStatus
} from '../meson'

const log = new Logger<ILogObj>({ name: 'metaport:core:actions:meson' })

export function isMesonAction(
  action: Action
): action is TransferMesonExt2S | TransferMesonS2Ext {
  return action instanceof TransferMesonExt2S || action instanceof TransferMesonS2Ext
}

function isTestnet(skaleNetwork: types.SkaleNetwork): boolean {
  return skaleNetwork === 'testnet' || skaleNetwork === 'regression'
}

export class TransferMesonExt2S extends Action {
  mesonQuote: MesonQuote | null = null
  mesonQuoteError: string | null = null
  setMesonSwapId: ((id: string) => void) | null = null
  setMesonSwapStatus: ((status: MesonSwapStatus) => void) | null = null

  async execute() {
    this.updateState('init')

    const quote = this.mesonQuote
    if (!quote) throw new Error('No Meson quote available — run preAction first')

    const testnet = isTestnet(this.mpc.config.skaleNetwork)

    const signer = await this.signer(this.sChain1!.provider, this.chainName1)

    this.updateState('mesonQuoting')
    const encodeResp = await encodeSwap(
      quote.fromChain,
      quote.toChain,
      quote.amount,
      this.address,
      this.address,
      testnet
    )
    const { encoded, signingRequest, tx } = encodeResp.result

    if (tx) {
      this.updateState('mesonApproving')
      await approveMesonIfNeeded(
        this.sourceToken,
        signer,
        tx.to,
        quote.amount,
        this.token.meta.decimals
      )
    }

    this.updateState('mesonSigning')
    const hexEthHeader = utf8ToHex('\x19Ethereum Signed Message:\n52')
    const msg = signingRequest.message.replace(hexEthHeader, '')
    const signature = await this.walletClient.request({
      method: 'personal_sign',
      params: [msg as `0x${string}`, this.address as `0x${string}`]
    })

    this.updateState('mesonSubmitting')
    const submitResp = await submitSwap(
      encoded,
      this.address,
      this.address,
      signature as string,
      testnet
    )
    const swapId = submitResp.result.swapId
    this.setMesonSwapId?.(swapId)

    this.updateState('mesonWaiting')
    await waitForSwap(swapId, testnet, (status) => {
      this.setMesonSwapStatus?.(status)
    })

    this.updateState('received')
    log.info('TransferMesonExt2S:execute - swap completed')
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
      this.mesonQuote = null
      return
    }
    this.setAmountErrorMessage(null)

    try {
      this.mesonQuote = await getMesonQuote(
        this.chainName1,
        this.chainName2,
        this.token.keyname,
        this.amount,
        this.address,
        this.address,
        isTestnet(this.mpc.config.skaleNetwork)
      )
      this.mesonQuoteError = null
    } catch (err) {
      log.error('TransferMesonExt2S:preAction - quote failed', err)
      this.mesonQuote = null
      this.mesonQuoteError = err instanceof Error ? err.message : String(err)
    }
  }
}

export class TransferMesonS2Ext extends Action {
  mesonQuote: MesonQuote | null = null
  mesonQuoteError: string | null = null
  setMesonSwapId: ((id: string) => void) | null = null
  setMesonSwapStatus: ((status: MesonSwapStatus) => void) | null = null

  async execute() {
    this.updateState('init')

    const quote = this.mesonQuote
    if (!quote) throw new Error('No Meson quote available — run preAction first')

    const testnet = isTestnet(this.mpc.config.skaleNetwork)

    const signer = await this.signer(this.sChain1!.provider, this.chainName1)

    this.updateState('mesonQuoting')
    const encodeResp = await encodeSwap(
      quote.fromChain,
      quote.toChain,
      quote.amount,
      this.address,
      this.address,
      testnet
    )
    const { encoded, signingRequest, tx } = encodeResp.result

    if (tx) {
      this.updateState('mesonApproving')
      await approveMesonIfNeeded(
        this.sourceToken,
        signer,
        tx.to,
        quote.amount,
        this.token.meta.decimals
      )
    }

    this.updateState('mesonSigning')
    const hexEthHeader = utf8ToHex('\x19Ethereum Signed Message:\n52')
    const msg = signingRequest.message.replace(hexEthHeader, '')
    const signature = await this.walletClient.request({
      method: 'personal_sign',
      params: [msg as `0x${string}`, this.address as `0x${string}`]
    })

    this.updateState('mesonSubmitting')
    const submitResp = await submitSwap(
      encoded,
      this.address,
      this.address,
      signature as string,
      testnet
    )
    const swapId = submitResp.result.swapId
    this.setMesonSwapId?.(swapId)

    this.updateState('mesonWaiting')
    await waitForSwap(swapId, testnet, (status) => {
      this.setMesonSwapStatus?.(status)
    })

    this.updateState('received')
    log.info('TransferMesonS2Ext:execute - swap completed')
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
      this.mesonQuote = null
      return
    }
    this.setAmountErrorMessage(null)

    try {
      this.mesonQuote = await getMesonQuote(
        this.chainName1,
        this.chainName2,
        this.token.keyname,
        this.amount,
        this.address,
        this.address,
        isTestnet(this.mpc.config.skaleNetwork)
      )
      this.mesonQuoteError = null
    } catch (err) {
      log.error('TransferMesonS2Ext:preAction - quote failed', err)
      this.mesonQuote = null
      this.mesonQuoteError = err instanceof Error ? err.message : String(err)
    }
  }
}

function utf8ToHex(utf8Str: string): string {
  return Array.from(utf8Str)
    .map((char) => char.charCodeAt(0).toString(16).padStart(2, '0'))
    .join('')
}

async function approveMesonIfNeeded(
  sourceToken: Contract,
  signer: Signer,
  spender: string,
  amount: string,
  decimals: number
): Promise<void> {
  const owner = await signer.getAddress()
  const amountWei = units.toWei(amount, decimals)
  const allowance: bigint = await sourceToken.allowance(owner, spender)
  if (allowance >= BigInt(amountWei)) return
  const connected = sourceToken.connect(signer) as Contract
  const tx = await connected.approve(spender, amountWei)
  await tx.wait()
  log.info('approveMesonIfNeeded: approval confirmed', tx.hash)
}
