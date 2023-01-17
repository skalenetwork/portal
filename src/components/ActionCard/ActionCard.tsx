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

import { getChainName, getChainIcon, iconPath } from './helper';


const tinycolor = require("tinycolor2");


function getChainName1(schainName: string) {
  if (CHAINS_META[schainName]) {
    return CHAINS_META[schainName]['alias'];
  }
  return schainName;
}

function getBgColor(schainName: string) {
  if (CHAINS_META[schainName]) {
    return CHAINS_META[schainName]['background'];
  }
  return stringToColor(schainName);
}


export default function ActionCard(props: any) {

  function getIcon(schainName: string) {
    let iconPath;
    let pngPath = schainName + '.png';
    let gifPath = schainName + '.gif';
    if (props.icons[pngPath]) {
      iconPath = pngPath;
    } else if (props.icons[gifPath]) {
      iconPath = gifPath;
    }
    if (iconPath) {
      return <img alt='logo' src={props.icons[iconPath].default} />
    }
    return <OfflineBoltIcon className='default-chain-icon' />;
  }

  const url = `transfer/${props.action.from}/${props.action.to}`;

  return (
    <div>
      <div className='mp__flexCentered'>
        <Link to={url}>

          <Button
            className='app-icon'
            style={{ backgroundColor: '#191919' }}
          >
            <div className='mp__flex mp__flexCenteredVert'>
              <div className='mp__flex'>
                {getChainIcon(props.action.from, true)}
              </div>
              <div className='mp__flex mp__margRi10 mp__margLeft10'>
                <ArrowForwardIcon />
              </div>
              <div className='mp__flex'>
                {getChainIcon(props.action.to, true)}
              </div>
            </div>

          </Button>
        </Link>
        <div className='mp__flex mp__flexCentered app-bott'>
          <div className={'app-bott-ins mp__flex mp__flexCentered app-bott-dark ' + (tinycolor(getBgColor(props.action.from)).isLight() ? '' : 'app-bott-dark')}>
            <div className='mp__margRi5'>
              <h6 className="mp__noMarg mp__flexCentered chainInfoText">
                TOKENS:
              </h6>
            </div>
            {props.action.tokens.map((token: any, index: number) => (
              <Tooltip title={token}>
                <img className='mp__iconToken' src={iconPath(token)} />
              </Tooltip>
            ))}
          </div>
        </div>
      </div>
      <p className="schain-name mp__flex mp__flexCentered">
        {getChainName(CHAINS_META, props.action.from)} to {getChainName(CHAINS_META, props.action.to)}
      </p>
    </div>
  );
}
