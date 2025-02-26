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
 * @file TokenList.ts
 * @copyright SKALE Labs 2025-Present
 */

import { useEffect } from 'react'
import React from 'react'
import { dc } from '@/core'

import { useAccount } from 'wagmi'

import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'

import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded'

import { getAvailableTokensTotal, getDefaultToken } from '../core/tokens/helper'

import { cls, cmn, styles } from '../core/css'

import TokenListSection from './TokenListSection'
import TokenIcon from './TokenIcon'

import { useCollapseStore } from '../store/Store'
import { useMetaportStore } from '../store/MetaportStore'
import { BALANCE_UPDATE_INTERVAL_MS } from '../core/constants'

export default function TokenList() {
  const token = useMetaportStore((state) => state.token)
  const tokens = useMetaportStore((state) => state.tokens)
  const setToken = useMetaportStore((state) => state.setToken)
  const updateTokenBalances = useMetaportStore((state) => state.updateTokenBalances)
  const tokenContracts = useMetaportStore((state) => state.tokenContracts)

  const tokenBalances = useMetaportStore((state) => state.tokenBalances)
  const transferInProgress = useMetaportStore((state) => state.transferInProgress)

  const expandedTokens = useCollapseStore((state) => state.expandedTokens)
  const setExpandedTokens = useCollapseStore((state) => state.setExpandedTokens)

  const { address } = useAccount()

  useEffect(() => {
    const fetchBalances = () => {
      updateTokenBalances(address)
    }
    fetchBalances()
    const intervalId = setInterval(fetchBalances, BALANCE_UPDATE_INTERVAL_MS)
    return () => {
      clearInterval(intervalId)
    }
  }, [address, updateTokenBalances, tokenContracts])

  useEffect(() => {
    const defaultToken = getDefaultToken(tokens)
    if (defaultToken) {
      setToken(defaultToken)
    }
  }, [tokens])

  let availableTokensTotal = getAvailableTokensTotal(tokens)
  let disabled = availableTokensTotal === 1
  let noTokens = availableTokensTotal === 0

  const handleChange = (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedTokens(isExpanded ? panel : false)
  }

  let tokensText = token ? token.meta.symbol : 'TOKEN'
  if (noTokens) {
    tokensText = 'N/A'
  }

  return (
    <Accordion
      expanded={expandedTokens === 'panel1'}
      onChange={handleChange('panel1')}
      disabled={disabled || transferInProgress || noTokens}
      elevation={0}
      className={cmn.fullWidth}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreRoundedIcon />}
        aria-controls="panel1bh-content"
        id="panel1bh-header"
        className={styles.accordionSummaryTokens}
      >
        <div className={cls(cmn.flex, cmn.flexcv, cmn.fullWidth)}>
          <div className={cls(cmn.flex, cmn.flexc, cmn.mri10, [cmn.pDisabled, noTokens])}>
            <TokenIcon
              key={token?.meta.symbol}
              tokenSymbol={token?.meta.symbol}
              iconUrl={token?.meta.iconUrl}
            />
          </div>
          <p
            className={cls(
              cmn.p,
              cmn.p1,
              cmn.p700,
              cmn.pPrim,
              [cmn.pDisabled, noTokens],
              cmn.flex,
              cmn.flexg,
              cmn.mri10
            )}
          >
            {tokensText}
          </p>
        </div>
      </AccordionSummary>

      {expandedTokens ? (
        <AccordionDetails>
          <TokenListSection
            tokens={tokens.eth}
            type={dc.TokenType.eth}
            setToken={setToken}
            setExpanded={setExpandedTokens}
            tokenBalances={tokenBalances}
          />
          <TokenListSection
            tokens={tokens.erc20}
            type={dc.TokenType.erc20}
            setToken={setToken}
            setExpanded={setExpandedTokens}
            tokenBalances={tokenBalances}
          />
          <TokenListSection
            tokens={tokens.erc721}
            type={dc.TokenType.erc721}
            setToken={setToken}
            setExpanded={setExpandedTokens}
          />
          <TokenListSection
            tokens={tokens.erc721meta}
            type={dc.TokenType.erc721meta}
            setToken={setToken}
            setExpanded={setExpandedTokens}
          />
          <TokenListSection
            tokens={tokens.erc1155}
            type={dc.TokenType.erc1155}
            setToken={setToken}
            setExpanded={setExpandedTokens}
          />
        </AccordionDetails>
      ) : null}
    </Accordion>
  )
}
