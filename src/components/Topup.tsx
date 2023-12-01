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
 * @file Topup.tsx
 * @copyright SKALE Labs 2023-Present
 */

import TollIcon from '@mui/icons-material/Toll'
import AvTimerRoundedIcon from '@mui/icons-material/AvTimerRounded'

import {
  cmn,
  cls,
  type MetaportCore,
  TokenIcon
} from '@skalenetwork/metaport'

import Stack from '@mui/material/Stack'
import Tile from './Tile'

export default function Topup(_: { mpc: MetaportCore; name: string }) {
  // const network = props.mpc.config.skaleNetwork
  // const alias = getChainAlias(network, props.name)

  return (
    <div>
      <p className={cls(cmn.p, cmn.p3, cmn.mtop20, cmn.p700, cmn.mleft5, cmn.mbott10)}>
        Payment info
      </p>
      <Stack spacing={1} direction={{ xs: 'column', md: 'row' }} useFlexGap flexWrap="wrap">
        <Tile
          value="0.64643 USD"
          text="SKL token price"
          grow
          icon={<TokenIcon tokenSymbol="skl" size="xs" />}
        />
        <Tile
          value="3700 USD"
          text="Chain price USD"
          grow
          icon={<TokenIcon tokenSymbol="usdc" size="xs" />}
        />
        <Tile value="666436.45" text="Chain price SKL (per month)" icon={<TollIcon />} grow />
      </Stack>
      <Stack
        spacing={1}
        direction={{ xs: 'column', md: 'row' }}
        className={cmn.mtop10}
        useFlexGap
        flexWrap="wrap"
      >
        <Tile
          value="25.03.2024"
          text="Paid until"
          textRi="Max top-up period: 12 month"
          grow
          progress={30}
          icon={<AvTimerRoundedIcon />}
        />
        <Tile value="125 days" text="Until due date" color="primary" />
      </Stack>

      <p className={cls(cmn.p, cmn.p3, cmn.mtop20, cmn.p700, cmn.mleft5, cmn.mbott10)}>
        Top-up chain
      </p>
      <Stack spacing={1} direction={{ xs: 'column', md: 'row' }} useFlexGap flexWrap="wrap">
        <Tile
          value="3666436.45 SKL"
          text="Chain price"
          textRi="666436.45 x 3"
          icon={<TollIcon />}
          grow
        //  children={<Toggle />}
        />
      </Stack>

      {/* <Stack spacing={1} direction={{ sm: 'column', md: 'row' }} useFlexGap flexWrap="wrap">
      <div className={cls(cmn.flex, cmn.flexcv, cmn.flexg, cmn.mtop10)}>
        <div className={cls('titleSection', cmn.flexg)}>
          <div className={cls(cmn.flex)}>
            <p className={cls(cmn.p, cmn.p4, cmn.pSec, cmn.nom, cmn.flexg)}>
              Paid until
            </p>
            <p className={cls(cmn.p, cmn.p4, cmn.pSec)}>
              Max topup period: 12 month
            </p>
          </div>
          <p className={cls(cmn.p, cmn.p1, cmn.p700, cmn.pPrim, cmn.mbott10, cmn.flexg)}>
            02.04.2024
          </p>
          <LinearProgress variant="determinate" value={10} color='error' style={{ height: '20px' }} />
        </div>
      </div>
      <div className={cls(cmn.flex, cmn.flexcv, cmn.mtop10)}>
        <div className={cls('titleSection', cmn.flexg)} style={{ background: '#f44336', height: '100%' }}>
          <div className={cls(cmn.flex)}>
            <p className={cls(cmn.p, cmn.p4, cmn.nom, cmn.flexg)} style={{ color: 'black' }}>
              Payment overdue
            </p>
          </div>
          <p className={cls(cmn.p, cmn.p1, cmn.p700, cmn.flexg)} style={{ color: 'black' }}>
            45 days
          </p>
        </div>
      </div>
    </Stack> */}

      {/* <Stack spacing={1} direction={{ xs: 'column', md: 'row' }} alignItems="stretch">
      <div className={cls(cmn.flex, cmn.flexcv, cmn.flexg, cmn.mtop10)}>
        <div className={cls('titleSection', cmn.flexg)}>
          <div className={cls(cmn.flex)}>
            <p className={cls(cmn.p, cmn.p4, cmn.pSec, cmn.nom, cmn.flexg)}>
              Paid until
            </p>
            <p className={cls(cmn.p, cmn.p4, cmn.pSec)}>
              Max top-up period: 12 month
            </p>
          </div>
          <p className={cls(cmn.p, cmn.p1, cmn.p700, cmn.pPrim, cmn.mbott10, cmn.flexg)}>
            02.04.2024
          </p>
          <LinearProgress variant="determinate" value={35} color='primary' style={{ height: '20px' }} />
        </div>
      </div>
      <div className={cls(cmn.flex, cmn.flexcv, cmn.mtop10)}>
        <div className={cls('titleSection', cmn.flexg)} style={{ background: '#29FF94', height: '100%' }}>
          <div className={cls(cmn.flex)}>
            <p className={cls(cmn.p, cmn.p4, cmn.nom, cmn.flexg)} style={{ color: 'black' }}>
              Until due date
            </p>
          </div>
          <p className={cls(cmn.p, cmn.p1, cmn.p700, cmn.flexg)} style={{ color: 'black' }}>
            125 days
          </p>
        </div>
      </div>
    </Stack> */}
    </div>
  )
}
