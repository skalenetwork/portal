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

import { cls, cmn } from '@skalenetwork/metaport'
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

import SwapHorizontalCircleOutlinedIcon from '@mui/icons-material/SwapHorizontalCircleOutlined'
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined'
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined'
import PieChartOutlineOutlinedIcon from '@mui/icons-material/PieChartOutlineOutlined'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined'
import AddCardRoundedIcon from '@mui/icons-material/AddCardRounded'
import LinkRoundedIcon from '@mui/icons-material/LinkRounded'
import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined'
import PaymentsRoundedIcon from '@mui/icons-material/PaymentsRounded'

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
            boxSizing: 'border-box'
          }
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }} className={cmn.mtop20}>
          <List>
            <ListItem>
              <Link to="/" className="undec fullW">
                <ListItemButton className={cls(cmn.pPrim)} selected={location.pathname === '/'}>
                  <ListItemIcon>
                    <HomeOutlinedIcon />
                  </ListItemIcon>
                  <ListItemText primary="Home" />
                </ListItemButton>
              </Link>
            </ListItem>
            <ListItem>
              <a className="undec fullW" target="_blank" href={GET_STARTED_URL} rel="noreferrer">
                <ListItemButton className={cls(cmn.pPrim)}>
                  <ListItemIcon>
                    <ExploreOutlinedIcon />
                  </ListItemIcon>
                  <ListItemText primary="Get Started" />
                </ListItemButton>
              </a>
            </ListItem>
          </List>
          <h4 className={cls(cmn.pSec, cmn.p, cmn.p4, cmn.mtop10, cmn.mleft20)}>Transfer</h4>
          <List>
            <ListItem>
              <Link to="/bridge" className="undec fullW">
                <ListItemButton
                  className={cls(cmn.pPrim)}
                  selected={
                    location.pathname === '/bridge/history' || location.pathname === '/bridge'
                  }
                >
                  <ListItemIcon>
                    <SwapHorizontalCircleOutlinedIcon />
                  </ListItemIcon>
                  <ListItemText primary="Bridge" />
                </ListItemButton>
              </Link>
            </ListItem>
            {networks.hasFeatureInAny(NETWORKS, 'onramp') && (
              <ListItem>
                <Link to="/onramp" className="undec fullW">
                  <ListItemButton
                    className={cls(cmn.pPrim)}
                    selected={location.pathname === '/onramp'}
                  >
                    <ListItemIcon>
                      <AddCardRoundedIcon />
                    </ListItemIcon>
                    <ListItemText primary="On-Ramp" />
                  </ListItemButton>
                </Link>
              </ListItem>
            )}
          </List>
          <h4 className={cls(cmn.pSec, cmn.p, cmn.p4, cmn.mtop10, cmn.mleft20)}>Network</h4>
          <List>
            {networks.hasFeatureInAny(NETWORKS, 'ecosystem') && (
              <ListItem>
                <Link to="/ecosystem" className="undec fullW">
                  <ListItemButton
                    className={cls(cmn.pPrim)}
                    selected={location.pathname.includes('/ecosystem')}
                  >
                    <ListItemIcon>
                      <PublicOutlinedIcon />
                    </ListItemIcon>
                    <ListItemText primary="Ecosystem" />
                  </ListItemButton>
                </Link>
              </ListItem>
            )}
            {networks.hasFeatureInAny(NETWORKS, 'chains') && (
              <ListItem>
                <Link to="/chains" className="undec fullW">
                  <ListItemButton
                    className={cls(cmn.pPrim)}
                    selected={
                      location.pathname.includes('/chains') || location.pathname.includes('/admin')
                    }
                  >
                    <ListItemIcon>
                      <LinkRoundedIcon />
                    </ListItemIcon>
                    <ListItemText primary="SKALE Chains" />
                  </ListItemButton>
                </Link>
              </ListItem>
            )}
            {networks.hasFeatureInAny(NETWORKS, 'staking') && (
              <ListItem>
                <Link to="/staking" className="undec fullW">
                  <ListItemButton
                    className={cls(cmn.pPrim)}
                    selected={location.pathname.includes('/staking')}
                  >
                    <ListItemIcon>
                      <PieChartOutlineOutlinedIcon />
                    </ListItemIcon>
                    <ListItemText primary="Staking" />
                  </ListItemButton>
                </Link>
              </ListItem>
            )}
            {networks.hasFeatureInAny(NETWORKS, 'staking') && (
              <ListItem>
                <Link to="/validators" className="undec fullW">
                  <ListItemButton
                    className={cls(cmn.pPrim)}
                    selected={location.pathname.includes('/validator')}
                  >
                    <ListItemIcon>
                      <GroupOutlinedIcon />
                    </ListItemIcon>
                    <ListItemText primary="Validators" />
                    <DelegationsNotification
                      validatorDelegations={props.validatorDelegations}
                      className={cls(cmn.mri5)}
                    />
                  </ListItemButton>
                </Link>
              </ListItem>
            )}
            {networks.hasFeatureInAny(NETWORKS, 'stats') && (
              <ListItem>
                <Link to="/stats" className="undec fullW">
                  <ListItemButton
                    className={cls(cmn.pPrim)}
                    selected={location.pathname === '/stats'}
                  >
                    <ListItemIcon>
                      <InsertChartOutlinedIcon />
                    </ListItemIcon>
                    <ListItemText primary="Stats" />
                  </ListItemButton>
                </Link>
              </ListItem>
            )}
            {networks.hasFeatureInAny(NETWORKS, 'credits') && (
              <ListItem>
                <Link to="/credits" className="undec fullW">
                  <ListItemButton
                    className={cls(cmn.pPrim)}
                    selected={location.pathname === '/credits'}
                  >
                    <ListItemIcon>
                      <PaymentsRoundedIcon />
                    </ListItemIcon>
                    <ListItemText primary="Chain Credits" />
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
