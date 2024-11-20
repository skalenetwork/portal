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
 * @file Validator.tsx
 * @copyright SKALE Labs 2024-Present
 */

import { useCallback, useEffect, useMemo, useState } from 'react'
import { type Signer } from 'ethers'
import { types } from '@/core'

import Container from '@mui/material/Container'
import { cmn, cls, type MetaportCore, styles, SkPaper } from '@skalenetwork/metaport'

import { Collapse, Skeleton } from '@mui/material'

import CorporateFareRoundedIcon from '@mui/icons-material/CorporateFareRounded'
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded'
import AllInboxRoundedIcon from '@mui/icons-material/AllInboxRounded'

import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded'

import {
  StakingActionProps,
  unstakeDelegation,
  acceptDelegation,
  LoadingState
} from '../core/delegation/stakingActions'
import { sortDelegations, SortType } from '../core/delegation'
import { META_TAGS } from '../core/meta'
import { ITEMS_PER_PAGE } from '../core/constants'

import SkPageInfoIcon from '../components/SkPageInfoIcon'
import ValidatorInfo from '../components/delegation/ValidatorInfo'
import Headline from '../components/Headline'
import ConnectWallet from '../components/ConnectWallet'
import Delegation from '../components/delegation/Delegation'
import SortToggle from '../components/delegation/SortToggle'
import ShowMoreButton from '../components/delegation/ShowMoreButton'
import DelegationTotals from '../components/delegation/DelegationTotals'
import Message from '../components/Message'
import ErrorTile from '../components/ErrorTile'
import ChainRewards from '../components/delegation/ChainRewards'

export default function Validator(props: {
  mpc: MetaportCore
  sc: types.staking.ISkaleContractsMap | null
  address: types.AddressType | undefined
  customAddress: types.AddressType | undefined
  loadValidator: () => Promise<void>
  validator: types.staking.IValidator | null | undefined
  isXs: boolean
  delegations: types.staking.IDelegation[]
  getMainnetSigner: () => Promise<Signer>
}) {
  const [sortBy, setSortBy] = useState<SortType>('id')
  const [visibleItems, setVisibleItems] = useState(ITEMS_PER_PAGE)

  const [loading, setLoading] = useState<LoadingState>(false)
  const [errorMsg, setErrorMsg] = useState<string | undefined>()

  const getStakingActionProps = useCallback(
    (): StakingActionProps => ({
      sc: props.sc,
      address: props.address,
      skaleNetwork: props.mpc.config.skaleNetwork,
      getMainnetSigner: props.getMainnetSigner,
      setLoading,
      setErrorMsg,
      postAction: props.loadValidator
    }),
    [
      props.sc,
      props.address,
      props.mpc.config.skaleNetwork,
      props.getMainnetSigner,
      props.loadValidator
    ]
  )

  const sortedDelegations = useMemo(
    () => sortDelegations(props.delegations || [], sortBy),
    [props.delegations, sortBy]
  )

  const visibleDelegations = useMemo(
    () => sortedDelegations.slice(0, visibleItems),
    [sortedDelegations, visibleItems]
  )

  const remainingItems = Math.max(0, sortedDelegations.length - visibleItems)

  useEffect(() => {
    if (props.sc !== null) {
      props.loadValidator()
    }
  }, [props.sc, props.address, props.customAddress])

  useEffect(() => {
    setVisibleItems(ITEMS_PER_PAGE)
  }, [sortBy])

  const handleShowMore = () => {
    setVisibleItems((prevVisible) => prevVisible + ITEMS_PER_PAGE)
  }

  async function handleUnstake(delegationInfo: types.staking.IDelegationInfo) {
    await unstakeDelegation({
      delegationInfo,
      props: getStakingActionProps()
    })
  }

  async function handleAccept(delegationInfo: types.staking.IDelegationInfo) {
    await acceptDelegation({
      delegationInfo,
      props: getStakingActionProps()
    })
  }

  const renderDelegationsContent = () => {
    if (props.delegations === null) {
      return (
        <div>
          <Skeleton variant="rectangular" height={84} className={cls(cmn.mbott10)} />
          <Skeleton variant="rectangular" height={84} className={cls(cmn.mbott10)} />
          <Skeleton variant="rectangular" height={84} className={cls(cmn.mbott10)} />
        </div>
      )
    }
    return (
      <>
        {visibleDelegations.map((delegation: types.staking.IDelegation) => (
          <Delegation
            key={delegation.id.toString()}
            delegation={delegation}
            validator={props.validator!}
            delegationType={types.staking.DelegationType.REGULAR}
            loading={loading}
            isXs={props.isXs}
            customAddress={props.customAddress}
            unstake={handleUnstake}
            accept={handleAccept}
            isValidatorPage
          />
        ))}
        {remainingItems > 0 && (
          <div className={cls(cmn.flex, cmn.flexcv)}>
            <div className={cls(cmn.flexg)}></div>
            <ShowMoreButton
              onClick={handleShowMore}
              remainingItems={remainingItems}
              loading={props.delegations === undefined}
            />
            <div className={cls(cmn.flexg)}></div>
          </div>
        )}
      </>
    )
  }

  return (
    <Container maxWidth="md">
      <div className={cls(cmn.flex, cmn.flexcv)}>
        <div className={cmn.flexg}>
          <h2 className={cls(cmn.nom)}>Manage Validator</h2>
          <p className={cls(cmn.nom, cmn.p, cmn.p3, cmn.pSec)}>{META_TAGS.validator.description}</p>
        </div>
        <SkPageInfoIcon meta_tag={META_TAGS.validator} />
      </div>
      {props.customAddress !== undefined ? (
        <Message
          className={cls(cmn.mtop20)}
          text={props.isXs ? 'Preview mode, ' : 'Previewing validator page in read-only mode, '}
          icon={<VisibilityRoundedIcon />}
          link="/validator"
          linkText="click to exit"
          type="warning"
        />
      ) : null}
      <SkPaper gray className={cls(cmn.mtop20)}>
        <Headline
          text="Validator Summary"
          icon={<CorporateFareRoundedIcon className={cls(styles.chainIconxs)} />}
          size="small"
          className={cls(cmn.mbott20)}
        />
        <Collapse in={props.address === undefined && props.customAddress === undefined}>
          <ConnectWallet tile className={cls(cmn.flexg)} />
        </Collapse>
        {props.address || props.customAddress ? (
          props.validator !== undefined ? (
            <div>
              <ValidatorInfo validator={props.validator} />
              <DelegationTotals delegations={props.delegations} className={cls(cmn.mtop10)} />
            </div>
          ) : (
            <div>
              <PeopleRoundedIcon
                className={cls(cmn.pSec, styles.chainIconlg, cmn.fullWidth, cmn.mtop20)}
              />
              <h3 className={cls(cmn.p, cmn.p700, cmn.pSec, cmn.pCent, cmn.mbott20)}>
                Validator doesn't exist
              </h3>
            </div>
          )
        ) : (
          <div></div>
        )}
      </SkPaper>
      {props.validator && (
        <ChainRewards
          mpc={props.mpc}
          validator={props.validator}
          address={props.address}
          customAddress={props.customAddress}
          className={cmn.mtop20}
          isXs={props.isXs}
        />
      )}
      <ErrorTile errorMsg={errorMsg} setErrorMsg={setErrorMsg} className={cls(cmn.mtop20)} />
      {props.validator && (
        <SkPaper gray className={cls(cmn.mtop20)}>
          <div>
            <div className={cls(cmn.flex, cmn.flexcv, cmn.mbott10)}>
              <Headline
                size="small"
                text={
                  'Delegations ' +
                  (props.delegations === null ? '' : `(${props.delegations.length})`)
                }
                icon={<AllInboxRoundedIcon className={cls(styles.chainIconxs)} />}
                className={cls(cmn.flexg)}
              />
              <SortToggle onChange={setSortBy} className={cls(cmn.mri5)} />
            </div>
            {renderDelegationsContent()}
          </div>
        </SkPaper>
      )}
    </Container>
  )
}
