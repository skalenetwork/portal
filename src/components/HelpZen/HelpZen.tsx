import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import ContactSupportRoundedIcon from '@mui/icons-material/ContactSupportRounded';

import './HelpZen.scss';


export default function MoreMenu() {
    const [open, setOpen] = React.useState<boolean>(false);

    useEffect(() => {
        window.zE('messenger', 'close');
        window.zE('messenger:on', 'open', () => { setOpen(true) })
        window.zE('messenger:on', 'close', () => { setOpen(false) })
    }, []);

    function handleClick() {
        window.zE('messenger', open ? 'close' : 'open');
    }

    return (
        <React.Fragment>
            <Box
                className='mp__margLeft10'
                sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }} >
                <Tooltip arrow title={open ? 'Click to hide chat' : 'Click to open chat'}>
                    <Button
                        onClick={handleClick}
                        className='mp__btnConnect mp__btnConnected'
                    >
                        <ContactSupportRoundedIcon className='mp__margRi10' />
                        Get help
                    </Button>
                </Tooltip>
            </Box>
        </React.Fragment>
    );
}