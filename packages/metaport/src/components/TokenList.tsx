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

import { useEffect, useState } from 'react'
import React from 'react'
import { dc } from '@/core'
import { useAccount } from 'wagmi'

import { Button, Modal, TextField, InputAdornment, Container } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded'

import { getAvailableTokensTotal, getDefaultToken } from '../core/tokens/helper'
import TokenListSection from './TokenListSection'
import TokenIcon from './TokenIcon'
import { useCollapseStore } from '../store/Store'
import { useMetaportStore } from '../store/MetaportStore'
import { BALANCE_UPDATE_INTERVAL_MS } from '../core/constants'
import SkPaper from './SkPaper'

export default function TokenList() {
  const [open, setOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleOpen = () => setOpen(true)
  const handleClose = () => {
    setOpen(false)
    setSearchQuery('')
  }

  const token = useMetaportStore((state) => state.token)
  const tokens = useMetaportStore((state) => state.tokens)

  const setToken = useMetaportStore((state) => state.setToken)
  const updateTokenBalances = useMetaportStore((state) => state.updateTokenBalances)
  const tokenContracts = useMetaportStore((state) => state.tokenContracts)

  const tokenBalances = useMetaportStore((state) => state.tokenBalances)
  const transferInProgress = useMetaportStore((state) => state.transferInProgress)

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
  let noTokens = availableTokensTotal === 0

  let tokensText = token ? token.meta.symbol : 'TOKEN'
  if (noTokens) {
    tokensText = 'N/A'
  }
  const filterTokens = (tokenMap: any) => {
    if (!searchQuery) return tokenMap
    const filtered: any = {}
    for (const key in tokenMap) {
      const token = tokenMap[key]
      if (
        token.meta.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        token.meta.symbol?.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        filtered[key] = token
      }
    }
    return filtered
  }

  const filteredTokens = filterTokens({ ...tokens.erc20, ...tokens.eth })
  const filteredTokensCount = Object.keys(filteredTokens).length

  return (
    <div>
      <div className="mr-2.5">
        <Button
          className="flex items-center w-full p-2.5 ml-2.5"
          onClick={handleOpen}
          disabled={transferInProgress}
          endIcon={
            <KeyboardArrowDownRoundedIcon className="text-primary" style={{ marginRight: '11px' }} />
          }
        >
          <div className={`flex items-center mr-2.5 ${noTokens ? 'opacity-50' : ''}`}>
            <TokenIcon
              key={token?.meta.symbol}
              tokenSymbol={token?.meta.symbol}
              iconUrl={token?.meta.iconUrl}
            />
          </div>
          <p className={`text-lg font-bold text-primary ${noTokens ? 'opacity-50' : ''} flex flex-grow`}>
            {tokensText}
          </p>
        </Button>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        className="darkTheme styles.metaport styles.backdropBlur"
      >
        <Container maxWidth="sm" className="styles.modalContainer">
          <div className="flex mb-5">
            <div className="flex-grow"></div>
            <SkPaper gray>
              <p className="text-base font-bold text-primary mt-1.5 mb-1.5 ml-5 mr-5">
                Select a token
              </p>
            </SkPaper>
            <div className="flex-grow"></div>
          </div>
          <SkPaper gray>
            <TextField
              fullWidth
              placeholder="Search tokens"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon className="text-primary styles.chainIcons" />
                  </InputAdornment>
                )
              }}
              className="styles.skInput"
              sx={{
                '& .MuiOutlinedInput-root': { borderRadius: '25px' },
                '& fieldset': { borderColor: '#353535 !important' }
              }}
            />
            {filteredTokensCount === 0 && (
              <div className="flex items-center justify-center mt-5 mb-5 p-2.5">
                <p className="text-base text-secondary-foreground text-center">
                  🚫 No tokens match your current filters
                </p>
              </div>
            )}
            <TokenListSection
              tokens={filteredTokens}
              type={dc.TokenType.erc20}
              setToken={setToken}
              setExpanded={setExpandedTokens}
              tokenBalances={tokenBalances}
              onCloseModal={handleClose}
              searchQuery={searchQuery}
            />
          </SkPaper>
        </Container>
      </Modal>
    </div>
  )
}
