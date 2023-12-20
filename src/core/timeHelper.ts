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
 * @file timeHelper.ts
 * @copyright SKALE Labs 2022-Present
 */

import { AVG_MONTH_LENGTH } from './constants'

export function formatBigIntTimestampSeconds(timestamp: bigint): string {
  const date = new Date(Number(timestamp * 1000n))
  const day = date.getUTCDate().toString().padStart(2, '0')
  const month = (date.getUTCMonth() + 1).toString().padStart(2, '0')
  const year = date.getUTCFullYear()
  return `${day}.${month}.${year}`
}

export function daysBetweenTimestamps(from: bigint, to: bigint): number {
  const fromDate = new Date(Number(from * 1000n))
  const toDate = new Date(Number(to * 1000n))
  const diffInMs = fromDate.getTime() - toDate.getTime()
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24)
  return Math.round(diffInDays) * -1
}

export function monthsBetweenTimestamps(from: bigint, to: bigint): number {
  const diffInDays = daysBetweenTimestamps(from, to)
  return Math.round(diffInDays / AVG_MONTH_LENGTH)
}

export function getCurrentTsBigInt(customCurrentTs?: bigint): bigint {
  if (customCurrentTs !== undefined && customCurrentTs !== null) return customCurrentTs
  return BigInt(Math.round(new Date().getTime() / 1000))
}

export function daysBetweenNowAndTimestamp(timestamp: bigint, customCurrentTs?: bigint): number {
  return daysBetweenTimestamps(getCurrentTsBigInt(customCurrentTs), timestamp)
}

export function monthsBetweenNowAndTimestamp(timestamp: bigint, customCurrentTs?: bigint): number {
  return monthsBetweenTimestamps(getCurrentTsBigInt(customCurrentTs), timestamp)
}

export function calculateElapsedPercentage(
  tsInSeconds: bigint,
  maxReplenishmentPeriod: bigint
): number {
  const tsDate = new Date(Number(tsInSeconds * 1000n))
  const futureTime = new Date()
  futureTime.setMonth(futureTime.getMonth() + Number(maxReplenishmentPeriod))

  const currentTime = new Date()

  const tsTimeMs = tsDate.getTime()
  const currentTimeMs = currentTime.getTime()
  const futureTimeMs = futureTime.getTime()

  const totalDuration = futureTimeMs - currentTimeMs
  const elapsedDuration = tsTimeMs - currentTimeMs

  let percentage = (elapsedDuration / totalDuration) * 100
  percentage = Math.max(0, Math.min(percentage, 100))

  return percentage
}

export function formatTimePeriod(count: number | bigint, type: 'day' | 'month'): string {
  count = Number(count)
  if (count === 0) {
    return `>1 ${type}`
  }
  if (type === 'day') {
    return Math.abs(count) === 1 ? `${count} day` : `${count} days`
  } else if (type === 'month') {
    return Math.abs(count) === 1 ? `${count} month` : `${count} months`
  } else {
    throw new Error('Invalid type provided. Type must be "day" or "month".')
  }
}
