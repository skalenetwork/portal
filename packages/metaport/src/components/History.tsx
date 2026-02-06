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
import Chain from './Chain'

import { useMetaportStore } from '../store/MetaportStore'
import { MoveRight } from 'lucide-react'
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
        <div className={`bg-card dark:bg-card ${size === 'sm' ? 'mt-5 mb-1.5' : 'mt-2.5 mb-2.5'} pt-2 pl-2 pr-2 pb-2 rounded-4xl`}>
          <div className={`ml-2.5 ${size === 'sm' ? 'pt-2 pb-2' : 'pt-3 pb-3'}`}>
            <p className={`${size === 'sm' ? 'text-sm' : 'text-base'} font-semibold text-foreground`}>
              Current transfer
            </p>
          </div>
          <div className="bg-muted-foreground/15 dark:bg-muted-foreground/10 card-bg p-4 rounded-3xl space-y-2">
            {transactionsHistory.map((transactionData: types.mp.TransactionHistory) => (
              <TransactionData
                key={transactionData.transactionHash}
                transactionData={transactionData}
                config={mpc.config}
              />
            ))}
          </div>
        </div>
      ) : null}
      <div>
        {transfersHistory
          .slice()
          .reverse()
          .map((transfer: types.mp.TransferHistory, key: number) => (
            <div
              key={key}
              className={`bg-card dark:bg-card ${size === 'sm' ? 'mt-5 mb-1.5' : 'mt-2.5 mb-2.5'} pl-2 pr-2 ${transfer.transactions.length > 0 ? 'pb-2' : ''} rounded-4xl`}
            >
              <div
                className={`flex flex-col sm:flex-row sm:items-center sm:justify-between ml-2.5 ${size === 'sm' ? 'pt-2 pb-2' : 'pt-3 pb-3'}`}
              >
                <div
                  className={`flex items-center ${size === 'sm' ? 'mb-2 sm:mb-0' : 'mb-2.5 sm:mb-0'
                    }`}
                >
                  <Chain
                    skaleNetwork={network}
                    chainName={transfer.chainName1}
                    size='xs'
                    decIcon
                    iconSize='sm'
                  />
                  <MoveRight size={14}
                    className={`text-foreground ml-2 mr-2 w-3 h-3`}
                  />
                  <Chain
                    skaleNetwork={network}
                    chainName={transfer.chainName2}
                    size='sm'
                    decIcon
                    iconSize='sm'
                  />
                </div>

                <div className="flex items-center ml-1.5 sm:mr-4">
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
                      } font-semibold capitalize text-foreground ml-1.5`}
                  >
                    {transfer.address !== undefined
                      ? `• ${transfer.address.substring(0, 6)}...${transfer.address.substring(
                        transfer.address.length - 4
                      )}`
                      : '• UNFINISHED'}
                  </p>
                </div>
              </div>
              {transfer.transactions.length > 0 && (
                <div className="bg-muted-foreground/15 dark:bg-muted-foreground/10 card-bg p-4 rounded-3xl space-y-2">
                  {transfer.transactions.map((transactionData: types.mp.TransactionHistory) => (
                    <TransactionData
                      key={transactionData.transactionHash}
                      transactionData={transactionData}
                      config={mpc.config}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  )
}
