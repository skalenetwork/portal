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
 * @file erc20.ts
 * @copyright SKALE Labs 2022-Present
 */

import debug from 'debug'
import { Contract } from 'ethers'
import { dc, types } from '@/core'

import { fromWei, toWei } from '../convertation'
import { addressesEqual } from '../helper'
import { SFUEL_RESERVE_AMOUNT } from '../constants'
import { MainnetChain, SChain } from '../contracts'

debug.enable('*')
const log = debug('metaport:actions:checks')

export async function checkEthBalance( // TODO: optimize balance checks
  chain: MainnetChain | SChain,
  address: string,
  amount: string,
  tokenData: dc.TokenData
): Promise<types.mp.CheckRes> {
  const checkRes: types.mp.CheckRes = { res: false }
  if (!amount || Number(amount) === 0) return checkRes
  try {
    toWei(amount, tokenData.meta.decimals)
  } catch (err) {
    if (err.fault && err.fault === 'underflow') {
      checkRes.msg = 'The amount is too small'
    } else {
      checkRes.msg = 'Incorrect amount'
    }
    return checkRes
  }
  try {
    const balance = await chain.ethBalance(address)
    log(`address: ${address}, eth balance: ${balance}, amount: ${amount}`)
    const balanceEther = Number(fromWei(balance, tokenData.meta.decimals))
    let checkedAmount = Number(amount)
    let msg = `Current balance: ${balanceEther} ${tokenData.meta.symbol}.`
    if (chain instanceof MainnetChain) {
      checkedAmount += SFUEL_RESERVE_AMOUNT
      msg += ` ${SFUEL_RESERVE_AMOUNT} ETH will be reserved to cover transfer costs.`
    }
    if (checkedAmount > balanceEther) {
      checkRes.msg = msg
    } else {
      checkRes.res = true
    }
    return checkRes
  } catch (err) {
    log(err)
    checkRes.msg = 'Something went wrong, check developer console'
    return checkRes
  }
}

export async function checkERC20Balance(
  address: string,
  amount: string,
  tokenData: dc.TokenData,
  tokenContract: Contract
): Promise<types.mp.CheckRes> {
  const checkRes: types.mp.CheckRes = { res: false }
  if (!amount || Number(amount) === 0) return checkRes
  try {
    toWei(amount, tokenData.meta.decimals)
  } catch (err) {
    if (err.fault && err.fault === 'underflow') {
      checkRes.msg = 'The amount is too small'
    } else {
      checkRes.msg = 'Incorrect amount'
    }
    return checkRes
  }
  try {
    const balance = await tokenContract.balanceOf(address)
    log(`address: ${address}, balanceWei: ${balance}, amount: ${amount}`)
    const balanceEther = fromWei(balance, tokenData.meta.decimals)
    if (Number(amount) > Number(balanceEther)) {
      checkRes.msg = `Insufficient balance: ${balanceEther} ${tokenData.meta.symbol}`
    } else {
      checkRes.res = true
    }
    return checkRes
  } catch (err) {
    log(err)
    checkRes.msg = 'Something went wrong, check developer console'
    return checkRes
  }
}

export async function checkERC20Allowance(
  address: string,
  approvalAddress: string,
  amount: string,
  tokenData: dc.TokenData,
  tokenContract: Contract
): Promise<types.mp.CheckRes> {
  const checkRes: types.mp.CheckRes = { res: false }
  if (!amount || Number(amount) === 0) return checkRes
  try {
    const allowance = await tokenContract.allowance(address, approvalAddress)
    const allowanceEther = fromWei(allowance, tokenData.meta.decimals)
    log(`allowanceEther: ${allowanceEther}, amount: ${amount}`)
    checkRes.res = Number(allowanceEther) >= Number(amount)
    return checkRes
  } catch (err) {
    log(err)
    checkRes.msg = 'Something went wrong, check developer console'
    return checkRes
  }
}

export async function checkERC721(
  address: string,
  approvalAddress: string,
  tokenId: number,
  tokenContract: Contract
): Promise<types.mp.CheckRes> {
  let approvedAddress: string
  const checkRes: types.mp.CheckRes = { res: true, approved: false }
  if (!tokenId) return checkRes
  try {
    approvedAddress = await tokenContract.getApproved(tokenId)
    log(`approvedAddress: ${approvedAddress}, address: ${address}`)
  } catch (err) {
    log(err)
    checkRes.msg = 'tokenId does not exist, try again'
    return checkRes
  }
  try {
    const currentOwner = await tokenContract.ownerOf(tokenId)
    log(`currentOwner: ${currentOwner}, address: ${address}`)
    if (!addressesEqual(currentOwner, address)) {
      checkRes.msg = 'This account is not an owner of this tokenId'
      return checkRes
    }
  } catch (err) {
    log(err)
    checkRes.msg = 'Something went wrong, check developer console'
    return checkRes
  }
  checkRes.approved = addressesEqual(approvedAddress, approvalAddress)
  return checkRes
}

export async function checkERC1155(
  address: string,
  approvalAddress: string,
  tokenId: number,
  amount: string,
  tokenData: dc.TokenData,
  tokenContract: Contract
): Promise<types.mp.CheckRes> {
  const checkRes: types.mp.CheckRes = { res: true, approved: false }
  if (!tokenId || !amount) return checkRes

  try {
    const balance = await tokenContract.balanceOf(address, tokenId)
    log(`address: ${address}, balanceEther: ${balance}, amount: ${amount}`)
    if (Number(amount) > Number(balance)) {
      checkRes.msg = `Current balance: ${balance} ${tokenData.meta.symbol}`
    }
    checkRes.approved = await tokenContract.isApprovedForAll(address, approvalAddress)
  } catch (err) {
    log(err)
    checkRes.msg = 'Something went wrong, check developer console'
    return checkRes
  }
  return checkRes
}
