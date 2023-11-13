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

import Button from '@mui/material/Button'
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded'
import ArrowOutwardRoundedIcon from '@mui/icons-material/ArrowOutwardRounded'
import WidgetsRoundedIcon from '@mui/icons-material/WidgetsRounded'

import {
  cmn,
  cls,
  styles,
  PROXY_ENDPOINTS,
  BASE_EXPLORER_URLS,
  type MetaportCore,
  SkPaper,
  getChainAlias,
  chainBg,
  interfaces
} from '@skalenetwork/metaport'

import ChainLogo from './ChainLogo'
import CopySurface from './CopySurface'
import ChainAccordion from './ChainAccordion'
import ChainCategories from './ChainCategories'

import { MAINNET_CHAIN_LOGOS } from '../core/constants'
import { getRpcUrl, getExplorerUrl, getChainId, HTTPS_PREFIX } from '../core/chain'

export default function SchainDetails(props: {
  schainName: string
  chainMeta: interfaces.ChainMetadata
  chain: any
  mpc: MetaportCore
}) {
  const proxyBase = PROXY_ENDPOINTS[props.mpc.config.skaleNetwork]
  const explorerBase = BASE_EXPLORER_URLS[props.mpc.config.skaleNetwork]

  const rpcUrl = getRpcUrl(proxyBase, props.schainName, HTTPS_PREFIX)
  const explorerUrl = getExplorerUrl(explorerBase, props.schainName)
  const chainId = getChainId(props.schainName)
  const chainIdInt = parseInt(chainId)

  const network = props.mpc.config.skaleNetwork

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

  function timestampToDate(ts: number) {
    return new Intl.DateTimeFormat('en-US', {
      year: '2-digit',
      month: '2-digit',
      day: '2-digit'
    }).format(ts * 1000)
  }

  async function addNetwork() {
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [networkParams]
    })
  }

  const chainAlias = getChainAlias(props.mpc.config.skaleNetwork, props.schainName, undefined, true)
  const chainDescription = props.chainMeta?.description
    ? props.chainMeta.description
    : `Chain was created on ${timestampToDate(props.chain[5])}`

  return (
    <div className={cls('chainDetails', cmn.mbott20)}>
      <Helmet>
        <title>SKALE Portal - {chainAlias}</title>
        <meta name="description" content={chainDescription} />
        <meta property="og:title" content={`SKALE Portal - ${chainAlias}`} />
        <meta property="og:description" content={chainDescription} />
      </Helmet>
      <SkPaper background={chainBg(network, props.schainName)} className={cls(cmn.mtop10)}>
        <ChainCategories category={props.chainMeta?.category ?? 'Other'} />
        <div className={cls('logo', cmn.flex, cmn.flexcv)}>
          <div className={cls(cmn.flex, cmn.flexg)}></div>
          <ChainLogo chainName={props.schainName} logos={MAINNET_CHAIN_LOGOS} />
          <div className={cls(cmn.flex, cmn.flexg)}></div>
        </div>
        <div className={cls('titleSection')}>
          <h2 className={cls(cmn.nom)}>{chainAlias}</h2>
          <p className={cls(cmn.mtop5, cmn.p, cmn.p3, cmn.pSec)}>{chainDescription}</p>
        </div>
        <div className={cls(cmn.flex, cmn.flexcv, cmn.flexw)}>
          <div className={cls('titleSection', cmn.mtop10)}>
            <div className={cls(cmn.flex)}>
              <div className={cls(cmn.mleft5)}>
                <a target="_blank" rel="noreferrer" href={explorerUrl} className="undec">
                  <Button
                    size="large"
                    className={styles.btnAction}
                    startIcon={<WidgetsRoundedIcon />}
                  >
                    Block Explorer
                  </Button>
                </a>
              </div>
              <div className={cls(cmn.mleft20)}>
                <Button
                  startIcon={<AddCircleRoundedIcon />}
                  size="large"
                  className={styles.btnAction}
                  onClick={addNetwork}
                >
                  Add network
                </Button>
              </div>
              {props.chainMeta?.url ? (
                <div className={cls(cmn.mleft20)}>
                  <a target="_blank" rel="noreferrer" href={props.chainMeta.url} className="undec">
                    <Button
                      size="large"
                      className={styles.btnAction}
                      startIcon={<ArrowOutwardRoundedIcon />}
                    >
                      Open website
                    </Button>
                  </a>
                </div>
              ) : null}
            </div>
          </div>
          <CopySurface
            className={cls(cmn.mtop10, cmn.mleft10, cmn.flexg)}
            title="Chain ID"
            value={chainIdInt.toString()}
          />
        </div>
      </SkPaper>
      <ChainAccordion mpc={props.mpc} schainName={props.schainName} />
    </div>
  )
}