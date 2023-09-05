/**
 * @license
 * SKALE proxy-ui
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

import React from 'react';

import { id } from 'ethers'

import CopySurface from './CopySurface';

import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import WidgetsIcon from '@mui/icons-material/Widgets';
import LanguageIcon from '@mui/icons-material/Language';
import AddCircleIcon from '@mui/icons-material/AddCircle';

import { cmn, cls, PROXY_ENDPOINTS, BASE_EXPLORER_URLS, MetaportCore, SkPaper } from '@skalenetwork/metaport';

//const BASE_PROXY_URL = process.env["REACT_APP_BASE_PROXY_URL"];
// const EXPLORER_URL = process.env["REACT_APP_EXPLORER_URL"];

const HTTP_PREFIX = 'http://';
const HTTPS_PREFIX = 'https://';
const WS_PREFIX = 'ws://';
const WSS_PREFIX = 'wss://';


function getRpcUrl(proxyUrl: string, schainName: string, prefix: string): string {
  return prefix + proxyUrl + '/v1/' + schainName;
}

function getRpcWsUrl(proxyUrl: string, schainName: string, prefix: string): string {
  return prefix + proxyUrl + '/v1/ws/' + schainName;
}

function getFsUrl(proxyUrl: string, schainName: string, prefix: string): string {
  return prefix + proxyUrl + '/fs/' + schainName;
}

export function getExplorerUrl(explorerUrl: string, schainName: string): string {
  return HTTPS_PREFIX + schainName + '.' + explorerUrl;
}

function getChainId(schainName: string): string {
  // let hash = Web3.utils.soliditySha3(schainName).substring(0, 15);
  // return rmPad0x(hash);
  return id(schainName)
}

function getSchainHash(schainName: string): string {
  // return Web3.utils.sha3(schainName);
  return '0xxx234'
}

export default function SchainDetails(props: {
  schainName: string,
  chainMeta: any,
  mpc: MetaportCore
}) {

  const proxyBase = PROXY_ENDPOINTS[props.mpc.config.skaleNetwork]
  const explorerBase = BASE_EXPLORER_URLS[props.mpc.config.skaleNetwork]

  const rpcUrl = getRpcUrl(proxyBase, props.schainName, HTTPS_PREFIX);
  const rpcHttpUrl = getRpcUrl(proxyBase, props.schainName, HTTP_PREFIX);

  const rpcWssUrl = getRpcWsUrl(proxyBase, props.schainName, WSS_PREFIX);
  const rpcWsUrl = getRpcWsUrl(proxyBase, props.schainName, WS_PREFIX);

  const fsUrl = getFsUrl(proxyBase, props.schainName, HTTPS_PREFIX);
  const fsHttpUrl = getFsUrl(proxyBase, props.schainName, HTTP_PREFIX);

  const explorerUrl = getExplorerUrl(explorerBase, props.schainName);
  const chainId = getChainId(props.schainName);
  const schainHash = getSchainHash(props.schainName);

  const [checked, setChecked] = React.useState(true);

  const networkParams = {
    chainId: chainId,
    chainName: "[S]" + getChainName(props.schainName),
    rpcUrls: [rpcUrl],
    nativeCurrency: {
      name: "sFUEL",
      symbol: "sFUEL",
      decimals: 18
    }
  }

  function getChainName(schainName: string) {
    if (props.chainMeta) {
      return props.chainMeta['alias'];
    }
    return schainName;
  }

  function getBgColor(schainName: string) {
    if (props.chainMeta) {
      return props.chainMeta['background'];
    }
    // return stringToColour(schainName);
  }

  async function addNetwork() {
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [networkParams],
    });
  }

  return (
    <div className='schain-details'>

      <div className={cls(cmn.flex)}>
        <h2 className={cls(cmn.nom)}>{getChainName(props.schainName)}</h2>
      </div>
      {(props.chainMeta && props.chainMeta.description) ? (
        <p className={cls(cmn.nom, cmn.p, cmn.p3, cmn.pSec)}>
          {props.chainMeta.description}
        </p>) : null}


      <SkPaper gray className={cls(cmn.mtop20, cmn.nop)}>

        <SkPaper gray >
          <div className={cls(cmn.flex)}>
            <div className={cls(cmn.mleft10)}>
              <a target="_blank" rel="noreferrer" href={explorerUrl} className='undec'>
                <Button
                  size="medium"
                  // variant="contained website-btn actions-btn"
                  startIcon={<WidgetsIcon />}
                >
                  Explorer
                </Button>
              </a>
            </div>
            <div className={cls(cmn.mleft10)}>
              <Button
                startIcon={<AddCircleIcon />}
                size="medium"
                // variant="contained website-btn actions-btn"
                onClick={addNetwork}
              >
                Add network
              </Button>
            </div>
            {(props.chainMeta && props.chainMeta.url) ? <div className={cls(cmn.mleft10)}>
              <a target="_blank" rel="noreferrer" href={props.chainMeta.url} className='undec'>
                <Button
                  size="medium"
                  // variant="contained website-btn actions-btn"
                  startIcon={<LanguageIcon />}
                >
                  Open dApp
                </Button>
              </a>
            </div> : null}
          </div>

        </SkPaper>
        <SkPaper background='transparent'>
          <h3 className='card-header no-marg-top'>
            Dev
          </h3>
          <CopySurface url={checked ? rpcUrl : rpcHttpUrl} />
          <Grid container spacing={2}>
            <Grid item md={6} xs={12}>
              <h4 className='no-marg-bott secondary-text'>
                Websocket
              </h4>
              <CopySurface url={checked ? rpcWssUrl : rpcWsUrl} />
            </Grid>
            <Grid item md={6} xs={12}>
              <h4 className='no-marg-bott secondary-text'>
                Filestorage
              </h4>
              <CopySurface url={checked ? fsUrl : fsHttpUrl} />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item md={6} xs={12}>
              <h4 className='no-marg-bott secondary-text'>
                Chain ID
              </h4>
              <CopySurface url={chainId} />
            </Grid>
            <Grid item md={6} xs={12}>
              <h4 className='no-marg-bott secondary-text'>
                Chain name hash
              </h4>
              <CopySurface url={schainHash} />
            </Grid>
          </Grid>
        </SkPaper>
      </SkPaper>
    </div>
  );
}
