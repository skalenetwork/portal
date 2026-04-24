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
 * @file time.ts
 * @copyright SKALE Labs 2025-Present
 */

const MINUTE = 60
const HOUR = 3600
const DAY = 86400
const MONTH = 2592000
const YEAR = 31536000

export function timeAgo(timestampSeconds: number): string {
  const diff = Math.floor(Date.now() / 1000) - timestampSeconds
  if (diff < MINUTE) return 'Just now'
  if (diff < HOUR) {
    const m = Math.floor(diff / MINUTE)
    return `${m} ${m === 1 ? 'minute' : 'minutes'} ago`
  }
  if (diff < DAY) {
    const h = Math.floor(diff / HOUR)
    return `${h} ${h === 1 ? 'hour' : 'hours'} ago`
  }
  if (diff < MONTH) {
    const d = Math.floor(diff / DAY)
    return `${d} ${d === 1 ? 'day' : 'days'} ago`
  }
  if (diff < YEAR) {
    const mo = Math.floor(diff / MONTH)
    return `${mo} ${mo === 1 ? 'month' : 'months'} ago`
  }
  const y = Math.floor(diff / YEAR)
  return `${y} ${y === 1 ? 'year' : 'years'} ago`
}
