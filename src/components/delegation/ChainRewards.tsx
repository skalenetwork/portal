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
 * @file ChainRewards.tsx
 * @copyright SKALE Labs 2024-Present
 */

import { useEffect, useState } from 'react'
import { Contract } from 'ethers'
import {
  cmn,
  cls,
  type MetaportCore,
  ERC_ABIS,
  enforceNetwork,
  useWagmiWalletClient,
  useWagmiSwitchNetwork,
  TokenIcon,
  walletClientToSigner,
  sendTransaction,
  styles,
  SkPaper
} from '@skalenetwork/metaport'
import { types } from '@/core'

import StarsRoundedIcon from '@mui/icons-material/StarsRounded'
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded'

import { formatBalance } from '../../core/helper'
import {
  getPaymasterAbi,
  getPaymasterAddress,
  getPaymasterChain,
  initPaymaster
} from '../../core/paymaster'
import { DEFAULT_UPDATE_INTERVAL_MS } from '../../core/constants'

import Headline from '../Headline'
import Tile from '../Tile'
import SkBtn from '../SkBtn'
import ErrorTile from '../ErrorTile'
import SkStack from '../SkStack'

interface ChainRewardsProps {
  mpc: MetaportCore
  validator: types.staking.IValidator | null | undefined
  address?: string
  customAddress?: string
  className?: string
  isXs?: boolean
}

const ChainRewards: React.FC<ChainRewardsProps> = ({
  mpc,
  validator,
  address,
  customAddress,
  className,
  isXs
}) => {
  const paymaster = initPaymaster(mpc)

  const [rewardAmount, setRewardAmount] = useState<bigint | null>(null)
  const [sklToken, setSklToken] = useState<Contract | null>(null)
  const [tokenBalance, setTokenBalance] = useState<bigint | null>(null)

  const [btnText, setBtnText] = useState<string | undefined>()
  const [errorMsg, setErrorMsg] = useState<string | undefined>()
  const [loading, setLoading] = useState<boolean>(false)

  const network = mpc.config.skaleNetwork
  const paymasterChain = getPaymasterChain(network)

  const { data: walletClient } = useWagmiWalletClient()
  const { switchChainAsync } = useWagmiSwitchNetwork()

  useEffect(() => {
    loadData()
    const intervalId = setInterval(loadData, DEFAULT_UPDATE_INTERVAL_MS)
    return () => {
      clearInterval(intervalId)
    }
  }, [validator])

  async function loadChainRewards() {
    if (validator) {
      setRewardAmount(await paymaster.getRewardAmount(validator.id))
    }
  }

  async function loadData() {
    await loadChainRewards()
    await loadSkaleToken()
  }

  async function loadSkaleToken() {
    const tokenAddress = await paymaster.skaleToken()
    let skl = sklToken
    if (skl === null) {
      skl = new Contract(tokenAddress, ERC_ABIS.erc20.abi, paymaster.runner)
      setSklToken(skl)
    }
    setTokenBalance(await skl.balanceOf(tokenAddress))
  }

  async function retrieveRewards() {
    if (!paymaster.runner?.provider || !walletClient || !switchChainAsync) {
      setErrorMsg('Something is wrong with your wallet, try again')
      return
    }
    setLoading(true)
    setBtnText(`Switching network`)
    setErrorMsg(undefined)
    try {
      const { chainId } = await paymaster.runner.provider.getNetwork()
      const paymasterAddress = getPaymasterAddress(network)

      await enforceNetwork(chainId, walletClient, switchChainAsync, network, paymasterChain)
      setBtnText('Sending transaction')
      const signer = walletClientToSigner(walletClient)
      const connectedPaymaster = new Contract(paymasterAddress, getPaymasterAbi(), signer)

      const res = await sendTransaction(connectedPaymaster.claim, [address])
      if (!res.status) {
        setErrorMsg(res.err?.name)
        return
      }
      await loadData()
    } catch (e: any) {
      console.error(e)
      setErrorMsg(e.toString())
    } finally {
      setLoading(false)
      setBtnText(undefined)
    }
  }

  return (
    <SkPaper gray className={cls(cmn.mtop20, className)}>
      <Headline
        size="small"
        text="Chain Rewards"
        icon={<StarsRoundedIcon className={cls(styles.chainIconxs)} />}
        className={cls(cmn.mbott20)}
      />
      <Tile
        disabled={rewardAmount === 0n}
        value={rewardAmount !== null && formatBalance(rewardAmount, 'SKL')}
        text="Rewards on Europa Hub"
        icon={<EventAvailableRoundedIcon />}
        grow
        childrenRi={
          <SkStack className={cls(cmn.flex, [cmn.flexcv, !isXs])}>
            <SkBtn
              loading={loading}
              text={btnText ?? 'Retrieve'}
              variant="contained"
              size="sm"
              className={cls([cmn.mleft20, !isXs], cmn.mri20, cmn.flexcv)}
              disabled={customAddress === undefined || rewardAmount === 0n || loading}
              onClick={retrieveRewards}
            />
            <div className={cls(['borderVert', !isXs])}>
              <Tile
                className={cls(cmn.nop, [cmn.mri10, !isXs], [cmn.mleft20, !isXs])}
                size="md"
                transparent
                grow
                value={tokenBalance !== null && formatBalance(tokenBalance, 'SKL')}
                ri={!isXs}
                text="Balance on Europa Hub"
                icon={<TokenIcon tokenSymbol="skl" size="xs" />}
              />
            </div>
          </SkStack>
        }
      />
      <ErrorTile errorMsg={errorMsg} setErrorMsg={setErrorMsg} className={cls(cmn.mtop10)} />
    </SkPaper>
  )
}

export default ChainRewards