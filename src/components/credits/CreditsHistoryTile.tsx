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
 * @file CreditsHistoryList.tsx
 * @copyright SKALE Labs 2025-Present
 */

import { useState, useEffect } from 'react'
import Avatar from 'boring-avatars'

import {
  cmn,
  cls,
  type MetaportCore,
  Tile,
  ChainIcon,
  TokenIcon,
  explorer
} from '@skalenetwork/metaport'
import { Contract } from 'ethers'
import { types, metadata, constants } from '@/core'
import * as cs from '../../core/credit-station'

import { Grid } from '@mui/material'
import PaymentsRoundedIcon from '@mui/icons-material/PaymentsRounded'
import HistoryToggleOffRoundedIcon from '@mui/icons-material/HistoryToggleOffRounded'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'

import SkStack from '../SkStack'
import { Link } from 'react-router-dom'

export const LIGHT_COLORS = [
  '#efeecc',
  '#fe8b05',
  '#fe0557',
  '#400403',
  '#0aabba',
  '#c8b6ff',
  '#90E0EF',
  '#F786AA',
  '#256EFF',
  '#31E981',
  '#ffbf81'
]

interface CreditsHistoryTileProps {
  mpc: MetaportCore
  creditsPurchase: {
    schainName: string
    payment: cs.PaymentEvent
  }
  chainsMeta: types.ChainsMetadataMap
  isXs: boolean
  tokenPrices: Record<string, bigint>
  ledgerContract: Contract | undefined
}

const CreditsHistoryTile: React.FC<CreditsHistoryTileProps> = ({
  mpc,
  creditsPurchase,
  chainsMeta,
  isXs,
  tokenPrices,
  ledgerContract
}) => {
  const network = mpc.config.skaleNetwork
  const chainAlias = metadata.getAlias(network, chainsMeta, creditsPurchase.schainName)
  const payment = creditsPurchase.payment

  const tokens = mpc.config.connections.mainnet?.erc20 || {}
  const tokenSymbol =
    Object.keys(tokens).find(
      (symbol) => tokens[symbol].address?.toLowerCase() === payment.tokenAddress.toLowerCase()
    ) || 'unknown'

  const [isFulfilled, setIsFulfilled] = useState<boolean>(false)

  useEffect(() => {
    if (!ledgerContract) return
    const checkFulfillment = async () => {
      try {
        setIsFulfilled(await ledgerContract.isFulfilled(payment.id))
      } catch (error) { }
    }
    checkFulfillment()
    const interval = setInterval(checkFulfillment, 10000)
    return () => clearInterval(interval)
  }, [ledgerContract, payment.id])

  return (
    <div>
      <div className={cls(cmn.mbott10, 'titleSection')}>
        <Grid container spacing={0} alignItems="center">
          <Grid size={{ xs: 12, md: 4 }}>
            <Link
              target="_blank"
              rel="noopener noreferrer"
              to={explorer.getTxUrl(constants.MAINNET_CHAIN_NAME, network, payment.transactionHash)}
            >
              <div className={cls(cmn.flex, cmn.flexcv)}>
                <Avatar
                  size={45}
                  variant="marble"
                  name={creditsPurchase.schainName + (payment.id * 2n)}
                  colors={LIGHT_COLORS}
                />
                <ChainIcon
                  skaleNetwork={network}
                  chainName={creditsPurchase.schainName}
                  size="sm"
                  className="creditHistoryIcon"
                />
                <div className={cls(cmn.mleft10, [cmn.flexg, isXs])}>
                  <h4 className={cls(cmn.p, cmn.p700, 'pOneLine', cmn.pPrim)}>{chainAlias}</h4>

                  <p className={cls(cmn.p, cmn.p4, cmn.pSec)}>
                    {payment.transactionHash ? `${payment.transactionHash.slice(0, 10)}...` : ''}
                  </p>
                </div>
              </div>
            </Link>
          </Grid>
          <Grid size={{ xs: 12, md: 8 }} className={cls([cmn.mtop20, isXs], cmn.flex, cmn.flexcv)}>
            <div
              className={cls(
                'chipXs',
                cmn.mleft20,
                cmn.flex,
                cmn.flexcv,
                ['chip_DELEGATED', isFulfilled],
                ['chip_SELF', !isFulfilled]
              )}
            >
              {isFulfilled ? <CheckCircleRoundedIcon /> : <HistoryToggleOffRoundedIcon />}
              <p className={cls(cmn.p, cmn.p4, 'pOneLine', cmn.mleft5)}>
                {isFulfilled ? 'COMPLETED' : 'PENDING'}
              </p>
            </div>
            <div className={cls(cmn.flexg)}></div>
            <SkStack className={cls(cmn.flex)}>
              <Tile
                size="md"
                transparent
                className={cls(cmn.nop, [cmn.mri20, !isXs], [cmn.mleft20, !isXs])}
                value={tokenSymbol.toUpperCase()}
                text="Token Used"
                grow
                ri={!isXs}
                icon={<TokenIcon tokenSymbol={tokenSymbol} size="xs" />}
              />
              <div className="borderVert"></div>
              <Tile
                size="md"
                transparent
                className={cls(cmn.nop, [cmn.mri20, !isXs], [cmn.mleft20, !isXs])}
                value={`ID: ${payment.id.toString()}`}
                text="Payment ID"
                grow
                ri={!isXs}
                icon={<PaymentsRoundedIcon />}
              />
            </SkStack>
          </Grid>
        </Grid>
      </div>
    </div>
  )
}

export default CreditsHistoryTile
