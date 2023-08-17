import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import ContactSupportRoundedIcon from '@mui/icons-material/ContactSupportRounded';

import { cls, styles, common } from '@skalenetwork/metaport';


export default function HelpZen() {
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
                        className={cls('mp__btnConnect', styles.paperGrey, common.pMain, common.flex)}>
                        <ContactSupportRoundedIcon className='mp__margRi5' style={{ height: '20px', width: '20px' }} />
                        Get help
                    </Button>
                </Tooltip>
            </Box>
        </React.Fragment >
    );
}