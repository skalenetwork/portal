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
import { type MetaportCore, SkPaper } from '@skalenetwork/metaport'
import { types } from '@/core'

import Container from '@mui/material/Container'

import Validators from '../components/delegation/Validators'
import DelegationTypeSelect from '../components/delegation/DelegationTypeSelect'
import Breadcrumbs from '../components/Breadcrumbs'
import SkStack from '../components/SkStack'
import { ChevronLeft, UserRoundSearch } from 'lucide-react'

export default function StakeValidator(props: {
  mpc: MetaportCore
  validators: types.st.IValidator[]
  loadValidators: () => void
  loadStakingInfo: () => void
  sc: types.st.ISkaleContractsMap | null
  si: types.st.StakingInfoMap
}) {
  const [delegationType, setDelegationType] = useState<types.st.DelegationType>(
    types.st.DelegationType.REGULAR
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

  function compareEnum(enumValue1: any, enumValue2: any): boolean {
    return Number(enumValue1) === Number(enumValue2)
  }

  return (
    <Container maxWidth="md">
        <SkStack>
          <div className="flex grow">
            <Breadcrumbs
              sections={[
                {
                  text: 'Staking',
                  icon: <ChevronLeft size={14} className="text-foreground" />,
                  url: '/staking'
                },
                {
                  text: 'Choose a validator',
                  icon: <UserRoundSearch size={14} />
                }
              ]}
            />
          </div>
          <div className="flex">
            <DelegationTypeSelect
              delegationType={delegationType}
              handleChange={handleChange}
              si={props.si}
            />
          </div>
        </SkStack>
            <SkPaper gray className="mt-2.5 chainDetails">
        <div className="mt-2.5 ml-1.25 mb-2.5" style={{ paddingBottom: '5px' }}>
          <h2 className="m-0 text-xl font-bold text-foreground">Stake SKL</h2>
          <p className="text-xs text-secondary-foreground font-semibold">
            Choose a validator to delegate your SKL
          </p>
        </div>
        <Validators
          mpc={props.mpc}
          validators={props.validators}
          validatorId={validatorId}
          setValidatorId={setValidatorId}
          internal={!compareEnum(delegationType, types.st.DelegationType.REGULAR)}
          delegationType={delegationType}
        />
      </SkPaper>
    </Container>
  )
}
