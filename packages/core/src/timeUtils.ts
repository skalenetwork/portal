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
 * @file timeUtils.ts
 * @copyright SKALE Labs 2025-Present
 */

export function convertMonthIndexToText(index: number): string {
  const baseYear = 2020
  const monthsPerYear = 12

  const year = baseYear + Math.floor(index / monthsPerYear)
  const month = index % monthsPerYear

  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ]
  return `${monthNames[month]} ${year}`
}

export function timestampToDate(ts: number, includeTime?: boolean) {
  const options: Intl.DateTimeFormatOptions = {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit'
  }

  if (includeTime) {
    options.hour = '2-digit'
    options.minute = '2-digit'
    options.second = '2-digit'
  }

  return new Intl.DateTimeFormat('en-US', options).format(ts * 1000)
}
