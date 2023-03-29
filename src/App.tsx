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
 * @file App.tsx
 * @copyright SKALE Labs 2023-Present
*/

import './App.scss';
import React, { useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import Box from '@mui/material/Box';

import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';

import { Metaport, interfaces } from '@skalenetwork/metaport';

import Header from './Header';
import SkDrawer from './SkDrawer';
import SkBottomNavigation from './SkBottomNavigation';
import Router from './Router';
import MetamaskConnector from './MetamaskConnector';

import TermsModal from './components/TermsModal';

import { connect, getAccounts } from './core/connector'
import { METAPORT_CONFIG } from './core/constants';


interface MetaportThemesMap { [themeName: string]: interfaces.MetaportTheme; }


export const themes: MetaportThemesMap = {
  'default': {
    primary: '#d9e021',
    background: '#191919',
    mode: 'dark'
  }
}


function createMuiTheme(th: any) {
  return createTheme({
    palette: {
      mode: th.mode,
      background: {
        paper: th.background
      },
      primary: {
        main: th.primary,
      },
      secondary: {
        main: th.background
      }
    }
  })
}


function App() {

  const [termsAccepted, setTermsAccepted] = React.useState<boolean>(false);

  const [colorScheme, setColorScheme] = React.useState('default');
  const [muiTheme, setMuiTheme] = React.useState(createMuiTheme(themes[colorScheme]));

  const [address, setAddress] = React.useState<string>();
  const [connectionError, setConnectionError] = React.useState<any>();
  const [metaport, setMetaport] = React.useState<Metaport>();

  useEffect(() => {
    setMuiTheme(createMuiTheme(themes[colorScheme]));
  }, [colorScheme]);

  useEffect(() => {
    if (!window.ethereum) return;
    window.ethereum.on('accountsChanged', accountsChangedFallback);
    getAccounts(
      (accounts: string[]) => { setAddress(accounts[0]); },
      (err) => { console.error(err) }
    );
    if (window.ethereum) {
      setMetaport(new Metaport(METAPORT_CONFIG));
    }
    return () => {
      window.removeEventListener("accountsChanged", accountsChangedFallback);
    }
  }, [window.ethereum]);

  function connectMetamask() {
    console.log('connectMetamask called');
    connect(
      () => {
        setAddress(window.ethereum.selectedAddress);
        setConnectionError(null);
      },
      (err) => { setConnectionError(err); }
    );
  }

  function accountsChangedFallback(event: any) {
    const accounts = event as string[];
    if (accounts.length === 0) {
      setAddress(undefined);
      // MetaMask is locked or the user has not connected any accounts
      console.log('Please connect wallet!');
    } else {
      setAddress(accounts[0]);
    }
  }

  const darkMode = themes[colorScheme].mode === 'dark';

  return (
    <ThemeProvider theme={muiTheme}>
      <Box
        sx={{ display: 'flex' }}
        className={'AppWrap bridgeUI ' + (darkMode ? 'bridgeUI-dark' : 'bridgeUI-light')}
      >
        <CssBaseline />
        <TermsModal termsAccepted={termsAccepted} setTermsAccepted={setTermsAccepted} />
        <Header
          colorScheme={colorScheme}
          setColorScheme={setColorScheme}
          connectMetamask={connectMetamask}
          address={address}
        />
        <SkDrawer />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar />
          {address ? <Router
            address={address}
            metaport={metaport}
            theme={themes[colorScheme]}
          /> :
            <MetamaskConnector
              address={address}
              connectMetamask={connectMetamask}
              connectionError={connectionError}
            />}
        </Box>
      </Box>
      <SkBottomNavigation />
    </ThemeProvider >
  );
}

export default App;
