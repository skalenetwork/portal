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
 * @file Portfolio.tsx
 * @copyright SKALE Labs 2023-Present
 */

import { useState, useEffect } from 'react'
import { types, dc } from '@/core'

import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import Grid from '@mui/material/Grid'

import {
  cmn,
  cls,
  styles,
  type MetaportCore,
  TokenIcon,
  SkPaper,
  useWagmiAccount,
  fromWei
} from '@skalenetwork/metaport'

import TokenSurface from '../components/TokenSurface'
import ConnectWallet from '../components/ConnectWallet'

export default function Portfolio(props: { mpc: MetaportCore }) {
  const { address } = useWagmiAccount()

  const [balances, setTokenBalances] = useState<types.mp.TokenBalancesMap[]>([])

  useEffect(() => {
    tokenBalances()
  }, [])

  async function tokenBalances() {
    const contracts = props.mpc.config.chains.map((chain: string) =>
      props.mpc.tokenContracts(
        props.mpc.tokens(chain),
        dc.TokenType.erc20,
        chain,
        props.mpc.provider(chain)
      )
    )
    setTokenBalances(
      await Promise.all(
        contracts.map(
          async (
            chainContracts: types.mp.TokenContractsMap
          ): Promise<types.mp.TokenBalancesMap> =>
            await props.mpc.tokenBalances(chainContracts, address!)
        )
      )
    )
  }

  function getTotalBalance(token: string) {
    const totalBalance: bigint = props.mpc.config.chains.reduce((sum: bigint, _, chainIndex) => {
      if (!balances[chainIndex]) return sum // If there's no balance, return the current sum
      const chainBalance: bigint = balances[chainIndex][token]
        ? BigInt(balances[chainIndex][token])
        : 0n
      return sum + chainBalance
    }, 0n) // Initial value as bigint§
    return totalBalance
  }

  function getTokenDecimals(token: string) {
    const tokenMetadata = props.mpc.config.tokens[token]
    if (!tokenMetadata?.decimals) return '18'
    return tokenMetadata.decimals
  }

  const isTokenInChain = (chain: string, token: string) => {
    const connection = props.mpc.config.connections[chain]
    if (!connection) return false

    const hasErc20Token = connection.erc20 && connection.erc20[token]
    const hasEthToken = connection.eth && connection.eth[token]

    return hasErc20Token || hasEthToken
  }

  return (
    <Container maxWidth="md">
      <Stack spacing={0}>
        <div className={cls(cmn.flex)}>
          <h2 className={cls(cmn.nom, cmn.flexg)}>Portfolio</h2>
        </div>
        <p className={cls(cmn.nom, cmn.p, cmn.p3, cmn.pSec)}>Your assets across all SKALE Chains</p>
        <div>
          {!address ? <ConnectWallet className={cmn.mtop20} /> : null}
          {Object.keys(props.mpc.config.tokens)?.map((token: string, index: number) => (
            <div key={index} className={cls(cmn.mtop20)}>
              <SkPaper gray className={cmn.n}>
                <div
                  className={cls(
                    cmn.flex,
                    cmn.flexcv,
                    cmn.mbott10,
                    cmn.mtop5,
                    cmn.mleft10,
                    cmn.mri10
                  )}
                >
                  <TokenIcon
                    size="md"
                    tokenSymbol={token}
                    iconUrl={props.mpc.config.tokens[token].iconUrl}
                  />
                  <div className={cls(cmn.mleft10, cmn.flexg)}>
                    <p className={cls(cmn.p, cmn.pPrim, cmn.p2, cmn.p700)}>
                      {props.mpc.config.tokens[token].symbol}
                    </p>
                    <p className={cls(cmn.p, cmn.pSec, cmn.p3, cmn.p600)}>
                      {props.mpc.config.tokens[token].name ?? (token === 'eth' ? 'Ethereum' : '')}
                    </p>
                  </div>
                  <div className={cls(cmn.mri5)}>
                    <p className={cls(cmn.p, cmn.pPrim, cmn.p1, cmn.p700, cmn.pri)}>
                      {fromWei(getTotalBalance(token).toString(), getTokenDecimals(token))}{' '}
                      {props.mpc.config.tokens[token].symbol}
                    </p>
                    <p className={cls(cmn.p, cmn.pSec, cmn.p5, cmn.p600, cmn.pri)}>On 2 chains</p>
                  </div>
                </div>
                <Grid container spacing={1} className={cls(cmn.full)}>
                  {props.mpc.config.chains
                    .filter((chain: string) => {
                      return isTokenInChain(chain, token)
                    })
                    .map((chain: string, index: number) => (
                      <Grid key={index} item lg={3} md={4} sm={6} xs={12}>
                        <TokenSurface
                          className={cls(styles.fullHeight)}
                          title={chain}
                          value={
                            (balances[index] && balances[index][token]
                              ? fromWei(balances[index][token].toString(), getTokenDecimals(token))
                              : '0') +
                            ' ' +
                            props.mpc.config.tokens[token].symbol
                          }
                          chainName={chain}
                          skaleNetwork={props.mpc.config.skaleNetwork}
                        />
                      </Grid>
                    ))}
                </Grid>
              </SkPaper>
            </div>
          ))}
        </div>
      </Stack>
    </Container>
  )
}
