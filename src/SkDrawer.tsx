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
 * @file SkDrawer.tsx
 * @copyright SKALE Labs 2024-Present
 */

import { useLocation, Link } from 'react-router-dom'
import { networks, types } from '@/core'

import Box from '@mui/material/Box'

import Drawer from '@mui/material/Drawer'
import Toolbar from '@mui/material/Toolbar'
import List from '@mui/material/List'

import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'

import {
  House,
  ArrowLeftRight,
  Globe2,
  BarChart2,
  PieChart,
  Users,
  CreditCard,
  Link2,
  BadgeDollarSign,
  Route
} from 'lucide-react'

import { GET_STARTED_URL, NETWORKS } from './core/constants'
import DelegationsNotification from './components/delegation/DelegationsNotification'

const drawerWidth = 220

export default function SkDrawer(props: { validatorDelegations: types.st.IDelegation[] | null }) {
  const location = useLocation()
  return (
    <Box display={{ sm: 'block', xs: 'none' }} m={1}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
            background: 'var(--background)'
          }
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }} className="mt-5">
          <List>
            <ListItem>
              <Link to="/" className="w-full text-foreground!">
                <ListItemButton className="text-primary" selected={location.pathname === '/'}>
                  <ListItemIcon>
                    <House className="text-foreground" size={18} />
                  </ListItemIcon>
                  <ListItemText primary="Home" />
                </ListItemButton>
              </Link>
            </ListItem>
            <ListItem>
              <a
                className="w-full text-foreground!"
                target="_blank"
                href={GET_STARTED_URL}
                rel="noreferrer"
              >
                <ListItemButton className="text-primary">
                  <ListItemIcon>
                    <Route className="text-foreground" size={18} />
                  </ListItemIcon>
                  <ListItemText primary="Get Started" />
                </ListItemButton>
              </a>
            </ListItem>
          </List>
          <h4 className="text-secondary-foreground text-xs font-medium mt-2.5 ml-5">Transfer</h4>
          <List>
            <ListItem>
              <Link to="/bridge" className="w-full text-foreground!">
                <ListItemButton
                  className=""
                  selected={
                    location.pathname === '/bridge/history' || location.pathname === '/bridge'
                  }
                >
                  <ListItemIcon>
                    <ArrowLeftRight className="text-foreground" size={18} />
                  </ListItemIcon>
                  <ListItemText primary="Bridge" />
                </ListItemButton>
              </Link>
            </ListItem>
            {networks.hasFeatureInAny(NETWORKS, 'onramp') && (
              <ListItem>
                <Link to="/onramp" className="w-full text-foreground!">
                  <ListItemButton
                    className="text-primary"
                    selected={location.pathname === '/onramp'}
                  >
                    <ListItemIcon>
                      <CreditCard className="text-foreground" size={18} />
                    </ListItemIcon>
                    <ListItemText primary="On-Ramp" />
                  </ListItemButton>
                </Link>
              </ListItem>
            )}
          </List>
          <h4 className="text-secondary-foreground text-xs font-medium mt-2.5 ml-5">Network</h4>
          <List>
            {networks.hasFeatureInAny(NETWORKS, 'ecosystem') && (
              <ListItem>
                <Link to="/ecosystem" className="w-full text-foreground!">
                  <ListItemButton
                    className="text-primary"
                    selected={location.pathname.includes('/ecosystem')}
                  >
                    <ListItemIcon>
                      <Globe2 className="text-foreground" size={18} />
                    </ListItemIcon>
                    <ListItemText primary="Ecosystem" />
                  </ListItemButton>
                </Link>
              </ListItem>
            )}
            {networks.hasFeatureInAny(NETWORKS, 'chains') && (
              <ListItem>
                <Link to="/chains" className="w-full text-foreground!">
                  <ListItemButton
                    className="text-primary"
                    selected={
                      location.pathname.includes('/chains') || location.pathname.includes('/admin')
                    }
                  >
                    <ListItemIcon>
                      <Link2 className="text-foreground" size={18} />
                    </ListItemIcon>
                    <ListItemText primary="SKALE Chains" />
                  </ListItemButton>
                </Link>
              </ListItem>
            )}
            {networks.hasFeatureInAny(NETWORKS, 'staking') && (
              <ListItem>
                <Link to="/staking" className="w-full text-foreground!">
                  <ListItemButton
                    className="text-primary"
                    selected={location.pathname.includes('/staking')}
                  >
                    <ListItemIcon>
                      <PieChart className="text-foreground" size={18} />
                    </ListItemIcon>
                    <ListItemText primary="Staking" />
                  </ListItemButton>
                </Link>
              </ListItem>
            )}
            {networks.hasFeatureInAny(NETWORKS, 'staking') && (
              <ListItem>
                <Link to="/validators" className="w-full text-foreground!">
                  <ListItemButton
                    className="text-primary"
                    selected={location.pathname.includes('/validator')}
                  >
                    <ListItemIcon>
                      <Users className="text-foreground" size={18} />
                    </ListItemIcon>
                    <ListItemText primary="Validators" />
                    <DelegationsNotification
                      validatorDelegations={props.validatorDelegations}
                      className="mr-1.5"
                    />
                  </ListItemButton>
                </Link>
              </ListItem>
            )}
            {networks.hasFeatureInAny(NETWORKS, 'stats') && (
              <ListItem>
                <Link to="/stats" className="w-full text-foreground!">
                  <ListItemButton
                    className="text-primary"
                    selected={location.pathname === '/stats'}
                  >
                    <ListItemIcon>
                      <BarChart2 className="text-foreground" size={18} />
                    </ListItemIcon>
                    <ListItemText primary="Stats" />
                  </ListItemButton>
                </Link>
              </ListItem>
            )}
            {networks.hasFeatureInAny(NETWORKS, 'credits') && (
              <ListItem>
                <Link to="/credits" className="w-full text-foreground!">
                  <ListItemButton
                    className="text-primary"
                    selected={
                      location.pathname === '/credits' || location.pathname === '/credits/admin'
                    }
                  >
                    <ListItemIcon>
                      <BadgeDollarSign className="text-foreground" size={18} />
                    </ListItemIcon>
                    <ListItemText primary="Chain Credits" />
                    <div className="chipNew">
                      <p className="text-xs">NEW</p>
                    </div>
                  </ListItemButton>
                </Link>
              </ListItem>
            )}
          </List>
        </Box>
      </Drawer>
    </Box>
  )
}
