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
import debug from 'debug'
import { useEffect, useState } from 'react'
import {
  cmn,
  cls,
  styles,
  SkPaper,
  type MetaportCore,
  sendTransaction
} from '@skalenetwork/metaport'
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
import { initActionContract } from '../core/contracts'
import { BALANCE_UPDATE_INTERVAL_MS, DEFAULT_ERROR_MSG } from '../core/constants'
import ErrorTile from '../components/ErrorTile'
import ConnectWallet from '../components/ConnectWallet'
import Headline from '../components/Headline'
import Message from '../components/Message'
import { META_TAGS } from '../core/meta'
import SkPageInfoIcon from '../components/SkPageInfoIcon'

debug.enable('*')
const log = debug('portal:pages:Staking')

export default function Staking(props: {
  mpc: MetaportCore
  validators: types.staking.IValidator[]
  loadValidators: () => Promise<void>
  loadStakingInfo: () => Promise<void>
  sc: types.staking.ISkaleContractsMap | null
  si: types.staking.StakingInfoMap
  address: types.AddressType | undefined
  customAddress: types.AddressType | undefined
  getMainnetSigner: () => Promise<Signer>
  isXs: boolean
}) {
  const [loading, setLoading] = useState<
    types.staking.IRewardInfo | types.staking.IDelegationInfo | false
  >(false)
  const [errorMsg, setErrorMsg] = useState<string | undefined>()

  const [customRewardAddress, setCustomRewardAddress] = useState<types.AddressType | undefined>(
    props.address
  )

  useEffect(() => {
    props.loadValidators()
    props.loadStakingInfo()
    const intervalId = setInterval(() => {
      props.loadStakingInfo()
    }, BALANCE_UPDATE_INTERVAL_MS)
    log(`Updating staking info interval: ${Number(intervalId)}`)
    return () => {
      log(`Clearing interval: ${Number(intervalId)}`)
      clearInterval(intervalId) // Clear interval on component unmount
    }
  }, [props.address, props.sc])

  useEffect(() => {
    setCustomRewardAddress(props.address)
  }, [props.address])

  async function processTx(
    delegationType: types.staking.DelegationType,
    txName: string,
    txArgs: any[],
    contractType: types.staking.ContractType
  ) {
    if (props.sc === null || props.address === undefined) return
    log('processTx:', txName, txArgs, contractType, delegationType)
    try {
      const signer = await props.getMainnetSigner()
      const contract = await initActionContract(
        signer,
        delegationType,
        props.address,
        props.mpc.config.skaleNetwork,
        contractType
      )
      const res = await sendTransaction(contract[txName], txArgs)
      if (!res.status) {
        setErrorMsg(res.err?.name)
      } else {
        setErrorMsg(undefined)
        await props.loadStakingInfo()
      }
      setLoading(false)
    } catch (err: any) {
      console.error(err)
      setErrorMsg(err.message ? err.message : DEFAULT_ERROR_MSG)
      setLoading(false)
    }
  }

  async function retrieveRewards(rewardInfo: types.staking.IRewardInfo) {
    setLoading(rewardInfo)
    if (!isAddress(customRewardAddress)) {
      setErrorMsg('Invalid address')
      setLoading(false)
      return
    }
    processTx(
      rewardInfo.delegationType,
      'withdrawBounty',
      [rewardInfo.validatorId, customRewardAddress],
      'distributor'
    )
  }

  async function unstake(delegationInfo: types.staking.IDelegationInfo) {
    setLoading(delegationInfo)
    processTx(
      delegationInfo.delegationType,
      'requestUndelegation',
      [delegationInfo.delegationId],
      'delegation'
    )
  }

  async function cancelRequest(delegationInfo: types.staking.IDelegationInfo) {
    setLoading(delegationInfo)
    processTx(
      delegationInfo.delegationType,
      'cancelPendingDelegation',
      [delegationInfo.delegationId],
      'delegation'
    )
  }

  async function retrieveUnlocked(rewardInfo: types.staking.IRewardInfo): Promise<void> {
    setLoading(rewardInfo)
    processTx(rewardInfo.delegationType, 'retrieve', [], 'distributor')
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
            type={types.staking.DelegationType.REGULAR}
            accountInfo={props.si[0]?.info}
            loading={loading}
            retrieveUnlocked={retrieveUnlocked}
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
            type={types.staking.DelegationType.ESCROW}
            accountInfo={props.si[1]?.info}
            loading={loading}
            retrieveUnlocked={retrieveUnlocked}
            isXs={props.isXs}
            customAddress={props.customAddress}
          />
        </SkPaper>
      </Collapse>

      <Collapse in={props.si[2] !== null}>
        <SkPaper gray className={cls(cmn.mtop20)}>
          <Summary
            type={types.staking.DelegationType.ESCROW2}
            accountInfo={props.si[2]?.info}
            loading={loading}
            retrieveUnlocked={retrieveUnlocked}
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
            retrieveRewards={retrieveRewards}
            loading={loading}
            setErrorMsg={setErrorMsg}
            errorMsg={errorMsg}
            unstake={unstake}
            cancelRequest={cancelRequest}
            isXs={props.isXs}
            address={props.address}
            customAddress={props.customAddress}
            customRewardAddress={customRewardAddress}
            setCustomRewardAddress={setCustomRewardAddress}
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
