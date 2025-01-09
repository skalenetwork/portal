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

import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'

import TokenIcon from './TokenIcon'
import TransactionData from './TransactionData'
import SkPaper from './SkPaper'
import Chain from './Chain'

import { useMetaportStore } from '../store/MetaportStore'
import { cls, cmn, styles } from '../core/css'

import * as interfaces from '../core/interfaces'

export default function History(props: { size?: interfaces.SimplifiedSize }) {
  const transactionsHistory = useMetaportStore((state) => state.transactionsHistory)
  const transfersHistory = useMetaportStore((state) => state.transfersHistory)

  const mpc = useMetaportStore((state) => state.mpc)

  const size = props.size ?? 'sm'
  const network = mpc.config.skaleNetwork

  if (transactionsHistory.length === 0 && transfersHistory.length === 0) return
  return (
    <div>
      {transactionsHistory.length !== 0 ? (
        <SkPaper gray className={cls(cmn.nop)}>
          <p
            className={cls(
              cmn.p,
              [cmn.p3, size == 'sm'],
              [cmn.p2, size == 'md'],
              cmn.p600,
              cmn.pPrim,
              [cmn.ptop15, size === 'sm'],
              [cmn.ptop25, size === 'md'],
              [cmn.mbott10, size === 'sm'],
              [cmn.mbott20, size === 'md'],
              cmn.mleft15
            )}
          >
            Current transfer
          </p>
          <SkPaper gray>
            {transactionsHistory.map((transactionData: interfaces.TransactionHistory) => (
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
          .map((transfer: interfaces.TransferHistory, key: number) => (
            <SkPaper
              gray
              key={key}
              className={cls(
                [cmn.mtop10, size === 'sm'],
                [cmn.mbott10, size === 'sm'],
                [cmn.mtop20, size === 'md'],
                [cmn.mbott20, size === 'md'],
                cmn.nop
              )}
            >
              <div
                className={cls(
                  cmn.flex,
                  cmn.flexcv,
                  cmn.flexw,
                  cmn.mleft15,
                  [cmn.ptop15, size === 'sm'],
                  [cmn.ptop25, size === 'md']
                )}
              >
                <div
                  className={cls(
                    cmn.flex,
                    cmn.flexcv,
                    [cmn.mbott10, size === 'sm'],
                    [cmn.mbott20, size === 'md']
                  )}
                >
                  <Chain
                    skaleNetwork={network}
                    chainName={transfer.chainName1}
                    size={size}
                    decIcon
                  />
                  <ArrowForwardRoundedIcon
                    className={cls(
                      cmn.pPrim,
                      [cmn.mleft5, size === 'sm'],
                      [cmn.mleft10, size === 'md'],
                      [cmn.mri5, size === 'sm'],
                      [cmn.mri10, size === 'md'],
                      styles.chainIconxs
                    )}
                  />
                  <Chain
                    skaleNetwork={network}
                    chainName={transfer.chainName2}
                    size={size}
                    decIcon
                  />
                </div>
                <div className={cls(cmn.flexg)}></div>

                <div
                  className={cls(
                    cmn.flex,
                    cmn.flexcv,
                    [cmn.mbott10, size === 'sm'],
                    [cmn.mbott20, size === 'md'],
                    cmn.mri20
                  )}
                >
                  <div className={cls(cmn.flex, cmn.flexcv)}>
                    <TokenIcon
                      tokenSymbol={transfer.tokenKeyname}
                      size={size == 'sm' ? 'xs' : 'sm'}
                    />
                  </div>
                  <p
                    className={cls(
                      cmn.p,
                      [cmn.p3, size == 'sm'],
                      [cmn.p2, size == 'md'],
                      cmn.p600,
                      cmn.cap,
                      cmn.pPrim,
                      cmn.upp,
                      cmn.mleft5
                    )}
                  >
                    {transfer.amount} {transfer.tokenKeyname}
                  </p>
                  <p
                    className={cls(
                      cmn.p,
                      [cmn.p3, size === 'sm'],
                      [cmn.p2, size === 'md'],
                      cmn.p600,
                      cmn.cap,
                      cmn.pPrim,
                      cmn.mleft5,
                      cmn.flexg
                    )}
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
                {transfer.transactions.map((transactionData: interfaces.TransactionHistory) => (
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
