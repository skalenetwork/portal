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
import {
  cls,
  cmn,
  ERC_ABIS,
  MetaportCore,
  SkPaper,
  styles,
  TokenIcon
} from '@skalenetwork/metaport'
import { types } from '@/core'

import StarsRoundedIcon from '@mui/icons-material/StarsRounded'
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded'

import Headline from '../Headline'
import { formatBalance } from '../../core/helper'
import Tile from '../Tile'
import SkBtn from '../SkBtn'
import { initPaymaster } from '../../core/paymaster'
import { DEFAULT_UPDATE_INTERVAL_MS } from '../../core/constants'
import SkStack from '../SkStack'
import { Contract } from 'ethers'

interface ChainRewardsProps {
  mpc: MetaportCore
  validator: types.staking.IValidator | null | undefined
  customAddress?: string
  className?: string
  isXs?: boolean
}

const ChainRewards: React.FC<ChainRewardsProps> = ({
  mpc,
  validator,
  customAddress,
  className,
  isXs
}) => {
  const paymaster = initPaymaster(mpc)

  const [rewardAmount, setRewardAmount] = useState<bigint | null>(null)
  const [sklToken, setSklToken] = useState<Contract | null>(null)
  const [tokenBalance, setTokenBalance] = useState<bigint | null>(null)

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
    loadChainRewards()
    loadSkaleToken()
  }

  async function loadSkaleToken() {
    const address = await paymaster.skaleToken()
    let skl = sklToken
    if (skl === null) {
      skl = new Contract(address, ERC_ABIS.erc20.abi, paymaster.runner)
      setSklToken(skl)
    }
    setTokenBalance(await skl.balanceOf(address))
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
              // loading={loading}
              text="Retrieve"
              variant="contained"
              size="sm"
              className={cls([cmn.mleft20, !isXs], cmn.mri20, cmn.flexcv)}
              disabled={customAddress !== undefined}
            // onClick={() => {
            // }}
            />
            <div className={cls(['borderVert', !isXs])}>
              <Tile
                className={cls(cmn.nop, [cmn.mri10, !isXs], [cmn.mleft20, !isXs])}
                size="md"
                transparent
                grow
                // disabled={props.accountInfo?.allowedToDelegate === 0n}
                value={tokenBalance !== null && formatBalance(tokenBalance, 'SKL')}
                ri={!isXs}
                text="Balance on Europa Hub"
                icon={<TokenIcon tokenSymbol="skl" size="xs" />}
              />
            </div>
          </SkStack>
        }
      />
    </SkPaper>
  )
}

export default ChainRewards
