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
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded'
import MonetizationOnRoundedIcon from '@mui/icons-material/MonetizationOnRounded'

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
import Tile from './Tile'

import { DEFAULT_UPDATE_INTERVAL_MS, DEFAULT_ERC20_DECIMALS } from '../core/constants'
import {
  initPaymaster,
  getPaymasterChain,
  getPaymasterInfo,
  type PaymasterInfo,
  DEFAULT_PAYMASTER_INFO,
  getPaymasterAddress,
  getPaymasterAbi,
  divideBigInts
} from '../core/paymaster'
import Headline from './Headline'

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
  const [inited, setInited] = useState<boolean>(false)

  const [sklToken, setSklToken] = useState<Contract | undefined>()
  const [tokenBalance, setTokenBalance] = useState<bigint | undefined>()
  const [topupPeriod, setTopupPeriod] = useState<number>(DEFAULT_TOPUP_PERIOD)
  const [info, setInfo] = useState<PaymasterInfo>(DEFAULT_PAYMASTER_INFO)

  const { data: walletClient } = useWagmiWalletClient()
  const { switchChainAsync } = useWagmiSwitchNetwork()

  useEffect(() => {
    loadPaymasterInfo()
    const intervalId = setInterval(loadPaymasterInfo, DEFAULT_UPDATE_INTERVAL_MS)
    return () => {
      clearInterval(intervalId)
    }
  }, [sklToken, address])

  async function loadPaymasterInfo() {
    const info = await getPaymasterInfo(paymaster, props.name, network)
    let skl = sklToken
    if (skl === undefined) {
      skl = new Contract(info.skaleToken, ERC_ABIS.erc20.abi, paymaster.runner)
      setSklToken(skl)
    } else {
      setTokenBalance(await skl.balanceOf(address))
    }
    setInfo(info)
    setInited(true)
  }

  async function topupChain() {
    if (!paymaster.runner?.provider || !walletClient || !switchChainAsync) {
      setErrorMsg('Something is wrong with your wallet, try again')
      return
    }
    setLoading(true)
    setBtnText(`Switch network to ${getChainAlias(network, paymasterChain)}`)
    setErrorMsg(undefined)
    try {
      const { chainId } = await paymaster.runner.provider.getNetwork()
      const paymasterAddress = getPaymasterAddress(network)

      await enforceNetwork(chainId, walletClient, switchChainAsync, network, paymasterChain)
      setBtnText('Sending transaction...')
      const signer = walletClientToSigner(walletClient)
      const connectedPaymaster = new Contract(paymasterAddress, getPaymasterAbi(), signer)
      const connectedToken = new Contract(info.skaleToken, ERC_ABIS.erc20.abi, signer)

      const allowance = await connectedToken.allowance(address, paymasterAddress)
      const totalPriceWei = getTotalPriceWei()
      if (allowance <= totalPriceWei) {
        setBtnText('Waiting for approval...')
        const approveRes = await sendTransaction(connectedToken.approve, [
          paymasterAddress,
          totalPriceWei * APPROVE_MULTIPLIER
        ])
        if (!approveRes.status) {
          setErrorMsg(approveRes.err?.name)
          return
        }
        setBtnText('Sending transaction...')
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

  if (!inited) return <Loader text="Loading pricing info" />

  if (info.schain.name === '')
    return (
      <Tile
        value="SKALE Chain is not added to Paymaster"
        text="Error occurred"
        icon={<ErrorRoundedIcon />}
        color="error"
        className={cls(cmn.mtop20)}
      />
    )
  if (info.oneSklPrice === 0n)
    return (
      <Tile
        value="Need to set oneSklPrice on contracts"
        text="Error occurred"
        icon={<ErrorRoundedIcon />}
        color="error"
        className={cls(cmn.mtop20)}
      />
    )

  return (
    <div>
      <PricingInfo info={info} />
      <Headline text="Top-up chain" icon={<MonetizationOnRoundedIcon />} />
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
