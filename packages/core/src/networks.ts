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
        features: ['bridge', 'onramp', 'ecosystem', 'chains', 'staking', 'stats', 'paymaster', 'sfuel', 'swap']
    },
    legacy: {
        features: ['bridge', 'onramp', 'ecosystem', 'chains', 'staking', 'stats', 'paymaster', 'sfuel']
    },
    regression: {
        features: []
    },
    testnet: {
        features: ['bridge', 'chains', 'sfuel']
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
    mainnet: 'linear-gradient(273.67deg, rgb(47 50 80), rgb(39 43 68))',
    legacy: 'linear-gradient(273.67deg, rgb(47 50 80), rgb(39 43 68))',
    regression: 'linear-gradient(273.67deg, rgb(47 50 80), rgb(39 43 68))',
    testnet: 'linear-gradient(273.67deg, rgb(47 50 80), rgb(39 43 68))',
    base: 'linear-gradient(rgb(0 0 129), rgb(40 40 121))',
    'base-sepolia-testnet': 'linear-gradient(rgb(0 0 129), rgb(40 40 121))',
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

