import React, { useEffect } from 'react';
import OfflineBoltIcon from '@mui/icons-material/OfflineBolt';

import { chainIconPath } from '../../core/helper';
import { MAINNET_CHAIN_NAME, TOKEN_ICONS, EXTERNAL_TOKEN_ICONS } from '../../core/constants';


function stringToColor(str: string, dark: boolean): string {
    if (dark) {
        // return `hsl(${hashCode(str) % 360}, 100%, 80%)`;
        return 'hsl(120deg 2% 88%)';
    }
    return 'hsl(0deg 0% 15%)';
    // return `hsl(${hashCode(str) % 360}, 55%, 40%)`;
}

/**
 * Gets the website URL for a given chain or application.
 *
 * @param {object} chainsMetadata An object containing metadata for SKALE chains.
 * @param {string} chainName The name of the chain to get the website URL for.
 * @param {string} [app] (Optional) The name of the application to get the website URL for.
 * @returns {string | undefined} The website URL for the specified chain/application, or `undefined` if not found.
 */
export function getChainWebsiteUrl(
    chainsMetadata: any,
    chainName: string,
    app?: string
): string | undefined {
    if (chainName == MAINNET_CHAIN_NAME) return;
    if (chainsMetadata && chainsMetadata[chainName]) {
        if (app && chainsMetadata[chainName]['apps'][app]) {
            return chainsMetadata[chainName]['apps'][app].url;
        }
        return chainsMetadata[chainName].url;
    }
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
        return <img src={iconPath} className='eth-logo chainIcon' />;
    }
    return (<OfflineBoltIcon className='chainIcon' sx={{ color: stringToColor(chainName, dark) }} />);
}


export function iconPath(name: string) {
    if (!name) return;
    if (EXTERNAL_TOKEN_ICONS[name]) {
        return EXTERNAL_TOKEN_ICONS[name];
    }
    const key = name.toLowerCase() + '.svg';
    if (TOKEN_ICONS[key]) {
        return TOKEN_ICONS[key];
    } else {
        return TOKEN_ICONS['eth.svg'];
    }
}


export function getChainNameFix(chain: string, app: string): string[] {
    if (chain.includes('_')) return chain.split('_');
    return [chain, app];
}