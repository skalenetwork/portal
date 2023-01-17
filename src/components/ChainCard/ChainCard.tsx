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
  return '#ffffff'; // todo: tmp!
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

  let url = `transfer/${props.from}/${props.toChain}`;
  if (props.chain.app || props.fromApp) {
    url += '?';
  }
  if (props.chain.app) {
    url += `to-app=${props.chain.app}&`;
  }
  if (props.fromApp) {
    url += `from-app=${props.fromApp}`;
  }

  return (
    <div>
      <div className='mp__flexCentered'>
        <Link to={url}>
          <Button
            className='app-icon'
            style={{ backgroundColor: getBgColor(props.toChain, props.chain.app) }}
          >
            {getIcon(props.toChain, props.chain.app)}
          </Button>
        </Link>
        <div className='mp__flex mp__flexCentered app-bott' style={{ backgroundColor: getBgColor(props.toChain, props.chain.app) }}>
          <div className={'app-bott-ins mp__flex mp__flexCentered ' + (tinycolor(getBgColor(props.toChain, props.chain.app)).isLight() ? '' : 'app-bott-dark')}>
            <div className='mp__margRi5'>
              <h6 className="mp__noMarg mp__flexCentered chainInfoText">
                TOKENS:
              </h6>
            </div>
            {Object.keys(props.chain.tokens).map((token: any, index: number) => (
              <Tooltip title={token} key={token}>
                <img className='mp__iconToken' src={iconPath(token)} />
              </Tooltip>
            ))}
          </div>
        </div>
      </div>
      <p className="schain-name mp__flex mp__flexCentered">
        {getChainName(CHAINS_META, props.toChain, props.chain.app)}
      </p>
    </div>
  );
}
