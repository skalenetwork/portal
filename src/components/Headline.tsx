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

interface HeadlineProps {
  text: string
  className?: string
  icon?: React.ReactElement
  size?: 'small' | 'medium'
}

const Headline: React.FC<HeadlineProps> = ({ text, className, icon, size = 'medium' }) => {
  const commonClasses = `flex items-center flex-grow ${className || ''}`

  const textElement =
    size === 'small' ? (
      <p className="font-bold grow uppercase">{text}</p>
    ) : (
      <h3 className="font-semibold text-foreground/80 ml-2.5">{text}</h3>
    )

  const iconElement = icon && (
    <div
      className={`items-center text-foreground/80 flex ${size === 'small' ? 'mr-2.5 styles.chainIconxs' : ''}`}
    >
      {icon}
    </div>
  )

  return (
    <div className={`${commonClasses} ${size === 'small' ? 'p-2.5' : ''}`}>
      {iconElement}
      {textElement}
    </div>
  )
}

export default Headline
