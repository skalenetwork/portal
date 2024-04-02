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
 * @file Stake.tsx
 * @copyright SKALE Labs 2024-Present
 */

import { useState, useEffect } from 'react'
import { type Signer } from 'ethers'
import { useParams } from 'react-router-dom'
import { cmn, cls, type MetaportCore, SkPaper, type interfaces } from '@skalenetwork/metaport'

import Container from '@mui/material/Container'
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded'
import PersonSearchRoundedIcon from '@mui/icons-material/PersonSearchRounded'
import SavingsRoundedIcon from '@mui/icons-material/SavingsRounded'
import MonetizationOnRoundedIcon from '@mui/icons-material/MonetizationOnRounded'

import Loader from '../components/Loader'

import ValidatorInfo from '../components/delegation/ValidatorInfo'
import Delegate from '../components/delegation/Delegate'
import Breadcrumbs from '../components/Breadcrumbs'
import ConnectWallet from '../components/ConnectWallet'

import {
  DelegationType,
  type ISkaleContractsMap,
  type IValidator,
  type StakingInfoMap
} from '../core/interfaces'

import ErrorTile from '../components/ErrorTile'
import Headline from '../components/Headline'
import { isDelegationTypeAvailable, isLoaded } from '../core/delegation/staking'
import { getDelegationTypeAlias } from '../core/delegation'

export default function StakeAmount(props: {
  mpc: MetaportCore
  validators: IValidator[]
  loadValidators: () => void
  loadStakingInfo: () => void
  sc: ISkaleContractsMap | null
  si: StakingInfoMap
  address: interfaces.AddressType | undefined
  getMainnetSigner: () => Promise<Signer>
}) {
  const { id, delType } = useParams()
  const validatorId = Number(id) ?? -1
  const delegationType = Number(delType) ?? DelegationType.REGULAR

  const [currentValidator, setCurrentValidator] = useState<IValidator | undefined>(undefined)
  const [errorMsg, setErrorMsg] = useState<string | undefined>()

  const loaded = isLoaded(props.si)
  const available = isDelegationTypeAvailable(props.si, delegationType)

  useEffect(() => {
    updateCurrentValidator()
  }, [])

  useEffect(() => {
    if (props.sc) {
      props.loadValidators()
      props.loadStakingInfo()
    }
  }, [props.sc])

  useEffect(() => {
    props.loadStakingInfo()
  }, [props.address])

  useEffect(() => {
    updateCurrentValidator()
  }, [props.validators])

  function updateCurrentValidator() {
    if (props.validators.length !== 0 && props.validators[validatorId - 1]) {
      setCurrentValidator(props.validators.find((validator) => validator.id === validatorId))
    }
  }

  if (validatorId === -1) {
    return <ErrorTile errorMsg="Validator ID is not found" setErrorMsg={setErrorMsg} />
  }

  // if (!currentValidator) {
  //   return <Loader text="Loading validator info" />
  // }

  // if (loaded && !available) {
  //   return <div>
  //     <Container maxWidth="md">
  //       <ErrorTile errorMsg="Delegation type is not available" setErrorMsg={setErrorMsg} />
  //     </Container>
  //   </div>
  // }

  return (
    <Container maxWidth="md">
      <SkPaper gray className={cls(cmn.mtop10, 'chainDetails')}>
        <div className={cls(cmn.flex, cmn.flexcv)}>
          <div className={cls(cmn.flex, cmn.flexg)}>
            <Breadcrumbs
              sections={[
                {
                  text: 'Staking',
                  icon: <ArrowBackIosNewRoundedIcon />,
                  url: '/staking'
                },
                {
                  text: 'Choose a validator',
                  icon: <PersonSearchRoundedIcon />,
                  url: '/staking/new'
                },
                {
                  text: 'Stake SKL',
                  icon: <SavingsRoundedIcon />
                }
              ]}
            />
          </div>
          {loaded && available ? (
            <div className="titleBadge" style={{ padding: '10px 15px' }}>
              <p className={cls(cmn.p, cmn.p4)}>{getDelegationTypeAlias(delegationType)} delegation</p>
            </div>
          ) : null}
        </div>
        <div className={cls(cmn.mtop10, cmn.mleft5, cmn.mbott10)} style={{ paddingBottom: '5px' }}>
          <h2 className={cls(cmn.nom)}>Stake SKL</h2>
          <p className={cls(cmn.p, cmn.p3, cmn.pSec)}>
            Review validator info and enter delegation amount
          </p>
        </div>
        {currentValidator ? (
          <ValidatorInfo validator={currentValidator} className={cls(cmn.mtop10)} />
        ) : (
          <Loader text="Loading validator info" />
        )}

        <Headline text="Staking details" icon={<MonetizationOnRoundedIcon />} />
        {props.address ? (
          <Delegate
            mpc={props.mpc}
            validator={currentValidator}
            address={props.address}
            si={props.si}
            delegationType={delegationType}
            errorMsg={errorMsg}
            setErrorMsg={setErrorMsg}
            loaded={loaded}
            delegationTypeAvailable={available}
            getMainnetSigner={props.getMainnetSigner}
          />
        ) : (
          <ConnectWallet tile className={cls(cmn.flexg)} />
        )}

        {/* {!address ? (
          <ConnectWallet tile className={cls(cmn.flexg)} />
        ) : currentValidator && loaded ? (
          <Delegate validator={currentValidator} />
        ) : (
          <Loader text="Loading staking info" />
        )} */}
      </SkPaper>
    </Container>
  )
}
