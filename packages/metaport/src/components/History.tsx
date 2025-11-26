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
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'

import TokenIcon from './TokenIcon'
import TransactionData from './TransactionData'
import SkPaper from './SkPaper'
import Chain from './Chain'

import { useMetaportStore } from '../store/MetaportStore'
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
            className={`p-0 ${size === 'sm' ? 'text-sm' : 'text-base'} font-semibold text-primary ${size === 'sm' ? 'pt-15' : 'pt-25'
              } ${size === 'sm' ? 'mb-2.5' : 'mb-5'} ml-15`}
          >
            Current transfer
          </p>
          <SkPaper gray>
            {transactionsHistory.map((transactionData: types.mp.TransactionHistory) => (
              <TransactionData
                key={transactionData.transactionHash}
                transactionData={transactionData}
                config={mpc.config}
              />
            ))}
          </SkPaper>
        </SkPaper>
      ) : null}
      <div>
        {transfersHistory
          .slice()
          .reverse()
          .map((transfer: types.mp.TransferHistory, key: number) => (
            <SkPaper
              gray
              key={key}
              className={`${size === 'sm' ? 'mt-10 mb-2.5' : 'mt-5 mb-5'} p-0`}
            >
              <div
                className={`flex items-center flex-wrap ml-15 ${size === 'sm' ? 'pt-15' : 'pt-25'
                  }`}
              >
                <div
                  className={`flex items-center ${size === 'sm' ? 'mb-2.5' : 'mb-5'
                    }`}
                >
                  <Chain
                    skaleNetwork={network}
                    chainName={transfer.chainName1}
                    size={size}
                    decIcon
                  />
                  <ArrowForwardRoundedIcon
                    className={`text-primary ${size === 'sm' ? 'ml-1.5 mr-1.5' : 'ml-10 mr-2.5'
                      } w-4 h-4`}
                  />
                  <Chain
                    skaleNetwork={network}
                    chainName={transfer.chainName2}
                    size={size}
                    decIcon
                  />
                </div>
                <div className="grow"></div>

                <div
                  className={`flex items-center ${size === 'sm' ? 'mb-2.5' : 'mb-5'
                    } mr-20`}
                >
                  <div className="flex items-center">
                    <TokenIcon
                      tokenSymbol={transfer.tokenKeyname}
                      size={size == 'sm' ? 'xs' : 'sm'}
                    />
                  </div>
                  <p
                    className={`${size === 'sm' ? 'text-sm' : 'text-base'
                      } font-semibold capitalize text-primary uppercase ml-1.5`}
                  >
                    {transfer.amount} {transfer.tokenKeyname}
                  </p>
                  <p
                    className={`${size === 'sm' ? 'text-sm' : 'text-base'
                      } font-semibold capitalize text-primary ml-1.5 grow`}
                  >
                    {transfer.address !== undefined
                      ? `• ${transfer.address.substring(0, 6)}...${transfer.address.substring(
                        transfer.address.length - 4
                      )}`
                      : '• UNFINISHED'}
                  </p>
                </div>
              </div>
              <SkPaper gray>
                {transfer.transactions.map((transactionData: types.mp.TransactionHistory) => (
                  <TransactionData
                    key={transactionData.transactionHash}
                    transactionData={transactionData}
                    config={mpc.config}
                  />
                ))}
              </SkPaper>
            </SkPaper>
          ))}
      </div>
    </div>
  )
}
