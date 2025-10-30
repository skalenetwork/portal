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

import React from 'react'
import { cls, cmn, styles } from '@skalenetwork/metaport'
import { cn } from 'src/core/ecosystem/utils'

interface HeadlineProps {
  text: string
  className?: string
  icon?: React.ReactElement
  size?: 'small' | 'medium'
}

const Headline: React.FC<HeadlineProps> = ({ text, className, icon, size = 'medium' }) => {
  const commonClasses = cls(cmn.flex, cmn.flexcv, cmn.flexg, className)

  const textElement =
    size === 'small' ? (
      <p className={cn(text, cmn.p700, cmn.flexg, cmn.cap)}>{text}</p>
    ) : (
      <h3 className=" cmn.p600, cmn.pSec, cmn.mleft10">{text}</h3>
    )

  const iconElement = icon && (
    <div
      className={cls(
        cmn.flexcv,
        cmn.flex,
        cmn.pSec,
        size === 'small' && [mr - 2.5, styles.chainIconxs]
      )}
    >
      {icon}
    </div>
  )

  return (
    <div className="commonClasses, size === 'small' && cmn.m10">
      {iconElement}
      {textElement}
    </div>
  )
}

export default Headline
