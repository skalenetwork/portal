import React, { useEffect } from 'react';
import OfflineBoltIcon from '@mui/icons-material/OfflineBolt';

import { chainIconPath } from '../../core/helper';
import { MAINNET_CHAIN_NAME, TOKEN_ICONS } from '../../core/constants';


function stringToColor(str: string, dark: boolean): string {
    if (dark) {
        // return `hsl(${hashCode(str) % 360}, 100%, 80%)`;
        return 'hsl(120deg 2% 88%)';
    }
    return 'hsl(0deg 0% 15%)';
    // return `hsl(${hashCode(str) % 360}, 55%, 40%)`;
}


export function getChainName(chainsMetadata: any, chainName: string, app?: string): string {
    if (chainName == MAINNET_CHAIN_NAME) {
        return 'Ethereum';
    }
    if (chainsMetadata && chainsMetadata[chainName]) {
        if (app && chainsMetadata[chainName]['apps'][app]) {
            return chainsMetadata[chainName]['apps'][app].alias;
        }
        return chainsMetadata[chainName].alias;
    } else {
        return chainName;
    }
}


export function getChainIcon(chainName: string, dark: boolean, app?: string) {
    const iconPath = chainIconPath(chainName, app);
    if (iconPath !== undefined) {
        return <img src={iconPath} className='eth-logo chainIcon'/>;
    }
    return (<OfflineBoltIcon className='chainIcon' sx={{ color: stringToColor(chainName, dark) }} />);
}


export function iconPath(name: string) {
    if (!name) return;
    const key = name.toLowerCase() + '.svg';
    if (TOKEN_ICONS[key]) {
        return TOKEN_ICONS[key];
    } else {
        return TOKEN_ICONS['eth.svg'];
    }
}