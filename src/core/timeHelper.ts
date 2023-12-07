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

export function formatBigIntTimestampSeconds(timestamp: bigint): string {
  const date = new Date(Number(timestamp * 1000n))
  const day = date.getUTCDate().toString().padStart(2, '0')
  const month = (date.getUTCMonth() + 1).toString().padStart(2, '0')
  const year = date.getUTCFullYear()
  return `${day}.${month}.${year}`
}

export function daysBetweenNowAndTimestamp(timestamp: bigint): number {
  const timestampDate = new Date(Number(timestamp * 1000n))
  const currentDate = new Date()
  const diffInMs = currentDate.getTime() - timestampDate.getTime()
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24)
  return Math.round(diffInDays) * -1
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
