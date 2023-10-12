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
 * @file ChainCard.tsx
 * @copyright SKALE Labs 2022-Present
 */

import { Link } from "react-router-dom";
import {
  cmn,
  cls,
  chainBg,
  getChainAlias,
  BASE_EXPLORER_URLS,
  type interfaces,
} from "@skalenetwork/metaport";

import Button from "@mui/material/Button";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import UnfoldMoreRoundedIcon from "@mui/icons-material/UnfoldMoreRounded";

import ChainLogo from "./ChainLogo";
import { getExplorerUrl } from "../core/chain";

import { MAINNET_CHAIN_LOGOS } from '../core/constants'


export default function ChainCard(props: {
  skaleNetwork: interfaces.SkaleNetwork;
  schain: any[];
}) {
  const explorerUrl = getExplorerUrl(
    BASE_EXPLORER_URLS[props.skaleNetwork],
    props.schain[0],
  );
  return (
    <div>
      <div className="fl-centered">
        <div
          className={cls("br__tile")}
          style={{ background: chainBg(props.skaleNetwork, props.schain[0]) }}
        >
          <Link
            to={"/chains/" + props.schain[0]}
            className={cls("br__tileLogo", cmn.flex)}
          >
            <div className={cls(cmn.flex, cmn.flexg)}></div>
            <div className={cls(cmn.flex, cmn.flexcv, 'inheritSize')}>
              <ChainLogo
                chainName={props.schain[0]}
                logos={MAINNET_CHAIN_LOGOS}
              />
            </div>
            <div className={cls(cmn.flex, cmn.flexg)}></div>
          </Link>
          <div
            className={cls(
              cmn.flex,
              cmn.flexcv,
              cmn.mbott10,
              cmn.mleft10,
              "br__tileBott",
              "fullWidth",
            )}
          >
            <div className={cls(cmn.fflex, cmn.flexg)}>
              <a
                target="_blank"
                rel="noreferrer"
                href={explorerUrl}
                className="undec"
              >
                <Button
                  endIcon={<ArrowOutwardIcon />}
                  size="small"
                  className="cardBtn"
                >
                  Explorer
                </Button>
              </a>
              <Link
                to={"/chains/" + props.schain[0]}
                style={{ marginLeft: '3px' }}
              >
                <Button
                  endIcon={<UnfoldMoreRoundedIcon />}
                  size="small"
                  className="cardBtn"
                >
                  Info
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <p
          className={cls(
            cmn.p,
            cmn.pCent,
            cmn.p3,
            cmn.pPrim,
            cmn.mtop10,
            cmn.p600,
          )}
        >
          {getChainAlias(props.skaleNetwork, props.schain[0], undefined, true)}
        </p>
      </div>
    </div>
  );
}
