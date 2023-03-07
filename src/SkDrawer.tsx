import { Link, useLocation } from "react-router-dom";

import Box from '@mui/material/Box';

import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';

import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import SwapHorizontalCircleOutlinedIcon from '@mui/icons-material/SwapHorizontalCircleOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import OutboundOutlinedIcon from '@mui/icons-material/OutboundOutlined';
import LocalGasStationOutlinedIcon from '@mui/icons-material/LocalGasStationOutlined';
import SettingsApplicationsOutlinedIcon from '@mui/icons-material/SettingsApplicationsOutlined';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import AppsOutlinedIcon from '@mui/icons-material/AppsOutlined';

import { METAPORT_CONFIG } from './core/constants';
import { getProxyEndpoint } from './core/network';

const drawerWidth = 240;


export default function SkDrawer() {
    const location = useLocation();
    return (
        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
            }}
        >
            <Toolbar />
            <Box sx={{ overflow: 'auto' }} className="mp__margTop20">
                <h4 className="secondaryText sectionHeader">Bridge</h4>
                <List>
                    <ListItem  >
                        <Link to="/" className="undec fullWidth">
                            <ListItemButton
                                selected={location.pathname === "/" || location.pathname.includes('/transfer')}>
                                <ListItemIcon>
                                    <SwapHorizontalCircleOutlinedIcon />
                                </ListItemIcon>
                                <ListItemText primary='Transfer' />
                            </ListItemButton>
                        </Link>
                    </ListItem>
                    <ListItem  >
                        <Link to="/bridge/exit" className="undec fullWidth">
                            <ListItemButton
                                selected={location.pathname === "/bridge/exit"}>
                                <ListItemIcon>
                                    <AccountBalanceWalletOutlinedIcon />
                                </ListItemIcon>
                                <ListItemText primary='Exit gas wallet' />
                            </ListItemButton>
                        </Link>
                    </ListItem>
                    {/* <ListItem  >
                        <Link to="/bridge/overview" className="undec fullWidth">
                            <ListItemButton
                                selected={location.pathname === "/bridge/overview"}>
                                <ListItemIcon>
                                    <AppsOutlinedIcon />
                                </ListItemIcon>
                                <ListItemText primary='Overview' />
                            </ListItemButton>
                        </Link>
                    </ListItem> */}
                </List>
                <h4 className="secondaryText sectionHeader">Other</h4>
                <List>
                    <ListItem  >
                        <Link to="/other/faq" className="undec fullWidth">
                            <ListItemButton
                                selected={location.pathname === "/other/faq"}>
                                <ListItemIcon>
                                    <HelpOutlineOutlinedIcon />
                                </ListItemIcon>
                                <ListItemText primary='FAQ' />
                            </ListItemButton>
                        </Link>
                    </ListItem>
                    <ListItem>
                        <a className="undec fullWidth" target="_blank" href={getProxyEndpoint(METAPORT_CONFIG.skaleNetwork)}>
                            <ListItemButton>
                                <ListItemIcon>
                                    <PublicOutlinedIcon />
                                </ListItemIcon>
                                <ListItemText primary='Get endpoints' />
                                <ArrowOutwardIcon className="drawerIconRi" />
                            </ListItemButton>
                        </a>
                    </ListItem>
                    <ListItem>
                        <a className="undec fullWidth" target="_blank" href='https://sfuel.skale.network/'>
                            <ListItemButton>
                                <ListItemIcon>
                                    <LocalGasStationOutlinedIcon />
                                </ListItemIcon>
                                <ListItemText primary='Get sFUEL' />
                                <ArrowOutwardIcon className="drawerIconRi" />
                            </ListItemButton>
                        </a>
                    </ListItem>
                    {/* <ListItem>
                        <a className="undec fullWidth" target="_blank" href='https://admin.skale.network/'>
                            <ListItemButton>
                                <ListItemIcon>
                                    <SettingsApplicationsOutlinedIcon />
                                </ListItemIcon>
                                <ListItemText primary='Admin UI' />
                                <OutboundOutlinedIcon className="drawerIconRi" />
                            </ListItemButton>
                        </a>
                    </ListItem> */}
                    <ListItem>
                        <a className="undec fullWidth" target="_blank" href='https://docs.skale.network/'>
                            <ListItemButton>
                                <ListItemIcon>
                                    <ArticleOutlinedIcon />
                                </ListItemIcon>
                                <ListItemText primary='Docs portal' />
                                <ArrowOutwardIcon className="drawerIconRi" />
                            </ListItemButton>
                        </a>
                    </ListItem>
                </List>
            </Box>
        </Drawer >
    );
}
