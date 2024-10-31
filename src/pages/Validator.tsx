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

import { useEffect } from 'react'

import Container from '@mui/material/Container'
import { cmn, cls, type MetaportCore } from '@skalenetwork/metaport'


import { type ISkaleContractsMap, type IValidator } from '../core/interfaces'
import SkPageInfoIcon from '../components/SkPageInfoIcon'
import { META_TAGS } from '../core/meta'

export default function Validator(props: {
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
      <div className={cls(cmn.flex, cmn.flexcv)}>
        <div className={cmn.flexg}>
          <h2 className={cls(cmn.nom)}>Manage Validator</h2>
          <p className={cls(cmn.nom, cmn.p, cmn.p3, cmn.pSec)}>
            {META_TAGS.validator.description}
          </p>
        </div>
        <SkPageInfoIcon meta_tag={META_TAGS.validator} />
      </div>
      <div className={cls(cmn.mtop20)}>
      </div>
    </Container>
  )
}
