import { Link, useLocation } from 'react-router-dom'
import { cls, cmn } from '@skalenetwork/metaport'

import Box from '@mui/material/Box'

import Drawer from '@mui/material/Drawer'
import Toolbar from '@mui/material/Toolbar'
import List from '@mui/material/List'

import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'

import SwapHorizontalCircleOutlinedIcon from '@mui/icons-material/SwapHorizontalCircleOutlined'
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined'
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined'
import HistoryIcon from '@mui/icons-material/History'
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined'
// import AppsOutlinedIcon from '@mui/icons-material/AppsOutlined'
// import WalletOutlinedIcon from '@mui/icons-material/WalletOutlined'
import ArrowOutwardRoundedIcon from '@mui/icons-material/ArrowOutwardRounded'
import DonutLargeRoundedIcon from '@mui/icons-material/DonutLargeRounded'
import { DUNE_SKALE_URL } from './core/constants'

const drawerWidth = 240

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
          <h4 className={cls(cmn.pSec, cmn.p, cmn.p4, cmn.mtop10, cmn.mleft20)}>Bridge</h4>
          <List>
            <ListItem>
              <Link to="/" className="undec fullWidth">
                <ListItemButton
                  className={cls(cmn.pPrim)}
                  selected={location.pathname === '/' || location.pathname.includes('/transfer')}
                >
                  <ListItemIcon>
                    <SwapHorizontalCircleOutlinedIcon />
                  </ListItemIcon>
                  <ListItemText primary="Transfer" />
                </ListItemButton>
              </Link>
            </ListItem>
            <ListItem>
              <Link to="/bridge/history" className="undec fullWidth">
                <ListItemButton
                  className={cls(cmn.pPrim)}
                  selected={location.pathname === '/bridge/history'}
                >
                  <ListItemIcon>
                    <HistoryIcon />
                  </ListItemIcon>
                  <ListItemText primary="History" />
                </ListItemButton>
              </Link>
            </ListItem>
            {/* <ListItem>
              <Link to="/portfolio" className="undec fullWidth">
                <ListItemButton
                  className={cls(cmn.pPrim)}
                  selected={location.pathname === '/portfolio'}
                >
                  <ListItemIcon>
                    <WalletOutlinedIcon />
                  </ListItemIcon>
                  <ListItemText primary="Portfolio" />
                </ListItemButton>
              </Link>
            </ListItem> */}
            <ListItem>
              <Link to="/other/faq" className="undec fullWidth">
                <ListItemButton
                  className={cls(cmn.pPrim)}
                  selected={location.pathname === '/other/faq'}
                >
                  <ListItemIcon>
                    <HelpOutlineOutlinedIcon />
                  </ListItemIcon>
                  <ListItemText primary="FAQ" />
                </ListItemButton>
              </Link>
            </ListItem>
          </List>
          <h4 className={cls(cmn.pSec, cmn.p, cmn.p4, cmn.mtop10, cmn.mleft20)}>Network</h4>
          <List>
            <ListItem>
              <Link to="/chains" className="undec fullWidth">
                <ListItemButton
                  className={cls(cmn.pPrim)}
                  selected={location.pathname.includes('/chains')}
                >
                  <ListItemIcon>
                    <PublicOutlinedIcon />
                  </ListItemIcon>
                  <ListItemText primary="Chains" />
                </ListItemButton>
              </Link>
            </ListItem>
            {/* <ListItem>
              <Link to="/apps" className="undec fullWidth">
                <ListItemButton
                  className={cls(cmn.pPrim)}
                  selected={location.pathname.includes('/apps')}
                >
                  <ListItemIcon>
                    <AppsOutlinedIcon />
                  </ListItemIcon>
                  <ListItemText primary="Apps" />
                </ListItemButton>
              </Link>
            </ListItem> */}
            <ListItem>
              <Link to="/stats" className="undec fullWidth">
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
            <ListItem>
              <a className="undec fullWidth" target="_blank" href={DUNE_SKALE_URL}>
                <ListItemButton className={cls(cmn.pPrim)}>
                  <ListItemIcon>
                    <DonutLargeRoundedIcon />
                  </ListItemIcon>
                  <ListItemText primary="Analytics" />
                  <ArrowOutwardRoundedIcon className="drawerIconRi" />
                </ListItemButton>
              </a>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </Box>
  )
}
