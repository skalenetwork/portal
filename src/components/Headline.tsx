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
 * @file Headline.tsx
 * @copyright SKALE Labs 2024-Present
 */

import { cls, cmn, styles } from '@skalenetwork/metaport'
import { type ReactElement } from 'react'

export default function Headline(props: {
  icon: ReactElement | undefined
  text: string
  className?: string | undefined
}) {
  return (
    <div className={cls(cmn.m10, cmn.flex, cmn.flexg, cmn.flexcv, props.className)}>
      <div className={cls(cmn.mri10, cmn.flexcv, cmn.flex, styles.chainIconxs, cmn.pSec)}>
        {props.icon}
      </div>
      <p className={cls(cmn.p, cmn.p2, cmn.p700, cmn.flexg, cmn.cap)}>{props.text}</p>
    </div>
  )
}
