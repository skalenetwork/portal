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
import { type MetaportCore, SkPaper, contracts } from '@skalenetwork/metaport'

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
  sc: types.st.ISkaleContractsMap | null
  address: types.AddressType | undefined
  customAddress: types.AddressType | undefined
  loadValidator: () => Promise<void>
  validator: types.st.IValidator | null | undefined
  isXs: boolean
  delegations: types.st.IDelegation[] | null
  getMainnetSigner: () => Promise<Signer>
  chainsMeta: types.ChainsMetadataMap
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
    setVisibleItems(ITEMS_PER_PAGE)
  }, [sortBy])

  const handleShowMore = () => {
    setVisibleItems((prevVisible) => prevVisible + ITEMS_PER_PAGE)
  }
  const [sklPrice, setSklPrice] = useState<bigint | undefined>(undefined)

  useEffect(() => {
    loadSklPrice()
  }, [])

  async function handleUnstake(delegationInfo: types.st.IDelegationInfo) {
    await unstakeDelegation({
      delegationInfo,
      props: getStakingActionProps()
    })
  }

  async function loadSklPrice() {
    const paymaster = await contracts.paymaster.getPaymaster(props.mpc)
    const price = await paymaster.oneSklPrice()
    setSklPrice(price)
  }

  async function handleAccept(delegationInfo: types.st.IDelegationInfo) {
    await acceptDelegation({
      delegationInfo,
      props: getStakingActionProps()
    })
  }

  const renderDelegationsContent = () => {
    if (props.delegations === null) {
      return (
        <div>
          <Skeleton variant="rectangular" height={84} className="mb-2.5" />
          <Skeleton variant="rectangular" height={84} className="mb-2.5" />
          <Skeleton variant="rectangular" height={84} className="mb-2.5" />
        </div>
      )
    }
    return (
      <>
        {visibleDelegations.map((delegation: types.st.IDelegation) => (
          <Delegation
            key={delegation.id.toString()}
            delegation={delegation}
            validator={props.validator!}
            delegationType={types.st.DelegationType.REGULAR}
            loading={loading}
            isXs={props.isXs}
            customAddress={props.customAddress}
            unstake={handleUnstake}
            accept={handleAccept}
            isValidatorPage
            sklPrice={sklPrice}
          />
        ))}
        {remainingItems > 0 && (
          <div className="flex items-center">
            <div className="flex-grow"></div>
            <ShowMoreButton
              onClick={handleShowMore}
              remainingItems={remainingItems}
              loading={props.delegations === undefined}
            />
            <div className="flex-grow"></div>
          </div>
        )}
      </>
    )
  }

  return (
    <Container maxWidth="md">
      <div className="flex items-center">
        <div className="flex-grow">
          <h2 className="m-0">Validator Operations</h2>
          <p className="text-sm text-secondary-foreground">{META_TAGS.validator.description}</p>
        </div>
        <SkPageInfoIcon meta_tag={META_TAGS.validator} />
      </div>
      {props.customAddress !== undefined ? (
        <Message
          className="mt-5"
          text={props.isXs ? 'Preview mode, ' : 'Previewing validator page in read-only mode, '}
          icon={<VisibilityRoundedIcon />}
          link="/validator"
          linkText="click to exit"
          type="warning"
        />
      ) : null}
      <SkPaper gray className="mt-5">
        <Headline
          text="Validator Summary"
          icon={<CorporateFareRoundedIcon className="styles.chainIconxs" />}
          size="small"
          className="mb-5"
        />
        <Collapse in={props.address === undefined && props.customAddress === undefined}>
          <ConnectWallet tile className="flex-grow" />
        </Collapse>
        {props.address || props.customAddress ? (
          props.validator !== undefined ? (
            <div>
              <ValidatorInfo validator={props.validator} sklPrice={sklPrice} />
              <DelegationTotals
                delegations={props.delegations}
                sklPrice={sklPrice}
                className="mt-2.5"
              />
            </div>
          ) : (
            <div>
              <PeopleRoundedIcon className="text-secondary-foreground styles.chainIconlg w-full mt-5" />
              <h3 className="font-bold text-secondary-foreground text-center mb-5">
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
          className="mt-5"
          isXs={props.isXs}
          chainsMeta={props.chainsMeta}
        />
      )}
      <ErrorTile errorMsg={errorMsg} setErrorMsg={setErrorMsg} className="mt-5" />
      {props.validator && (
        <SkPaper gray className="mt-5">
          <div>
            <div className="flex items-center mb-2.5">
              <Headline
                size="small"
                text={
                  'Delegations ' +
                  (props.delegations === null ? '' : `(${props.delegations.length})`)
                }
                icon={<AllInboxRoundedIcon className="styles.chainIconxs" />}
                className="flex-grow"
              />
              <SortToggle onChange={setSortBy} className="mr-1.25" />
            </div>
            {renderDelegationsContent()}
          </div>
        </SkPaper>
      )}
    </Container>
  )
}
