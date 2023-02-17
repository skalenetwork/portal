import FAUCET from '../faucet.json'
import { ZERO_ADDRESS, ZERO_FUNCSIG } from './constants';
import Web3 from 'web3';

function getAddress(chainName: string) {
    if (!isFaucetAvailable(chainName)) return ZERO_ADDRESS;
    const faucet: { [x: string]: {[x: string]: string}} = FAUCET;
    return faucet[chainName].address;
}

function getFunc(chainName: string) {
    if (!isFaucetAvailable(chainName)) return ZERO_FUNCSIG;
    const faucet: { [x: string]: {[x: string]: string}} = FAUCET;
    return faucet[chainName].func;
}

export function isFaucetAvailable(chainName: string) {
    if (!FAUCET) return false;
    let keys = Object.keys(FAUCET);
    return keys.includes(chainName);
}

export function getFuncData(web3: Web3, chainName: string, address: string) {
    const faucetAddress = getAddress(chainName);
    const functionSig = getFunc(chainName);
    const functionParam = web3.eth.abi.encodeParameter('address', address);
    return {to: faucetAddress, data: functionSig + functionParam};
}