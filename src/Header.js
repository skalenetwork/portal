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
import Typography from '@mui/material/Typography';
import { Link } from "react-router-dom";

import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import MetamaskConnector from './MetamaskConnector';
import OpenMetaportBtn from './OpenMetaportBtn';

import logo from './skale_lg.svg';

import { themes } from './App';


export default class Header extends React.Component {
  render() {
    return (
      <AppBar elevation={0} position="fixed" className="sk-header" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar className='mp__flex'>
          <div className="mp__flex fl-centered-vert">
            <Link to="/">
              <img src={logo} className="logo" alt="logo" />
            </Link>
          </div>
          <div className="mp__flex fl-centered-vert mp__flexGrow mp__margLeft10">
            <h2 className="mp__noMarg headerText">Bridge</h2>
          </div>

          {/* <div className="mp__flex mp__margRi10 marg-left-10">
            <Fab
              size="small"
              style={{ backgroundColor: themes.violet.primary }}
              onClick={() => { this.props.setColorScheme('violet') }}
            >
              <LightModeIcon style={{ color: 'white' }} />
            </Fab>
          </div>
          <div className="mp__flex mp__margRi10">
            <Fab
              size="small"
              style={{ backgroundColor: themes.default.primary }}
              onClick={() => { this.props.setColorScheme('default') }}
            >
              <DarkModeIcon />
            </Fab>
          </div>
          <div className="mp__flex mp__margRi10">
            <Fab
              size="small"
              style={{ backgroundColor: themes.pink.primary }}
              onClick={() => { this.props.setColorScheme('pink') }}
            >
              <LightModeIcon style={{ color: 'white' }} />
            </Fab>
          </div>
          <div className="mp__flex mp__margRi20">
            <Fab
              size="small"
              style={{ backgroundColor: themes.green.primary }}
              onClick={() => { this.props.setColorScheme('green') }}
            >
              <DarkModeIcon />
            </Fab>
          </div> */}
          {/* <OpenMetaportBtn address={this.props.address} connectMetamask={this.props.connectMetamask} /> */}
          <MetamaskConnector address={this.props.address} connectMetamask={this.props.connectMetamask} />
        </Toolbar>
      </AppBar>
    )
  }
}