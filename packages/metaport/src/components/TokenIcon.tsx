/**
 * @license
 * SKALE Metaport
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

/**
 * @file TokensIcon.ts
 * @copyright SKALE Labs 2023-Present
 */

import TollRoundedIcon from '@mui/icons-material/TollRounded'
import { tokenIcon } from '../core/metadata'

import { styles } from '../core/css'

// todo: 4.0 replace with a library
export default function TokenIcon(props: {
  tokenSymbol: string | undefined | null
  iconUrl?: string | undefined | null
  size?: 'xs' | 'sm' | 'md' | 'lg'
}) {
  const size = props.size ?? 'sm'
  const className = styles[`chainIcon${size}`]
  if (props.tokenSymbol === undefined || props.tokenSymbol === null) {
    return <TollRoundedIcon />
  }
  const iconPath = props.iconUrl ?? tokenIcon(props.tokenSymbol)
  // if (iconPath.default) {
  //   return <img className={className} src={iconPath.default} />
  // }
  return <img className={className} src={iconPath} />
}
