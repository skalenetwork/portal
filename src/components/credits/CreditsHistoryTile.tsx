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
import { types, units, metadata, constants } from '@/core'
import * as cs from '../../core/credit-station'

import { Grid, Tooltip, Button } from '@mui/material'
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded'
import RemoveCircleRoundedIcon from '@mui/icons-material/RemoveCircleRounded'
import HourglassBottomRoundedIcon from '@mui/icons-material/HourglassBottomRounded'
import PaymentsRoundedIcon from '@mui/icons-material/PaymentsRounded'

import ChainLogo from '../ChainLogo'

import { getValidatorById } from '../../core/delegation'
import { MAINNET_CHAIN_LOGOS } from '../../core/constants'
import Logo from '../Logo'
import SkStack from '../SkStack'
import { Link } from 'react-router-dom'

export const LIGHT_COLORS = ['#c8b6ff', '#90E0EF', '#F786AA', '#256EFF', '#31E981', '#ffbf81']

interface CreditsHistoryTileProps {
  mpc: MetaportCore
  creditsPurchase: {
    schainName: string
    payment: cs.PaymentEvent
  }
  chainsMeta: types.ChainsMetadataMap
  isXs: boolean
  tokenPrices: Record<string, bigint>
}

const CreditsHistoryTile: React.FC<CreditsHistoryTileProps> = ({
  mpc,
  creditsPurchase,
  chainsMeta,
  isXs,
  tokenPrices
}) => {
  const network = mpc.config.skaleNetwork
  const chainAlias = metadata.getAlias(network, chainsMeta, creditsPurchase.schainName)
  const payment = creditsPurchase.payment

  const tokens = mpc.config.connections.mainnet?.erc20 || {}
  const tokenSymbol =
    Object.keys(tokens).find(
      (symbol) => tokens[symbol].address?.toLowerCase() === payment.tokenAddress.toLowerCase()
    ) || 'unknown'

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
                  name={creditsPurchase.schainName + payment.id}
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
            <div className={cls('chipXs chip_DELEGATED', cmn.mleft20)}>
              <p className={cls(cmn.p, cmn.p4, 'pOneLine')}>COMPLETED</p>
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
            <div className={cls(cmn.flex, cmn.flexdcv)}>
              <div className={cls([cmn.flexg, !isXs])}></div>
              {/* <div
                                className={cls(
                                    [cmn.flexg, isXs],
                                    cmn.mri20,
                                    [cmn.pri, !isXs],
                                    [cmn.mleft10, !isXs]
                                )}
                            >
                                <p className={cls(cmn.p, cmn.p4, cmn.pSec)}>Rewards available</p>
                                <h3 className={cls(cmn.p, cmn.p700)}>10005 CREDITS</h3>
                            </div> */}

              {/* <div className={cls(cmn.flex, cmn.flexcv)}>
                                <Button
                                    size="small"
                                    variant="contained"
                                    className={cls('btnSm')}
                                >
                                    Go to chain
                                </Button>

                            </div> */}
            </div>
          </Grid>
        </Grid>
      </div>
    </div>
  )
}

export default CreditsHistoryTile
