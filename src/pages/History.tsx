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
 * @file History.tsx
 * @copyright SKALE Labs 2023-Present
 */

import { Helmet } from 'react-helmet'

import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import { History as TransfersHistory, SkPaper, useMetaportStore } from '@skalenetwork/metaport'

import { ArrowLeftRight, Trash2 } from 'lucide-react'

import { clearTransferHistory as clearTransferHistoryFromStorage } from '../core/transferHistory'
import { META_TAGS } from '../core/meta'
import BridgeMenu from '../components/BridgeMenu'

export default function History() {
  const mpc = useMetaportStore((state) => state.mpc)
  const transfersHistory = useMetaportStore((state) => state.transfersHistory)
  const clearTransactionsHistory = useMetaportStore((state) => state.clearTransactionsHistory)

  function clearTransferHistory() {
    clearTransactionsHistory()
    clearTransferHistoryFromStorage(mpc.config.skaleNetwork)
  }

  return (
    <Container maxWidth="sm" className="mt-2">
      <Helmet>
        <title>{META_TAGS.history.title}</title>
        <meta name="description" content={META_TAGS.history.description} />
        <meta property="og:title" content={META_TAGS.history.title} />
        <meta property="og:description" content={META_TAGS.history.description} />
      </Helmet>
      <Stack spacing={0}>
        <div className="flex items-center">
          <div className="grow">
            <h2 className="m-0 text-xl font-bold text-foreground">Bridge History</h2>
            <p className="text-xs text-secondary-foreground font-semibold">
              View and manage your past bridge transfers.
            </p>
          </div>
          <div>
            <BridgeMenu currentPage="history" />
          </div>
        </div>
        <div className="mt-6">
          <TransfersHistory size="md" />
          {transfersHistory.length !== 0 ? (
            <Button
              onClick={clearTransferHistory}
              color="error"
              size="small"
              className="w-full normal-case! text-sm leading-6 tracking-wider font-semibold py-3.5 px-4 min-h-[44px] rounded shadow-none mt-2.5"
              startIcon={<Trash2 size={14} />}
            >
              Clear transfers history
            </Button>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 bg-card rounded-4xl">
              <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-4">
                <ArrowLeftRight size={24} className="text-muted-foreground" />
              </div>
              <p className="text-sm font-semibold text-muted-foreground">No past transfers found</p>
              <p className="text-xs text-muted-foreground/70 mt-1 font-medium">
                Your bridge transfers will appear here
              </p>
            </div>
          )}
        </div>
      </Stack>
    </Container>
  )
}
