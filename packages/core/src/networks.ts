/**
 * @license
 * SKALE Portal
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

/**
 * @file networks.ts
 * @copyright SKALE Labs 2025-Present
 */

import { type types } from '.'
import { NetworksConfig } from './types';

export const networks: NetworksConfig = {
    mainnet: {
        features: ['bridge', 'onramp', 'ecosystem', 'chains', 'staking', 'stats', 'paymaster', 'sfuel', 'swap', 'metrics']
    },
    legacy: {
        features: ['bridge', 'onramp', 'ecosystem', 'chains', 'staking', 'stats', 'paymaster', 'sfuel', 'metrics']
    },
    regression: {
        features: []
    },
    testnet: {
        features: ['bridge', 'chains', 'sfuel', 'metrics']
    },
    base: {
        features: ['bridge', 'chains', 'credits']
    },
    'base-sepolia-testnet': {
        features: ['bridge', 'chains', 'credits']
    }
}


export const MAINNET_ALIASES: { [key in types.SkaleNetwork]: string } = {
    mainnet: 'Ethereum Mainnet',
    legacy: 'Hoodi Testnet',
    regression: 'Hoodi Testnet',
    testnet: 'Hoodi Testnet',
    base: 'Base',
    'base-sepolia-testnet': 'Base Sepolia Testnet',
}

export const MAINNET_DESCRIPTIONS: { [key in types.SkaleNetwork]: string } = {
    mainnet: 'Ethereum is a global, decentralized platform for money and new kinds of applications.',
    legacy: 'Legacy SKALE network for testing and development with full feature support.',
    regression: 'Internal SKALE network used for regression testing and quality assurance.',
    testnet: 'SKALE testnet environment for experimenting with bridge functionality and sFUEL.',
    base: 'Base is an Ethereum L2 providing a secure, low-cost environment for decentralized applications.',
    'base-sepolia-testnet': 'Base Sepolia testnet for safe development and testing of Base applications.',
}

export const MAINNET_BACKGROUNDS: { [key in types.SkaleNetwork]: string } = {
    mainnet: 'linear-gradient(273.67deg, #FFF3EF, #D8C4FF)',
    legacy: 'linear-gradient(273.67deg, #D6FFFC, #B8CFFF)',
    regression: 'linear-gradient(273.67deg, #D6FFFC, #B8CFFF)',
    testnet: 'linear-gradient(273.67deg, #FFDADA, #D6FFDE)',
    base: 'linear-gradient(#0000FF, #0000D8)',
    'base-sepolia-testnet': 'linear-gradient(#B8A581, #9a8a6bff)',
}

export function parse(networksEnv: string | undefined): types.SkaleNetwork[] {
    if (!networksEnv) throw new Error('VITE_NETWORKS environment variable is not defined');
    return networksEnv.split(',').map((network) => network.trim() as types.SkaleNetwork);
}

export function hasFeature(network: types.SkaleNetwork, feature: types.NetworkFeature): boolean {
    return networks[network]?.features.includes(feature) ?? false;
}

export function hasFeatureInAny(networkNames: types.SkaleNetwork[], feature: types.NetworkFeature): boolean {
    return networkNames.some((network) => hasFeature(network, feature));
}

