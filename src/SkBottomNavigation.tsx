import React, { useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";

import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import SwapHorizontalCircleOutlinedIcon from '@mui/icons-material/SwapHorizontalCircleOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import HistoryIcon from '@mui/icons-material/History';


export default function SkBottomNavigation() {
    const [value, setValue] = React.useState(0);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.pathname === "/" || location.pathname.includes('/transfer')) setValue(0);
        if (location.pathname === "/bridge/exit") setValue(1);
        if (location.pathname === "/other/faq") setValue(2);
    }, [location]);

    return (
        <Box display={{ sm: 'none', xs: 'block' }} className='br__bottomNav'>
            <BottomNavigation
                showLabels
                value={value}
                onChange={(event, newValue) => {
                    setValue(newValue);
                }}
            >
                <BottomNavigationAction
                    label="Transfer"
                    icon={<SwapHorizontalCircleOutlinedIcon />}
                    onClick={() => { navigate("/"); }}
                />
                <BottomNavigationAction
                    label="History"
                    icon={<HistoryIcon />}
                    onClick={() => { navigate("/bridge/history"); }}
                />
                <BottomNavigationAction
                    label="FAQ"
                    icon={<HelpOutlineOutlinedIcon />}
                    onClick={() => { navigate("/other/faq"); }}
                />
            </BottomNavigation>
        </Box>
    );
}