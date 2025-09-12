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
import { cmn, cls, styles, SkPaper, contracts, type MetaportCore } from '@skalenetwork/metaport'
import { types } from '@/core'

import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'

import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded'
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded'
import AllInboxRoundedIcon from '@mui/icons-material/AllInboxRounded'
import QueueRoundedIcon from '@mui/icons-material/QueueRounded'
import PieChartRoundedIcon from '@mui/icons-material/PieChartRounded'
import WarningRoundedIcon from '@mui/icons-material/WarningRounded'

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
  isXs: boolean
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
        <div className={cls(cmn.flex, cmn.flexcv)}>
          <div className={cls(cmn.flexg)}>
            <h2 className={cls(cmn.nom)}>Staking</h2>
            <p className={cls(cmn.nom, cmn.p, cmn.p3, cmn.pSec)}>
              {props.isXs
                ? 'Manage your delegations'
                : 'Delegate, review delegations and withdraw staking rewards'}
            </p>
          </div>
          <div className={cls(cmn.mri10)}>
            {loading !== false || props.customAddress !== undefined ? (
              <Button
                variant="contained"
                className="btnMd"
                startIcon={<QueueRoundedIcon />}
                disabled={loading !== false || props.customAddress !== undefined}
              >
                Stake SKL
              </Button>
            ) : (
              <Link to="/staking/new">
                <Button
                  variant="contained"
                  className="btnMd"
                  startIcon={<QueueRoundedIcon />}
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
          className={cls(cmn.mtop20)}
          text={props.isXs ? 'Preview mode, ' : 'Previewing staking page in read-only mode, '}
          icon={<VisibilityRoundedIcon />}
          link="/staking"
          linkText="click to exit"
          type="warning"
        />
      ) : null}

      {props.address !== customRewardAddress ? (
        <Message
          className={cls(cmn.mtop20)}
          text={`Custom address will be used for rewards withdrawal: ${customRewardAddress}`}
          icon={<WarningRoundedIcon />}
          type="warning"
          closable={false}
        />
      ) : null}

      <SkPaper gray className={cls(cmn.mtop20)}>
        <Collapse in={props.address !== undefined}>
          <Summary
            sklPrice={sklPrice}
            type={types.st.DelegationType.REGULAR}
            accountInfo={props.si[0]?.info}
            loading={loading}
            retrieveUnlocked={handleRetrieveUnlocked}
            isXs={props.isXs}
            customAddress={props.customAddress}
          />
        </Collapse>
        <Collapse in={props.address === undefined}>
          <Headline
            text="Account info"
            icon={<AccountCircleRoundedIcon className={cls(styles.chainIconxs)} />}
            size="small"
          />
          <ConnectWallet tile className={cls(cmn.flexg, cmn.mtop10)} />
        </Collapse>
      </SkPaper>
      <Collapse in={props.si[1] !== null}>
        <SkPaper gray className={cls(cmn.mtop20)}>
          <Summary
            sklPrice={sklPrice}
            type={types.st.DelegationType.ESCROW}
            accountInfo={props.si[1]?.info}
            loading={loading}
            retrieveUnlocked={handleRetrieveUnlocked}
            isXs={props.isXs}
            customAddress={props.customAddress}
          />
        </SkPaper>
      </Collapse>
      <Collapse in={props.si[2] !== null}>
        <SkPaper gray className={cls(cmn.mtop20)}>
          <Summary
            sklPrice={sklPrice}
            type={types.st.DelegationType.ESCROW2}
            accountInfo={props.si[2]?.info}
            loading={loading}
            retrieveUnlocked={handleRetrieveUnlocked}
            isXs={props.isXs}
            customAddress={props.customAddress}
          />
        </SkPaper>
      </Collapse>

      <ErrorTile errorMsg={errorMsg} setErrorMsg={setErrorMsg} className={cls(cmn.mtop20)} />

      <SkPaper gray className={cls(cmn.mtop20)}>
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
            isXs={props.isXs}
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
            icon={<AllInboxRoundedIcon className={cls(styles.chainIconxs)} />}
            size="small"
          />
          <div className={cls(cmn.mtop20)}>
            <PieChartRoundedIcon className={cls(cmn.pSec, styles.chainIconmd, cmn.fullWidth)} />
            <h5 className={cls(cmn.p, cmn.p600, cmn.pSec, cmn.pCent, cmn.mtop5, cmn.mbott20)}>
              Connect your wallet to view delegations
            </h5>
          </div>
        </Collapse>
      </SkPaper>
    </Container>
  )
}
