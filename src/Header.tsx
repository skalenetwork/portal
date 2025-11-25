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
import IconButton from '@mui/material/IconButton'
import { MoonStar, SunMedium } from 'lucide-react'

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
import { useThemeMode } from '@skalenetwork/metaport'

export default function Header(props: {
  address: `0x${string}` | undefined
  mpc: MetaportCore
  openProfileModal: () => void
}) {
  const { mode, toggleMode } = useThemeMode()

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
            <img src={logo} className="skLogo invert dark:invert-0" alt="logo" />
          </Link>
        </div>
        <div className="flex items-center grow ml-2.5">
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
        <IconButton
          size="small"
          className="ml-1.5! h-8 w-8 rounded-full bg-card! text-foreground! hover:bg-muted"
          onClick={toggleMode}
        >
          {mode === 'dark' ? <MoonStar className="h-4 w-4" /> : <SunMedium className="h-4 w-4" />}
        </IconButton>
        <HelpZen />
        <MoreMenu />
      </Toolbar>
    </AppBar>
  )
}
