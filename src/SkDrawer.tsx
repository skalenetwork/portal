import { Link, useLocation } from "react-router-dom";
import { cmn } from '@skalenetwork/metaport';

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
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import HistoryIcon from '@mui/icons-material/History';
import SpaceDashboardOutlinedIcon from '@mui/icons-material/SpaceDashboardOutlined';
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';


const drawerWidth = 240;


export default function SkDrawer() {
    const location = useLocation();
    return (
        <Box display={{ sm: 'block', xs: 'none' }} m={1}>
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
                }}
            >
                <Toolbar />
                <Box sx={{ overflow: 'auto' }} className={cmn.mtop20}>
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
                            <Link to="/bridge/history" className="undec fullWidth">
                                <ListItemButton
                                    selected={location.pathname === "/bridge/history"}>
                                    <ListItemIcon>
                                        <HistoryIcon />
                                    </ListItemIcon>
                                    <ListItemText primary='History' />
                                </ListItemButton>
                            </Link>
                        </ListItem>
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
                        {/* <ListItem  >
                            <Link to="/bridge/exit" className="undec fullWidth">
                                <ListItemButton
                                    selected={location.pathname === "/bridge/exit"}>
                                    <ListItemIcon>
                                        <AccountBalanceWalletOutlinedIcon />
                                    </ListItemIcon>
                                    <ListItemText primary='Exit gas wallet' />
                                </ListItemButton>
                            </Link>
                        </ListItem> */}
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
                    <h4 className="secondaryText sectionHeader">Network</h4>
                    <List>
                        <ListItem>
                            <Link to="/chains" className="undec fullWidth">
                                <ListItemButton selected={location.pathname.includes("/chains")}>
                                    <ListItemIcon>
                                        <PublicOutlinedIcon />
                                    </ListItemIcon>
                                    <ListItemText primary='Chains' />
                                </ListItemButton>
                            </Link>
                        </ListItem>

                        <ListItem>
                            <Link to="/stats" className="undec fullWidth">
                                <ListItemButton selected={location.pathname === "/stats"}>
                                    <ListItemIcon>
                                        <InsertChartOutlinedIcon />
                                    </ListItemIcon>
                                    <ListItemText primary='Stats' />
                                </ListItemButton>
                            </Link>
                        </ListItem>

                        <ListItem>
                            <a className="undec fullWidth" target="_blank" href='https://dune.com/manel/skale-analytics'>
                                <ListItemButton>
                                    <ListItemIcon>
                                        <SpaceDashboardOutlinedIcon />
                                    </ListItemIcon>
                                    <ListItemText primary='Dune Dashboard' />
                                    <ArrowOutwardIcon className="drawerIconRi" />
                                </ListItemButton>
                            </a>
                        </ListItem>

                        {/* <ListItem>
                            <a className="undec fullWidth" target="_blank" href='https://sfuel.skale.network/'>
                                <ListItemButton>
                                    <ListItemIcon>
                                        <LocalGasStationOutlinedIcon />
                                    </ListItemIcon>
                                    <ListItemText primary='Get sFUEL' />
                                    <ArrowOutwardIcon className="drawerIconRi" />
                                </ListItemButton>
                            </a>
                        </ListItem> */}
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
                        {/* <ListItem>
                            <a className="undec fullWidth" target="_blank" href='https://skale.space/stats'>
                                <ListItemButton>
                                    <ListItemIcon>
                                        <LeaderboardRoundedIcon />
                                    </ListItemIcon>
                                    <ListItemText primary='Stats' />
                                    <ArrowOutwardIcon className="drawerIconRi" />
                                </ListItemButton>
                            </a>
                        </ListItem> */}
                        {/* <ListItem>
                            <a className="undec fullWidth" target="_blank" href='https://docs.skale.network/'>
                                <ListItemButton>
                                    <ListItemIcon>
                                        <ArticleOutlinedIcon />
                                    </ListItemIcon>
                                    <ListItemText primary='Docs portal' />
                                    <ArrowOutwardIcon className="drawerIconRi" />
                                </ListItemButton>
                            </a>
                        </ListItem> */}
                    </List>
                </Box>
            </Drawer >
        </Box>

    );
}
