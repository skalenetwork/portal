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

import Button from '@mui/material/Button'

import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded'
import ArrowOutwardRoundedIcon from '@mui/icons-material/ArrowOutwardRounded'
import WidgetsRoundedIcon from '@mui/icons-material/WidgetsRounded'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'

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
  type interfaces
} from '@skalenetwork/metaport'

import SkStack from './SkStack'
import ChainLogo from './ChainLogo'
import CopySurface from './CopySurface'
import ChainAccordion from './ChainAccordion'
import ChainCategories from './ChainCategories'
import Tile from './Tile'
import SkBtn from './SkBtn'

import { MAINNET_CHAIN_LOGOS } from '../core/constants'
import { getRpcUrl, getExplorerUrl, getChainId, HTTPS_PREFIX } from '../core/chain'

export default function SchainDetails(props: {
  schainName: string
  chainMeta: interfaces.ChainMetadata
  chain: any
  mpc: MetaportCore
}) {
  const [loading, setLoading] = useState<boolean>(false)
  const [added, setAdded] = useState<boolean>(false)

  const proxyBase = PROXY_ENDPOINTS[props.mpc.config.skaleNetwork]
  const explorerBase = BASE_EXPLORER_URLS[props.mpc.config.skaleNetwork]

  const rpcUrl = getRpcUrl(proxyBase, props.schainName, HTTPS_PREFIX)
  const explorerUrl = getExplorerUrl(explorerBase, props.schainName)
  const chainId = getChainId(props.schainName)
  const chainIdInt = parseInt(chainId)

  const network = props.mpc.config.skaleNetwork

  const networkParams = {
    chainId,
    chainName:
      'SKALE' +
      (network === 'testnet' ? ' Testnet ' : ' ') +
      getChainAlias(props.mpc.config.skaleNetwork, props.schainName),
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
    setLoading(true)
    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [networkParams]
      })
      setAdded(true)
    } finally {
      setLoading(false)
    }
  }

  function connectBtnText() {
    if (added) return 'Chain Connected'
    return loading ? 'Connecting Chain' : 'Connect to Chain'
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
        <ChainCategories category={props.chainMeta?.category ?? 'Other'} alias={chainAlias} />
        <div className={cls('logo', cmn.flex, cmn.flexcv)}>
          <div className={cls(cmn.flex, cmn.flexg)}></div>
          <ChainLogo chainName={props.schainName} logos={MAINNET_CHAIN_LOGOS} />
          <div className={cls(cmn.flex, cmn.flexg)}></div>
        </div>
        <SkStack>
          <Tile
            grow
            children={
              <div>
                <h2 className={cls(cmn.nom)}>{chainAlias}</h2>
                <p className={cls(cmn.mtop5, cmn.p, cmn.p3, cmn.pSec)}>{chainDescription}</p>
              </div>
            }
          />
        </SkStack>
        <SkStack className={cmn.mtop10}>
          <Tile
            children={
              <SkStack>
                <div>
                  <a target="_blank" rel="noreferrer" href={explorerUrl} className="undec">
                    <Button
                      size="medium"
                      className={cls(styles.btnAction, cmn.mri10)}
                      startIcon={<WidgetsRoundedIcon />}
                    >
                      Block Explorer
                    </Button>
                  </a>
                </div>
                <div>
                  <SkBtn
                    startIcon={added ? <CheckCircleRoundedIcon /> : <AddCircleRoundedIcon />}
                    size="md"
                    className={cls(styles.btnAction, cmn.mri10, 'btnPadd', [
                      'btnPaddLoading',
                      loading
                    ])}
                    onClick={addNetwork}
                    disabled={loading}
                    text={connectBtnText()}
                    loading={loading}
                  />
                </div>
                <div>
                  {props.chainMeta?.url ? (
                    <a
                      target="_blank"
                      rel="noreferrer"
                      href={props.chainMeta.url}
                      className="undec"
                    >
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
          <CopySurface className={cls(cmn.flexg)} title="Chain ID" value={chainIdInt.toString()} />
        </SkStack>
      </SkPaper>
      <ChainAccordion mpc={props.mpc} schainName={props.schainName} />
    </div>
  )
}
