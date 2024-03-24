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
 * @file AccordionLink.tsx
 * @copyright SKALE Labs 2023-Present
 */

import { ReactElement } from 'react'

import ButtonBase from '@mui/material/ButtonBase'
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded'

import { cmn, cls, styles } from '@skalenetwork/metaport'
import { Link } from 'react-router-dom'

export default function AccordionLink(props: {
  title: string
  url: string
  icon?: ReactElement
  className?: string
}) {
  return (
    <div className={props.className}>
      <Link to={props.url} className={cls(cmn.pPrim)}>
        <ButtonBase className={cls(cmn.fullWidth, cmn.flex, cmn.pleft, cmn.bordRad)}>
          <div className={cls(cmn.m10, cmn.flex, cmn.flexg, cmn.flexcv)}>
            {props.icon ? (
              <div className={cls(cmn.mri10, cmn.flexcv, cmn.flex, styles.chainIconxs, cmn.pSec)}>
                {props.icon}
              </div>
            ) : null}
            <p className={cls(cmn.p, cmn.p2, cmn.p700, cmn.flexg)}>{props.title}</p>
            <AddCircleRoundedIcon className={cls(cmn.mri5, styles.chainIconxs, cmn.pSec)} />
          </div>
        </ButtonBase>
      </Link>
    </div>
  )
}
