/**
 * @license
 * SKALE bridge-ui
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

import React from 'react';
import Fab from '@mui/material/Fab';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { Link } from "react-router-dom";

import logo from './skale_lg.svg';

import MoreMenu from './components/MoreMenu';
import AccountMenu from './components/AccountMenu';


export default class Header extends React.Component {
  render() {
    return (
      <AppBar elevation={0} position="fixed" className="sk-header" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar className='mp__flex'>
          <div className="mp__flex mp__flexCenteredVert mp__flexGrow">
            <Link to="/" className='mp__undec mp__logoLink mp__flex mp__flexCenteredVert'>
              <img src={logo} className="logo" alt="logo" />
            </Link>
          </div>
          <AccountMenu address={this.props.address} connectMetamask={this.props.connectMetamask} />
          <MoreMenu />
        </Toolbar>
      </AppBar>
    )
  }
}