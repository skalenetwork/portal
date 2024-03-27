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
 * @file Portal.tsx
 * @copyright SKALE Labs 2023-Present
 */

import Box from '@mui/material/Box'
import CssBaseline from '@mui/material/CssBaseline'

import Header from './Header'
import SkDrawer from './SkDrawer'
import Router from './Router'
import ScrollToTop from './components/ScrollToTop'

import { useMetaportStore, useWagmiAccount, Debug, cls, cmn } from '@skalenetwork/metaport'

export default function Portal() {
  const mpc = useMetaportStore((state) => state.mpc)
  const { address } = useWagmiAccount()
  if (!mpc) return <div></div>
  return (
    <Box sx={{ display: 'flex' }} className="AppWrap">
      <CssBaseline />
      <ScrollToTop />
      <Header address={address} mpc={mpc} />
      <SkDrawer />
      <div className={cls(cmn.fullWidth)} id="appContentScroll">
        <Router />
        <div className={cls(cmn.mtop20, cmn.fullWidth)}>
          <Debug />
        </div>
      </div>
    </Box>
  )
}
