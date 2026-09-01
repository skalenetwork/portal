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
 * @file ValidatorLogo.tsx
 * @copyright SKALE Labs 2024-Present
 */

import Avatar from 'boring-avatars'
import { AVATAR_COLORS } from '@/ui'
import { VALIDATOR_LOGOS } from '@/lib/constants'
import { styles } from '@/bridge'

type SizeType = 'xxxs' | 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export type SizeMap = {
  [key in SizeType]: number
}

export default function ValidatorLogo(props: {
  validatorId?: number
  className?: string
  size?: SizeType
}) {
  if (!props.validatorId) return

  const iconPath = `v${props.validatorId}`
  const iconModule = (VALIDATOR_LOGOS as any)[iconPath]
  const size = props.size ?? 'xxs'
  const sizes: SizeMap = { xxxs: 30, xxs: 45, xs: 60, sm: 80, md: 120, lg: 150, xl: 200 }
  const borderRadius: SizeMap = { xxxs: 5, xxs: 10, xs: 15, sm: 18, md: 25, lg: 30, xl: 35 }

  if (iconModule) {
    return (
      <img
        style={{
          borderRadius: `${borderRadius[size]}px`,
          width: sizes[size],
          height: sizes[size]
        }}
        className={`${props.className || ''} ${!props.size ? 'validatorIcon' : ''} ${styles[`chainIcon${size}`]}`}
        src={iconModule.default ?? iconModule}
      />
    )
  }
  return (
    <div
      style={{
        width: sizes[size],
        height: sizes[size],
        display: 'flex',
        overflow: 'hidden'
      }}
      className={`${styles[`chainIcon${size}`]} ${!props.size ? 'validatorIcon' : ''} ${props.className || ''}`}
    >
      <Avatar variant="marble" name={iconPath} colors={AVATAR_COLORS} size={sizes[size]} />
    </div>
  )
}
