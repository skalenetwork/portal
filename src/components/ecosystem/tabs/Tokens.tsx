/**
 * @license
 * SKALE portal
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
 * @file Tokens.tsx
 * @copyright SKALE Labs 2024-Present
 */

import { cmn, cls, styles, type MetaportCore, interfaces, SkPaper } from '@skalenetwork/metaport'

import Grid from '@mui/material/Grid'
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded'

import CopySurface from '../../CopySurface'
import Headline from '../../Headline'

export default function Tokens(props: {
  schainName: string
  mpc: MetaportCore
  className?: string
}) {
  const tokenConnections = props.mpc.config.connections[props.schainName] ?? {}
  const chainTokens = tokenConnections.erc20 ?? {}

  function findWrapperAddress(token: interfaces.Token): `0x${string}` | null | undefined {
    const chainWithWrapper = Object.values(token.chains).find((chain) => chain.wrapper)
    return chainWithWrapper ? chainWithWrapper.wrapper : null
  }

  return (
    <SkPaper gray className={cls(cmn.mtop20)}>
      <Headline
        text="Available tokens"
        icon={<AccountBalanceWalletRoundedIcon />}
        className={cls(cmn.mbott20)}
      />
      <Grid container spacing={2}>
        {Object.keys(chainTokens).flatMap((tokenSymbol: string) => {
          const wrapperAddress = findWrapperAddress(chainTokens[tokenSymbol])
          return [
            <Grid key={tokenSymbol} item lg={3} md={4} sm={6} xs={12}>
              <CopySurface
                className={cls(styles.fullHeight)}
                title={tokenSymbol.toUpperCase()}
                value={chainTokens[tokenSymbol].address as string}
                tokenMetadata={props.mpc.config.tokens[tokenSymbol]}
              />
            </Grid>,
            ...(wrapperAddress
              ? [
                  <Grid key={`w${tokenSymbol}`} item lg={3} md={4} sm={6} xs={12}>
                    <CopySurface
                      className={cls(styles.fullHeight)}
                      title={`w${tokenSymbol.toUpperCase()}`}
                      value={wrapperAddress}
                      tokenMetadata={props.mpc.config.tokens[tokenSymbol]}
                    />
                  </Grid>
                ]
              : [])
          ]
        })}
      </Grid>
    </SkPaper>
  )
}
