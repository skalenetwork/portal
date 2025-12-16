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
 * @file History.ts
 * @copyright SKALE Labs 2023-Present
 */

import { types } from '@/core'

import TokenIcon from './TokenIcon'
import TransactionData from './TransactionData'
import SkPaper from './SkPaper'
import Chain from './Chain'

import { useMetaportStore } from '../store/MetaportStore'
import { ArrowUpRight } from 'lucide-react'
export default function History(props: { size?: types.Size }) {
  const transactionsHistory = useMetaportStore((state) => state.transactionsHistory)
  const transfersHistory = useMetaportStore((state) => state.transfersHistory)

  const mpc = useMetaportStore((state) => state.mpc)

  const size = props.size ?? 'sm'
  const network = mpc.config.skaleNetwork

  if (transactionsHistory.length === 0 && transfersHistory.length === 0) return
  return (
    <div>
      {transactionsHistory.length !== 0 ? (
        <SkPaper gray className="p-0">
          <p
            className={`p-0 ${size === 'sm' ? 'text-sm' : 'text-base'} font-semibold text-foreground ${size === 'xs' ? 'pt-4' : 'pt-6'
              } ${size === 'sm' ? 'mb-2.5' : 'mb-5'} ml-4`}
          >
            Current transfer
          </p>
          <div className="bg-muted p-4 rounded-3xl">
            {transactionsHistory.map((transactionData: types.mp.TransactionHistory) => (
              <TransactionData
                key={transactionData.transactionHash}
                transactionData={transactionData}
                config={mpc.config}
              />
            ))}
          </div>
        </SkPaper>
      ) : null}
      <div>
        {transfersHistory
          .slice()
          .reverse()
          .map((transfer: types.mp.TransferHistory, key: number) => (
            <div
              key={key}
              className={`bg-muted ${size === 'sm' ? 'mt-10 mb-2.5' : 'mt-5 mb-5'} p-0 rounded-3xl`}
            >
              <div
                className={`flex items-center justify-between ml-4 ${size === 'sm' ? 'pt-4' : 'pt-6'
                  }`}
              >
                <div
                  className={`flex items-center ${size === 'sm' ? 'mb-2.5' : 'mb-5'
                    }`}
                >
                  <Chain
                    skaleNetwork={network}
                    chainName={transfer.chainName1}
                    size='sm'
                    decIcon
                  />
                  <ArrowUpRight
                    className={`text-foreground ml-2 mr-2 w-3 h-3`}
                  />
                  <Chain
                    skaleNetwork={network}
                    chainName={transfer.chainName2}
                    size='sm'
                    decIcon
                  />
                </div>

                <div
                  className={`flex items-center ${size === 'sm' ? 'mb-2.5' : 'mb-5'
                    } mr-4`}
                >
                  <div className="flex items-center">
                    <TokenIcon
                      tokenSymbol={transfer.tokenKeyname}
                      size={size == 'sm' ? 'xs' : 'sm'}
                    />
                  </div>
                  <p
                    className={`${size === 'sm' ? 'text-xs' : 'text-sm'
                      } font-semibold capitalize text-foreground uppercase ml-1.5`}
                  >
                    {transfer.amount} {transfer.tokenKeyname}
                  </p>
                  <p
                    className={`${size === 'sm' ? 'text-xs' : 'text-sm'
                      } font-semibold capitalize text-foreground ml-1.5 grow`}
                  >
                    {transfer.address !== undefined
                      ? `• ${transfer.address.substring(0, 6)}...${transfer.address.substring(
                        transfer.address.length - 4
                      )}`
                      : '• UNFINISHED'}
                  </p>
                </div>
              </div>
              <div className="bg-muted-foreground/10 mx-4 mb-4 p-4 rounded-2xl">
                {transfer.transactions.map((transactionData: types.mp.TransactionHistory) => (
                  <TransactionData
                    key={transactionData.transactionHash}
                    transactionData={transactionData}
                    config={mpc.config}
                  />
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}
