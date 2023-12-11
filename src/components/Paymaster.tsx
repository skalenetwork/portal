/**
 * @license
 * SKALE portal
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
 * @file Paymaster.tsx
 * @copyright SKALE Labs 2023-Present
 */

import { Contract, id } from 'ethers'
import { useState, useEffect } from 'react'

import {
  cmn,
  cls,
  type MetaportCore,
  useWagmiAccount,
  ERC_ABIS,
  enforceNetwork,
  useWagmiWalletClient,
  useWagmiSwitchNetwork,
  walletClientToSigner,
  sendTransaction,
  getChainAlias,
  toWei
} from '@skalenetwork/metaport'

import ConnectWallet from './ConnectWallet'
import PricingInfo from './PricingInfo'
import Topup from './Topup'
import Loader from './Loader'

import { DEFAULT_UPDATE_INTERVAL_MS, DEFAULT_ERC20_DECIMALS } from '../core/constants'
import {
  initPaymaster,
  getPaymasterChain,
  getPaymasterInfo,
  PaymasterInfo,
  DEFAULT_PAYMASTER_INFO,
  getPaymasterAddress,
  getPaymasterAbi,
  divideBigInts
} from '../core/paymaster'

const DEFAULT_TOPUP_PERIOD = 3
const APPROVE_MULTIPLIER = 2n

export default function Paymaster(props: { mpc: MetaportCore; name: string }) {
  const { address } = useWagmiAccount()
  const paymaster = initPaymaster(props.mpc)
  const network = props.mpc.config.skaleNetwork
  const paymasterChain = getPaymasterChain(network)

  const [btnText, setBtnText] = useState<string | undefined>()
  const [errorMsg, setErrorMsg] = useState<string | undefined>()
  const [loading, setLoading] = useState<boolean>(false)

  const [sklToken, setSklToken] = useState<Contract | undefined>()
  const [tokenBalance, setTokenBalance] = useState<bigint | undefined>()
  const [topupPeriod, setTopupPeriod] = useState<number>(DEFAULT_TOPUP_PERIOD)
  const [info, setInfo] = useState<PaymasterInfo>(DEFAULT_PAYMASTER_INFO)

  const { data: walletClient } = useWagmiWalletClient()
  const { switchNetworkAsync } = useWagmiSwitchNetwork()

  useEffect(() => {
    if (paymaster === undefined) return
    loadPaymasterInfo()
    const intervalId = setInterval(loadPaymasterInfo, DEFAULT_UPDATE_INTERVAL_MS)
    return () => clearInterval(intervalId)
  }, [sklToken, paymaster, address])

  async function loadPaymasterInfo() {
    if (paymaster === undefined) return
    const info = await getPaymasterInfo(paymaster, props.name)
    let skl = sklToken
    if (skl === undefined) {
      skl = new Contract(info.skaleToken, ERC_ABIS.erc20.abi, paymaster.runner)
      setSklToken(skl)
    } else {
      setTokenBalance(await skl.balanceOf(address))
    }
    setInfo(info)
  }

  async function topupChain() {
    if (!paymaster.runner?.provider || !walletClient || !switchNetworkAsync) {
      setErrorMsg('Something is wrong with your wallet, try again')
      return
    }
    setLoading(true)
    setBtnText(`Switch network to ${getChainAlias(network, paymasterChain)}`)
    setErrorMsg(undefined)
    try {
      const { chainId } = await paymaster.runner.provider.getNetwork()
      const paymasterAddress = getPaymasterAddress(network)

      await enforceNetwork(chainId, walletClient, switchNetworkAsync, network, paymasterChain)
      setBtnText('Sending transaction...')
      const signer = walletClientToSigner(walletClient)
      const connectedPaymaster = new Contract(paymasterAddress, getPaymasterAbi(), signer)
      const connectedToken = new Contract(info.skaleToken, ERC_ABIS.erc20.abi, signer)

      const allowance = await connectedToken.allowance(address, paymasterAddress)
      const totalPriceWei = getTotalPriceWei()
      if (allowance <= totalPriceWei) {
        const approveRes = await sendTransaction(
          connectedToken.approve, [paymasterAddress, totalPriceWei * APPROVE_MULTIPLIER])
        if (!approveRes.status) {
          setErrorMsg(approveRes.err?.name)
          return
        }
      }
      const res = await sendTransaction(connectedPaymaster.pay, [id(props.name), topupPeriod])
      if (!res.status) {
        setErrorMsg(res.err?.name)
        return
      }
      await loadPaymasterInfo()
    } catch (e: any) {
      console.error(e)
      setErrorMsg(e.toString())
    } finally {
      setLoading(false)
      setBtnText(undefined)
    }
  }

  function getTotalPriceWei() {
    const chainPriceSkl = divideBigInts(info.schainPricePerMonth, info.oneSklPrice)
    const totalPriceSkl = chainPriceSkl * topupPeriod
    return toWei(totalPriceSkl.toString(), DEFAULT_ERC20_DECIMALS)
  }

  if (info.oneSklPrice === 0n) return <Loader text="Loading pricing info" />

  return (
    <div>
      <p className={cls(cmn.p, cmn.p2, cmn.mtop20, cmn.p700, cmn.mleft5, cmn.mbott10)}>
        Pricing info
      </p>
      <PricingInfo info={info} />
      <p className={cls(cmn.p, cmn.p2, cmn.mtop20, cmn.p700, cmn.mleft5, cmn.mbott10)}>
        Top-up chain
      </p>
      {!address ? (
        <ConnectWallet tile className={cls(cmn.flexg)} />
      ) : (
        <Topup
          mpc={props.mpc}
          name={props.name}
          topupPeriod={topupPeriod}
          setTopupPeriod={setTopupPeriod}
          info={info}
          tokenBalance={tokenBalance}
          topupChain={topupChain}
          btnText={btnText}
          loading={loading}
          errorMsg={errorMsg}
          setErrorMsg={setErrorMsg}
        />
      )}
    </div>
  )
}
