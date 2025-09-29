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
 * @file DelegationTotals.tsx
 * @copyright SKALE Labs 2024-Present
 */

import { useMemo } from 'react'
import { cls, styles, useUIStore, Tile } from '@skalenetwork/metaport'
import { type types, units } from '@/core'

import InboxRoundedIcon from '@mui/icons-material/InboxRounded'
import TaskAltRoundedIcon from '@mui/icons-material/TaskAltRounded'
import DonutLargeRoundedIcon from '@mui/icons-material/DonutLargeRounded'
import LibraryAddCheckRoundedIcon from '@mui/icons-material/LibraryAddCheckRounded'

import { calculateDelegationTotals } from '../../core/delegation/delegations'

import SkStack from '../SkStack'

interface DelegationTotalsProps {
  delegations: types.st.IDelegation[] | null
  sklPrice?: bigint | undefined
  className?: string
}

const DelegationTotals: React.FC<DelegationTotalsProps> = ({
  delegations,
  className,
  sklPrice
}) => {
  const totals = useMemo(
    () => (delegations ? calculateDelegationTotals(delegations) : null),
    [delegations]
  )
  const theme = useUIStore((state) => state.theme)
  const getTileText = (status: string, count?: number) => `${status}${count ? ` (${count})` : ''}`

  return (
    <SkStack className={cls(className)}>
      <Tile
        value={totals && units.displayBalance(totals.proposed.amount, 'SKL')}
        tooltip={
          sklPrice && totals ? units.displaySklValueUsd(totals.proposed.amount, sklPrice) : ''
        }
        text={getTileText('Proposed', totals?.proposed.count)}
        grow
        size="md"
        textColor={totals?.proposed.count ? theme.primary : undefined}
        icon={<InboxRoundedIcon className={cls(styles.chainIconxs)} />}
      />
      <Tile
        value={totals && units.displayBalance(totals.accepted.amount, 'SKL')}
        tooltip={
          sklPrice && totals ? units.displaySklValueUsd(totals.accepted.amount, sklPrice) : ''
        }
        text={getTileText('Accepted', totals?.accepted.count)}
        grow
        size="md"
        icon={<TaskAltRoundedIcon className={cls(styles.chainIconxs)} />}
      />
      <Tile
        value={totals && units.displayBalance(totals.delegated.amount, 'SKL')}
        tooltip={
          sklPrice && totals ? units.displaySklValueUsd(totals.delegated.amount, sklPrice) : ''
        }
        text={getTileText('Delegated', totals?.delegated.count)}
        grow
        size="md"
        icon={<DonutLargeRoundedIcon className={cls(styles.chainIconxs)} />}
      />
      <Tile
        value={totals && units.displayBalance(totals.completed.amount, 'SKL')}
        tooltip={
          sklPrice && totals ? units.displaySklValueUsd(totals.completed.amount, sklPrice) : ''
        }
        text={getTileText('Completed', totals?.completed.count)}
        grow
        size="md"
        icon={<LibraryAddCheckRoundedIcon className={cls(styles.chainIconxs)} />}
      />
    </SkStack>
  )
}

export default DelegationTotals
