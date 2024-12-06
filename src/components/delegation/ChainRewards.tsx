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
  SkPaper,
  Station
} from '@skalenetwork/metaport'
import { types } from '@/core'

import StarsRoundedIcon from '@mui/icons-material/StarsRounded'
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded'
import ViewInArRoundedIcon from '@mui/icons-material/ViewInArRounded'

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
import { Button, Tooltip } from '@mui/material'
import { getExplorerUrlForAddress } from '../../core/explorer'

interface ChainRewardsProps {
  mpc: MetaportCore
  validator: types.staking.IValidator | null | undefined
  address?: types.AddressType
  customAddress?: types.AddressType
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

  const [rewardAmount, setRewardAmount] = useState<bigint | undefined>(undefined)
  const [sklToken, setSklToken] = useState<Contract | undefined>(undefined)
  const [tokenBalance, setTokenBalance] = useState<bigint | undefined>(undefined)
  const [tokenUrl, setTokenUrl] = useState<string | undefined>(undefined)

  const [btnText, setBtnText] = useState<string | undefined>()
  const [errorMsg, setErrorMsg] = useState<string | undefined>()
  const [loading, setLoading] = useState<boolean>(false)

  const network = mpc.config.skaleNetwork
  const paymasterChain = getPaymasterChain(network)

  const { data: walletClient } = useWagmiWalletClient()
  const { switchChainAsync } = useWagmiSwitchNetwork()

  const addr = customAddress ?? address

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
    if (skl === undefined) {
      skl = new Contract(tokenAddress, ERC_ABIS.erc20.abi, paymaster.runner)
      setTokenUrl(getExplorerUrlForAddress(network, paymasterChain, tokenAddress))
      setSklToken(skl)
    }
    setTokenBalance(await skl.balanceOf(addr))
  }

  async function retrieveRewards() {
    if (!paymaster.runner?.provider || !walletClient || !switchChainAsync || !address) {
      setErrorMsg('Something is wrong with your wallet, try again')
      return
    }
    setLoading(true)
    setBtnText('Switching network')
    setErrorMsg(undefined)
    try {
      const sFuelBalance = await paymaster.runner.provider.getBalance(address)
      if (sFuelBalance === 0n) {
        setBtnText('Mining sFUEL')
        const station = new Station(paymasterChain, mpc)
        const powResult = await station.doPoW(address)
        if (!powResult.ok) {
          setErrorMsg('Failed to mine sFUEL')
          return
        }
      }

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
        value={rewardAmount !== undefined && formatBalance(rewardAmount, 'SKL')}
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
              disabled={
                customAddress !== undefined ||
                rewardAmount === null ||
                rewardAmount === 0n ||
                loading
              }
              onClick={retrieveRewards}
            />
            <div className={cls(['borderVert', !isXs])}>
              <Tile
                className={cls(cmn.nop, [cmn.mleft20, !isXs])}
                size="md"
                transparent
                grow
                value={tokenBalance !== undefined && formatBalance(tokenBalance, 'SKL')}
                ri={!isXs}
                text="Balance on Europa Hub"
                icon={<TokenIcon tokenSymbol="skl" size="xs" />}
                childrenRi={
                  <Tooltip title="Open in block explorer">
                    <a target="_blank" rel="noreferrer" href={tokenUrl ?? ''} className="undec">
                      <Button
                        disabled={tokenUrl === null}
                        variant="text"
                        className={cls('roundBtn', cmn.mleft5)}
                      >
                        <ViewInArRoundedIcon className={cls(styles.chainIconxs)} />
                      </Button>
                    </a>
                  </Tooltip>
                }
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
