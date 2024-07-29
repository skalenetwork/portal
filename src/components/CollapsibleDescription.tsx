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
 * @file CollapsibleDescription.tsx
 * @copyright SKALE Labs 2024-Present
 */

import React, { useState, useRef, useEffect } from 'react'
import { cls, cmn } from '@skalenetwork/metaport'

interface TruncateTextProps {
  text: string
  lines?: number
}

const CollapsibleDescription: React.FC<TruncateTextProps> = ({ text, lines = 2 }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isTruncated, setIsTruncated] = useState(false)
  const textRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const checkTruncation = () => {
      const element = textRef.current
      if (element) {
        const lineHeight = parseFloat(window.getComputedStyle(element).lineHeight)
        const maxHeight = lineHeight * lines
        setIsTruncated(element.scrollHeight > maxHeight)
      }
    }

    checkTruncation()
    window.addEventListener('resize', checkTruncation)

    return () => {
      window.removeEventListener('resize', checkTruncation)
    }
  }, [lines, text])

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <div>
      <p
        ref={textRef}
        className={cls(cmn.mtop5, cmn.p, cmn.p3, cmn.pSec)}
        style={{
          display: '-webkit-box',
          WebkitLineClamp: isExpanded ? '' : lines,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}
      >
        {text}
      </p>
      {isTruncated && (
        <p className={cls(cmn.mtop5, cmn.p, cmn.p3, 'pointer')} onClick={toggleExpansion}>
          Show {isExpanded ? 'less' : 'more'}
        </p>
      )}
    </div>
  )
}

export default CollapsibleDescription
