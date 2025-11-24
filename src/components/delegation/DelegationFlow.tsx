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
 * @file DelegationFlow.tsx
 * @copyright SKALE Labs 2024-Present
 */

import { types } from '@/core'

import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'

import { formatBigIntTimestampSeconds } from '../../core/timeHelper'

interface DelegationFlowProps {
  delegation?: types.st.IDelegation
  className?: string
}

const DelegationFlow: React.FC<DelegationFlowProps> = ({ delegation }) => {
  function formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}.${month}.${year}`
  }

  function getFirstDayNextMonth(): string {
    const date = new Date()
    date.setMonth(date.getMonth() + 1)
    date.setDate(1)
    return formatDate(date)
  }

  function getFirstDayMonthAfterNext(): string {
    const date = new Date()
    date.setMonth(date.getMonth() + 2)
    date.setDate(1)
    return formatDate(date)
  }

  function getCurrentDate(): string {
    return formatDate(new Date())
  }

  return (
    <div className="flex items-center className">
      <div>
        <div className="chipXs chip_PROPOSED">
          <p className="text-xs truncate">PROPOSED</p>
        </div>
        <p className="text-xs text-secondary-foreground text-center mt-1.5">
          {delegation ? formatBigIntTimestampSeconds(delegation.created) : getCurrentDate()}
        </p>
      </div>
      <ArrowForwardRoundedIcon className="text-secondary-foreground styles.chainIconxs mr-2.5 ml-2.5 'delegationFlowIcon'" />
      <div>
        <div className="chipXs chip_ACCEPTED">
          <p className="text-xs truncate">ACCEPTED</p>
        </div>
        <p className="text-xs text-secondary-foreground text-center mt-1.5">
          Until {getFirstDayNextMonth()}
        </p>
      </div>
      <ArrowForwardRoundedIcon className="text-secondary-foreground styles.chainIconxs mr-2.5 ml-2.5 'delegationFlowIcon'" />
      <div>
        <div className="chipXs chip_DELEGATED">
          <p className="text-xs">DELEGATED</p>
        </div>
        <p className="text-xs text-secondary-foreground text-center mt-1.5">
          From {getFirstDayNextMonth()}
        </p>
      </div>
      <ArrowForwardRoundedIcon className="text-secondary-foreground styles.chainIconxs mr-2.5 ml-2.5 'delegationFlowIcon'" />
      <div>
        <div className="chipXs chip_REWARDS">
          <p className="text-xs truncate">REWARDS GENERATED</p>
        </div>
        <p className="text-xs text-secondary-foreground text-center mt-1.5">
          Monthly, starting on {getFirstDayMonthAfterNext()}
        </p>
      </div>
    </div>
  )
}

export default DelegationFlow
