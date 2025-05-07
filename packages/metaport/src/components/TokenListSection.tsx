import Button from '@mui/material/Button'
import { dc, types } from '@/core'

import { cls, cmn } from '../core/css'
import { styles } from '../core/css' // Import styles

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
}) {
  function handle(tokenData: dc.TokenData): void {
    props.setExpanded(false)
    props.setToken(tokenData)
    if (props.onCloseModal) props.onCloseModal()
  }

  console.log('Tokens:', props.tokens);
  console.log('Token Balances:', props.tokenBalances);

  if (Object.keys(props.tokens).length === 0) return

  const nonZeroBalanceTokens = Object.keys(props.tokens).filter(
    (key) =>
      props.tokenBalances &&
      props.tokenBalances[props.tokens[key]?.keyname] > 0n
  )

  const zeroBalanceTokens = Object.keys(props.tokens).filter(
    (key) =>
      !props.tokenBalances ||
      props.tokenBalances[props.tokens[key]?.keyname] <= 0n
  )

  return (
    <div className={cls(cmn.chainsList, cmn.mbott10, cmn.mri10)} style={{ marginLeft: '8px' }}>
      {nonZeroBalanceTokens.length > 0 && (
        <div>
          <h5 style={{ color: 'lightgrey', textAlign: 'left', fontFamily: '-apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif' }}>Your Tokens</h5>

          {nonZeroBalanceTokens.sort().map((key) => (
            <Button
              key={key}
              color="secondary"
              size="small"
              className={cmn.fullWidth}
              onClick={() => handle(props.tokens[key])}
            >
              {/* Removed styles.paperGrey for transparent background */}
              <div className={cls(cmn.flex, cmn.flexcv, cmn.fullWidth, cmn.mtop10, cmn.mbott10, cmn.bordRad)}>
                <div className={cls(cmn.flex, cmn.flexc, cmn.mleft10)}>
                  <TokenIcon
                    tokenSymbol={props.tokens[key]?.meta.symbol}
                    iconUrl={props.tokens[key]?.meta.iconUrl}
                  />
                </div>
                {/* Wrapped name and address in a div and added cmn.flexg */}
                <div className={cls(cmn.flexg)}>
                  <p
                    className={cls(
                      cmn.p,
                      cmn.p3,
                      cmn.p600,
                      cmn.flex,
                      cmn.mri10,
                      cmn.mleft10
                    )}
                    style={{ color: 'lightgrey' }} // Added inline style for lightgrey
                  >
                    {getTokenName(props.tokens[key])}
                  </p>


                  {props.tokens[key].address &&
                    <p
                      className={cls(
                        cmn.p,
                        cmn.p4,
                        cmn.p500,
                        cmn.flex,
                        cmn.mleft10
                      )}
                      style={{ color: 'lightgrey', textAlign: 'right' }} // Added inline style for lightgrey and text alignment
                    >
                      {props.tokens[key].address.substring(0, 5) +
                        '...' +
                        props.tokens[key].address.substring(props.tokens[key].address.length - 3)}
                    </p>}

                </div>
                {/* TokenBalance remains in its div */}
                <div className={cmn.mri10}>
                  <TokenBalance
                    balance={
                      props.tokenBalances ? props.tokenBalances[props.tokens[key]?.keyname] : null

                    }
                    symbol={props.tokens[key]?.meta.symbol}
                    decimals={props.tokens[key]?.meta.decimals}
                    style={{ color: 'lightgrey', textAlign: 'right' }} // Added inline style for lightgrey and text alignment
                  />

                </div>

              </div>
            </Button>
          ))}
        </div>
      )}

      {zeroBalanceTokens.length > 0 && (
        <div>
          <h5 style={{ color: 'lightgrey', textAlign: 'left', fontFamily: '-apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif' }}>Tokens</h5>
          {zeroBalanceTokens.sort().map((key) => (
            <Button
              key={key}
              color="secondary"
              size="small"
              className={cmn.fullWidth}
              onClick={() => handle(props.tokens[key])}
            >
              {/* Removed styles.paperGrey for transparent background */}
              <div className={cls(cmn.flex, cmn.flexcv, cmn.fullWidth, cmn.mtop10, cmn.mbott10, cmn.bordRad)}>
                <div className={cls(cmn.flex, cmn.flexc, cmn.mleft10)}>
                  <TokenIcon
                    tokenSymbol={props.tokens[key]?.meta.symbol}
                    iconUrl={props.tokens[key]?.meta.iconUrl}
                  />
                </div>
                 {/* Wrapped name and address in a div and added cmn.flexg */}
                <div className={cls(cmn.flexg)}>
                  <p
                    className={cls(
                      cmn.p,
                      cmn.p3,
                      cmn.p600,
                      cmn.flex,
                      cmn.mri10,
                      cmn.mleft10
                    )}
                    style={{ color: 'lightgrey' }} // Added inline style for lightgrey
                  >
                    {getTokenName(props.tokens[key])}
                  </p>


                  {props.tokens[key].address &&
                    <p
                      className={cls(
                        cmn.p,
                        cmn.p4,
                        cmn.p500,
                        cmn.flex,
                        cmn.mleft10
                      )}
                      style={{ color: 'lightgrey', textAlign: 'right' }} // Added inline style for lightgrey and text alignment
                    >
                      {props.tokens[key].address.substring(0, 5) +
                        '...' +
                        props.tokens[key].address.substring(props.tokens[key].address.length - 3)}
                    </p>}

                </div>
                {/* TokenBalance remains in its div */}
                <div className={cmn.mri10}>
                  <TokenBalance
                    balance={
                      props.tokenBalances ? props.tokenBalances[props.tokens[key]?.keyname] : null
                    }
                    symbol={props.tokens[key]?.meta.symbol}
                    decimals={props.tokens[key]?.meta.decimals}
                    style={{ color: 'lightgrey', textAlign: 'right' }} // Added style for consistency
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
