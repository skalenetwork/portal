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
 * @file connector.ts
 * @copyright SKALE Labs 2023-Present
*/

import Web3 from 'web3';


export const CHAIN_IDS: any = {
  'staging': '0x4',
  'staging3': '0x5',
  'qatestnet': '0x4',
  'mainnet': '0x1'
}


export async function changeMetamaskNetwork(networkParams: { chainId: any; }) {
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: networkParams.chainId }],
    });
  } catch (switchError: any) {
    // This error code indicates that the chain has not been added to MetaMask.
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [networkParams],
        });
        return [0, new Web3(window.ethereum)];
      } catch (addError) {
        return [1, addError];
      }
    }
    return [1, switchError];
  }
  return [0, new Web3(window.ethereum)];
}


export const connect = (connectFallback: () => void, errorFallback: (err: any) => void) => {
  window.ethereum
    .request({ method: 'eth_requestAccounts' })
    .then(connectFallback)
    .catch(errorFallback);
}


export const getAccounts = (fallback: (accounts: Array<string>) => void, errorFallback: (err: any) => void) => {
  window.ethereum
    .request({ method: 'eth_accounts' })
    .then(fallback)
    .catch(errorFallback);
}


export const addChainChangedListener = (chainChangedFallback: any) => {
  window.ethereum.on('chainChanged', chainChangedFallback);
}


export const unlockStateChangedListener = (unlockStateChangedFallback: any) => {
  if (!window.ethereum) {
    console.log('WARNING: window.ethereum is not defined - skipping unlockStateChangedListener');
    return;
  }
  window.ethereum.on('metamask_unlockStateChanged', unlockStateChangedFallback);
}


export function schainNetworkParams(
  schainName: string,
  schainChainUrl: string,
  schainChainId: string
): any {
  return {
    chainId: schainChainId,
    chainName: "SKALE Chain | " + schainName,
    rpcUrls: [schainChainUrl],
    nativeCurrency: {
      name: "sFUEL",
      symbol: "sFUEL",
      decimals: 18
    }
  };
}


export function mainnetNetworkParams(network: string, mainnetEndpoint: string) {
  return {
    chainId: CHAIN_IDS[network],
    rpcUrls: [mainnetEndpoint],
  };
}