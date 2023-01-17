import React, { useEffect } from 'react';

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

import CHAINS from '../../chainsData.json';


export default function TokenButton(props: any) {
    const chainsData = CHAINS as any;
    const from: string = props.from;
    const to: string = props.to;
    return (<div>
        {Object.keys(chainsData[from][to].tokens).map((token: any, index: number) => (
            <Tooltip title={token} key={token}>
                <img className='mp__iconToken' src={iconPath(token)} />
            </Tooltip>
        ))}
    </div>)
}