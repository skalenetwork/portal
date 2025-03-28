/**
 * @license
 * SKALE Metaport
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
 * @file metaport.ts
 * @copyright SKALE Labs 2023-Present
 */

import { Logger, type ILogObj } from 'tslog'
import { Provider, JsonRpcProvider, Contract, Signer } from 'ethers'
import { types, dc, ERC_ABIS, contracts, constants, endpoints } from '@/core'

import { getEmptyTokenDataMap } from './tokens/helper'
import { getStepsMetadata } from '../core/transfer_steps'
import { mainnetProvider, sChainProvider } from './network'
import { MetaportState } from '../store/MetaportState'

import { MainnetChain, SChain } from './contracts'
import { skaleContracts, type Instance } from '@skalenetwork/skale-contracts-ethers-v6'

const log = new Logger<ILogObj>({ name: 'metaport:core' })

export const createTokenData = (
  tokenKeyname: string,
  chainName: string,
  tokenType: dc.TokenType,
  config: types.mp.Config
): dc.TokenData => {
  const configToken: types.mp.Token = config.connections[chainName][tokenType][tokenKeyname]
  return new dc.TokenData(
    configToken.address,
    tokenType,
    tokenKeyname,
    config.tokens[tokenKeyname],
    configToken.chains,
    chainName
  )
}

export const addTokenData = (
  tokenKeyname: string,
  chainName: string,
  tokenType: dc.TokenType,
  config: types.mp.Config,
  tokens: types.mp.TokenDataTypesMap
) => {
  tokens[tokenType][tokenKeyname] = createTokenData(tokenKeyname, chainName, tokenType, config)
}

export const createTokensMap = (
  chainName1: string,
  chainName2: string | null,
  config: types.mp.Config
): types.mp.TokenDataTypesMap => {
  const tokens = getEmptyTokenDataMap()
  log.info(`updating tokens map for ${chainName1} -> ${chainName2}`)
  if (chainName1) {
    Object.values(dc.TokenType).forEach((tokenType) => {
      if (config.connections[chainName1][tokenType]) {
        Object.keys(config.connections[chainName1][tokenType]).forEach((tokenKeyname) => {
          const tokenInfo = config.connections[chainName1][tokenType][tokenKeyname]
          if (!chainName2 || (chainName2 && tokenInfo.chains.hasOwnProperty(chainName2))) {
            addTokenData(tokenKeyname, chainName1, tokenType as dc.TokenType, config, tokens)
          }
        })
      }
    })
  }
  return tokens
}

export function createWrappedTokensMap(
  chainName1: string,
  config: types.mp.Config
): types.mp.TokenDataTypesMap {
  const wrappedTokens: types.mp.TokenDataTypesMap = getEmptyTokenDataMap()
  const tokenType = dc.TokenType.erc20
  if (!chainName1 || !config.connections[chainName1][tokenType]) return wrappedTokens
  Object.keys(config.connections[chainName1][tokenType]).forEach((tokenKeyname) => {
    const token = config.connections[chainName1][tokenType][tokenKeyname]
    const wrapperAddress = findFirstWrapperAddress(token)
    if (wrapperAddress) {
      addTokenData(tokenKeyname, chainName1, tokenType as dc.TokenType, config, wrappedTokens)
    }
  })
  const ethToken = config.connections[chainName1].eth?.eth
  if (ethToken) {
    const wrapperAddress = findFirstWrapperAddress(ethToken)
    if (wrapperAddress) {
      addTokenData('eth', chainName1, dc.TokenType.eth, config, wrappedTokens)
    }
  }
  return wrappedTokens
}

const findFirstWrapperAddress = (token: types.mp.Token): `0x${string}` | null =>
  Object.values(token.chains).find((chain) => 'wrapper' in chain)?.wrapper || null

export const findFirstWrapperChainName = (token: dc.TokenData): string | null => {
  for (const [chainName, chain] of Object.entries(token.connections)) {
    if (chain.wrapper) {
      return chainName
    }
  }
  return null
}

export default class MetaportCore {
  #config: types.mp.Config
  #imaCache: Record<string, MainnetChain | SChain> = {}

  constructor(config: types.mp.Config) {
    this.#config = config
  }

  get config(): types.mp.Config {
    return this.#config
  }

  get network(): types.SkaleNetwork {
    return this.#config.skaleNetwork
  }

  /**
   * Generates available tokens for a given chain or a pair of the chains.
   *
   * @param {string} from - Source chain name.
   * @param {string | null} [to] - Destination chain name.
   *
   * @returns {types.mp.TokenDataTypesMap} - Returns a map of token data types for the given chains.
   *
   * @example
   *
   * // To get tokens for 'a' -> 'b'
   * const tokens = mpc.tokens('a', 'b');
   *
   * // To get all tokens from 'a'
   * const tokens = mpc.tokens('a');
   */
  tokens(from: string, to?: string | null): types.mp.TokenDataTypesMap {
    if (from === undefined || from === null || from === '') return getEmptyTokenDataMap()
    return createTokensMap(from, to, this.#config)
  }

  wrappedTokens(chainName: string): types.mp.TokenDataTypesMap {
    return createWrappedTokensMap(chainName, this.#config)
  }

  async tokenBalance(tokenContract: Contract, address: string): Promise<bigint> {
    return await tokenContract.balanceOf(address)
  }

  async tokenBalances(
    tokenContracts: types.mp.TokenContractsMap,
    address: string
  ): Promise<types.mp.TokenBalancesMap> {
    const balances: types.mp.TokenBalancesMap = {}
    const tokenKeynames = Object.keys(tokenContracts)
    for (const tokenKeyname of tokenKeynames) {
      balances[tokenKeyname] = await tokenContracts[tokenKeyname].balanceOf(address)
    }
    return balances
  }

  tokenContracts(
    tokens: types.mp.TokenDataTypesMap,
    tokenType: dc.TokenType,
    chainName: string,
    provider: Provider,
    customAbiTokenType?: dc.TokenTypeExtended
  ): types.mp.TokenContractsMap {
    const contracts: types.mp.TokenContractsMap = {}
    if (tokens[tokenType]) {
      Object.keys(tokens[tokenType]).forEach((tokenKeyname) => {
        let destChainName
        if (customAbiTokenType === dc.CustomAbiTokenType.erc20wrap) {
          destChainName = findFirstWrapperChainName(tokens[tokenType][tokenKeyname])
          if (!destChainName) return
        }
        contracts[tokenKeyname] = this.tokenContract(
          chainName,
          tokenKeyname,
          tokenType,
          provider,
          customAbiTokenType,
          destChainName
        )
      })
    }
    return contracts
  }

  tokenContract(
    chainName: string,
    tokenKeyname: string,
    tokenType: dc.TokenType,
    provider: Provider,
    customAbiTokenType?: dc.TokenTypeExtended,
    destChainName?: string
  ): Contract | undefined {
    const token = this.#config.connections[chainName][tokenType][tokenKeyname]
    if (!token.address) return
    const abi = customAbiTokenType ? ERC_ABIS[customAbiTokenType].abi : ERC_ABIS[tokenType].abi
    const address = customAbiTokenType ? token.chains[destChainName].wrapper : token.address
    return new Contract(address, abi, provider)
  }

  originAddress(
    chainName1: string,
    chainName2: string,
    tokenKeyname: string,
    tokenType: dc.TokenType
  ) {
    let token = this.#config.connections[chainName1][tokenType][tokenKeyname]
    const isClone = token.chains[chainName2].clone
    if (isClone) {
      token = this.#config.connections[chainName2][tokenType][tokenKeyname]
    }
    return token.chains[isClone ? chainName1 : chainName2].wrapper ?? token.address
  }

  endpoint(chainName: string): string {
    return endpoints.get(this.#config.mainnetEndpoint, this.#config.skaleNetwork, chainName)
  }

  async ima(chainName: string): Promise<MainnetChain | SChain> {
    if (chainName === constants.MAINNET_CHAIN_NAME) return await this.mainnet()
    return await this.schain(chainName)
  }

  async getInstance(
    provider: Provider,
    project: contracts.ISkaleContractsProject,
    aliasOrAddress: string
  ): Promise<Instance> {
    const network = await skaleContracts.getNetworkByProvider(provider)
    const projectInstance = await network.getProject(project)
    return await projectInstance.getInstance(aliasOrAddress)
  }

  async mainnet(externalProvider?: Provider, signer?: Signer): Promise<MainnetChain> {
    if (
      externalProvider === undefined &&
      signer === undefined &&
      this.#imaCache[constants.MAINNET_CHAIN_NAME]
    ) {
      log.debug('returning cached mainnet ima')
      return this.#imaCache[constants.MAINNET_CHAIN_NAME] as MainnetChain
    }
    const provider = externalProvider ?? mainnetProvider(this.#config.mainnetEndpoint)
    const aliasOrAddress = contracts.getAliasOrAddress(
      this.#config.skaleNetwork,
      contracts.Project.MAINNET_IMA
    )
    const instance = await this.getInstance(provider, contracts.Project.MAINNET_IMA, aliasOrAddress)
    const mainnet = new MainnetChain(provider, instance, signer)
    if (externalProvider === undefined && signer === undefined) {
      log.debug('caching mainnet ima')
      this.#imaCache[constants.MAINNET_CHAIN_NAME] = mainnet
    }
    return mainnet
  }

  async schain(chainName: string, externalProvider?: Provider, signer?: Signer): Promise<SChain> {
    if (chainName === constants.MAINNET_CHAIN_NAME) throw new Error('Invalid chain name')
    if (externalProvider === undefined && signer === undefined && this.#imaCache[chainName]) {
      log.debug(`returning cached ima for ${chainName}`)
      return this.#imaCache[chainName] as SChain
    }
    let provider = externalProvider ?? sChainProvider(this.#config.skaleNetwork, chainName)
    const instance = await this.getInstance(
      provider,
      contracts.SchainProject.SCHAIN_IMA,
      contracts.PREDEPLOYED_ALIAS
    )
    const schain = new SChain(provider, instance, signer)
    if (externalProvider === undefined && signer === undefined) {
      log.debug(`caching ima for ${chainName}`)
      this.#imaCache[chainName] = schain
    }
    return schain
  }

  provider(chainName: string): Provider {
    return new JsonRpcProvider(this.endpoint(chainName))
  }

  tokenChanged(
    chainName1: string,
    ima2: MainnetChain | SChain,
    token: dc.TokenData | null | undefined,
    destChainName?: string
  ): Partial<MetaportState> {
    if (token === undefined || token === null)
      return {
        token: null,
        destTokenContract: null,
        destTokenBalance: null,
        stepsMetadata: [],
        amount: '',
        currentStep: 0
      }
    let destTokenContract
    if (destChainName) {
      destTokenContract = this.tokenContract(
        destChainName,
        token.keyname,
        token.type,
        ima2.provider,
        null,
        chainName1
      )
    }
    return {
      token,
      stepsMetadata: getStepsMetadata(this.config, token, destChainName),
      destTokenContract,
      destTokenBalance: null,
      destChains: Object.keys(token.connections),
      amount: '',
      currentStep: 0
    }
  }

  async chainChanged(
    chainName1: string,
    chainName2: string,
    prevToken: dc.TokenData
  ): Promise<Partial<MetaportState>> {
    if (chainName1 === '' || chainName2 === '') {
      return { chainName1, chainName2 }
    }

    const ima1 = await this.ima(chainName1)
    const ima2 = await this.ima(chainName2)
    const tokens = this.tokens(chainName1, chainName2)
    const tokenContracts = this.tokenContracts(
      tokens,
      dc.TokenType.erc20,
      chainName1,
      ima1.provider
    )

    const wrappedTokenContracts = this.tokenContracts(
      tokens,
      dc.TokenType.erc20,
      chainName1,
      ima1.provider,
      dc.CustomAbiTokenType.erc20wrap
    )

    if (tokens.eth?.eth && chainName1 !== constants.MAINNET_CHAIN_NAME) {
      tokenContracts.eth = this.tokenContract(chainName1, 'eth', dc.TokenType.eth, ima1.provider)

      const destChainName = findFirstWrapperChainName(tokens.eth.eth)
      if (destChainName) {
        wrappedTokenContracts.eth = this.tokenContract(
          chainName1,
          'eth',
          dc.TokenType.eth,
          ima1.provider,
          dc.CustomAbiTokenType.erc20wrap,
          destChainName
        )
      }
    }

    const prevTokenKeyname = prevToken?.keyname
    const prevTokenType = prevToken?.type
    const token =
      prevTokenKeyname && tokens[prevTokenType][prevTokenKeyname]
        ? tokens[prevTokenType][prevTokenKeyname]
        : null

    return {
      ima1,
      ima2,
      chainName1,
      chainName2,

      destChains: this.config.chains,
      destTokenContract: null,
      destTokenBalance: null,

      ...this.tokenChanged(chainName1, ima2, token, chainName2),
      tokens,
      tokenContracts,
      tokenBalances: {},

      wrappedTokens: this.wrappedTokens(chainName1),
      wrappedTokenContracts,
      wrappedTokenBalances: {},

      currentStep: 0
    }
  }
}
