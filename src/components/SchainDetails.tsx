/**
 * @license
 * SKALE bridge-ui
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

import { id, toBeHex } from "ethers";

import CopySurface from "./CopySurface";

import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import ArrowOutwardRoundedIcon from '@mui/icons-material/ArrowOutwardRounded';
import WidgetsRoundedIcon from '@mui/icons-material/WidgetsRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import TollRoundedIcon from '@mui/icons-material/TollRounded';

import {
  cmn,
  cls,
  styles,
  PROXY_ENDPOINTS,
  BASE_EXPLORER_URLS,
  type MetaportCore,
  SkPaper,
  getChainAlias,
  chainBg
} from "@skalenetwork/metaport";

import ChainLogo from "./ChainLogo";

import { MAINNET_CHAIN_LOGOS } from '../core/constants'


const HTTPS_PREFIX = "https://";
const WSS_PREFIX = "wss://";


function getRpcUrl(
  proxyUrl: string,
  schainName: string,
  prefix: string,
): string {
  return prefix + proxyUrl + "/v1/" + schainName;
}


function getRpcWsUrl(
  proxyUrl: string,
  schainName: string,
  prefix: string,
): string {
  return prefix + proxyUrl + "/v1/ws/" + schainName;
}


function getFsUrl(
  proxyUrl: string,
  schainName: string,
  prefix: string,
): string {
  return prefix + proxyUrl + "/fs/" + schainName;
}


export function getExplorerUrl(
  explorerUrl: string,
  schainName: string,
): string {
  return HTTPS_PREFIX + schainName + "." + explorerUrl;
}


function getChainId(schainName: string): string {
  return toBeHex(id(schainName).substring(0, 15));
}


export default function SchainDetails(props: {
  schainName: string;
  chainMeta: any;
  chain: any;
  mpc: MetaportCore;
}) {
  const proxyBase = PROXY_ENDPOINTS[props.mpc.config.skaleNetwork];
  const explorerBase = BASE_EXPLORER_URLS[props.mpc.config.skaleNetwork];

  const rpcUrl = getRpcUrl(proxyBase, props.schainName, HTTPS_PREFIX);
  const rpcWssUrl = getRpcWsUrl(proxyBase, props.schainName, WSS_PREFIX);
  const fsUrl = getFsUrl(proxyBase, props.schainName, HTTPS_PREFIX);

  const explorerUrl = getExplorerUrl(explorerBase, props.schainName);
  const chainId = getChainId(props.schainName);
  const chainIdInt = parseInt(chainId)

  const network = props.mpc.config.skaleNetwork

  const tokenConnections = props.mpc.config.connections[props.schainName] ?? {}
  const chainTokens = tokenConnections.erc20 ?? {}

  const networkParams = {
    chainId,
    chainName: "[S]" + getChainName(props.schainName),
    rpcUrls: [rpcUrl],
    nativeCurrency: {
      name: "sFUEL",
      symbol: "sFUEL",
      decimals: 18,
    },
  };

  function getChainName(schainName: string) {
    if (props.chainMeta) {
      return props.chainMeta.alias;
    }
    return schainName;
  }

  async function addNetwork() {
    await window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [networkParams],
    });
  }

  function timestampToDate(ts: number) {
    return new Intl.DateTimeFormat(
      'en-US', { year: '2-digit', month: '2-digit', day: '2-digit' }).format(ts * 1000)
  }

  return (<div className={cls('chainDetails', cmn.mbott20)}>
    <SkPaper background={chainBg(network, props.schainName)} className={cls(cmn.mtop10)}>
      <div className={cls('logo', cmn.flex, cmn.flexcv)} >
        <div className={cls(cmn.flex, cmn.flexg)}></div>
        <ChainLogo
          chainName={props.schainName}
          logos={MAINNET_CHAIN_LOGOS}
        />
        <div className={cls(cmn.flex, cmn.flexg)}></div>
      </div>
      <div className={cls('titleSection')}>
        <h2 className={cls(cmn.nom)}>{getChainAlias(
          props.mpc.config.skaleNetwork, props.schainName, undefined, true)}
        </h2>
        <p className={cls(cmn.mtop5, cmn.p, cmn.p3, cmn.pSec)}>
          {props.chainMeta?.description ? props.chainMeta.description :
            `Chain was created on ${timestampToDate(props.chain[5])}`}
        </p>
      </div>
      <div className={cls(cmn.flex, cmn.flexcv, cmn.flexw)}>
        <div className={cls('titleSection', cmn.mtop10)}>
          <div className={cls(cmn.flex)}>
            <div className={cls(cmn.mleft5)}>
              <a
                target="_blank"
                rel="noreferrer"
                href={explorerUrl}
                className="undec"
              >
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
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={props.chainMeta.url}
                  className="undec"
                >
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
          title='Chain ID'
          value={chainIdInt.toString()}
        />
      </div>
    </SkPaper>
    <SkPaper gray className={cls(cmn.mtop20, cmn.mbott20)}>
      <div className={cls(cmn.flex, cmn.flexcv, cmn.mtop10, cmn.mbott5, cmn.mleft10)}>
        <div className={cls(cmn.mri5, cmn.flexcv, cmn.flex, styles.chainIcons)}>
          <SettingsRoundedIcon />
        </div>
        <h3 className={cls(cmn.nom, cmn.cap)}>Developer info</h3>
      </div>
      <Grid container spacing={2} className={cls(cmn.full)}>
        <Grid item md={12} xs={12} className={cmn.mtop10}>
          <CopySurface className={cls(styles.fullHeight)} title='RPC Endpoint' value={rpcUrl} />
        </Grid>
        <Grid item md={6} xs={12}>
          <CopySurface className={cls(styles.fullHeight)} title='Websocket Endpoint' value={rpcWssUrl} />
        </Grid>
        <Grid item md={6} xs={12}>
          <CopySurface className={cls(styles.fullHeight)} title='Filestorage Endpoint' value={fsUrl} />
        </Grid>
        <Grid item md={6} xs={12}>
          <CopySurface className={cls(styles.fullHeight)}
            title='SKALE Manager name'
            value={props.schainName}
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <CopySurface className={cls(styles.fullHeight)} title='Chain ID Hex' value={chainId} />
        </Grid>
      </Grid>
      {Object.keys(chainTokens).length !== 0 ? <div>
        <div className={cls(cmn.flex, cmn.flexcv, cmn.mtop20, cmn.mbott20, cmn.mleft10)}>
          <div className={cls(cmn.mri5, cmn.flexcv, cmn.flex, styles.chainIcons)}>
            <TollRoundedIcon />
          </div>
          <h3 className={cls(cmn.nom, cmn.cap)}>Available tokens</h3>
        </div>
        <Grid container spacing={2} className={cls(cmn.full)}>
          {Object.keys(chainTokens).map((tokenSymbol: string) => (
            <Grid key={tokenSymbol} item md={3} xs={12}>
              <CopySurface
                className={cls(styles.fullHeight)}
                title={tokenSymbol.toUpperCase()}
                value={chainTokens[tokenSymbol].address as string}
              />
            </Grid>
          ))}
        </Grid>
      </div> : <div></div>}
      <a
        target="_blank"
        rel="noreferrer"
        href="https://docs.skale.network/skale-chain-administration/submit-metadata"
        className="undec"
      >
        <Button
          color="primary"
          size="small"
          className={cls(styles.btnAction, cmn.mtop20)}
          startIcon={<EditRoundedIcon />}
        >
          Update chain metadata
        </Button>
      </a>
    </SkPaper>
  </div >)
}
