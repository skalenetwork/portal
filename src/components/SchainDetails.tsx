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

import { Helmet } from 'react-helmet'

import {
  cmn,
  cls,
  styles,
  PROXY_ENDPOINTS,
  type MetaportCore,
  SkPaper,
  getChainAlias,
  chainBg,
  type interfaces
} from '@skalenetwork/metaport'

import Button from '@mui/material/Button'
import { Container } from '@mui/material'

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

import SkStack from './SkStack'
import ChainLogo from './ChainLogo'
import ChainCategories from './ChainCategories'
import Tile from './Tile'
import Breadcrumbs from './Breadcrumbs'
import CollapsibleDescription from './CollapsibleDescription'

import { MAINNET_CHAIN_LOGOS } from '../core/constants'
import { getRpcUrl, getChainId, HTTPS_PREFIX, getChainDescription } from '../core/chain'
import { getExplorerUrl } from '../core/explorer'
import { IChainMetrics, IStatsData } from '../core/types'
import { formatNumber } from '../core/timeHelper'
import ChainTabsSection from './ecosystem/tabs/ChainTabsSection'

export default function SchainDetails(props: {
  schainName: string
  chainsMeta: interfaces.ChainsMetadataMap
  schainStats: IStatsData | null
  schainMetrics: IChainMetrics | null
  chain: any
  mpc: MetaportCore
}) {
  const proxyBase = PROXY_ENDPOINTS[props.mpc.config.skaleNetwork]
  const network = props.mpc.config.skaleNetwork

  const rpcUrl = getRpcUrl(proxyBase, props.schainName, HTTPS_PREFIX)
  const explorerUrl = getExplorerUrl(network, props.schainName)
  const chainId = getChainId(props.schainName)

  const networkParams = {
    chainId,
    chainName: '[S]' + getChainAlias(props.mpc.config.skaleNetwork, props.schainName),
    rpcUrls: [rpcUrl],
    nativeCurrency: {
      name: 'sFUEL',
      symbol: 'sFUEL',
      decimals: 18
    }
  }

  async function addNetwork() {
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [networkParams]
    })
  }

  const chainMeta = props.chainsMeta[props.schainName]

  const chainAlias = getChainAlias(props.mpc.config.skaleNetwork, props.schainName, undefined, true)
  const chainDescription = getChainDescription(chainMeta)

  return (
    <div className={cls('chainDetails', cmn.mbott20)}>
      <Helmet>
        <title>SKALE Portal - {chainAlias}</title>
        <meta name="description" content={chainDescription} />
        <meta property="og:title" content={`SKALE Portal - ${chainAlias}`} />
        <meta property="og:description" content={chainDescription} />
      </Helmet>
      <SkPaper background={chainBg(network, props.schainName)} className={cls(cmn.mtop10)}>
        <div className={cls(cmn.flex, cmn.flexcv)}>
          <Breadcrumbs
            sections={[
              {
                text: 'Ecosystem',
                icon: <ArrowBackIosNewRoundedIcon />,
                url: '/ecosystem'
              },
              {
                text: chainAlias,
                icon: <LinkRoundedIcon />
              }
            ]}
          />
          <div className={cls(cmn.flexg)}></div>
          <ChainCategories category={chainMeta?.category ?? 'Other'} alias={chainAlias} />
        </div>
        <Container className="logo">
          <ChainLogo
            network={props.mpc.config.skaleNetwork}
            chainName={props.schainName}
            logos={MAINNET_CHAIN_LOGOS}
          />
        </Container>
        <SkStack>
          <Tile
            grow
            children={
              <div>
                <h2 className={cls(cmn.nom)}>{chainAlias}</h2>
                <CollapsibleDescription text={chainDescription} />
              </div>
            }
          />
        </SkStack>
        <SkStack className={cmn.mtop10}>
          <Tile
            className={cls(cmn.nop, cmn.flex, cmn.flexcv)}
            children={
              <SkStack className={cls(cmn.m10, cmn.mleft20, cmn.mri20, cmn.flex, cmn.flexcv)}>
                <div>
                  <a target="_blank" rel="noreferrer" href={explorerUrl} className="undec">
                    <Button
                      size="medium"
                      className={cls(styles.btnAction, cmn.mri10)}
                      startIcon={<ViewInArRoundedIcon />}
                    >
                      Block Explorer
                    </Button>
                  </a>
                </div>
                <div>
                  <Button
                    startIcon={<AddCircleRoundedIcon />}
                    size="medium"
                    className={cls(styles.btnAction, cmn.mri10)}
                    onClick={addNetwork}
                  >
                    Connect Wallet
                  </Button>
                </div>
                <div>
                  {chainMeta?.url ? (
                    <a target="_blank" rel="noreferrer" href={chainMeta.url} className="undec">
                      <Button
                        size="medium"
                        className={cls(styles.btnAction, cmn.mri10)}
                        startIcon={<ArrowOutwardRoundedIcon />}
                      >
                        Open Website
                      </Button>
                    </a>
                  ) : null}
                </div>
              </SkStack>
            }
          />
          <Tile
            size="md"
            grow
            text="Daily transactions"
            value={
              props.schainMetrics
                ? formatNumber(props.schainMetrics.chain_stats.transactions_today)
                : ''
            }
            icon={<TrendingUpRoundedIcon />}
          />
        </SkStack>

        <SkStack className={cmn.mtop10}>
          <Tile
            size="md"
            grow
            text="Total transactions"
            value={props.schainStats ? formatNumber(props.schainStats.tx_count_total) : ''}
            icon={<DataSaverOffRoundedIcon />}
          />
          <Tile
            size="md"
            grow
            text="Gas saved"
            value={
              props.schainStats ? `${formatNumber(props.schainStats.gas_fees_total_eth)} ETH` : ''
            }
            icon={<SavingsRoundedIcon />}
          />
          <Tile
            size="md"
            grow
            text="Unique active wallets"
            value={props.schainStats ? formatNumber(props.schainStats.users_count_total) : ''}
            icon={<PersonRoundedIcon />}
          />
          <Tile
            size="md"
            grow
            text="Total blocks"
            value={props.schainStats ? formatNumber(props.schainStats.block_count_total) : ''}
            icon={<GridViewRoundedIcon />}
          />
        </SkStack>
      </SkPaper>
      <ChainTabsSection
        chainsMeta={props.chainsMeta}
        mpc={props.mpc}
        schainName={props.schainName}
      />
    </div>
  )
}
