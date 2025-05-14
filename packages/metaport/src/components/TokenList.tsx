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

import SearchIcon from '@mui/icons-material/Search'


import { getAvailableTokensTotal, getDefaultToken } from '../core/tokens/helper'


import { cls, cmn, styles } from '../core/css'

import TokenListSection from './TokenListSection'
import TokenIcon from './TokenIcon'


import { useCollapseStore } from '../store/Store'
import { useMetaportStore } from '../store/MetaportStore'
import { BALANCE_UPDATE_INTERVAL_MS } from '../core/constants'
import { Box, Button, Modal, TextField, InputAdornment } from '@mui/material'
import SkPaper from './SkPaper'

const style = {
  position: 'absolute',
  top: '5%',
  left: '50%',
  transform: 'translate(-50%, 0)',
  width: 400,
  // backdropFilter: 'blur(30px)',
};
export default function TokenList() {

  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = useState('')

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const token = useMetaportStore((state) => state.token)
  const tokens = useMetaportStore((state) => state.tokens)

  console.log('tokens;; ', tokens.erc20)
  const setToken = useMetaportStore((state) => state.setToken)
  const updateTokenBalances = useMetaportStore((state) => state.updateTokenBalances)
  const tokenContracts = useMetaportStore((state) => state.tokenContracts)

  const tokenBalances = useMetaportStore((state) => state.tokenBalances)
  console.log('token balances;; ', tokenBalances)

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

  const filteredTokens = filterTokens({ ...tokens.erc20, ...tokens.eth });
  const filteredTokensCount = Object.keys(filteredTokens).length;

  return (
    <div >

      <Button className={cls(cmn.flex, cmn.flexcv, cmn.fullWidth, cmn.padd10, cmn.mleft10,)} onClick={handleOpen} disabled={disabled}>
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
            cmn.mright10
          )}
        >
          {tokensText}
        </p>
      </Button>

      
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className={cls(cmn.darkTheme, styles.metaport)}
        style={{ backdropFilter: 'blur(10px)' }}
      >
        
        <Box sx={style}>    
        <div className={cls(cmn.flex, cmn.mbott20)}>
          <div className={cls(cmn.flexg)}></div>
          <SkPaper gray>
          <p 
              className={cls(
                cmn.p,
                cmn.p2,
                cmn.p700,
                cmn.pPrim,
                cmn.mtop5,
                cmn.mbott5,
                cmn.mleft20,
                cmn.mri20,
                cmn.flexcv,
                cmn.pCent,
                
              )}
            > 
            Select a token         
              </p>

              </SkPaper>
              <div className={cls(cmn.flexg)}></div>
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
                    <SearchIcon className={cls(cmn.pPrim, styles.chainIcons)} />
                  </InputAdornment>
                )
              }}
              className={cls(styles.skInput)}
              sx={{
                '& .MuiOutlinedInput-root': { borderRadius: '25px'},
                '& fieldset': { borderColor: '#353535 !important'},
              }}
            />
            {filteredTokensCount === 0 && (<p className={cls(cmn.p, cmn.p2, cmn.p400, cmn.flexg, cmn.pSec, cmn.mleft10, cmn.mtop20,)}> No tokens match the filter </p>
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
            {/* <TokenListSection
              tokens={filterTokens(tokens.erc721)}
              type={dc.TokenType.erc721}
              setToken={setToken}
              setExpanded={setExpandedTokens}
              onCloseModal={handleClose}
              searchQuery={searchQuery}
            />
            <TokenListSection
              tokens={filterTokens(tokens.erc721meta)}
              type={dc.TokenType.erc721meta}
              setToken={setToken}
              setExpanded={setExpandedTokens}
              onCloseModal={handleClose}
              searchQuery={searchQuery}
            />
            <TokenListSection
              tokens={filterTokens(tokens.erc1155)}
              type={dc.TokenType.erc1155}
              setToken={setToken}
              setExpanded={setExpandedTokens}
              onCloseModal={handleClose}
              searchQuery={searchQuery}
            /> */}
          </SkPaper>
        </Box>
      </Modal>
    </div >)
}