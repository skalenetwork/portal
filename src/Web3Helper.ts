import Web3 from 'web3';
import { AbiItem } from 'web3-utils';

import erc20Abi from './metadata/erc20_abi.json';
import erc721Abi from './metadata/erc721_abi.json';
import erc721MetaAbi from './metadata/erc721meta_abi.json';
import erc1155Abi from './metadata/erc1155_abi.json';
import proxyEndpoints from './metadata/proxy.json';

export interface TokenAbisMap { [tokenType: string]: AbiItem[]; };

const ERC_ABIS: TokenAbisMap = {
    erc20: erc20Abi.abi as AbiItem[],
    erc721: erc721Abi.abi as AbiItem[],
    // erc721meta: erc721MetaAbi.abi as AbiItem[],
    erc1155: erc1155Abi.abi as AbiItem[]
}


export function initContract(tokenType: string, tokenAddress: string, web3: Web3) {
    return new web3.eth.Contract(ERC_ABIS[tokenType] as AbiItem[], tokenAddress);
}


export function initWeb3(network: string, schainName: string) {
    const endpoint = getSChainEndpoint(network, schainName);
    return new Web3(endpoint);
}


function getSChainEndpoint(network: string, sChainName: string): string {
    return getProxyEndpoint(network) + '/v1/' + sChainName;
}


function getProxyEndpoint(network: string) {
    // todo: add network validation
    return (proxyEndpoints as any)[network];
}