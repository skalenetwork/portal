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

import { constants, networks } from '@/core'
import { type MetaportCore } from '@skalenetwork/metaport'

import HelpZen from './components/HelpZen'
import MoreMenu from './components/MoreMenu'
import AccountMenu from './components/AccountMenu'
import NetworkSwitch from './components/NetworkSwitch'
import GetSFuel from './components/GetSFuel'
import { Link } from 'react-router-dom'
import { NETWORKS } from './core/constants'

export default function Header(props: {
  address: `0x${string}` | undefined
  mpc: MetaportCore
  openProfileModal: () => void
}) {
  return (
    <AppBar
      elevation={0}
      position="fixed"
      className="sk-header"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar className="flex items-center">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <img src={logo} className="skLogo" alt="logo" />
          </Link>
        </div>
        <div className="flex items-center flex-grow ml-2.5">
          {constants.MAINNET_CHAIN_NAME !== 'mainnet' ? (
            <Chip
              label="TESTNET"
              color="primary"
              size="small"
              className="br__chipXs br__chipGray"
            />
          ) : null}
        </div>
        <AccountMenu address={props.address} openProfileModal={props.openProfileModal} />
        {networks.hasFeatureInAny(NETWORKS, 'sfuel') && <GetSFuel mpc={props.mpc} />}
        <NetworkSwitch mpc={props.mpc} />
        <HelpZen />
        <MoreMenu />
      </Toolbar>
    </AppBar>
  )
}
