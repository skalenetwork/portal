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
import { cmn, cls, type MetaportCore, SkPaper } from '@skalenetwork/metaport'
import { types } from '@/core'

import Container from '@mui/material/Container'
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded'
import PersonSearchRoundedIcon from '@mui/icons-material/PersonSearchRounded'

import Validators from '../components/delegation/Validators'
import DelegationTypeSelect from '../components/delegation/DelegationTypeSelect'
import Breadcrumbs from '../components/Breadcrumbs'
import { compareEnum } from '../core/helper'
import SkStack from '../components/SkStack'

export default function StakeValidator(props: {
  mpc: MetaportCore
  validators: types.staking.IValidator[]
  loadValidators: () => void
  loadStakingInfo: () => void
  sc: types.staking.ISkaleContractsMap | null
  si: types.staking.StakingInfoMap
}) {
  const [delegationType, setDelegationType] = useState<types.staking.DelegationType>(
    types.staking.DelegationType.REGULAR
  )
  const [validatorId, setValidatorId] = useState<number>()

  const handleChange = (event: any) => {
    setDelegationType(event.target.value)
  }

  useEffect(() => {
    if (props.sc) {
      props.loadValidators()
      props.loadStakingInfo()
    }
  }, [props.sc])

  return (
    <Container maxWidth="md">
      <SkPaper gray className={cls(cmn.mtop10, 'chainDetails')}>
        <SkStack>
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
                  icon: <PersonSearchRoundedIcon />
                }
              ]}
            />
          </div>
          <div className={cls(cmn.flex)}>
            <DelegationTypeSelect
              delegationType={delegationType}
              handleChange={handleChange}
              si={props.si}
            />
          </div>
        </SkStack>
        <div className={cls(cmn.mtop10, cmn.mleft5, cmn.mbott10)} style={{ paddingBottom: '5px' }}>
          <h2 className={cls(cmn.nom)}>Stake SKL</h2>
          <p className={cls(cmn.p, cmn.p3, cmn.pSec)}>Choose a validator to delegate your SKL</p>
        </div>
        <Validators
          mpc={props.mpc}
          validators={props.validators}
          validatorId={validatorId}
          setValidatorId={setValidatorId}
          internal={!compareEnum(delegationType, types.staking.DelegationType.REGULAR)}
          delegationType={delegationType}
        />
      </SkPaper>
    </Container>
  )
}
