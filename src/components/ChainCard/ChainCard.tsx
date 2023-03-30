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
 * @file ChainCard.js
 * @copyright SKALE Labs 2022-Present
*/

import * as React from 'react';

import { Link } from "react-router-dom";

import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';

import OfflineBoltIcon from '@mui/icons-material/OfflineBolt';
import LooksOneIcon from '@mui/icons-material/LooksOne';
import LooksTwoIcon from '@mui/icons-material/LooksTwo';

import BlurOnIcon from '@mui/icons-material/BlurOn';
import BlurOffIcon from '@mui/icons-material/BlurOff';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { stringToColor } from '../../core/helper';
import { CHAINS_META } from '../../core/constants';

import { getChainName, getChainIcon, iconPath } from '../ActionCard/helper';

import './ChainCard.scss';

const tinycolor = require("tinycolor2");


function getBgColor(schainName: string, app?: string) {
  if (CHAINS_META[schainName]) {
    if (app) {
      return CHAINS_META[schainName]['apps'][app]['background'];
    }
    return CHAINS_META[schainName]['background'];
  }
  return 'linear-gradient(273.67deg, rgb(255, 255, 255), rgb(223 222 222))';
  return stringToColor(schainName);
}


export default function ChainCard(props: any) {
  function getIcon(schainName: string, app?: string) {
    let iconPath = schainName;
    if (app) {
      iconPath += `-${app}`;
    }
    let pngPath = iconPath + '.png';
    let gifPath = iconPath + '.gif';
    let svgPath = iconPath + '.svg';
    if (props.icons[pngPath]) {
      iconPath = pngPath;
    } else if (props.icons[gifPath]) {
      iconPath = gifPath;
    } else if (props.icons[svgPath]) {
      iconPath = svgPath;
    }
    if (iconPath) {
      return <img alt='logo' src={props.icons[iconPath]} />
    }
    return <OfflineBoltIcon className='default-chain-icon' />;
  }

  // TODO: refactor!

  let url = `/bridge/transfer/${props.from}`;

  if (props.toChain) {
    url += `/${props.toChain}`;
  }

  if (props.chain.app || props.fromApp) {
    url += '?';
  }
  if (props.chain.app && props.toChain) {
    url += `to-app=${props.chain.app}&`;
  }
  if (props.fromApp) {
    url += `from-app=${props.fromApp}`;
  }

  const chain = props.toChain ? props.toChain : props.from;

  let tokens;
  if (props.toChain) {
    tokens = Object.keys(props.chain.tokens);
  } else {
    const tokensArr = Object.keys(props.chain.chains).map((toChain: any) => { return props.chain.chains[toChain].tokens });
    tokens = tokensArr.map((val: any) => { return Object.keys(val) });
    tokens = Array.from(new Set(tokens.flat()));
  }

  return (
    <Link to={url} className='undec'>
      <div className='tile'>
        <div className='mp__flexCentered'>

          <Button
            className='app-icon'
            style={{ background: getBgColor(chain, props.chain.app) }}
          >
            {getIcon(chain, props.chain.app)}
          </Button>

          <div className='mp__flex app-bott' style={{ background: getBgColor(chain, props.chain.app) }}>
            <div className={'app-bott-ins mp__flex ' + (tinycolor(getBgColor(chain, props.chain.app)).isLight() ? '' : 'app-bott-dark')}>
              {tokens.map((token: any, index: number) => (
                <Tooltip title={token.toUpperCase()} key={token}>
                  <img className='mp__iconToken' src={iconPath(token)} />
                </Tooltip>
              ))}
            </div>
          </div>
        </div>
        <p className="schain-name mp__flex mp__flexCentered undec">
          {getChainName(CHAINS_META, chain, props.chain.app)}
        </p>
      </div>
    </Link>
  );
}
