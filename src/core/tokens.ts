/**
 * @license
 * SKALE Bridge UI
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
 * @file tokens.ts
 * @copyright SKALE Labs 2023-Present
 */

import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import { Contract } from 'web3-eth-contract';

import debug from 'debug';

import erc20Abi from '../metadata/erc20_abi.json';
import proxyEndpoints from '../metadata/proxy.json';
import { MAINNET_CHAIN_NAME, METAPORT_CONFIG } from './constants';


debug.enable('*');
const log = debug('bridge:core:tokens');


export function getChainEndpoint(chainName: string): string {
    if (chainName === MAINNET_CHAIN_NAME) {
        return METAPORT_CONFIG.mainnetEndpoint;
    }
    return getProxyEndpoint(METAPORT_CONFIG.skaleNetwork) + '/v1/' + chainName;
}


function getProxyEndpoint(network: string) {
    return (proxyEndpoints as any)[network];
}


function initWeb3(endpoint: string) {
    const provider = new Web3.providers.HttpProvider(endpoint);
    return new Web3(provider);
}


export function initChainWeb3(chainName: string): Web3 {
    log(`Initializing web3 instance for ${chainName}`);
    const endpoint = getChainEndpoint(chainName);
    return initWeb3(endpoint);
}


export function initTokenContract(web3: Web3, abi: any, address: string): any {
    return new web3.eth.Contract(abi, address);
}


export function initERC20Token(web3: Web3 | undefined, address: string | undefined): any | undefined {
    if (!web3 || !address) return;
    return new web3.eth.Contract(erc20Abi.abi as AbiItem[], address);
}


export async function getTokenBalance(contract: Contract, address: string): Promise<string> {
    return await contract.methods.balanceOf(address).call({ from: address });
}


export async function ethBalance(web3: Web3, address: string): Promise<string> {
    return await web3.eth.getBalance(address);
}


export async function getBalance(
    web3: Web3 | undefined,
    contract: Contract | undefined,
    address: string,
    chainName: string
): Promise<string | undefined> {
    log(`Getting balance for ${address}`);
    if (contract) return await getTokenBalance(contract, address);
    if (web3 && chainName === MAINNET_CHAIN_NAME) return await ethBalance(web3, address);
}