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

import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded'
import ArrowOutwardRoundedIcon from '@mui/icons-material/ArrowOutwardRounded'
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded'
import LinkRoundedIcon from '@mui/icons-material/LinkRounded'
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded'
import PersonRoundedIcon from '@mui/icons-material/PersonRounded'
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded'
import DataSaverOffRoundedIcon from '@mui/icons-material/DataSaverOffRounded'
import SavingsRoundedIcon from '@mui/icons-material/SavingsRounded'
import ViewInArRoundedIcon from '@mui/icons-material/ViewInArRounded'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'

import SkStack from './SkStack'
import Breadcrumbs from './Breadcrumbs'
import CollapsibleDescription from './CollapsibleDescription'
import SkBtn from './SkBtn'
import Logo from './Logo'
import { getRpcUrl, getChainId } from '../core/chain'
import { formatNumber } from '../core/timeHelper'
import ChainTabsSection from './chains/tabs/ChainTabsSection'
import CategoriesChips from './ecosystem/CategoriesChips'

export default function SchainDetails(props: {
  schainName: string
  chainsMeta: types.ChainsMetadataMap
  schainStats: types.IStatsData | null
  schainMetrics: types.IChainMetrics | null
  chain: any
  mpc: MetaportCore
  isXs: boolean
}) {
  const [loading, setLoading] = useState<boolean>(false)
  const [added, setAdded] = useState<boolean>(false)

  const network = props.mpc.config.skaleNetwork
  const proxyBase = endpoints.getProxyEndpoint(network)

  const rpcUrl = getRpcUrl(proxyBase, props.schainName, constants.HTTPS_PREFIX)
  const explorerUrl = explorer.getExplorerUrl(
    props.chainsMeta[props.schainName],
    network,
    props.schainName
  )
  const chainId = getChainId(props.schainName)

  const networkParams = {
    chainId,
    chainName:
      'SKALE' +
      (network === 'testnet' ? ' Testnet ' : ' ') +
      metadata.getAlias(network, props.chainsMeta, props.schainName),
    rpcUrls: [rpcUrl],
    nativeCurrency: {
      name: 'sFUEL',
      symbol: 'sFUEL',
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

  const chainMeta = props.chainsMeta[props.schainName]

  const chainAlias = metadata.getAlias(network, props.chainsMeta, props.schainName)
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
      <SkPaper gray className="mt-2.5">
        <div className="p-2.5">
          <div className="responsive-app-header flex items-center">
            <Logo
              chainsMeta={props.chainsMeta}
              skaleNetwork={network}
              chainName={props.schainName}
              size="md"
            />
            <div className="app-info grow">
              <div className="flex items-center mb-2.5">
                <div className="grow">
                  <CategoriesChips categories={chainMeta?.categories} all />
                </div>
              </div>

              <h2 className="font-bold text-xl text-foreground">{chainAlias}</h2>
              <CollapsibleDescription text={chainDescription} expandable />
            </div>
          </div>
        </div>
      </SkPaper>
      <SkPaper gray className="mt-2.5">
        <SkStack>
          <Tile
            className="flex items-center"
            children={
              <div className={`${!props.isXs ? 'flex' : ''} items-center`}>
                <a target="_blank" rel="noreferrer" href={explorerUrl} className="undec">
                  <Button
                    size="medium"
                    className="mr-2.5 capitalize! text-accent-foreground! p-4! py-3!"
                    startIcon={<ViewInArRoundedIcon />}
                  >
                    Block Explorer
                  </Button>
                </a>
                <SkBtn
                  startIcon={added ? <CheckCircleRoundedIcon /> : <AddCircleRoundedIcon />}
                  size="md"
                  className={`mr-2.5 text-accent-foreground! p-4! py-3! ${loading ? 'btnPaddLoading' : ''} ${props.isXs ? 'w-full' : ''}`}
                  onClick={addNetwork}
                  disabled={loading}
                  text={connectBtnText()}
                  loading={loading}
                />
                {chainMeta?.url && (
                  <a target="_blank" rel="noreferrer" href={chainMeta.url} className="undec">
                    <Button
                      size="medium"
                      className="capitalize! text-accent-foreground!  p-4! py-3!"
                      startIcon={<ArrowOutwardRoundedIcon />}
                    >
                      Open Website
                    </Button>
                  </a>
                )}
              </div>
            }
          />
          {networks.hasFeature(network, 'metrics') && (
            <Tile
              size="md"
              grow
              text="Daily transactions"
              value={
                props.schainMetrics
                  ? formatNumber(props.schainMetrics.chain_stats?.transactions_today)
                  : '0'
              }
              icon={<TrendingUpRoundedIcon className="w-4! h-4!" />}
            />
          )}
        </SkStack>

        {networks.hasFeature(network, 'metrics') ? (
          <SkStack className="pt-2.5">
            <Tile
              size="md"
              grow
              text="Total transactions"
              value={formatNumber(getTxCount())}
              icon={<DataSaverOffRoundedIcon className="w-4! h-4!" />}
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
                icon={<SavingsRoundedIcon className="w-4! h-4!" />}
              />
            )}
            <Tile
              size="md"
              grow
              text={isMainnet ? 'Unique active wallets' : 'Total addresses'}
              value={formatNumber(getUAW())}
              icon={<PersonRoundedIcon className="w-4! h-4!" />}
            />
            <Tile
              size="md"
              grow
              text="Total blocks"
              value={formatNumber(getTotalBlocks())}
              icon={<GridViewRoundedIcon className="w-4! h-4!" />}
            />
          </SkStack>
        ) : (
          <div></div>
        )}
      </SkPaper>
      <ChainTabsSection
        chainsMeta={props.chainsMeta}
        mpc={props.mpc}
        schainName={props.schainName}
        isXs={props.isXs}
      />
    </div>
  )
}
