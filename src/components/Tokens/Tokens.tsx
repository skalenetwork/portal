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
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import ButtonBase from '@mui/material/ButtonBase/ButtonBase';
import { getChainName, getChainIcon, iconPath } from '../ActionCard/helper';

import CHAINS from '../../chainsData.json';


export default function Tokens(props: any) {
    const chainsData = CHAINS as any;
    const from: string = props.from;
    const to: string = props.to;
    return (<div className='mp__flex mp__margTop10'>
        {Object.keys(chainsData[from][to].tokens).map((token: any, index: number) => (
            <div className={'mp__margRi5 ' + (props.token === token ? 'selectedToken' : '')}>
                <Chip
                    label={token}
                    onClick={() => { props.setToken(token) }}
                    variant="filled"
                    clickable
                    className='mp__margRi5'
                    size='medium'
                    icon={<img className='mp__iconTokenBtn' src={iconPath(token)} />}
                />
            </div>
        ))}
        <div className='mp__flex mp__flexGrow'></div>
    </div>)
}