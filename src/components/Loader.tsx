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
 * @file Loader.tsx
 * @copyright SKALE Labs 2023-Present
 */

import { cmn, cls } from '@skalenetwork/metaport'
import CircularProgress from '@mui/material/CircularProgress'

export default function Loader(props: { text: string }) {
  return (
    <div className={cls(cmn.flex, cmn.mtop20, cmn.mbott20)}>
      <div className={cls(cmn.flexg)}></div>
      <div className={cls(cmn.flex, cmn.flexcv, cmn.mri20)}>
        <CircularProgress className="fullscreen-spin" />
      </div>
      <div className={cls(cmn.flex, cmn.flexcv)}>
        <h3 className="fullscreen-msg-text">{props.text}</h3>
      </div>
      <div className={cls(cmn.flexg)}></div>
    </div>
  )
}
