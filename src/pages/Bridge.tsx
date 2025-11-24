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
import { Link, useSearchParams } from 'react-router-dom'
import HistoryIcon from '@mui/icons-material/History'
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded'

import {
  useMetaportStore,
  SkPaper,
  TransactionData,
  useWagmiAccount,
  Tile
} from '@skalenetwork/metaport'
import { type types, dc, networks } from '@/core'

import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'

import BridgeBody from '../components/BridgeBody'

import { META_TAGS } from '../core/meta'
import Meson from '../components/Meson'
import { Button } from '@mui/material'
import SkPageInfoIcon from '../components/SkPageInfoIcon'
import { DISABLE_BRIDGE, NETWORKS } from '../core/constants'

interface TokenParams {
  keyname: string | null
  type: dc.TokenType | null
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
    transactionsHistory,
    addressChanged
  } = useMetaportStore((state) => state)

  const { address } = useWagmiAccount()

  function validChainName(chainName: string | null): boolean {
    if (!chainName) return false
    return mpc.config.chains.includes(chainName)
  }

  function validAppName(chainName: string | null, appName: string | null): boolean {
    if (!chainName || !appName) return false
    const apps = props.chainsMeta?.[chainName]?.apps
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
    addressChanged()
  }, [address])

  useEffect(() => {
    initBridge()
  }, [])

  async function initBridge() {
    if (chainName1 && chainName2 && token) return
    const from = searchParams.get('from')
    const to = searchParams.get('to')
    const fromApp = searchParams.get('from-app')
    const toApp = searchParams.get('to-app')
    const keyname = searchParams.get('token')
    const type = searchParams.get('type')

    const chain1 = validChainName(from) ? from! : mpc.config.chains[0]
    const chain2 = validChainName(to) ? to! : mpc.config.chains[1]

    await setChainName1(chain1)
    await setChainName2(chain2)
    setAppName1(validAppName(from, fromApp) ? fromApp! : undefined!)
    setAppName2(validAppName(to, toApp) ? toApp! : undefined!)

    if (keyname && type && validKeyname(keyname, type, chain1, chain2))
      setTokenParams({ keyname, type: type as dc.TokenType })
  }

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

  if (DISABLE_BRIDGE)
    return (
      <Container maxWidth="md">
        <Tile
          value="Bridge operations on the SKALE Testnet will be temporarily disabled from July 9 to July 18 due to planned migration from Holesky to Hoodi.
As Ethereum phases out the Holesky testnet (ending September 2025), SKALE is updating its testnet bridge connection to ensure continued stability and a smooth developer experience.
Thank you for your understanding!"
          text="Testnet Bridge Maintenance Notice."
          icon={<ErrorRoundedIcon />}
          color="warning"
          className="mt-5"
        />
      </Container>
    )

  return (
    <Container maxWidth="sm">
      <Helmet>
        <title>{META_TAGS.bridge.title}</title>
        <meta name="description" content={META_TAGS.bridge.description} />
        <meta property="og:title" content={META_TAGS.bridge.title} />
        <meta property="og:description" content={META_TAGS.bridge.description} />
      </Helmet>
      <Stack spacing={0}>
        <div className="flex items-center">
          <div className="flex-grow">
            <h2 className="m-0">Bridge</h2>
            {networks.hasFeatureInAny(NETWORKS, 'sfuel') && (
              <p className="text-sm text-secondary-foreground">
                Zero Gas Fees between SKALE Chains
              </p>
            )}
          </div>
          <div>
            <Link to="/bridge/history">
              <Button
                variant="contained"
                className="btnMd bg-secondary-foreground text-primary mr-2.5"
                startIcon={<HistoryIcon />}
              >
                History
              </Button>
            </Link>
            <SkPageInfoIcon meta_tag={META_TAGS.bridge} />
          </div>
        </div>

        <div className="mt-5">
          <BridgeBody chainsMeta={props.chainsMeta} />
          {transactionsHistory.length !== 0 ? (
            <div className="mb-5">
              <p className="text-base text-foreground font-bold mt-5 mb-2.5">
                Completed transactions
              </p>
              <SkPaper gray>
                {transactionsHistory.map((transactionData: types.mp.TransactionHistory) => (
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
        className="mt-5"
        skaleNetwork={mpc.config.skaleNetwork}
        isXs={props.isXs}
      />
    </Container>
  )
}
