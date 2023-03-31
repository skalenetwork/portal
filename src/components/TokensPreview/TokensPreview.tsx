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
 * @file TokensPreview.js
 * @copyright SKALE Labs 2023-Present
*/

import Tooltip from '@mui/material/Tooltip';
import { iconPath } from '../ActionCard/helper';


const MAX_TOKENS = 6;


export default function TokensPreview(props: any) {
  return (
    <div className='br__tileBottIcons mp__flex'>
      {props.tokens.slice(0, MAX_TOKENS).map((token: any, index: number) => (
        <Tooltip title={token.toUpperCase()} key={token}>
          <img className='mp__iconToken' src={iconPath(token)} />
        </Tooltip>
      ))}
      {props.tokens.length > MAX_TOKENS ? <div
        className='mp__iconToken mp__iconTokenMore mp__flex mp__flexCentered'
      >
        <Tooltip title={`${props.tokens.length - MAX_TOKENS} more mapped tokens`}>
          <p className="mp__noMarg mp__flex">
            +{props.tokens.length - MAX_TOKENS}
          </p>
        </Tooltip>
      </div> : null}
    </div>
  );
}
