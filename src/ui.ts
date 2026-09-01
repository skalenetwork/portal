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
 * @file ui.ts
 * @copyright SKALE Labs 2025-Present
 */

import { useState } from 'react'
import { notify } from '@/core'
import { twMerge } from 'tailwind-merge'
import { clsx, type ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function useCopy(timeout = 1000): [boolean, (value: string) => void] {
  const [copied, setCopied] = useState(false)
  const copy = (value: string) => {
    navigator.clipboard.writeText(value).then(
      () => {
        setCopied(true)
        setTimeout(() => setCopied(false), timeout)
      },
      () => notify.temporaryError('Could not copy to clipboard')
    )
  }
  return [copied, copy]
}

export const AVATAR_COLORS = [
  '#efeecc',
  '#fe8b05',
  '#fe0557',
  '#400403',
  '#0aabba',
  '#c8b6ff',
  '#90E0EF',
  '#F786AA',
  '#256EFF',
  '#31E981',
  '#ffbf81'
]
