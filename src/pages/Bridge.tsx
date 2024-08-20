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
 * @file Bridge.tsx
 * @copyright SKALE Labs 2023-Present
 */

import { Helmet } from 'react-helmet'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import {
  CHAINS_META,
  cls,
  cmn,
  type dataclasses,
  useMetaportStore,
  SkPaper,
  type interfaces,
  TransactionData
} from '@skalenetwork/metaport'
import { type types } from '@/core'

import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'

import BridgeBody from '../components/BridgeBody'

import { META_TAGS } from '../core/meta'
import Meson from '../components/Meson'

interface TokenParams {
  keyname: string | null
  type: dataclasses.TokenType | null
}

function getEmptyTokenParams(): TokenParams {
  return { keyname: null, type: null }
}

export default function Bridge(props: { isXs: boolean; chainsMeta: types.ChainsMetadataMap }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const [tokenParams, setTokenParams] = useState<TokenParams>(getEmptyTokenParams())

  const mpc = useMetaportStore((state) => state.mpc)

  const {
    chainName1,
    chainName2,
    setChainName1,
    setChainName2,
    appName1,
    appName2,
    setAppName1,
    setAppName2,
    token,
    tokens,
    setToken,
    transactionsHistory
  } = useMetaportStore((state) => state)

  function validChainName(chainName: string | null): boolean {
    if (!chainName) return false
    return mpc.config.chains.includes(chainName)
  }

  function validAppName(chainName: string | null, appName: string | null): boolean {
    if (!chainName || !appName) return false
    const chainMeta = CHAINS_META[mpc.config.skaleNetwork]
    const apps = chainMeta?.[chainName]?.apps
    return !!apps?.[appName]
  }

  function validKeyname(keyname: string, type: string, from: string, to: string): boolean {
    return !!mpc.config.connections[from]?.[type]?.[keyname]?.chains?.[to]
  }

  function updateSearchParams() {
    const params: any = {
      from: chainName1,
      to: chainName2,
      token: token?.keyname,
      type: token?.type
    }
    if (appName1) params['from-app'] = appName1
    if (appName2) params['to-app'] = appName2
    setSearchParams(params)
  }

  useEffect(() => {
    updateSearchParams()
  }, [chainName1, chainName2, appName1, appName2, token])

  useEffect(() => {
    if (chainName1 && chainName2 && token) return
    const from = searchParams.get('from')
    const to = searchParams.get('to')
    const fromApp = searchParams.get('from-app')
    const toApp = searchParams.get('to-app')
    const keyname = searchParams.get('token')
    const type = searchParams.get('type')

    const chain1 = validChainName(from) ? from! : mpc.config.chains[0]
    const chain2 = validChainName(to) ? to! : mpc.config.chains[1]

    setChainName1(chain1)
    setChainName2(chain2)
    setAppName1(validAppName(from, fromApp) ? fromApp! : undefined!)
    setAppName2(validAppName(to, toApp) ? toApp! : undefined!)

    if (keyname && type && validKeyname(keyname, type, chain1, chain2))
      setTokenParams({ keyname, type: type as dataclasses.TokenType })
  }, [])

  useEffect(() => {
    if (
      tokens &&
      tokenParams.type != null &&
      tokenParams.keyname &&
      tokens[tokenParams.type] &&
      tokens[tokenParams.type][tokenParams.keyname] &&
      validKeyname(tokenParams.keyname, tokenParams.type, chainName1, chainName2)
    ) {
      setToken(tokens[tokenParams.type][tokenParams.keyname])
      setTokenParams(getEmptyTokenParams())
      return
    }

    if (tokens && !token) {
      if (tokens.erc20 && Object.values(tokens.erc20)[0]) {
        setToken(Object.values(tokens.erc20)[0])
        return
      }
      if (tokens.eth && tokens.eth.eth) {
        setToken(tokens.eth.eth)
      }
    }
  }, [tokenParams, tokens])

  return (
    <Container maxWidth="sm">
      <Helmet>
        <title>{META_TAGS.bridge.title}</title>
        <meta name="description" content={META_TAGS.bridge.description} />
        <meta property="og:title" content={META_TAGS.bridge.title} />
        <meta property="og:description" content={META_TAGS.bridge.description} />
      </Helmet>
      <Stack spacing={0}>
        <div className={cls(cmn.flex)}>
          <h2 className={cls(cmn.nom)}>Transfer</h2>
        </div>
        <p className={cls(cmn.nom, cmn.p, cmn.p3, cmn.pSec)}>Zero Gas Fees between SKALE Chains</p>
        <div className={cls(cmn.mtop20)}>
          <BridgeBody />
          {transactionsHistory.length !== 0 ? (
            <div className={cls(cmn.mbott20)}>
              <p className={cls(cmn.p, cmn.p2, cmn.pPrim, cmn.p700, cmn.mtop20, cmn.mbott10)}>
                Completed transactions
              </p>
              <SkPaper gray>
                {transactionsHistory.map((transactionData: interfaces.TransactionHistory) => (
                  <TransactionData
                    key={transactionData.transactionHash}
                    transactionData={transactionData}
                    config={mpc.config}
                  />
                ))}
              </SkPaper>
            </div>
          ) : null}
        </div>
      </Stack>
      <Meson
        chainsMeta={props.chainsMeta}
        className={cls(cmn.mtop20)}
        skaleNetwork={mpc.config.skaleNetwork}
        isXs={props.isXs}
      />
    </Container>
  )
}
