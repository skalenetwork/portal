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
 * @file AmountInput.ts
 * @copyright SKALE Labs 2025-Present
 */

import React from 'react'
import { useAccount } from 'wagmi'
import { dc, units } from '@/core'

import TextField from '@mui/material/TextField'
import { Button } from '@mui/material'

import { SFUEL_RESERVE_AMOUNT } from '../core/constants'

import TokenList from './TokenList'
import { useMetaportStore } from '../store/MetaportStore'
import { useCollapseStore } from '../store/Store'
import { styles } from '../core/css'
import { useThemeMode } from './ThemeProvider'

export default function AmountInput() {
  const { mode } = useThemeMode()
  const { address } = useAccount()
  const transferInProgress = useMetaportStore((state) => state.transferInProgress)
  const currentStep = useMetaportStore((state) => state.currentStep)
  const setAmount = useMetaportStore((state) => state.setAmount)
  const amount = useMetaportStore((state) => state.amount)
  const expandedTokens = useCollapseStore((state) => state.expandedTokens)

  const tokenBalances = useMetaportStore((state) => state.tokenBalances)
  const token = useMetaportStore((state) => state.token)

  const maxAmount = tokenBalances[token?.keyname]

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (parseFloat(event.target.value) < 0) {
      setAmount('', address)
      return
    }
    if (event.target.value.length > 12) {
      let initialSize = 28 - event.target.value.length / 3
      initialSize = initialSize <= 12 ? 12 : initialSize
      event.target.style.fontSize = initialSize + 'px'
    } else {
      event.target.style.fontSize = '28px'
    }
    setAmount(event.target.value, address)
  }

  const setMaxAmount = () => {
    let maxAmountWei: bigint = maxAmount
    if (token.type === dc.TokenType.eth) {
      const reserveAmountEth = units.toWei(SFUEL_RESERVE_AMOUNT.toString(), token.meta.decimals)
      maxAmountWei = maxAmount - reserveAmountEth
    }
    const balanceEther = units.formatBalance(maxAmountWei, token.meta.decimals)
    setAmount(balanceEther, address)
  }

  return (
    <div className={`flex ${styles.inputAmount} ${mode == 'light' && styles.inputAmountLight} items-center`}>
      {
        expandedTokens ? null : (
          <div className="flex grow items-center">
            <TextField
              className='text-foreground! disabled:text-foreground/50!'
              type="number"
              variant="standard"
              placeholder="0.00"
              value={amount}
              onChange={handleChange}
              disabled={transferInProgress || currentStep !== 0
              }
              style={{ width: '100%' }
              }
            />
            < Button
              size="small"
              disabled={transferInProgress || currentStep !== 0 || maxAmount === 0n}
              className="bg-secondary-foreground/10! flex items-center text-[10px]! py-1! px-3! min-w-0! text-foreground! mr-2!"
              onClick={setMaxAmount}
            >
              MAX
            </Button>
          </div>
        )}
      <TokenList />
    </div>
  )
}
