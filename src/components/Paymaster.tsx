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
import { type types, metadata, constants, ERC_ABIS, units, helper } from '@/core'
import {
  type MetaportCore,
  useWagmiAccount,
  enforceNetwork,
  useWagmiWalletClient,
  Tile,
  useWagmiSwitchNetwork,
  walletClientToSigner,
  sendTransaction,
  contracts
} from '@skalenetwork/metaport'

import { CircleDollarSign, ShieldAlert } from 'lucide-react'

import ConnectWallet from './ConnectWallet'
import PricingInfo from './PricingInfo'
import Topup from './Topup'
import Loader from './Loader'
import Headline from './Headline'

const DEFAULT_TOPUP_PERIOD = 3
const APPROVE_MULTIPLIER = 2n

export default function Paymaster(props: {
  mpc: MetaportCore
  name: string
  chainsMeta: types.ChainsMetadataMap
}) {
  const { address } = useWagmiAccount()
  const network = props.mpc.config.skaleNetwork
  const paymasterChain = contracts.paymaster.getPaymasterChain(network)

  const [btnText, setBtnText] = useState<string | undefined>()
  const [errorMsg, setErrorMsg] = useState<string | undefined>()
  const [loading, setLoading] = useState<boolean>(false)
  const [inited, setInited] = useState<boolean>(false)

  const [paymaster, setPaymaster] = useState<Contract | undefined>()
  const [sklToken, setSklToken] = useState<Contract | undefined>()
  const [tokenBalance, setTokenBalance] = useState<bigint | undefined>()
  const [topupPeriod, setTopupPeriod] = useState<number>(DEFAULT_TOPUP_PERIOD)
  const [info, setInfo] = useState<types.pm.PaymasterInfo>(
    contracts.paymaster.DEFAULT_PAYMASTER_INFO
  )

  const { data: walletClient } = useWagmiWalletClient()
  const { switchChainAsync } = useWagmiSwitchNetwork()

  useEffect(() => {
    initPaymaster()
  }, [])

  useEffect(() => {
    loadPaymasterInfo()
    const intervalId = setInterval(loadPaymasterInfo, constants.DEFAULT_UPDATE_INTERVAL_MS)
    return () => {
      clearInterval(intervalId)
    }
  }, [sklToken, address, paymaster])

  async function initPaymaster() {
    setPaymaster(await contracts.paymaster.getPaymaster(props.mpc))
  }

  async function loadPaymasterInfo() {
    if (!paymaster) return
    const info = await contracts.paymaster.getPaymasterInfo(paymaster, props.name, network)
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
    if (!paymaster) return
    if (!paymaster.runner?.provider || !walletClient || !switchChainAsync) {
      setErrorMsg('Something is wrong with your wallet, try again')
      return
    }
    setLoading(true)
    setBtnText(`Switch network to ${metadata.getAlias(network, props.chainsMeta, paymasterChain)}`)
    setErrorMsg(undefined)
    try {
      const { chainId } = await paymaster.runner.provider.getNetwork()
      const paymasterAddress = contracts.paymaster.getPaymasterAddress(network)

      await enforceNetwork(chainId, walletClient, switchChainAsync, network, paymasterChain)
      setBtnText('Sending transaction...')
      const signer = walletClientToSigner(walletClient)
      paymaster.connect(signer)
      const connectedToken = new Contract(info.skaleToken, ERC_ABIS.erc20.abi, signer)

      const allowance = await connectedToken.allowance(address, paymasterAddress)
      const totalPriceWei = getTotalPriceWei()
      if (allowance <= totalPriceWei) {
        setBtnText('Waiting for approval...')
        const approveRes = await sendTransaction(
          signer,
          connectedToken.approve,
          [paymasterAddress, totalPriceWei * APPROVE_MULTIPLIER],
          'paymaster:approve'
        )
        if (!approveRes.status) {
          setErrorMsg(approveRes.err?.name)
          return
        }
        setBtnText('Sending transaction...')
      }
      const res = await sendTransaction(
        signer,
        paymaster.pay,
        [id(props.name), topupPeriod],
        'paymaster:'
      )
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
    const chainPriceSkl = helper.divideBigInts(info.schainPricePerMonth, info.oneSklPrice)
    const totalPriceSkl = chainPriceSkl * topupPeriod
    return units.toWei(totalPriceSkl.toString(), constants.DEFAULT_ERC20_DECIMALS)
  }

  if (!inited) return <Loader text="Loading pricing info" />

  if (info.schain.name === '')
    return (
      <Tile
        value="SKALE Chain is not added to Paymaster"
        text="Error occurred"
        icon={<ShieldAlert size={17} />}
        color="error"
        className="mt-5 dark:bg-red-800/80 dark:border-red-600 border-2"
      />
    )
  if (info.oneSklPrice === 0n)
    return (
      <Tile
        value="Need to set oneSklPrice on contracts"
        text="Error occurred"
        icon={<ShieldAlert size={17} />}
        color="error"
        className="mt-5 dark:bg-red-800/80 dark:border-red-600 border-2"
      />
    )

  return (
    <div>
      <PricingInfo info={info} />
      <Headline
        text="Top-up chain"
        className="mt-5"
        icon={<CircleDollarSign size={17} />}
        size="small"
      />
      {!address ? (
        <ConnectWallet tile className="grow" />
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
