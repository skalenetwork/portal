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
 * @file PageCard.tsx
 * @copyright SKALE Labs 2022-Present
 */

import { Link } from 'react-router-dom'
import { cmn, cls } from '@skalenetwork/metaport'

export default function PageCard(props: { name: string; icon: any; description: string }) {
  return (
    <div>
      <div className="fl-centered">
        <Link to={props.name}>
          <div className={cls('br__tile pageCard startCardBg ' + `startCard${props.name}`)}>
            <div className="startCardText">
              <div className={cls(cmn.flex, cmn.flexg, cmn.flexcv)}>
                <div className={cls(cmn.mri5, cmn.flex, cmn.flexcv)}>{props.icon}</div>
                <p
                  className={cls(cmn.cap, cmn.nom, cmn.pPrim, cmn.p)}
                  style={{ fontSize: '1.5rem', fontWeight: 700 }}
                >
                  {props.name}
                </p>
              </div>
              <p className={cls(cmn.p, cmn.p3, cmn.pSec)}>{props.description}</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}
