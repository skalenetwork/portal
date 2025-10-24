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
import { Link } from 'react-router-dom'
import { cmn, cls, type MetaportCore } from '@skalenetwork/metaport'
import { types } from '@/core'

import { Button } from '@mui/material'
import Container from '@mui/material/Container'
import ManageAccountsRoundedIcon from '@mui/icons-material/ManageAccountsRounded'

import Validators from '../components/delegation/Validators'
import SkPageInfoIcon from '../components/SkPageInfoIcon'
import { META_TAGS } from '../core/meta'
import DelegationsNotification from '../components/delegation/DelegationsNotification'

export default function ValidatorsPage(props: {
  mpc: MetaportCore
  validators: types.st.IValidator[]
  sc: types.st.ISkaleContractsMap | null
  loadValidators: () => void
  validatorDelegations: types.st.IDelegation[] | null
}) {
  useEffect(() => {
    if (props.sc !== null) {
      props.loadValidators()
    }
  }, [props.sc])

  return (
    <Container maxWidth="md">
      <div className="flex items-center">
        <div className="flex-grow">
          <h2 className={cls(cmn.nom)}>Validators</h2>
          <p className={cls(cmn.nom, cmn.p, text-sm, cmn.pSec)}>
            List of validators on SKALE Network
          </p>
        </div>
        <Link to="/validator">
          <Button
            size="small"
            variant="contained"
            className={cls('btnMd', cmn.mri10)}
            startIcon={<ManageAccountsRoundedIcon />}
            endIcon={<DelegationsNotification validatorDelegations={props.validatorDelegations} />}
          >
            Validator Operations
          </Button>
        </Link>
        <SkPageInfoIcon meta_tag={META_TAGS.validators} />
      </div>
      <div className={cls(cmn.mtop20)}>
        <Validators
          mpc={props.mpc}
          validators={props.validators}
          validatorId={0}
          setValidatorId={(): void => {}}
          delegationType={types.st.DelegationType.REGULAR}
          size="lg"
        />
      </div>
    </Container>
  )
}
