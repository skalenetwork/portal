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

import { type types } from '@/core'
import { cmn, cls, styles, type MetaportCore, SkPaper } from '@skalenetwork/metaport'
import Grid from '@mui/material/Grid'
import CopySurface from '../../CopySurface'
import { getAddress } from 'ethers'

export default function Tokens(props: {
  schainName: string
  mpc: MetaportCore
  className?: string
}) {
  const tokenConnections = props.mpc.config.connections[props.schainName] ?? {}
  const chainTokens = tokenConnections.erc20 ?? {}
  const ethToken = tokenConnections.eth ?? {}

  function findWrapperAddress(token: types.mp.Token): `0x${string}` | null | undefined {
    if (!token || !token.chains) return null
    const chainWithWrapper = Object.values(token.chains).find((chain) => chain.wrapper)
    return chainWithWrapper ? chainWithWrapper.wrapper : null
  }

  const renderTokens = (tokens: any) => {
    return Object.entries(tokens).flatMap(([tokenSymbol, tokenData]: [string, any]) => {
      const wrapperAddress = findWrapperAddress(tokenData)
      return [
        <Grid key={`${tokenSymbol}`} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
          <CopySurface
            className={cls(styles.fullHeight)}
            title={`${tokenSymbol.toUpperCase()}`}
            value={getAddress(tokenData.address)}
            tokenMetadata={props.mpc.config.tokens[tokenSymbol]}
          />
        </Grid>,
        ...(wrapperAddress
          ? [
            <Grid key={`w${tokenSymbol}`} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <CopySurface
                className={cls(styles.fullHeight)}
                title={`w${tokenSymbol.toUpperCase()}`}
                value={getAddress(wrapperAddress)}
                tokenMetadata={props.mpc.config.tokens[tokenSymbol]}
              />
            </Grid>
          ]
          : [])
      ]
    })
  }

  return (
    <SkPaper gray className={cls(cmn.mtop20)}>
      <Grid container spacing={2}>
        {renderTokens(ethToken)}
        {renderTokens(chainTokens)}
      </Grid>
    </SkPaper>
  )
}
