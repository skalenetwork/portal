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
 * @file SkBottomNavigation.tsx
 * @copyright SKALE Labs 2024-Present
 */

import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import Button from '@mui/material/Button'
import { Home, ArrowLeftRight, PieChart, BadgeDollarSign, Network } from 'lucide-react'
import { networks, types } from '@/core'
import { NETWORKS } from './core/constants'

export default function SkBottomNavigation() {
  const [value, setValue] = useState(0)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    setValue(500)
    if (location.pathname === '/') setValue(0)
    if (location.pathname === '/bridge' || location.pathname.includes('/transfer')) setValue(1)
    if (location.pathname.includes('/chains') || location.pathname.includes('/admin')) setValue(3)
    if (location.pathname.includes('/staking')) setValue(4)
    if (location.pathname === '/credits' || location.pathname === '/credits/admin') setValue(5)
  }, [location])

  const items = [
    { label: 'Home', path: '/', index: 0, Icon: Home, featureKey: null as types.NetworkFeature | null },
    { label: 'Bridge', path: '/bridge', index: 1, Icon: ArrowLeftRight, featureKey: null as types.NetworkFeature | null },
    { label: 'Chains', path: '/chains', index: 3, Icon: Network, featureKey: 'chains' as types.NetworkFeature },
    { label: 'Staking', path: '/staking', index: 4, Icon: PieChart, featureKey: 'staking' as types.NetworkFeature },
    {
      label: 'Credits',
      path: '/credits',
      index: 5,
      Icon: BadgeDollarSign,
      featureKey: 'credits' as types.NetworkFeature
    },
  ] as const

  const visibleItems = items.filter((item) => {
    if (!item.featureKey) return true
    return networks.hasFeatureInAny(NETWORKS, item.featureKey)
  })

  return (
    <div className="br__bottomNav sm:hidden block">
      <nav className="bg-card/60! backdrop-blur-xs m-4 mb-2 border! border-foreground/10! rounded-full py-2!">
        <ul className="flex items-center justify-between">
          {visibleItems.map((item) => {
            const isActive = value === item.index
            const Icon = item.Icon
            return (
              <li key={item.label} className="flex-1 flex justify-center">
                <Button
                  className={`min-w-0 flex flex-col items-center gap-1 text-xs! capitalize! font-medium shadow-none px-4! rounded-full! ${isActive
                    ? 'text-foreground! bg-accent-foreground/10!'
                    : 'text-muted-foreground/80!'
                    }`}
                  onClick={() => {
                    setValue(item.index)
                    navigate(item.path)
                  }}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Button>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}
