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
 * @file SchainDetails.tsx
 * @copyright SKALE Labs 2021-Present
 */

import { useState } from 'react'
import { Helmet } from 'react-helmet'

import { type MetaportCore, SkPaper, explorer, Tile } from '@skalenetwork/metaport'
import { type types, metadata, constants, endpoints, networks } from '@/core'

import Button from '@mui/material/Button'

import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded'
import LinkRoundedIcon from '@mui/icons-material/LinkRounded'

import SkStack from './SkStack'
import Breadcrumbs from './Breadcrumbs'
import CollapsibleDescription from './CollapsibleDescription'
import Logo from './Logo'
import { getRpcUrl, getChainId } from '../core/chain'
import { formatNumber } from '../core/timeHelper'
import ChainTabsSection from './chains/tabs/ChainTabsSection'
import CategoriesChips from './ecosystem/CategoriesChips'
import {
  BadgeCheck,
  Blocks,
  ChartPie,
  CirclePlus,
  ExternalLink,
  Grid2x2,
  HandCoins,
  TrendingUp,
  Users
} from 'lucide-react'

export default function SchainDetails(props: {
  chainsMeta: types.ChainsMetadataMap
  schainStats: types.IStatsData | null
  schainMetrics: types.IChainMetrics | null
  chain: types.ISChain
  mpc: MetaportCore
}) {
  const [loading, setLoading] = useState<boolean>(false)
  const [added, setAdded] = useState<boolean>(false)

  const network = props.mpc.config.skaleNetwork
  const proxyBase = endpoints.getProxyEndpoint(network)

  const rpcUrl = getRpcUrl(proxyBase, props.chain.name, constants.HTTPS_PREFIX)
  const explorerUrl = explorer.getExplorerUrl(
    props.chainsMeta[props.chain.name],
    network,
    props.chain.name
  )
  const chainId = getChainId(props.chain.name)

  const networkParams = {
    chainId,
    chainName: metadata.getAlias(network, props.chainsMeta, props.chain.name),
    rpcUrls: [rpcUrl],
    nativeCurrency: {
      name: networks.NATIVE_TOKEN_SYMBOLS[network],
      symbol: networks.NATIVE_TOKEN_SYMBOLS[network],
      decimals: 18
    },
    blockExplorerUrls: [explorerUrl]
  }

  async function addNetwork() {
    setLoading(true)
    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [networkParams]
      })
      setAdded(true)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  function connectBtnText() {
    if (added) return 'Chain Connected'
    return loading ? 'Connecting Chain' : 'Connect to Chain'
  }

  const chainMeta = props.chainsMeta[props.chain.name]

  const chainAlias = metadata.getAlias(network, props.chainsMeta, props.chain.name)
  const chainDescription = metadata.getChainDescription(chainMeta)

  const isMainnet = props.mpc.config.skaleNetwork === constants.MAINNET_CHAIN_NAME

  const getTxCount = () => {
    return isMainnet
      ? props.schainStats?.tx_count_total
      : props.schainMetrics?.chain_stats?.total_transactions
  }

  const getUAW = () => {
    return isMainnet
      ? props.schainStats?.users_count_total
      : props.schainMetrics?.chain_stats?.total_addresses
  }

  const getTotalBlocks = () => {
    return isMainnet
      ? props.schainStats?.block_count_total
      : props.schainMetrics?.chain_stats?.total_blocks
  }

  return (
    <div className="chainDetails mb-5">
      <div className="flex">
        <Breadcrumbs
          className="bg"
          sections={[
            {
              text: 'Chains',
              icon: <ArrowBackIosNewRoundedIcon className="w-3! h-3! text-foreground" />,
              url: '/chains'
            },
            {
              text: chainAlias,
              icon: <LinkRoundedIcon className="w-3! h-3!" />
            }
          ]}
        />
        <div className="grow"></div>
      </div>
      <Helmet>
        <title>SKALE Portal - {chainAlias}</title>
        <meta name="description" content={chainDescription} />
        <meta property="og:title" content={`SKALE Portal - ${chainAlias}`} />
        <meta property="og:description" content={chainDescription} />
      </Helmet>
      <SkPaper gray className="mt-2.5 p-4!">
        <div className="responsive-app-header flex items-center">
          <Logo
            chainsMeta={props.chainsMeta}
            skaleNetwork={network}
            chainName={props.chain.name}
            size="md"
          />
          <div className="app-info grow">
            <div className="flex items-center mb-2.5">
              <div className="grow">
                <CategoriesChips categories={chainMeta?.categories} all />
              </div>
              {props.schainMetrics && (
                <div className="bg-muted! text-foreground! flex items-center py-1.5 px-3! rounded-lg!">
                  <TrendingUp size={14} />
                  <p className="text-[8pt] ml-2.5">
                    {formatNumber(props.schainMetrics.chain_stats?.transactions_today)}+ Daily Tx
                  </p>
                </div>
              )}
            </div>
            <h2 className="font-bold text-xl text-foreground">{chainAlias}</h2>
            <CollapsibleDescription text={chainDescription} expandable />
          </div>
        </div>
      </SkPaper>
      <SkPaper gray className="mt-2.5 p-4!">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 md:gap-0">
          <a target="_blank" rel="noreferrer" href={explorerUrl} className="undec w-full md:w-auto">
            <Button
              size="medium"
              className="w-full! md:w-fit! md:mr-3! capitalize! text-accent! bg-foreground! disabled:bg-foreground/50! text-xs! px-6! py-4! ease-in-out transition-transform duration-150 active:scale-[0.97]"
              startIcon={<Blocks size={17} />}
            >
              Block Explorer
            </Button>
          </a>
          <Button
            startIcon={
              added ? (
                <BadgeCheck size={17} className="text-green-300 dark:text-green-600" />
              ) : (
                <CirclePlus size={17} />
              )
            }
            className="w-full! md:w-fit! md:mr-3! capitalize! text-accent! bg-foreground! disabled:bg-foreground/50! text-xs! px-6! py-4! ease-in-out transition-transform duration-150 active:scale-[0.97]"
            onClick={addNetwork}
            disabled={loading}
          >
            {connectBtnText()}
          </Button>

          {chainMeta?.url && (
            <a target="_blank" rel="noreferrer" href={chainMeta.url} className="undec w-full md:w-auto">
              <Button
                size="medium"
                className="w-full! md:w-fit! md:mr-3! capitalize! text-accent! bg-foreground! disabled:bg-foreground/50! text-xs! px-6! py-4! ease-in-out transition-transform duration-150 active:scale-[0.97]"
                startIcon={<ExternalLink size={17} className="textd-green-600" />}
              >
                Open Website
              </Button>
            </a>
          )}
        </div>
      </SkPaper>
      {networks.hasFeature(network, 'metrics') && (
        <SkPaper gray className="mt-2.5 p-4!">
          <SkStack>
            <Tile
              size="md"
              grow
              text="Total transactions"
              value={formatNumber(getTxCount())}
              icon={<ChartPie size={14} />}
            />
            {isMainnet && (
              <Tile
                size="md"
                grow
                text="Gas saved"
                value={
                  props.schainStats
                    ? `${formatNumber(props.schainStats.gas_fees_total_eth)} ETH`
                    : ''
                }
                icon={<HandCoins size={14} />}
              />
            )}
            <Tile
              size="md"
              grow
              text={isMainnet ? 'Unique active wallets' : 'Total addresses'}
              value={formatNumber(getUAW())}
              icon={<Users size={14} />}
            />
            <Tile
              size="md"
              grow
              text="Total blocks"
              value={formatNumber(getTotalBlocks())}
              icon={<Grid2x2 size={14} />}
            />
          </SkStack>
        </SkPaper>
      )}
      <ChainTabsSection
        chainsMeta={props.chainsMeta}
        mpc={props.mpc}
        chain={props.chain}
      />
    </div>
  )
}
