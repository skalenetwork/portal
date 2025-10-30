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

import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded'
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded'

import { useMetaportStore } from '../store/MetaportStore'
import { useCollapseStore } from '../store/Store'

import { styles } from '../core/css'

export default function TransactionsHistory() {
  const transactionsHistory = useMetaportStore((state) => state.transactionsHistory)
  const transfersHistory = useMetaportStore((state) => state.transfersHistory)
  const expandedTH = useCollapseStore((state) => state.expandedTH)
  const setExpandedTH = useCollapseStore((state) => state.setExpandedTH)

  const totalCount = transactionsHistory.length + transfersHistory.length
  if (totalCount === 0) return
  return (
    <div className="cmn.flex, cmn.flexcv">
      <Button
        size="small"
        className="styles.btnChain, cmn.flex, cmn.flexcv, cmn.pPrim"
        onClick={() => {
          setExpandedTH(!expandedTH)
        }}
      >
        <div className="cmn.mri5, cmn.flex">
          <HistoryRoundedIcon className={styles.chainIconxs} />
        </div>
        History ({totalCount})
        <ExpandMoreRoundedIcon className="styles.chainIconxs, [cmn.rotate180, expandedTH]" />
      </Button>
    </div>
  )
}
