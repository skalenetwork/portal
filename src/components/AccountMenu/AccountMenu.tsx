import * as React from 'react';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';


import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'

import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import ButtonBase from '@mui/material/ButtonBase/ButtonBase';
import WalletIcon from '@mui/icons-material/Wallet';

import { Link } from "react-router-dom";

import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import InventoryOutlinedIcon from '@mui/icons-material/InventoryOutlined';
import HubOutlinedIcon from '@mui/icons-material/HubOutlined';
import HistoryIcon from '@mui/icons-material/History';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import SignalCellularAltOutlinedIcon from '@mui/icons-material/SignalCellularAltOutlined';
import { METAPORT_CONFIG } from '../../core/constants';
import { getProxyEndpoint } from '../../core/network';


export default function AccountMenu(props: any) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    if (!props.address) return;
    return (
        <React.Fragment>
            <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }} >
                <Tooltip arrow title="Click to expand">
                    <Button
                        onClick={handleClick}
                        className='mp__btnConnect mp__btnConnected'
                    >
                        <Jazzicon diameter={20} seed={jsNumberForAddress(props.address)} />
                        {/* {open ? props.address : props.address.substring(0, 5) + '...' + props.address.substring(props.address.length - 3)} */}
                        {props.address.substring(0, 5) + '...' + props.address.substring(props.address.length - 3)}
                    </Button>
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
                        <HistoryIcon className='mp__margRi10' />  Transactions history
                    </MenuItem>
                </Link>
                <a className="undec fullWidth" target="_blank" href={'https://etherscan.io/address/' + props.address}>
                    <MenuItem onClick={handleClose}>
                        <div className='mp__flex'>
                            <SignalCellularAltOutlinedIcon className='mp__margRi10' />
                        </div>
                        <div className='mp__flex mp__flexGrow'>
                            View on Etherscan
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



