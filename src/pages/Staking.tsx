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
 * @file Staking.tsx
 * @copyright SKALE Labs 2024-Present
 */

import { Helmet } from 'react-helmet'

import { Link } from 'react-router-dom'
import { type Signer, isAddress } from 'ethers'
import { useCallback, useEffect, useState } from 'react'
import { SkPaper, contracts, type MetaportCore } from '@skalenetwork/metaport'
import { types } from '@/core'

import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'

import { ChartPie, CircleUser, Coins, Eye, Inbox, TriangleAlert } from 'lucide-react'

import Delegations from '../components/delegation/Delegations'

import Summary from '../components/delegation/Summary'
import { Collapse } from '@mui/material'

import {
  retrieveRewards,
  unstakeDelegation,
  cancelDelegationRequest,
  retrieveUnlockedTokens,
  type LoadingState,
  StakingActionProps
} from '../core/delegation/stakingActions'

import { BALANCE_UPDATE_INTERVAL_MS } from '../core/constants'
import ErrorTile from '../components/ErrorTile'
import ConnectWallet from '../components/ConnectWallet'
import Headline from '../components/Headline'
import Message from '../components/Message'
import { META_TAGS } from '../core/meta'
import SkPageInfoIcon from '../components/SkPageInfoIcon'

export default function Staking(props: {
  mpc: MetaportCore
  validators: types.st.IValidator[]
  loadValidators: () => Promise<void>
  loadStakingInfo: () => Promise<void>
  sc: types.st.ISkaleContractsMap | null
  si: types.st.StakingInfoMap
  address: types.AddressType | undefined
  customAddress: types.AddressType | undefined
  getMainnetSigner: () => Promise<Signer>
}) {
  const [loading, setLoading] = useState<LoadingState>(false)
  const [errorMsg, setErrorMsg] = useState<string | undefined>()
  const [customRewardAddress, setCustomRewardAddress] = useState<types.AddressType | undefined>(
    props.address
  )
  const [sklPrice, setSklPrice] = useState<bigint | undefined>()

  useEffect(() => {
    props.loadValidators()
    props.loadStakingInfo()
    const intervalId = setInterval(props.loadStakingInfo, BALANCE_UPDATE_INTERVAL_MS)
    return () => clearInterval(intervalId)
  }, [props.address, props.sc])

  useEffect(() => {
    setCustomRewardAddress(props.address)
  }, [props.address])

  useEffect(() => {
    loadSklPrice()
  }, [])

  const getStakingActionProps = useCallback(
    (): StakingActionProps => ({
      sc: props.sc,
      address: props.address,
      skaleNetwork: props.mpc.config.skaleNetwork,
      getMainnetSigner: props.getMainnetSigner,
      setLoading,
      setErrorMsg,
      postAction: props.loadStakingInfo
    }),
    [
      props.sc,
      props.address,
      props.mpc.config.skaleNetwork,
      props.getMainnetSigner,
      props.loadStakingInfo
    ]
  )

  async function loadSklPrice() {
    const paymaster = await contracts.paymaster.getPaymaster(props.mpc)
    const price = await paymaster.oneSklPrice()
    setSklPrice(price)
  }

  async function handleRetrieveRewards(rewardInfo: types.st.IRewardInfo) {
    if (!isAddress(customRewardAddress)) {
      setErrorMsg('Invalid address')
      setLoading(false)
      return
    }
    await retrieveRewards({
      rewardInfo,
      rewardAddress: customRewardAddress,
      props: getStakingActionProps()
    })
  }

  async function handleUnstake(delegationInfo: types.st.IDelegationInfo) {
    await unstakeDelegation({
      delegationInfo,
      props: getStakingActionProps()
    })
  }

  async function handleCancelRequest(delegationInfo: types.st.IDelegationInfo) {
    await cancelDelegationRequest({
      delegationInfo,
      props: getStakingActionProps()
    })
  }

  async function handleRetrieveUnlocked(rewardInfo: types.st.IRewardInfo) {
    await retrieveUnlockedTokens({
      rewardInfo,
      props: getStakingActionProps()
    })
  }

  return (
    <Container maxWidth="md">
      <Helmet>
        <title>{META_TAGS.staking.title}</title>
        <meta name="description" content={META_TAGS.staking.description} />
        <meta property="og:title" content={META_TAGS.staking.title} />
        <meta property="og:description" content={META_TAGS.staking.description} />
      </Helmet>
      <Stack spacing={0}>
        <div className="flex items-center">
          <div className="grow">
            <h2 className="m-0 text-xl font-bold text-foreground">Staking</h2>
            <div className="text-xs text-secondary-foreground font-semibold">
              <span className="sm:hidden">Manage your delegations</span>
              <span className="hidden sm:!inline">Delegate, review delegations and withdraw staking rewards</span>
            </div>
          </div>
          <div className="mr-2.5">
            {loading !== false || props.customAddress !== undefined ? (
              <Button
                variant="contained"
                className="btn btnSm py-3! text-xs text-accent! bg-foreground!"
                startIcon={<Coins size={14} />}
                disabled={loading !== false || props.customAddress !== undefined}
              >
                Stake SKL
              </Button>
            ) : (
              <Link to="/staking/new">
                <Button
                  variant="contained"
                  className="btn btnSm py-3! text-xs text-accent! bg-foreground!"
                  startIcon={<Coins size={14} />}
                  disabled={loading || props.customAddress !== undefined}
                >
                  Stake SKL
                </Button>
              </Link>
            )}
          </div>
          <SkPageInfoIcon meta_tag={META_TAGS.staking} />
        </div>
      </Stack>

      {props.customAddress !== undefined ? (
        <Message
          className="mt-5"
          text="Preview mode, "
          textLong="Previewing staking page in read-only mode, "
          icon={<Eye />}
          link="/staking"
          linkText="Click to exit"
          type="warning"
        />
      ) : null}

      {props.address !== customRewardAddress ? (
        <Message
          className="mt-5"
          text={`Custom address will be used for rewards withdrawal: ${customRewardAddress}`}
          icon={<TriangleAlert />}
          type="warning"
          closable={false}
        />
      ) : null}

      <SkPaper gray className="mt-5">
        <Collapse in={props.address !== undefined}>
          <Summary
            sklPrice={sklPrice}
            type={types.st.DelegationType.REGULAR}
            accountInfo={props.si[0]?.info}
            loading={loading}
            retrieveUnlocked={handleRetrieveUnlocked}
            customAddress={props.customAddress}
          />
        </Collapse>
        <Collapse in={props.address === undefined}>
          <Headline
            text="Account info"
            icon={<CircleUser size={17} />}
          />
          <ConnectWallet tile className="grow mt-2.5" />
        </Collapse>
      </SkPaper>
      <Collapse in={props.si[1] !== null}>
        <SkPaper gray className="mt-5">
          <Summary
            sklPrice={sklPrice}
            type={types.st.DelegationType.ESCROW}
            accountInfo={props.si[1]?.info}
            loading={loading}
            retrieveUnlocked={handleRetrieveUnlocked}
            customAddress={props.customAddress}
          />
        </SkPaper>
      </Collapse>
      <Collapse in={props.si[2] !== null}>
        <SkPaper gray className="mt-5">
          <Summary
            sklPrice={sklPrice}
            type={types.st.DelegationType.ESCROW2}
            accountInfo={props.si[2]?.info}
            loading={loading}
            retrieveUnlocked={handleRetrieveUnlocked}
            customAddress={props.customAddress}
          />
        </SkPaper>
      </Collapse>

      <ErrorTile errorMsg={errorMsg} setErrorMsg={setErrorMsg} className="mt-2.5" />

      <SkPaper gray className="mt-5">
        <Collapse in={props.address !== undefined}>
          <Delegations
            validators={props.validators}
            si={props.si}
            retrieveRewards={handleRetrieveRewards}
            loading={loading}
            setErrorMsg={setErrorMsg}
            errorMsg={errorMsg}
            unstake={handleUnstake}
            cancelRequest={handleCancelRequest}
            address={props.address}
            customAddress={props.customAddress}
            customRewardAddress={customRewardAddress}
            setCustomRewardAddress={setCustomRewardAddress}
            sklPrice={sklPrice}
          />
        </Collapse>
        <Collapse in={props.address === undefined}>
          <Headline
            text="Delegations"
            icon={<Inbox className="text-[17px]!" />}
            size="small"
          />
          <div className="mt-5 text-center">
            <ChartPie className="text-secondary-foreground w-full mb-2" />
            <h5 className="text-sm text-muted-foreground font-semibold mb-5 text-center">
              Connect your wallet to view delegations
            </h5>
          </div>
        </Collapse>
      </SkPaper>
    </Container>
  )
}
