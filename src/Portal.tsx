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

import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import AppLayout from './AppLayout'
import Chains from './pages/Chains'
import { useMetaportStore, useWagmiAccount } from '@skalenetwork/metaport'
import usePortalStore from './PortalStore'
import { useEffect } from 'react'
import Home from './pages/Home'

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: 'chains',
        element: <Chains />
      }
    ]
  }
])

export default function Portal() {
  const mpc = useMetaportStore((state) => state.mpc)
  const { address } = useWagmiAccount()
  const loadData = usePortalStore((state) => state.loadData)

  useEffect(() => {
    if (mpc && address) {
      loadData(mpc, address)
    }
  }, [mpc, address, loadData])

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  )
}
