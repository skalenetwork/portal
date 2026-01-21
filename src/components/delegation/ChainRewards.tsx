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
  type MetaportCore,
  enforceNetwork,
  useWagmiWalletClient,
  useWagmiSwitchNetwork,
  TokenIcon,
  Tile,
  walletClientToSigner,
  sendTransaction,
  SkPaper,
  Station,
  explorer,
  contracts
} from '@skalenetwork/metaport'
import { type types, constants, units, ERC_ABIS } from '@/core'

import { Button, IconButton, Tooltip } from '@mui/material'
import { Blocks, CalendarArrowDown, CircleStar } from 'lucide-react'

import Headline from '../Headline'
import ErrorTile from '../ErrorTile'
import SkStack from '../SkStack'

interface ChainRewardsProps {
  mpc: MetaportCore
  validator: types.st.IValidator | null | undefined
  address?: types.AddressType
  customAddress?: types.AddressType
  className?: string
  isXs?: boolean
  chainsMeta: types.ChainsMetadataMap
}

const ChainRewards: React.FC<ChainRewardsProps> = ({
  mpc,
  validator,
  address,
  customAddress,
  className,
  isXs,
  chainsMeta
}) => {
  const [rewardAmount, setRewardAmount] = useState<bigint | undefined>(undefined)
  const [sklToken, setSklToken] = useState<Contract | undefined>(undefined)
  const [tokenBalance, setTokenBalance] = useState<bigint | undefined>(undefined)
  const [tokenUrl, setTokenUrl] = useState<string | undefined>(undefined)
  const [sklPrice, setSklPrice] = useState<bigint | undefined>(undefined)

  const [btnText, setBtnText] = useState<string | undefined>()
  const [errorMsg, setErrorMsg] = useState<string | undefined>()
  const [loading, setLoading] = useState<boolean>(false)
  const [paymaster, setPaymaster] = useState<Contract | undefined>()

  const network = mpc.config.skaleNetwork
  const paymasterChain = contracts.paymaster.getPaymasterChain(network)

  const { data: walletClient } = useWagmiWalletClient()
  const { switchChainAsync } = useWagmiSwitchNetwork()

  const addr = customAddress ?? address

  useEffect(() => {
    initPaymaster()
  }, [])

  useEffect(() => {
    if (!paymaster) return
    loadData()
    const intervalId = setInterval(loadData, constants.DEFAULT_UPDATE_INTERVAL_MS)
    return () => {
      clearInterval(intervalId)
    }
  }, [paymaster, validator])

  async function initPaymaster() {
    setPaymaster(await contracts.paymaster.getPaymaster(mpc))
  }

  async function loadChainRewards() {
    if (validator && paymaster) {
      setRewardAmount(await paymaster.getRewardAmount(validator.id))
    }
  }

  async function loadData() {
    await loadChainRewards()
    await loadSkaleToken()
    await loadSklPrice()
  }

  async function loadSklPrice() {
    if (!paymaster) return
    setSklPrice(await paymaster.oneSklPrice())
  }

  async function loadSkaleToken() {
    if (!paymaster) return
    const tokenAddress = await paymaster.skaleToken()
    let skl = sklToken
    if (skl === undefined) {
      skl = new Contract(tokenAddress, ERC_ABIS.erc20.abi, paymaster.runner)
      setTokenUrl(
        explorer.getExplorerUrlForAddress(
          chainsMeta[paymasterChain],
          network,
          paymasterChain,
          tokenAddress
        )
      )
      setSklToken(skl)
    }
    setTokenBalance(await skl.balanceOf(addr))
  }

  async function retrieveRewards() {
    if (
      !paymaster ||
      !paymaster.runner?.provider ||
      !walletClient ||
      !switchChainAsync ||
      !address
    ) {
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

      await enforceNetwork(chainId, walletClient, switchChainAsync, network, paymasterChain)
      setBtnText('Sending transaction')
      const signer = walletClientToSigner(walletClient)
      paymaster.connect(signer)

      const res = await sendTransaction(signer, paymaster.claim, [address], 'paymaster:claim')
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
    <SkPaper gray className={`mt-5 ${className || ''}`}>
      <Headline
        size="small"
        text="Chain Rewards"
        icon={<CircleStar size={17} />}
      />
      <Tile
        disabled={rewardAmount === 0n}
        value={rewardAmount !== undefined && units.displayBalance(rewardAmount, 'SKL')}
        text="Rewards on Europa Hub"
        icon={<CalendarArrowDown size={14} />}
        size="lg"
        grow
        tooltip={
          sklPrice !== undefined && rewardAmount !== undefined
            ? units.displaySklValueUsd(rewardAmount, sklPrice)
            : ''
        }
        childrenRi={
          <SkStack className="flex items-center">
            <Button
              loading={loading}
              variant="contained"
              size="small"
              className="btn btnSm text-xs bg-accent-foreground! text-accent! align-center! disabled:bg-muted-foreground!"
              disabled={
                customAddress !== undefined ||
                rewardAmount === null ||
                rewardAmount === 0n ||
                loading
              }
              onClick={retrieveRewards}
            >
             Retrieve
            </Button>
            <div className={!isXs ? 'border-l-2 border-border' : ''}>
              <Tile
                className={`p-0! ${!isXs ? 'ml-5' : ''}`}
                size="md"
                transparent
                grow
                value={tokenBalance !== undefined && units.displayBalance(tokenBalance, 'SKL')}
                ri={!isXs}
                text="Balance on Europa Hub"
                icon={<TokenIcon tokenSymbol="skl" size="xs" />}
                tooltip={
                  sklPrice !== undefined && tokenBalance !== undefined
                    ? units.displaySklValueUsd(tokenBalance, sklPrice)
                    : ''
                }
                childrenRi={
                  <Tooltip title="Open in block explorer">
                    <a target="_blank" rel="noreferrer" href={tokenUrl ?? ''} className="unde ml-6!">
                      <IconButton
                        disabled={tokenUrl === null}
                        className="bg-muted-foreground/10!"
                      >
                        <Blocks size={17} className='text-foreground' />
                      </IconButton>
                    </a>
                  </Tooltip>
                }
              />
            </div>
          </SkStack>
        }
      />
      <ErrorTile errorMsg={errorMsg} setErrorMsg={setErrorMsg} className="mt-2.5" />
    </SkPaper>
  )
}

export default ChainRewards
