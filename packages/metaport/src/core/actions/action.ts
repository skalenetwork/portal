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
 * @file action.ts
 * @copyright SKALE Labs 2022-Present
 */

import { Logger, type ILogObj } from 'tslog'
import { UseSwitchChainReturnType } from 'wagmi'
import { WalletClient } from 'viem'
import { Contract, Provider, type Signer } from 'ethers'
import { dc, type types, units, helper } from '@/core'

import MetaportCore, { createTokenData } from '../metaport'
import { externalEvents } from '../events'
import { LOADING_BUTTON_TEXT } from './actionState'
import { isMainnetChainId, enforceNetwork } from '../network'
import { walletClientToSigner } from '../ethers'
import { MainnetChain, SChain } from '../contracts'

const log = new Logger<ILogObj>({ name: 'metaport:core:actions' })

export type ActionConstructor = (new (...args: ConstructorParameters<typeof Action>) => Action) & {
  create: typeof Action.create
}

export abstract class Action {
  execute(): void {
    return
  }
  preAction(): void {
    return
  }

  mpc: MetaportCore
  mainnet?: MainnetChain
  sChain1?: SChain
  sChain2?: SChain

  chainName1: string
  chainName2: string
  address: types.AddressType
  amount: string
  tokenId: number
  token: dc.TokenData

  walletClient: WalletClient

  sourceToken: Contract
  destToken: Contract
  unwrappedToken: Contract | undefined

  originAddress: string

  activeStep: number
  setActiveStep: React.Dispatch<React.SetStateAction<number>>

  setAmountErrorMessage: React.Dispatch<React.SetStateAction<string>>
  setBtnText: (btnText: string) => void

  _switchChain: UseSwitchChainReturnType['switchChainAsync']

  constructor(
    mpc: MetaportCore,
    chainName1: string,
    chainName2: string,
    address: types.AddressType,
    amount: string,
    tokenId: number,
    token: dc.TokenData,
    setAmountErrorMessage: (amountErrorMessage: string) => void,
    setBtnText: (btnText: string) => void,
    switchChain: UseSwitchChainReturnType['switchChainAsync'],
    walletClient: WalletClient
  ) {
    this.mpc = mpc
    this.chainName1 = chainName1
    this.chainName2 = chainName2
    this.address = address
    this.amount = amount
    this.tokenId = Number(tokenId)
    this.token = createTokenData(token.keyname, chainName1, token.type, this.mpc.config)
    this.setAmountErrorMessage = setAmountErrorMessage
    this.setBtnText = setBtnText
    this._switchChain = switchChain
    this.walletClient = walletClient
  }

  static async create<T extends Action>(
    this: new (
      mpc: MetaportCore,
      chainName1: string,
      chainName2: string,
      address: types.AddressType,
      amount: string,
      tokenId: number,
      token: dc.TokenData,
      setAmountErrorMessage: (amountErrorMessage: string) => void,
      setBtnText: (btnText: string) => void,
      switchChain: UseSwitchChainReturnType['switchChainAsync'],
      walletClient: WalletClient
    ) => T,
    mpc: MetaportCore,
    chainName1: string,
    chainName2: string,
    address: types.AddressType,
    amount: string,
    tokenId: number,
    token: dc.TokenData,
    setAmountErrorMessage: (amountErrorMessage: string) => void,
    setBtnText: (btnText: string) => void,
    switchChain: UseSwitchChainReturnType['switchChainAsync'],
    walletClient: WalletClient
  ): Promise<T> {
    const instance = new this(
      mpc,
      chainName1,
      chainName2,
      address,
      amount,
      tokenId,
      token,
      setAmountErrorMessage,
      setBtnText,
      switchChain,
      walletClient
    )
    await instance.initialize()
    return instance
  }

  private async initialize(): Promise<void> {
    if (helper.isMainnet(this.chainName1)) {
      this.mainnet = await this.mpc.mainnet()
    } else {
      this.sChain1 = await this.mpc.schain(this.chainName1)
    }
    if (helper.isMainnet(this.chainName2)) {
      this.mainnet = await this.mpc.mainnet()
    } else {
      this.sChain2 = await this.mpc.schain(this.chainName2)
    }

    const provider1 = helper.isMainnet(this.chainName1)
      ? this.mainnet.provider
      : this.sChain1.provider
    const provider2 = helper.isMainnet(this.chainName2)
      ? this.mainnet.provider
      : this.sChain2.provider

    if (this.chainName2) {
      this.sourceToken = this.mpc.tokenContract(
        this.chainName1,
        this.token.keyname,
        this.token.type,
        provider1,
        this.token.wrapper(this.chainName2) ? dc.CustomAbiTokenType.erc20wrap : null,
        this.token.wrapper(this.chainName2) ? this.chainName2 : null
      )
      this.originAddress = this.mpc.originAddress(
        this.chainName1,
        this.chainName2,
        this.token.keyname,
        this.token.type
      )

      if (this.token.wrapper(this.chainName2)) {
        this.unwrappedToken = this.mpc.tokenContract(
          this.chainName1,
          this.token.keyname,
          this.token.type,
          provider1
        )
      }

      const destWrapperAddress =
        this.mpc.config.connections[this.chainName2][this.token.type][this.token.keyname].chains[
          this.chainName1
        ].wrapper
      if (this.token.isClone(this.chainName2) && destWrapperAddress) {
        this.destToken = this.mpc.tokenContract(
          this.chainName2,
          this.token.keyname,
          this.token.type,
          provider2,
          dc.CustomAbiTokenType.erc20wrap,
          this.chainName1
        )
      } else {
        this.destToken = this.mpc.tokenContract(
          this.chainName2,
          this.token.keyname,
          this.token.type,
          provider2
        )
      }
    }
  }

  updateState(currentState: types.mp.ActionState, transactionHash?: string, timestamp?: number) {
    log.info(`actionStateUpd: ${this.constructor.name} - ${currentState} - ${this.token.keyname} \
- ${this.chainName1} -> ${this.chainName2}`)
    const amountWei = this.amount ? units.toWei(this.amount, this.token.meta.decimals) : 0n
    externalEvents.actionStateUpdated({
      actionName: this.constructor.name,
      actionState: currentState,
      actionData: {
        chainName1: this.chainName1,
        chainName2: this.chainName2,
        address: this.address,
        amount: this.amount,
        amountWei: amountWei,
        tokenId: this.tokenId
      },
      transactionHash,
      timestamp
    })
    this.setBtnText(LOADING_BUTTON_TEXT[currentState])
  }

  async connectedMainnet(
    provider: Provider,
    customAbiTokenType?: dc.CustomAbiTokenType,
    destChainName?: string,
    chainName?: string
  ): Promise<MainnetChain> {
    return (await this._getConnectedChain(
      provider,
      customAbiTokenType,
      destChainName,
      chainName
    )) as MainnetChain
  }

  async connectedSChain(
    provider: Provider,
    customAbiTokenType?: dc.CustomAbiTokenType,
    destChainName?: string,
    chainName?: string
  ): Promise<SChain> {
    return (await this._getConnectedChain(
      provider,
      customAbiTokenType,
      destChainName,
      chainName
    )) as SChain
  }

  async signer(provider: Provider, chainName?: string): Promise<Signer> {
    this.updateState('switch')
    const { chainId } = await provider.getNetwork()
    await enforceNetwork(
      chainId,
      this.walletClient,
      this._switchChain,
      this.mpc.config.skaleNetwork,
      chainName ?? this.chainName1
    )
    return walletClientToSigner(this.walletClient)
  }

  async _getConnectedChain(
    provider: Provider,
    customAbiTokenType?: dc.CustomAbiTokenType,
    destChainName?: string,
    chainName?: string
  ): Promise<MainnetChain | SChain> {
    this.updateState('switch')
    const { chainId } = await provider.getNetwork()
    const updChainId = await enforceNetwork(
      chainId,
      this.walletClient,
      this._switchChain,
      this.mpc.config.skaleNetwork,
      chainName ?? this.chainName1
    )
    const signer = walletClientToSigner(this.walletClient)

    let chain: MainnetChain | SChain
    if (isMainnetChainId(updChainId, this.mpc.config.skaleNetwork)) {
      chain = await this.mpc.mainnet(signer.provider, signer)
    } else {
      chain = await this.mpc.schain(chainName ?? this.chainName1, signer.provider, signer)
    }

    const tokenContract = this.mpc.tokenContract(
      destChainName === this.chainName1 ? this.chainName2 : this.chainName1,
      this.token.keyname,
      this.token.type,
      chain.provider,
      customAbiTokenType,
      destChainName
    )
    await chain.addToken(this.token.type, this.token.keyname, tokenContract)
    return chain
  }
}
