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

import Jazzicon from 'react-jazzicon'
import { VALIDATOR_LOGOS } from '../../core/constants'
import { cls, styles } from '@skalenetwork/metaport'

function hashCode(str: string) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  return hash
}

function getPseudoRandomNumber(
  seed: string,
  min: number = 1000000000,
  max: number = 100000000000000
): number {
  const seedValue = hashCode(seed)
  const range = max - min
  const rng = Math.sin(seedValue) * 10000
  const randomInt = min + Math.floor((rng - Math.floor(rng)) * range)
  return randomInt
}

type SizeType = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

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
  const size = props.size ?? 'md'
  const sizes: SizeMap = { xs: 17, sm: 26, md: 35, lg: 45, xl: 70 }
  if (iconModule) {
    return (
      <img
        style={{ borderRadius: '50%', width: sizes[size], height: sizes[size] }}
        className={cls(
          props.className,
          'border',
          ['validatorIcon', !props.size],
          styles[`chainIcon${size}`]
        )}
        src={iconModule.default ?? iconModule}
      />
    )
  }
  return (
    <div
      className={cls(styles[`chainIcon${size}`], ['validatorIcon', !props.size], props.className)}
    >
      <Jazzicon diameter={sizes[size]} seed={getPseudoRandomNumber(iconPath)} />
    </div>
  )
}
