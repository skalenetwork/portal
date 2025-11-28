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
import { type MetaportCore } from '@skalenetwork/metaport'

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
        <div key={`${tokenSymbol}`} className="col-span-1">
          <CopySurface
            className="h-full"
            title={`${tokenSymbol.toUpperCase()}`}
            value={getAddress(tokenData.address)}
            tokenMetadata={props.mpc.config.tokens[tokenSymbol]}
          />
        </div>,
        ...(wrapperAddress
          ? [
            <div key={`w${tokenSymbol}`} className="col-span-1">
              <CopySurface
                className="h-full"
                title={`w${tokenSymbol.toUpperCase()}`}
                value={getAddress(wrapperAddress)}
                tokenMetadata={props.mpc.config.tokens[tokenSymbol]}
              />
            </div>
          ]
          : [])
      ]
    })
  }

  const totalTokensCount = Object.entries({ ...ethToken, ...chainTokens }).reduce(
    (acc, [, tokenData]: [string, any]) => {
      const wrapperAddress = findWrapperAddress(tokenData)
      return acc + 1 + (wrapperAddress ? 1 : 0)
    },
    0
  )

  return (
    <div className="p-2! pt-0!">
      <div className='flex items-center pb-2'>
        <p className="text-foreground text-lg font-sans font-bold pl-0.5">Tokens</p>
        <div className="bg-muted! text-foreground! flex items-center py-1 px-2! rounded-lg! ml-2">
          <p className="text-[8pt]">
            {totalTokensCount}
          </p>
        </div>
      </div>
      <div className=' grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2'>
        {renderTokens(ethToken)}
        {renderTokens(chainTokens)}
      </div>
    </div>
  )
}
