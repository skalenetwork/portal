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
 * @file PricingInfo.tsx
 * @copyright SKALE Labs 2023-Present
 */

import { ClockFading, Gem } from 'lucide-react'

import { constants, units, type types, helper } from '@/core'
import { TokenIcon, Tile } from '@skalenetwork/metaport'

import {
  daysBetweenNowAndTimestamp,
  monthsBetweenNowAndTimestamp,
  calculateElapsedPercentage,
  formatBigIntTimestampSeconds,
  formatTimePeriod
} from '../core/timeHelper'

import SkStack from './SkStack'

export default function PricingInfo(props: { info: types.pm.PaymasterInfo }) {
  const sklPrice = units.fromWei(props.info.oneSklPrice, constants.DEFAULT_ERC20_DECIMALS)
  const chainPriceUsd = units.fromWei(
    props.info.schainPricePerMonth,
    constants.DEFAULT_ERC20_DECIMALS
  )
  const chainPriceSkl = helper.divideBigInts(props.info.schainPricePerMonth, props.info.oneSklPrice)

  const untilDueDateDays = daysBetweenNowAndTimestamp(
    props.info.schain.paidUntil,
    props.info.effectiveTimestamp
  )
  const untilDueDateMonths = monthsBetweenNowAndTimestamp(
    props.info.schain.paidUntil,
    props.info.effectiveTimestamp
  )
  const dueDateStatus = getDueDateStatus(untilDueDateDays)
  const dueDateText = untilDueDateDays < 0 ? 'Payment overdue' : 'Paid for'

  const elapsedPercentage = calculateElapsedPercentage(
    props.info.schain.paidUntil,
    props.info.maxReplenishmentPeriod,
    props.info.effectiveTimestamp
  )

  function getDueDateStatus(days: number): types.pm.DueDateStatus {
    if (days > 31) {
      return 'success'
    } else if (days > 0 && days <= 31) {
      return 'warning'
    } else {
      // days <= 0
      return 'error'
    }
  }

  return (
    <div>
      <SkStack className="mt-2.5">
        <Tile
          value={`${units.truncateDecimals(sklPrice, 6)} USD`}
          text="SKL token price"
          grow
          icon={<TokenIcon tokenSymbol="skl" size="xs" />}
        />
        <Tile
          value={`${units.truncateDecimals(chainPriceUsd, 6)} USD`}
          text="Chain price USD"
          grow
          icon={<TokenIcon tokenSymbol="usdc" size="xs" />}
        />
        <Tile
          value={`${units.truncateDecimals(chainPriceSkl.toString(), 6)} SKL`}
          tooltip={`${units.truncateDecimals(chainPriceUsd, 6)} USD`}
          text="Chain price SKL (per month)"
          icon={<Gem size={14}/>}
          grow
        />
      </SkStack>
      <SkStack className="mt-2.5">
        <Tile
          value={formatBigIntTimestampSeconds(props.info.schain.paidUntil)}
          text="Paid until"
          textRi={`Max top-up period: ${formatTimePeriod(
            props.info.maxReplenishmentPeriod,
            'month'
          )}`}
          grow
          progressColor={dueDateStatus}
          progress={elapsedPercentage || 0.001}
          icon={<ClockFading size={14} />}
        />
        <Tile
          value={`${formatTimePeriod(Math.abs(untilDueDateMonths), 'month')} `}
          text={dueDateText}
          className="text-foreground"
          color={dueDateStatus}
          textRi={
            props.info.effectiveTimestamp
              ? '// Current ts: ' + formatBigIntTimestampSeconds(props.info.effectiveTimestamp)
              : ''
          }
        />
      </SkStack>
    </div>
  )
}
