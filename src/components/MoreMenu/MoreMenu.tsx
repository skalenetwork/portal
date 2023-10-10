import * as React from 'react';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';

import { Link } from "react-router-dom";

import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import InventoryOutlinedIcon from '@mui/icons-material/InventoryOutlined';
import HubOutlinedIcon from '@mui/icons-material/HubOutlined';
import PrivacyTipOutlinedIcon from '@mui/icons-material/PrivacyTipOutlined';

import { METAPORT_CONFIG } from '../../core/constants';
import { getProxyEndpoint } from '../../core/network';

import './MoreMenu.scss';


export default function MoreMenu() {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <React.Fragment>
            <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }} >
                <Tooltip arrow title="Useful links">
                    <IconButton
                        id="basic-button"
                        aria-controls={open ? 'basic-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClick}
                        className='mp__margLeft10 moreBtn'
                    >
                        <MoreVertIcon />
                    </IconButton>
                </Tooltip>
            </Box>
            <Menu
                className='mp__moreMenu'
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                        '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <Link to="/other/terms-of-service" className="undec fullWidth">
                    <MenuItem onClick={handleClose}>
                        <InventoryOutlinedIcon className='mp__margRi10' /> Terms of service
                    </MenuItem>
                </Link>
                <Link to="/other/privacy-policy" className="undec fullWidth">
                    <MenuItem onClick={handleClose}>
                        <PrivacyTipOutlinedIcon className='mp__margRi10' /> Privacy policy
                    </MenuItem>
                </Link>
                <a className="undec fullWidth" target="_blank" href='https://skale.space/'>
                    <MenuItem onClick={handleClose}>
                        <div className='mp__flex'>
                            <PublicOutlinedIcon className='mp__margRi10' />
                        </div>
                        <div className='mp__flex mp__flexGrow'>
                            Main website
                        </div>
                        <div className='mp__flex mp__margLeft10'>
                            <ArrowOutwardIcon className="menuIconRi" />
                        </div>
                    </MenuItem>
                </a>
                <a className="undec fullWidth" target="_blank" href='https://docs.skale.network/'>
                    <MenuItem onClick={handleClose} className='undec'>
                        <div className='mp__flex'>
                            <ArticleOutlinedIcon className='mp__margRi10' />
                        </div>
                        <div className='mp__flex mp__flexGrow'>
                            Docs portal
                        </div>
                        <div className='mp__flex mp__margLeft10'>
                            <ArrowOutwardIcon className="menuIconRi" />
                        </div>
                    </MenuItem>
                </a>
                <a className="undec fullWidth" target="_blank" href={getProxyEndpoint(METAPORT_CONFIG.skaleNetwork)}>
                    <MenuItem onClick={handleClose} className='undec fullWidth'>
                        <div className='mp__flex'>
                            <HubOutlinedIcon className='mp__margRi10' />
                        </div>
                        <div className='mp__flex mp__flexGrow'>
                            Network UI
                        </div>
                        <div className='mp__flex mp__margLeft10'>
                            <ArrowOutwardIcon className="menuIconRi" />
                        </div>
                    </MenuItem>
                </a>
            </Menu>
        </React.Fragment>
    );
}



