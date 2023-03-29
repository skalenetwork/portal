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
 * @file BridgePaper.ts
 * @copyright SKALE Labs 2023-Present
*/

import { ReactElement } from 'react';
import { clsNames } from '../../core/helper';


export default function BridgePaper(props: {
    children?: ReactElement | ReactElement[],
    gray?: boolean,
    rounded?: boolean,
    fullHeight?: boolean,
    margTop?: boolean
}) {
    return (<div className={clsNames(
        'br__paper',
        ['br__paperGrey', props.gray],
        ['br__paperRounded', props.rounded],
        ['br__fullHeight', props.fullHeight],
        ['mp__margTop20', props.margTop]
    )}>
        {props.children}
    </div>)
}