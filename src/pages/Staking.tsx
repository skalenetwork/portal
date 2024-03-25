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

import { Link } from 'react-router-dom'
import { type Signer } from 'ethers'
import debug from 'debug'
import { useEffect, useState } from 'react'
import {
  cmn,
  cls,
  styles,
  SkPaper,
  type MetaportCore,
  type interfaces,
  sendTransaction
} from '@skalenetwork/metaport'

import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'

import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded'
import AllInboxRoundedIcon from '@mui/icons-material/AllInboxRounded'
import QueueRoundedIcon from '@mui/icons-material/QueueRounded'
import PieChartRoundedIcon from '@mui/icons-material/PieChartRounded'

import Delegations from '../components/delegation/Delegations'

import {
  type ISkaleContractsMap,
  type IValidator,
  DelegationType,
  type StakingInfoMap,
  type IRewardInfo,
  type IDelegationInfo,
  type ContractType
} from '../core/interfaces'

import Summary from '../components/delegation/Summary'
import { Collapse } from '@mui/material'
import { initActionContract } from '../core/contracts'
import { BALANCE_UPDATE_INTERVAL_MS, DEFAULT_ERROR_MSG } from '../core/constants'
import ErrorTile from '../components/ErrorTile'
import ConnectWallet from '../components/ConnectWallet'
import Headline from '../components/Headline'

debug.enable('*')
const log = debug('portal:pages:Staking')

export default function Staking(props: {
  mpc: MetaportCore
  validators: IValidator[]
  loadValidators: () => void
  loadStakingInfo: () => void
  sc: ISkaleContractsMap | null
  si: StakingInfoMap
  address: interfaces.AddressType | undefined
  getMainnetSigner: () => Promise<Signer>
  isXs: boolean
}) {
  const [loading, setLoading] = useState<IRewardInfo | IDelegationInfo | false>(false)
  const [errorMsg, setErrorMsg] = useState<string | undefined>()

  useEffect(() => {
    props.loadValidators()
    props.loadStakingInfo()
    const intervalId = setInterval(() => {
      props.loadStakingInfo()
    }, BALANCE_UPDATE_INTERVAL_MS)
    log(`Updating staking info interval: ${intervalId}`)
    return () => {
      log(`Clearing interval: ${intervalId}`)
      clearInterval(intervalId) // Clear interval on component unmount
    }
  }, [props.address, props.sc])

  async function processTx(
    delegationType: DelegationType,
    txName: string,
    txArgs: any[],
    contractType: ContractType
  ) {
    if (!props.sc || !props.address) return
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

  async function retrieveRewards(rewardInfo: IRewardInfo) {
    setLoading(rewardInfo)
    processTx(
      rewardInfo.delegationType,
      'withdrawBounty',
      [rewardInfo.validatorId, props.address],
      'distributor'
    )
  }

  async function unstake(delegationInfo: IDelegationInfo) {
    setLoading(delegationInfo)
    processTx(
      delegationInfo.delegationType,
      'requestUndelegation',
      [delegationInfo.delegationId],
      'delegation'
    )
  }

  async function cancelRequest(delegationInfo: IDelegationInfo) {
    setLoading(delegationInfo)
    processTx(
      delegationInfo.delegationType,
      'cancelPendingDelegation',
      [delegationInfo.delegationId],
      'delegation'
    )
  }

  async function retrieveUnlocked(rewardInfo: IRewardInfo): Promise<void> {
    setLoading(rewardInfo)
    processTx(rewardInfo.delegationType, 'retrieve', [], 'distributor')
  }

  return (
    <Container maxWidth="md">
      <Stack spacing={0}>
        <div className={cls(cmn.flex, cmn.flexcv)}>
          <div className={cls(cmn.flexg)}>
            <h2 className={cls(cmn.nom)}>Staking</h2>
            <p className={cls(cmn.nom, cmn.p, cmn.p3, cmn.pSec)}>
              Delegate, review delegations and withdraw staking rewards
            </p>
          </div>
          <div>
            <Link to="/staking/new">
              <Button
                variant="contained"
                className={cls('btnMd', cmn.mtop10)}
                startIcon={<QueueRoundedIcon />}
                disabled={loading !== false}
              >
                Stake SKL
              </Button>
            </Link>
          </div>
        </div>
      </Stack>

      <SkPaper gray className={cls(cmn.mtop20)}>
        <Collapse in={props.address !== undefined}>
          <Summary
            type={DelegationType.REGULAR}
            accountInfo={props.si[0]?.info}
            loading={loading}
            retrieveUnlocked={retrieveUnlocked}
            isXs={props.isXs}
          />
        </Collapse>
        <Collapse in={props.address === undefined}>
          <Headline text="Account info" icon={<AccountCircleRoundedIcon />} />
          <ConnectWallet tile className={cls(cmn.flexg, cmn.mtop10)} />
        </Collapse>
      </SkPaper>

      <Collapse in={props.si[1] !== null}>
        <SkPaper gray className={cls(cmn.mtop20)}>
          <Summary
            type={DelegationType.ESCROW}
            accountInfo={props.si[1]?.info}
            loading={loading}
            retrieveUnlocked={retrieveUnlocked}
            isXs={props.isXs}
          />
        </SkPaper>
      </Collapse>

      <Collapse in={props.si[2] !== null}>
        <SkPaper gray className={cls(cmn.mtop20)}>
          <Summary
            type={DelegationType.ESCROW2}
            accountInfo={props.si[2]?.info}
            loading={loading}
            retrieveUnlocked={retrieveUnlocked}
            isXs={props.isXs}
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
          />
        </Collapse>
        <Collapse in={props.address === undefined}>
          <Headline text="Delegations" icon={<AllInboxRoundedIcon />} />
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
