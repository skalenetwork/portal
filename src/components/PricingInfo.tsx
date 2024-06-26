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

import TollIcon from '@mui/icons-material/Toll'
import AvTimerRoundedIcon from '@mui/icons-material/AvTimerRounded'

import { cmn, TokenIcon, fromWei } from '@skalenetwork/metaport'

import { type PaymasterInfo, type DueDateStatus, divideBigInts } from '../core/paymaster'
import { truncateDecimals } from '../core/helper'
import {
  daysBetweenNowAndTimestamp,
  monthsBetweenNowAndTimestamp,
  calculateElapsedPercentage,
  formatBigIntTimestampSeconds,
  formatTimePeriod
} from '../core/timeHelper'
import { DEFAULT_ERC20_DECIMALS } from '../core/constants'

import SkStack from './SkStack'
import Tile from './Tile'

export default function PricingInfo(props: { info: PaymasterInfo }) {
  const sklPrice = fromWei(props.info.oneSklPrice, DEFAULT_ERC20_DECIMALS)
  const chainPriceUsd = fromWei(props.info.schainPricePerMonth, DEFAULT_ERC20_DECIMALS)
  const chainPriceSkl = divideBigInts(props.info.schainPricePerMonth, props.info.oneSklPrice)

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

  function getDueDateStatus(days: number): DueDateStatus {
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
      <SkStack>
        <Tile
          value={`${truncateDecimals(sklPrice, 6)} USD`}
          text="SKL token price"
          grow
          icon={<TokenIcon tokenSymbol="skl" size="xs" />}
        />
        <Tile
          value={`${truncateDecimals(chainPriceUsd, 6)} USD`}
          text="Chain price USD"
          grow
          icon={<TokenIcon tokenSymbol="usdc" size="xs" />}
        />
        <Tile
          value={`${truncateDecimals(chainPriceSkl.toString(), 6)} SKL`}
          text="Chain price SKL (per month)"
          icon={<TollIcon />}
          grow
        />
      </SkStack>
      <SkStack className={cmn.mtop10}>
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
          icon={<AvTimerRoundedIcon />}
        />
        <Tile
          value={`${formatTimePeriod(Math.abs(untilDueDateMonths), 'month')} `}
          text={dueDateText}
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
