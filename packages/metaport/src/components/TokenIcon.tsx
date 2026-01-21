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

import { constants } from '@/core'
import { styles } from '../core/css'
import { Ban } from 'lucide-react'

export default function TokenIcon(props: {
  tokenSymbol: string | undefined | null
  iconUrl?: string | undefined | null
  size?: 'xs' | 'sm' | 'md' | 'lg',
  className?: string
}) {
  const size = props.size ?? 'sm'
  const className = `${styles[`chainIcon${size}`]} rounded-full ${props.className || ''}`
  if (props.tokenSymbol === undefined || props.tokenSymbol === null) {
    return <Ban size={17} className="text-muted-foreground!" />
  }
  if (props.iconUrl !== undefined && props.iconUrl !== null) {
    return (
      <img
        className="object-contain max-w-fit"
        src={props.iconUrl}
      />
    )
  }
  return (
    <img
      className="object-contain max-w-fit"
      src={`${constants.BASE_TOKEN_ICON_URL}${props.tokenSymbol.toLowerCase()}.svg`}
    />
  )
}
