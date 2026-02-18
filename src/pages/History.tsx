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

import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import { History as TransfersHistory, useMetaportStore } from '@skalenetwork/metaport'

import { ChevronLeft, HistoryIcon, Trash2 } from 'lucide-react'

import { clearTransferHistory as clearTransferHistoryFromStorage } from '../core/transferHistory'
import { META_TAGS } from '../core/meta'
import Breadcrumbs from '../components/Breadcrumbs'

export default function History() {
  const mpc = useMetaportStore((state) => state.mpc)
  const transfersHistory = useMetaportStore((state) => state.transfersHistory)
  const transactionsHistory = useMetaportStore((state) => state.transactionsHistory)
  const clearTransactionsHistory = useMetaportStore((state) => state.clearTransactionsHistory)

  function clearTransferHistory() {
    clearTransactionsHistory()
    clearTransferHistoryFromStorage(mpc.config.skaleNetwork)
  }

  return (
    <Container maxWidth="md">
      <Helmet>
        <title>{META_TAGS.history.title}</title>
        <meta name="description" content={META_TAGS.history.description} />
        <meta property="og:title" content={META_TAGS.history.title} />
        <meta property="og:description" content={META_TAGS.history.description} />
      </Helmet>
      <div className="mt-2">
        <Stack spacing={0}>
          <div className="flex">
            <Breadcrumbs
              className="bg"
              sections={[
                {
                  text: 'Bridge',
                  icon: <ChevronLeft size={14} />,
                  url: '/bridge'
                },
                {
                  text: 'History',
                  icon: <HistoryIcon size={14} />
                }
              ]}
            />
            <div className="grow"></div>
          </div>
          <div className={transactionsHistory.length !== 0 ? 'mt-2.5' : ''}>
            <TransfersHistory size="md" />
          </div>
          <div>
            {transfersHistory.length !== 0 ? (
              <Button
                onClick={clearTransferHistory}
                color="error"
                size="small"
                className="w-full normal-case! text-sm leading-6 tracking-wider font-semibold py-3.5 px-4 min-h-[44px] rounded shadow-none mb-5"
                startIcon={<Trash2 size={14} />}
              >
                Clear transfers history
              </Button>
            ) : (
              <div className="text-sm font-semibold text-muted-foreground mt-5 text-center">
                No past transfers found
              </div>
            )}
          </div>
        </Stack>
      </div>
    </Container>
  )
}
