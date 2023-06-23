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
import { styled } from '@mui/material/styles';

import { clsNames } from '../../core/helper';


export default function BridgePaper(props: {
    children?: ReactElement | ReactElement[],
    gray?: boolean,
    blur?: boolean,
    dark?: boolean,
    border?: boolean,
    rounded?: boolean,
    roundedTop?: boolean,
    fullHeight?: boolean,
    margTop?: boolean
}) {

    const BrPaper = styled('div')(({ theme }) => ({
        [theme.breakpoints.down('sm')]: {
            borderRadius: '28px 28px 0 0'
        },
        [theme.breakpoints.up('sm')]: {
            borderRadius: '28px'
        }
    }));

    return (<BrPaper className={clsNames(
        'br__paper',
        ['br__paperBlur', props.blur],
        ['br__paperBorder', props.border],
        ['br__paperGrey', props.gray],
        ['br__paperDark', props.dark],
        ['br__paperRounded', props.rounded],
        ['br__fullHeight', props.fullHeight],
        ['mp__margTop20', props.margTop]
    )}>
        {props.children}
    </BrPaper>)
}