import { Link, useLocation } from "react-router-dom";

import Box from '@mui/material/Box';

import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';

import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import StorefrontIcon from '@mui/icons-material/Storefront';
import MoveUpIcon from '@mui/icons-material/MoveUp';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import ExploreIcon from '@mui/icons-material/Explore';
import AddLinkIcon from '@mui/icons-material/AddLink';
import SettingsEthernetIcon from '@mui/icons-material/SettingsEthernet';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import WidgetsIcon from '@mui/icons-material/Widgets';
import RequestPageIcon from '@mui/icons-material/RequestPage';

import { getChainIcon } from './components/ActionCard/helper';

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
                <h4 className="secondaryText sectionHeader">From Mainnet</h4>
                <List>
                    <ListItem  >
                        <Link to="/common/sandbox" className="undec fullWidth">
                            <ListItemButton
                                selected={location.pathname === "/common/s"}>
                                <ListItemIcon>
                                    {getChainIcon('staging-perfect-parallel-gacrux', true)}
                                </ListItemIcon>
                                <ListItemText primary='Europa Hub' />
                            </ListItemButton>
                        </Link>
                    </ListItem>
                    <ListItem  >
                        <Link to="/common/sandbox" className="undec fullWidth">
                            <ListItemButton
                                selected={location.pathname === "/common/sandbox" || location.pathname === "/"}>
                                <ListItemIcon>
                                    {getChainIcon('staging-severe-violet-wezen', true)}
                                </ListItemIcon>
                                <ListItemText primary='Calypso Hub' />
                            </ListItemButton>
                        </Link>
                    </ListItem>
                    <ListItem  >
                        <Link to="/common/sandbox" className="undec fullWidth">
                            <ListItemButton
                                selected={location.pathname === "/common/sandbox" || location.pathname === "/"}>
                                <ListItemIcon>
                                    <WidgetsIcon />
                                </ListItemIcon>
                                <ListItemText primary='Popular' />
                            </ListItemButton>
                        </Link>
                    </ListItem>
                </List>
                <h4 className="secondaryText sectionHeader">ERC20</h4>
                <List>
                    <ListItem >
                        <Link to="/erc20/s2s" className="undec fullWidth">
                            <ListItemButton selected={location.pathname === "/erc20/s2s"}>
                                <ListItemIcon>
                                    <ElectricBoltIcon />
                                </ListItemIcon>
                                <ListItemText className='undec' primary='S2S Demo' />
                            </ListItemButton>
                        </Link>
                    </ListItem>
                    <ListItem >
                        <Link to="/erc20/wrap" className="undec fullWidth">
                            <ListItemButton selected={location.pathname === "/erc20/wrap"}>
                                <ListItemIcon>
                                    <MoveUpIcon />
                                </ListItemIcon>
                                <ListItemText className='undec' primary='Wrap Demo' />
                            </ListItemButton>
                        </Link>
                    </ListItem>
                    <ListItem >
                        <Link to="/erc20/transfer-requests" className="undec fullWidth">
                            <ListItemButton selected={location.pathname === "/erc20/transfer-requests"}>
                                <ListItemIcon>
                                    <RequestPageIcon />
                                </ListItemIcon>
                                <ListItemText className='undec' primary='Transfer requests' />
                            </ListItemButton>
                        </Link>
                    </ListItem>
                </List>
                <h4 className="secondaryText sectionHeader">NFT (ERC721 & ERC1155)</h4>
                <List>
                    <ListItem >
                        <Link to="/nft/medals" className="undec fullWidth">
                            <ListItemButton selected={location.pathname === "/nft/medals"}>
                                <ListItemIcon>
                                    <WorkspacePremiumIcon />
                                </ListItemIcon>
                                <ListItemText primary='Medals Demo' />
                            </ListItemButton>
                        </Link>
                    </ListItem>
                    <ListItem >
                        <Link to="/nft/marketplace" className="undec fullWidth">
                            <ListItemButton selected={location.pathname === "/nft/marketplace"}>
                                <ListItemIcon>
                                    <StorefrontIcon />
                                </ListItemIcon>
                                <ListItemText primary='Marketplace Demo' />
                            </ListItemButton>
                        </Link>
                    </ListItem>
                </List>
                {/* <h4 className="secondaryText sectionHeader">Manage</h4>
                <List>
                    <ListItem >
                        <Link to="/admin/connect-chains" className="undec fullWidth">
                            <ListItemButton selected={location.pathname === "/admin/connect-chains"}>
                                <ListItemIcon>
                                    <SettingsEthernetIcon />
                                </ListItemIcon>
                                <ListItemText primary='Connect chains' />
                            </ListItemButton>
                        </Link>
                    </ListItem>
                    <ListItem >
                        <Link to="/admin/link-tokens" className="undec fullWidth">
                            <ListItemButton selected={location.pathname === "/admin/link-tokens"}>
                                <ListItemIcon>
                                    <AddLinkIcon />
                                </ListItemIcon>
                                <ListItemText primary='Link tokens' />
                            </ListItemButton>
                        </Link>
                    </ListItem>
                </List> */}
            </Box>
        </Drawer >
    );
}
