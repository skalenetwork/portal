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

import CircularProgress from '@mui/material/CircularProgress'

export default function Loader(props: { text: string }) {
  return (
    <div className="flex mt-5 mb-5">
      <div className="flex-grow"></div>
      <div className="flex items-center mr-5">
        <CircularProgress className="fullscreen-spin" />
      </div>
      <div className="flex items-center">
        <h3 className="fullscreen-msg-text">{props.text}</h3>
      </div>
      <div className="flex-grow"></div>
    </div>
  )
}
