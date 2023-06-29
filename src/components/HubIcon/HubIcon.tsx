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
 * @file HubIcon.js
 * @copyright SKALE Labs 2023-Present
*/

import Tooltip from '@mui/material/Tooltip';
import { getChainName, getChainIcon } from '../ActionCard/helper';

import { CHAINS_META } from '../../core/constants';


export default function HubIcon(props: {
  chains_meta: any,
  chain: string
}) {

  const chainName = getChainName(CHAINS_META, props.chain);
  const chainIcon = getChainIcon(props.chain, true);

  return (
    <div className='br__tileBottIcons mp__flex mp__flexCenteredVert'>
      <Tooltip title={'This app is located on ' + chainName}>
        <div className='mp__iconHub mp__flex mp__flexCenteredVert'>
          {chainIcon}
        </div>
      </Tooltip>
    </div>
  );
}
