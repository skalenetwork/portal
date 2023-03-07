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
 * @file ChainOverview.js
 * @copyright SKALE Labs 2022-Present
*/

import * as React from 'react';

import { Link } from "react-router-dom";

import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';

import { CHAINS_META } from '../../core/constants';

import { getChainName, iconPath } from '../ActionCard/helper';


export default function ChainOverview(props: any) {
  let tokens;
  const tokensArr = Object.keys(props.chain.chains).map((toChain: any) => { return props.chain.chains[toChain].tokens });
  tokens = tokensArr.map((val: any) => { return Object.keys(val) });
  tokens = Array.from(new Set(tokens.flat()));

  return (
    <div>
      <div className='mp__flexCentered'>
        <Button className='app-icon' >
          icon
        </Button>
        <div className='mp__flex mp__flexCentered app-bott' >
          <div className='app-bott-ins mp__flex mp__flexCentered'>
            {tokens.map((token: any, index: number) => (
              <Tooltip title={token.toUpperCase()} key={token}>
                <img className='mp__iconToken' src={iconPath(token)} />
              </Tooltip>
            ))}
          </div>
        </div>
      </div>
      <p className="schain-name mp__flex mp__flexCentered">
        {getChainName(CHAINS_META, props.chainName, props.chain.app)}
      </p>
    </div>
  );
}
