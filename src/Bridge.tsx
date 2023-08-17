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
 * @file Bridge.tsx
 * @copyright SKALE Labs 2023-Present
*/

import { useState } from 'react';

import Header from './Header';
import SkDrawer from './SkDrawer';
import Router from './Router';

import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';



import { Metaport, SkConnect, TokenIcon, ChainIcon, ChainsList, TokenList, interfaces, useCollapseStore, useMetaportStore, cls, styles, common, useWagmiAccount } from '@skalenetwork/metaport';
import { Button } from '@mui/material';


function Bridge(props: { mpTheme: interfaces.MetaportTheme }) {

  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);

  const expandedFrom = useCollapseStore((state) => state.expandedFrom)
  const setExpandedFrom = useCollapseStore((state) => state.setExpandedFrom)

  const expandedTo = useCollapseStore((state) => state.expandedTo)
  const setExpandedTo = useCollapseStore((state) => state.setExpandedTo)

  const token = useMetaportStore((state) => state.token)
  const chainName1 = useMetaportStore((state) => state.chainName1)
  const chainName2 = useMetaportStore((state) => state.chainName2)

  const setChainName1 = useMetaportStore((state) => state.setChainName1)
  const setChainName2 = useMetaportStore((state) => state.setChainName2)

  const transferInProgress = useMetaportStore((state) => state.transferInProgress)
  const mpc = useMetaportStore((state) => state.mpc)

  const { address } = useWagmiAccount()

  // const address = '0x'

  if (!mpc) return <div></div>

  return (
    <Box
      sx={{ display: 'flex' }}
      className={'AppWrap'}
    >
      <CssBaseline />

      <Header
      // colorScheme={colorScheme}
      // setColorScheme={setColorScheme}
      // connectMetamask={connectMetamask}
        address={address}
      />
      <SkDrawer />

      {address ? <Router address={address} /> : <SkConnect />}

      {/* <Metaport config={mpc.config}/> */}
      {/* <Button variant='contained' className={cls(styles.btnAction)}>Action button</Button> */}

    </Box >

  )
}

export default Bridge
