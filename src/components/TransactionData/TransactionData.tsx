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
 * @file TransactionData.ts
 * @copyright SKALE Labs 2023-Present
*/

import { ReactElement } from 'react';

import IconButton from '@mui/material/IconButton';

import MoveUpIcon from '@mui/icons-material/MoveUp';
import MoveDownIcon from '@mui/icons-material/MoveDown';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import LogoutIcon from '@mui/icons-material/Logout';
import DoneRoundedIcon from '@mui/icons-material/DoneRounded';
import { getTxUrl } from '../../core/network';


const actionIcons: { [actionName: string]: ReactElement; } = {
    'deposit': <ArrowOutwardIcon />,
    'transferToSchain': <ArrowOutwardIcon />,
    'wrap': <MoveDownIcon />,
    'unwrap': <MoveUpIcon />,
    'getMyEth': <LockOpenIcon />,
    'withdraw': <LogoutIcon />,
    'approve': <DoneRoundedIcon />,
    'approveWrap': <DoneRoundedIcon />,
    'wrapsfuel': <MoveDownIcon />,
}


export default function TransactionData(props: any) {
    const explorerUrl = getTxUrl(
        props.transactionData.chainName,
        props.transactionData.tx.transactionHash
    );
    return (<div className='mp__margBott15 mp__flex mp__flexCenteredVert' >
        <div className=''>
            <div className={'br__transactionDataIcon mp__flex mp__flexCentered ' + `br__action_${props.transactionData.txName}`}>
                {actionIcons[props.transactionData.txName]}
            </div>
        </div>
        <div className='mp__margLeft20 mp__flexGrow mp__flex'>
            <div>
                <p className='mp__p mp__p2 capitalize whiteText'>{props.transactionData.txName}</p>
                <p className='mp__p mp__p3'>{new Date(props.transactionData.timestamp * 1000).toUTCString()}</p>
            </div>
        </div>
        <div>
            <IconButton
                id="basic-button"
                href={explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className='mp__margLeft10 moreBtn br__openExplorerBtn'
            >
                <OpenInNewIcon />
            </IconButton>
        </div>
    </div>)
}
