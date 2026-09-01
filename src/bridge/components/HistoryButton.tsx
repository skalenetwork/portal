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
 * @file TransactionsHistory.ts
 * @copyright SKALE Labs 2023-Present
 */

import Button from '@mui/material/Button'

import { ChevronDown } from 'lucide-react'
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded'

import { useMetaportStore } from '../store/MetaportStore'
import { useCollapseStore } from '../store/Store'

export default function TransactionsHistory() {
  const transactionsHistory = useMetaportStore((state) => state.transactionsHistory)
  const transfersHistory = useMetaportStore((state) => state.transfersHistory)
  const expandedTH = useCollapseStore((state) => state.expandedTH)
  const setExpandedTH = useCollapseStore((state) => state.setExpandedTH)

  const totalCount = transactionsHistory.length + transfersHistory.length
  if (totalCount === 0) return
  return (
    <div className="flex items-center">
      <Button
        size="small"
        className={`btn-chain flex items-center text-primary ${expandedTH ? 'rotate-180' : ''}`}
        onClick={() => {
          setExpandedTH(!expandedTH)
        }}
      >
        <div className="mr-1.5 flex">
          <HistoryRoundedIcon className="w-4 h-4" />
        </div>
        History ({totalCount})
        <ChevronDown size={17} className="text-secondary-foreground" />
      </Button>
    </div>
  )
}
