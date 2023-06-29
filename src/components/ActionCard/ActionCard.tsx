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

import { Link } from "react-router-dom";

import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { CHAINS_META } from '../../core/constants';

import { getChainName, getChainIcon, iconPath } from './helper';


export default function ActionCard(props: any) {

  const url = `bridge/transfer/${props.action.from}/${props.action.to}`;

  return (
    <div>
      <div className='mp__flexCentered'>
        <Link to={url}>
          <Button className='app-icon'>
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
          <div className='app-bott-ins mp__flex mp__flexCentered'>
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
