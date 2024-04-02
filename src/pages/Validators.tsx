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
 * @file Validators.tsx
 * @copyright SKALE Labs 2024-Present
 */

import { useEffect } from 'react'

import Container from '@mui/material/Container'
import { cmn, cls, type MetaportCore } from '@skalenetwork/metaport'

import Validators from '../components/delegation/Validators'

import { DelegationType, type ISkaleContractsMap, type IValidator } from '../core/interfaces'

export default function ValidatorsPage(props: {
  mpc: MetaportCore
  validators: IValidator[]
  sc: ISkaleContractsMap | null
  loadValidators: () => void
}) {
  useEffect(() => {
    if (props.sc !== null) {
      props.loadValidators()
    }
  }, [props.sc])

  return (
    <Container maxWidth="md">
      <div className={cls(cmn.flex)}>
        <h2 className={cls(cmn.nom)}>Validators</h2>
      </div>
      <p className={cls(cmn.nom, cmn.p, cmn.p3, cmn.pSec)}>List of validators on SKALE Network</p>
      <div className={cls(cmn.mtop20)}>
        <Validators
          mpc={props.mpc}
          validators={props.validators}
          validatorId={0}
          setValidatorId={(): void => {}}
          delegationType={DelegationType.REGULAR}
          size="lg"
        />
      </div>
    </Container>
  )
}
