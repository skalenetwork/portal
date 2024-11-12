import { cls, cmn } from '@skalenetwork/metaport'
import { useLocation, Link } from 'react-router-dom'

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

const drawerWidth = 220

export default function SkDrawer() {
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
          </List>
          <h4 className={cls(cmn.pSec, cmn.p, cmn.p4, cmn.mtop10, cmn.mleft20)}>Network</h4>
          <List>
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
                  <div className="chipNew">
                    <p className={cls(cmn.p, cmn.p5)}>NEW</p>
                  </div>
                </ListItemButton>
              </Link>
            </ListItem>
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
                </ListItemButton>
              </Link>
            </ListItem>
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
          </List>
        </Box>
      </Drawer>
    </Box>
  )
}
