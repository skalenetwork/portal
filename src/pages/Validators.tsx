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
import { type MetaportCore } from '@skalenetwork/metaport'
import { types } from '@/core'

import Container from '@mui/material/Container'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'

import Validators from '../components/delegation/Validators'
import SkPageInfoIcon from '../components/SkPageInfoIcon'
import { META_TAGS } from '../core/meta'
import DelegationsNotification from '../components/delegation/DelegationsNotification'
import { UserCog } from 'lucide-react'

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
        <div className="grow">
          <h2 className="m-0 text-xl font-bold text-foreground">Validators</h2>
          <p className="text-xs text-secondary-foreground font-semibold">
            List of validators on SKALE Network
          </p>
        </div>
        <Link to="/validator">
          <Tooltip title="Validator Operations">
            <IconButton className="ml-1.5! rounded-full! bg-card! text-foreground! hover:bg-muted">
              <UserCog className="text-foreground" size={17} />
              <DelegationsNotification
                validatorDelegations={props.validatorDelegations}
                className="ml-1.5"
              />
            </IconButton>
          </Tooltip>
        </Link>
        <SkPageInfoIcon meta_tag={META_TAGS.validators} />
      </div>
      <div className="mt-5">
        <Validators
          mpc={props.mpc}
          validators={props.validators}
          validatorId={0}
          setValidatorId={(): void => {}}
          delegationType={types.st.DelegationType.REGULAR}
          size="lg"
          showButton={true}
        />
      </div>
    </Container>
  )
}
