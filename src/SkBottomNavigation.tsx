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

import Box from '@mui/material/Box'
import BottomNavigation from '@mui/material/BottomNavigation'
import BottomNavigationAction from '@mui/material/BottomNavigationAction'
import SwapHorizontalCircleOutlinedIcon from '@mui/icons-material/SwapHorizontalCircleOutlined'
import PieChartOutlineOutlinedIcon from '@mui/icons-material/PieChartOutlineOutlined'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined'

export default function SkBottomNavigation() {
  const [value, setValue] = useState(0)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    setValue(500)
    if (location.pathname === '/') setValue(0)
    if (location.pathname === '/bridge' || location.pathname.includes('/transfer')) setValue(1)
    if (location.pathname.includes('/chains') || location.pathname.includes('/admin')) setValue(2)
    if (location.pathname.includes('/staking')) setValue(3)
  }, [location])

  return (
    <Box display={{ sm: 'none', xs: 'block' }} className="br__bottomNav">
      <BottomNavigation
        showLabels
        value={value}
        onChange={(_, newValue) => {
          setValue(newValue)
        }}
      >
        <BottomNavigationAction
          label="Home"
          icon={<HomeOutlinedIcon />}
          onClick={() => {
            navigate('/')
          }}
        />
        <BottomNavigationAction
          label="Bridge"
          icon={<SwapHorizontalCircleOutlinedIcon />}
          onClick={() => {
            navigate('/bridge')
          }}
        />
        <BottomNavigationAction
          label="Chains"
          icon={<PublicOutlinedIcon />}
          onClick={() => {
            navigate('/chains')
          }}
        />
        <BottomNavigationAction
          label="Staking"
          icon={<PieChartOutlineOutlinedIcon />}
          onClick={() => {
            navigate('/staking')
          }}
        />
      </BottomNavigation>
    </Box>
  )
}
