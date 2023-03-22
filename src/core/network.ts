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
 * @file network.ts
 * @copyright SKALE Labs 2023-Present
*/

import Web3 from 'web3';
import { soliditySha3, AbiItem } from 'web3-utils';

import { SChain, MainnetChain } from '@skalenetwork/ima-js';

import sChainAbi from '../metadata/schainAbi.json';
import mainnetAbi from '../metadata/mainnetAbi.json';
import proxyEndpoints from '../metadata/proxy.json';
import {
  schainNetworkParams,
  mainnetNetworkParams,
  changeMetamaskNetwork,
  CHAIN_IDS
} from './connector';


import erc20Abi from '../metadata/erc20_abi.json';
import erc721Abi from '../metadata/erc721_abi.json';
import erc721MetaAbi from '../metadata/erc721meta_abi.json';
import erc1155Abi from '../metadata/erc1155_abi.json';
import erc20WrapperAbi from '../metadata/erc20_wrapper_abi.json';

import mainnetAddresses from '../metadata/addresses/mainnet.json';
import stagingAddresses from '../metadata/addresses/staging.json';
import staging3Addresses from '../metadata/addresses/staging3.json';

import {
  MAINNET_CHAIN_NAME,
  HTTPS_PREFIX,
  MAINNET_EXPLORER_URL,
  CHAIN_EXPLORER_BASE_URL
} from './constants';


const ERC_ABIS: any = {
  'erc20': erc20Abi,
  'erc20wrap': erc20WrapperAbi,
  'erc721': erc721Abi,
  'erc721meta': erc721MetaAbi,
  'erc1155': erc1155Abi
}


export function initContract(tokenType: string, tokenAddress: string, web3: Web3) {
  return new web3.eth.Contract(ERC_ABIS[tokenType].abi as AbiItem[], tokenAddress);
}


export function initERC20(tokenAddress: string, web3: Web3) {
  return new web3.eth.Contract(erc20Abi.abi as AbiItem[], tokenAddress);
}


// export function initERC20Wrapper(tokenAddress: string, web3: Web3) {
//   return new web3.eth.Contract(erc20WrapperAbi.abi as AbiItem[], tokenAddress);
// }


export function initSChain(network: string, schainName: string) {
  const endpoint = getSChainEndpoint(network, schainName);
  const sChainWeb3 = new Web3(endpoint);
  return new SChain(sChainWeb3, sChainAbi);
}


export async function switchMetamaskNetwork( // TODO: use new function
  network: string,
  chainName: string,
  mainnetEndpoint: string
) {
  if (chainName === MAINNET_CHAIN_NAME) {
    return await initMainnetMetamask(network, mainnetEndpoint);
  } else {
    return await initSChainMetamask(network, chainName);
  }
}


export function getChainId(network: string, chainName: string): string | undefined { // TODO: use new function
  if (chainName === MAINNET_CHAIN_NAME) return CHAIN_IDS[network];
  return calcChainId(chainName);
}


export async function initSChainMetamask(network: string, schainName: string) {
  const endpoint = getSChainEndpoint(network, schainName);
  const chainId = calcChainId(schainName);
  const networkParams = schainNetworkParams(schainName, endpoint, chainId);
  await changeMetamaskNetwork(networkParams);
  const sChainWeb3 = new Web3(window.ethereum);
  return new SChain(sChainWeb3, sChainAbi);
}


export function updateWeb3SChain(schain: SChain, network: string, schainName: string) {
  const endpoint = getSChainEndpoint(network, schainName);
  const sChainWeb3 = new Web3(endpoint);
  schain.updateWeb3(sChainWeb3);
}


export async function updateWeb3SChainMetamask(
  schain: SChain,
  network: string,
  schainName: string
): Promise<void> {
  const endpoint = getSChainEndpoint(network, schainName);
  const chainId = calcChainId(schainName);
  const networkParams = schainNetworkParams(schainName, endpoint, chainId);
  await changeMetamaskNetwork(networkParams);
  const sChainWeb3 = new Web3(window.ethereum);
  schain.updateWeb3(sChainWeb3);
}


export function updateWeb3Mainnet(mainnet: MainnetChain, mainnetEndpoint: string) {
  const web3 = new Web3(mainnetEndpoint);
  mainnet.updateWeb3(web3);
}


export async function updateWeb3MainnetMetamask(
  mainnet: MainnetChain,
  network: string,
  mainnetEndpoint: string
): Promise<void> {
  const networkParams = mainnetNetworkParams(network, mainnetEndpoint);
  await changeMetamaskNetwork(networkParams);
  const web3 = new Web3(window.ethereum);
  mainnet.updateWeb3(web3);
}


function getMainnetAbi(network: string) {
  if (network === 'staging') {
    return { ...mainnetAbi, ...stagingAddresses }
  }
  if (network === 'staging3') {
    return { ...mainnetAbi, ...staging3Addresses }
  }
  return { ...mainnetAbi, ...mainnetAddresses }
}


export async function setMetamaskNetwork(
  network: string,
  chainName: string,
  mainnetEndpoint: string
) {
  let networkParams;
  if (chainName === MAINNET_CHAIN_NAME) {
    networkParams = mainnetNetworkParams(network, mainnetEndpoint);
  } else {
    const endpoint = getSChainEndpoint(network, chainName);
    const chainId = calcChainId(chainName);
    networkParams = schainNetworkParams(chainName, endpoint, chainId);
  }
  await changeMetamaskNetwork(networkParams);
}


export function initMainnet(network: string, mainnetEndpoint: string): MainnetChain {
  const web3 = new Web3(mainnetEndpoint);
  return new MainnetChain(web3, getMainnetAbi(network));
}


export async function initMainnetMetamask(
  network: string,
  mainnetEndpoint: string
): Promise<MainnetChain> {
  const networkParams = mainnetNetworkParams(network, mainnetEndpoint);
  await changeMetamaskNetwork(networkParams);
  const web3 = new Web3(window.ethereum);
  return new MainnetChain(web3, getMainnetAbi(network));
}


function getSChainEndpoint(network: string, sChainName: string): string {
  return getProxyEndpoint(network) + '/v1/' + sChainName;
}


export function getProxyEndpoint(network: string) {
  // todo: add network validation
  return (proxyEndpoints as any)[network];
}


export function getExplorerUrl(chainName: string): string {
  if (chainName === MAINNET_CHAIN_NAME) return MAINNET_EXPLORER_URL;
  return HTTPS_PREFIX + chainName + '.' + CHAIN_EXPLORER_BASE_URL;
}


export function getTxUrl(chainName: string, txHash: string): string {
  const explorerUrl = getExplorerUrl(chainName);
  return `${explorerUrl}/tx/${txHash}`;
}


function calcChainId(sChainName: string) {
  let h = soliditySha3(sChainName);
  h = remove0x(h).toLowerCase();
  if (!h) return '0x0';
  while (h.length < 64)
    h = "0" + h;
  h = h.substr(0, 13);
  h = h.replace(/^0+/, '');
  return "0x" + h;
}


export function remove0x(s: any) {
  if (!s.startsWith('0x')) return s;
  return s.slice(2);
}
