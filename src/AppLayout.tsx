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
 * @file AppLayout.ts
 * @copyright SKALE Labs 2025-Present
 */

import { Box, CssBaseline } from '@mui/material'
import { Outlet } from 'react-router-dom'
import { useMediaQuery } from '@mui/material'
import SkDrawer from './SkDrawer'
import SkBottomNavigation from './SkBottomNavigation'
import Header from './Header'
import { cls, cmn } from '@skalenetwork/metaport'

export default function AppLayout() {
  const isXs = useMediaQuery('(max-width: 600px)')

  return (
    <Box>
      <Header />
      <Box sx={{ display: 'flex' }} className="AppWrap">
        <CssBaseline />
        {!isXs && <SkDrawer validatorDelegations={null} />}
        <div className={cls(cmn.fullWidth)} id="appContentScroll">
          <Outlet />
        </div>
      </Box>
      {isXs && <SkBottomNavigation />}
    </Box>
  )
}
