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
 * @file Header.js
 * @copyright SKALE Labs 2021-Present
 */

import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Chip from '@mui/material/Chip'

import logo from './assets/skale_lg.svg'

import { cmn, cls, type MetaportCore } from '@skalenetwork/metaport'

import HelpZen from './components/HelpZen'
import MoreMenu from './components/MoreMenu'
import AccountMenu from './components/AccountMenu'
import NetworkSwitch from './components/NetworkSwitch'

import { MAINNET_CHAIN_NAME, MAIN_SKALE_URL } from './core/constants'

export default function Header(props: { address: `0x${string}` | undefined; mpc: MetaportCore }) {
  return (
    <AppBar
      elevation={0}
      position="fixed"
      className="sk-header"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar className={cmn.flex}>
        <div className={cls(cmn.flex, cmn.flexcv)}>
          <a
            className={cls(cmn.flex, cmn.flexcv)}
            target="_blank"
            href={MAIN_SKALE_URL}
            rel="noreferrer"
          >
            <img src={logo} className="skLogo" alt="logo" />
          </a>
        </div>
        <div className={cls(cmn.flex, cmn.flexg, cmn.mleft10)}>
          {MAINNET_CHAIN_NAME !== 'mainnet' ? (
            <Chip
              label="TESTNET"
              color="primary"
              size="small"
              className="br__chipXs br__chipGray"
            />
          ) : null}
        </div>
        <AccountMenu address={props.address} />
        <NetworkSwitch mpc={props.mpc} />
        <HelpZen />
        <MoreMenu />
      </Toolbar>
    </AppBar>
  )
}
