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
 * @file BridgeBalance.tsx
 * @copyright SKALE Labs 2025-Present
 */

import { useMemo, useEffect } from 'react'
import { Helmet } from 'react-helmet'

import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'

import {
  BridgeBalanceCard,
  SkPaper,
  useWagmiAccount,
  useMetaportStore,
  useBridgeBalanceStore,
  getBridgeBalanceChains
} from '@skalenetwork/metaport'

import { META_TAGS } from '../core/meta'
import BridgeMenu from '../components/BridgeMenu'
import ConnectWallet from '../components/ConnectWallet'

export default function BridgeBalance() {
  const { address } = useWagmiAccount()
  const mpc = useMetaportStore((state) => state.mpc)
  const initChains = useBridgeBalanceStore((state) => state.initChains)

  const chainNames = useMemo(() => getBridgeBalanceChains(mpc.config), [mpc.config])
  const singleChain = chainNames.length === 1

  useEffect(() => {
    initChains(chainNames)
  }, [chainNames])

  return (
    <Container maxWidth="sm">
      <Helmet>
        <title>{META_TAGS.bridgeBalance.title}</title>
        <meta name="description" content={META_TAGS.bridgeBalance.description} />
        <meta property="og:title" content={META_TAGS.bridgeBalance.title} />
        <meta property="og:description" content={META_TAGS.bridgeBalance.description} />
      </Helmet>
      <Stack spacing={0}>
        <div className="flex items-center">
          <div className="grow">
            <h2 className="m-0 text-xl font-bold text-foreground">Bridge Balance</h2>
            <p className="text-xs text-secondary-foreground font-semibold">
              Manage your ETH balance used for gas fees on Mainnet network.
            </p>
          </div>
          <div>
            <BridgeMenu currentPage="balance" />
          </div>
        </div>
        {address ? (
          singleChain ? (
            <SkPaper gray className="mt-3.5">
              <BridgeBalanceCard chainName={chainNames[0]} />
            </SkPaper>
          ) : (
            <div className="mt-3.5">
              {chainNames.map((chainName, index) => (
                <BridgeBalanceCard
                  key={chainName}
                  chainName={chainName}
                  showHeader
                  defaultExpanded={index === 0}
                />
              ))}
            </div>
          )
        ) : (
          <SkPaper gray className="mt-3.5">
            <ConnectWallet />
          </SkPaper>
        )}
      </Stack>
    </Container>
  )
}
