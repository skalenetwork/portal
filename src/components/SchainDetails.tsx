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

import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'

import { cmn, cls, styles, type MetaportCore, SkPaper, explorer } from '@skalenetwork/metaport'
import { type types, metadata, constants, endpoints } from '@/core'

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
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded'

import SkStack from './SkStack'
import Tile from './Tile'
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
  const [error, setError] = useState<string | null>(null)

  const network = props.mpc.config.skaleNetwork
  const proxyBase = endpoints.getProxyEndpoint(network)

  const rpcUrl = getRpcUrl(proxyBase, props.schainName, constants.HTTPS_PREFIX)
  const explorerUrl = explorer.getExplorerUrl(network, props.schainName)
  const chainId = getChainId(props.schainName)

  const networkParams = {
    chainId,
    chainName:
      'SKALE' +
      (network === 'testnet' ? ' Testnet ' : ' ') +
      metadata.getAlias(props.chainsMeta, props.schainName),
    rpcUrls: [rpcUrl],
    nativeCurrency: {
      name: 'sFUEL',
      symbol: 'sFUEL',
      decimals: 18
    },
    blockExplorerUrls: [explorerUrl]
  }

  // Check if chain is already connected
  async function checkIfChainConnected() {
    try {
      if (!window.ethereum) return false
      
      const currentChainId = await window.ethereum.request({ method: 'eth_chainId' })
      return currentChainId === chainId
    } catch (e) {
      console.error('Error checking chain connection:', e)
      return false
    }
  }

  // Check connection status on component mount
  useEffect(() => {
    checkIfChainConnected().then(setAdded)
  }, [chainId])

  async function addNetwork() {
    setLoading(true)
    setError(null)
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed')
      }
      
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [networkParams]
      })
      setAdded(true)
    } catch (e: any) {
      console.error(e)
      // Handle specific MetaMask errors
      if (e.code === -32603) {
        setError('MetaMask RPC error. Please try again.')
      } else if (e.code === 4001) {
        setError('Connection rejected by user')
      } else {
        setError(e.message || 'Failed to connect to chain')
      }
    } finally {
      setLoading(false)
    }
  }

  function getConnectBtnIcon() {
    if (error) return <ErrorRoundedIcon />
    if (added) return <CheckCircleRoundedIcon />
    return <AddCircleRoundedIcon />
  }

  function connectBtnText() {
    if (error) return 'Retry Connection'
    if (added) return 'Chain Connected'
    return loading ? 'Connecting Chain' : 'Connect to Chain'
  }

  const chainMeta = props.chainsMeta[props.schainName]

  const chainAlias = metadata.getAlias(props.chainsMeta, props.schainName)
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
    <div className={cls('chainDetails', cmn.mbott20)}>
      <div className={cls(cmn.flex)}>
        <Breadcrumbs
          className="bg"
          sections={[
            {
              text: 'Chains',
              icon: <ArrowBackIosNewRoundedIcon />,
              url: '/chains'
            },
            {
              text: chainAlias,
              icon: <LinkRoundedIcon />
            }
          ]}
        />
        <div className={cls(cmn.flexg)}></div>
      </div>
      <Helmet>
        <title>SKALE Portal - {chainAlias}</title>
        <meta name="description" content={chainDescription} />
        <meta property="og:title" content={`SKALE Portal - ${chainAlias}`} />
        <meta property="og:description" content={chainDescription} />
      </Helmet>
      <SkPaper gray className={cls(cmn.mtop10)}>
        <div className={cls(cmn.m10)}>
          <div className={cls('responsive-app-header', cmn.flex, cmn.flexcvd)}>
            <Logo
              chainsMeta={props.chainsMeta}
              skaleNetwork={network}
              chainName={props.schainName}
              size="md"
            />
            <div className={cls('app-info', cmn.flexg)}>
              <div className={cls(cmn.flex, cmn.flexcv, cmn.mbott10)}>
                <div className={cmn.flexg}>
                  <CategoriesChips categories={chainMeta?.categories} all />
                </div>
              </div>

              <h2 className={cls(cmn.nom, cmn.p1)}>{chainAlias}</h2>
              <CollapsibleDescription text={chainDescription} expandable />
            </div>
          </div>
        </div>
      </SkPaper>
      <SkPaper gray className={cls(cmn.mtop10)}>
        <SkStack className={cmn.mbott10}>
          <Tile
            className={cls(cmn.nop, cmn.flex, cmn.flexcv)}
            children={
              <div
                className={cls(
                  cmn.m10,
                  cmn.mleft20,
                  cmn.mri20,
                  [cmn.flex, !props.isXs],
                  cmn.flexcv
                )}
              >
                <a target="_blank" rel="noreferrer" href={explorerUrl} className="undec">
                  <Button
                    size="medium"
                    className={cls(styles.btnAction, cmn.mri10)}
                    startIcon={<ViewInArRoundedIcon />}
                  >
                    Block Explorer
                  </Button>
                </a>
                <SkBtn
                  startIcon={getConnectBtnIcon()}
                  size="md"
                  className={cls(
                    styles.btnAction,
                    cmn.mri10,
                    'btnPadd',
                    ['btnPaddLoading', loading],
                    [cmn.fullWidth, props.isXs]
                  )}
                  onClick={addNetwork}
                  disabled={loading || added}
                  text={connectBtnText()}
                  loading={loading}
                />
                {chainMeta?.url && (
                  <a target="_blank" rel="noreferrer" href={chainMeta.url} className="undec">
                    <Button
                      size="medium"
                      className={cls(styles.btnAction)}
                      startIcon={<ArrowOutwardRoundedIcon />}
                    >
                      Open Website
                    </Button>
                  </a>
                )}
              </div>
            }
          />
          <Tile
            size="md"
            grow
            text="Daily transactions"
            value={
              props.schainMetrics
                ? formatNumber(props.schainMetrics.chain_stats?.transactions_today)
                : '0'
            }
            icon={<TrendingUpRoundedIcon />}
          />
        </SkStack>

        <SkStack className={cmn.md10}>
          <Tile
            size="md"
            grow
            text="Total transactions"
            value={formatNumber(getTxCount())}
            icon={<DataSaverOffRoundedIcon />}
          />
          {isMainnet && (
            <Tile
              size="md"
              grow
              text="Gas saved"
              value={
                props.schainStats ? `${formatNumber(props.schainStats.gas_fees_total_eth)} ETH` : ''
              }
              icon={<SavingsRoundedIcon />}
            />
          )}
          <Tile
            size="md"
            grow
            text={isMainnet ? 'Unique active wallets' : 'Total addresses'}
            value={formatNumber(getUAW())}
            icon={<PersonRoundedIcon />}
          />
          <Tile
            size="md"
            grow
            text="Total blocks"
            value={formatNumber(getTotalBlocks())}
            icon={<GridViewRoundedIcon />}
          />
        </SkStack>
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
