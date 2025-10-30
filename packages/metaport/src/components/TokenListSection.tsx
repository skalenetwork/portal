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
 * @file TokenListSection.ts
 * @copyright SKALE Labs 2025-Present
 */

import SavingsIcon from '@mui/icons-material/Savings'
import LocalMallIcon from '@mui/icons-material/LocalMall'
import Button from '@mui/material/Button'

import { dc, types, constants } from '@/core'
import { cls, cmn, styles } from '../core/css'
import { getTokenName } from '../core/metadata'

import TokenSection from './TokenSection'
import TokenIcon from './TokenIcon'

export default function TokenListSection(props: {
  setExpanded: (expanded: string | false) => void
  setToken: (token: dc.TokenData) => void
  tokens: types.mp.TokenDataMap
  type: dc.TokenType
  tokenBalances?: types.mp.TokenBalancesMap
  onCloseModal: () => void
  searchQuery: string
}) {
  function handle(tokenData: dc.TokenData): void {
    props.setExpanded(false)
    props.setToken(tokenData)
    props.onCloseModal()
  }

  const filteredTokens = Object.keys(props.tokens).filter(
    (key) =>
      props.tokens[key]?.meta.symbol.toLowerCase().includes(props.searchQuery.toLowerCase()) ||
      getTokenName(props.tokens[key]).toLowerCase().includes(props.searchQuery.toLowerCase())
  )
  const popularTokens = filteredTokens
    .filter((key) => constants.POPULAR_TOKENS.includes(props.tokens[key]?.meta.symbol))
    .sort((a, b) => props.tokens[a]?.meta.symbol.localeCompare(props.tokens[b]?.meta.symbol))

  const nonZeroBalanceTokens = filteredTokens
    .filter((key) => props.tokenBalances && props.tokenBalances[props.tokens[key]?.keyname] > 0n)
    .map((key) => ({
      key,
      tokenData: props.tokens[key],
      balance: props.tokenBalances ? props.tokenBalances[props.tokens[key]?.keyname] : null
    }))

  const zeroBalanceTokens = filteredTokens
    .filter(
      (key) =>
        !props.tokenBalances ||
        Object.keys(props.tokenBalances).length === 0 ||
        props.tokenBalances[props.tokens[key]?.keyname] <= 0n
    )
    .map((key) => ({
      key,
      tokenData: props.tokens[key],
      balance: props.tokenBalances ? props.tokenBalances[props.tokens[key]?.keyname] : null
    }))

  return (
    <div className="styles.bridgeModalScroll">
      {popularTokens.map((key) => (
        <Button
          color="primary"
          size="small"
          className="cmn.mtop20, cmn.flexcv, cmn.mleft10, styles.filled"
          variant="contained"
          key={key}
          onClick={() => handle(props.tokens[key])}
        >
          <div className="cmn.flex, cmn.flexcv">
            <TokenIcon
              tokenSymbol={props.tokens[key]?.meta.symbol}
              iconUrl={props.tokens[key]?.meta.iconUrl}
            />
            <span className=" cmn.pPrim, cmn.mleft10">
              {props.tokens[key]?.meta.symbol}
            </span>
          </div>
        </Button>
      ))}
      {nonZeroBalanceTokens.length > 0 && (
        <TokenSection
          text="Your Tokens"
          icon={<SavingsIcon className="styles.chainIconxs" />}
          tokens={nonZeroBalanceTokens}
          onTokenClick={handle}
        />
      )}

      {zeroBalanceTokens.length > 0 && (
        <TokenSection
          text="Tokens"
          icon={<LocalMallIcon className="styles.chainIconxs" />}
          tokens={zeroBalanceTokens}
          onTokenClick={handle}
        />
      )}
    </div>
  )
}
