import { useEffect } from 'react'
import React from 'react'

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
import { TokenType } from '../core/dataclasses'
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
            <TokenIcon tokenSymbol={token?.meta.symbol} iconUrl={token?.meta.iconUrl} />
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
            type={TokenType.eth}
            setToken={setToken}
            setExpanded={setExpandedTokens}
            tokenBalances={tokenBalances}
          />
          <TokenListSection
            tokens={tokens.erc20}
            type={TokenType.erc20}
            setToken={setToken}
            setExpanded={setExpandedTokens}
            tokenBalances={tokenBalances}
          />
          <TokenListSection
            tokens={tokens.erc721}
            type={TokenType.erc721}
            setToken={setToken}
            setExpanded={setExpandedTokens}
          />
          <TokenListSection
            tokens={tokens.erc721meta}
            type={TokenType.erc721meta}
            setToken={setToken}
            setExpanded={setExpandedTokens}
          />
          <TokenListSection
            tokens={tokens.erc1155}
            type={TokenType.erc1155}
            setToken={setToken}
            setExpanded={setExpandedTokens}
          />
        </AccordionDetails>
      ) : null}
    </Accordion>
  )
}
