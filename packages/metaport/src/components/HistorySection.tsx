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
 * @file HistorySection.ts
 * @copyright SKALE Labs 2023-Present
 */

import { Collapse } from '@mui/material'
import Button from '@mui/material/Button'

import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'

import History from './History'

import { useMetaportStore } from '../store/MetaportStore'
import { useCollapseStore } from '../store/Store'

export default function TransactionsHistory() {
  const transactionsHistory = useMetaportStore((state) => state.transactionsHistory)
  const transfersHistory = useMetaportStore((state) => state.transfersHistory)

  const clearTransactionsHistory = useMetaportStore((state) => state.clearTransactionsHistory)
  const expandedTH = useCollapseStore((state) => state.expandedTH)
  const setExpandedTH = useCollapseStore((state) => state.setExpandedTH)

  function clearTransferHistory() {
    clearTransactionsHistory()
    setExpandedTH(false)
  }

  if (transactionsHistory.length === 0 && transfersHistory.length === 0) return
  return (
    <Collapse in={expandedTH}>
      <div className="cmn.flex, cmn.mbott10, cmn.mtop10">
        <Button
          onClick={() => {
            setExpandedTH(false)
          }}
          color="warning"
          size="medium"
          className="styles.btnAction"
          startIcon={<CloseRoundedIcon />}
        >
          Close history
        </Button>
        <Button
          onClick={clearTransferHistory}
          color="error"
          size="medium"
          className="styles.btnAction"
          startIcon={<DeleteRoundedIcon />}
        >
          Clear history
        </Button>
      </div>
      <History size="sm" />
    </Collapse>
  )
}
