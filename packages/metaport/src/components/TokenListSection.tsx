import Button from '@mui/material/Button'
import SavingsIcon from '@mui/icons-material/Savings'
import LocalMallIcon from '@mui/icons-material/LocalMall'

import { dc, types } from '@/core'

import { cls, cmn, styles } from '../core/css'

import TokenBalance from './TokenBalance'
import TokenIcon from './TokenIcon'

import { getTokenName } from '../core/metadata'

export default function TokenListSection(props: {
  setExpanded: (expanded: string | false) => void
  setToken: (token: dc.TokenData) => void
  tokens: types.mp.TokenDataMap
  type: dc.TokenType
  tokenBalances?: types.mp.TokenBalancesMap

  onCloseModal?: () => void
  searchQuery?: string
}) {
  function handle(tokenData: dc.TokenData): void {
    props.setExpanded(false)
    props.setToken(tokenData)
    if (props.onCloseModal) props.onCloseModal()
  }

  console.log('Tokens:', props.tokens)
  console.log('Token Balances:', props.tokenBalances)

  const filteredTokens = Object.keys(props.tokens).filter(
    (key) =>
      props.tokens[key]?.meta.symbol
        .toLowerCase()
        .includes(props.searchQuery?.toLowerCase() || '') ||
      getTokenName(props.tokens[key])
        .toLowerCase()
        .includes(props.searchQuery?.toLowerCase() || '')
  )

  const nonZeroBalanceTokens = filteredTokens.filter(
    (key) => props.tokenBalances && props.tokenBalances[props.tokens[key]?.keyname] > 0n
  )

  const zeroBalanceTokens = Object.keys(props.tokens).filter(
    (key) =>
      props.tokenBalances == undefined ||
      Object.keys(props.tokenBalances).length == 0 ||
      props.tokenBalances[props.tokens[key]?.keyname] <= 0n
  )

  return (
    <div className={cls(styles.bridgeModalScroll)}>
      {nonZeroBalanceTokens.length > 0 && (
        <div className={cls(cmn.mtop20)}>
          <div className={cls(cmn.flex, cmn.flexcv, cmn.flexg, cmn.pSec, cmn.mleft10)}>
            <div className={cls(cmn.flexcv, cmn.flex, cmn.mri10, styles.chainIconxs)}>
              <SavingsIcon />
            </div>
            <p className={cls(cmn.p, cmn.p3, cmn.p600, cmn.flexg, cmn.cap)}>Your Tokens</p>
          </div>

          {nonZeroBalanceTokens.sort().map((key) => (
            <Button
              key={key}
              color="secondary"
              size="small"
              className={cls(cmn.fullWidth, cmn.pleft10)}
              onClick={() => handle(props.tokens[key])}
            >
              <div
                className={cls(
                  cmn.flex,
                  cmn.flexcv,
                  cmn.fullWidth,
                  cmn.mtop10,
                  cmn.mbott10,
                  cmn.bordRad
                )}
              >
                <div className={cls(cmn.flex, cmn.flexc)}>
                  <TokenIcon
                    tokenSymbol={props.tokens[key]?.meta.symbol}
                    iconUrl={props.tokens[key]?.meta.iconUrl}
                  />
                </div>
                <div className={cls(cmn.flexg)}>
                  <p
                    className={cls(
                      cmn.p,
                      cmn.p3,
                      cmn.p600,
                      cmn.pPrim,
                      cmn.flex,
                      cmn.mri10,
                      cmn.mleft10
                    )}
                  >
                    {getTokenName(props.tokens[key])}
                  </p>

                  {props.tokens[key].address && (
                    <p className={cls(cmn.p, cmn.p4, cmn.pSec, cmn.p500, cmn.flex, cmn.mleft10)}>
                      {props.tokens[key].address.substring(0, 5) +
                        '...' +
                        props.tokens[key].address.substring(props.tokens[key].address.length - 3)}
                    </p>
                  )}
                </div>

                <div className={cmn.mri10}>
                  <TokenBalance
                    balance={
                      props.tokenBalances ? props.tokenBalances[props.tokens[key]?.keyname] : null
                    }
                    symbol={props.tokens[key]?.meta.symbol}
                    decimals={props.tokens[key]?.meta.decimals}
                    truncate={4}
                  />
                </div>
              </div>
            </Button>
          ))}
        </div>
      )}

      {zeroBalanceTokens.length > 0 && (
        <div className={cls(cmn.mtop20)}>
          <div className={cls(cmn.flex, cmn.flexcv, cmn.flexg, cmn.pSec, cmn.mleft10)}>
            <div className={cls(cmn.flexcv, cmn.flex, cmn.mri10, styles.chainIconxs)}>
              <LocalMallIcon />
            </div>
            <p className={cls(cmn.p, cmn.p3, cmn.p600, cmn.flexg, cmn.cap)}>Tokens</p>
          </div>

          {zeroBalanceTokens.sort().map((key) => (
            <Button
              key={key}
              color="secondary"
              size="small"
              className={cls(cmn.fullWidth, cmn.pleft10)}
              onClick={() => handle(props.tokens[key])}
            >
              <div
                className={cls(
                  cmn.flex,
                  cmn.flexcv,
                  cmn.fullWidth,
                  cmn.mtop10,
                  cmn.mbott10,
                  cmn.bordRad
                )}
              >
                <div className={cls(cmn.flex, cmn.flexc)}>
                  <TokenIcon
                    tokenSymbol={props.tokens[key]?.meta.symbol}
                    iconUrl={props.tokens[key]?.meta.iconUrl}
                  />
                </div>
                <div className={cls(cmn.flexg)}>
                  <p
                    className={cls(
                      cmn.p,
                      cmn.p3,
                      cmn.p600,
                      cmn.flex,
                      cmn.mri10,
                      cmn.mleft10,
                      cmn.pPrim
                    )}
                  >
                    {getTokenName(props.tokens[key])}
                  </p>

                  {props.tokens[key].address && (
                    <p className={cls(cmn.p, cmn.p4, cmn.p500, cmn.flex, cmn.mleft10, cmn.pSec)}>
                      {props.tokens[key].address.substring(0, 5) +
                        '...' +
                        props.tokens[key].address.substring(props.tokens[key].address.length - 3)}
                    </p>
                  )}
                </div>

                <div className={cmn.mri10}>
                  <TokenBalance
                    balance={
                      props.tokenBalances ? props.tokenBalances[props.tokens[key]?.keyname] : null
                    }
                    symbol={props.tokens[key]?.meta.symbol}
                    decimals={props.tokens[key]?.meta.decimals}
                    truncate={4}
                  />
                </div>
              </div>
            </Button>
          ))}
        </div>
      )}
    </div>
  )
}
