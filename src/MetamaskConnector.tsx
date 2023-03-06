import React from 'react';

import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'

import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import ButtonBase from '@mui/material/ButtonBase/ButtonBase';
import WalletIcon from '@mui/icons-material/Wallet';

export default function MetamaskConnector(props: any) {
    const [open, setOpen] = React.useState<boolean>(false);

    function toggleOpen() {
        setOpen(!open);
    }

    if (!props.address && !props.connect) return null;
    return (
        <div className=''>
            {(props.address ? (
                <Tooltip arrow title={open ? 'Click to minimize' : 'Click to show connected wallet'}>
                    <Button
                        onClick={toggleOpen}
                        className='mp__btnConnect mp__btnConnected'
                    >
                        <Jazzicon diameter={20} seed={jsNumberForAddress(props.address)} />
                        {open ? props.address : props.address.substring(0, 5) + '...' + props.address.substring(props.address.length - 3)}
                    </Button>
                </Tooltip>
            ) : (<Button
                onClick={props.connectMetamask}
                className='mp__btnConnect'
                variant="contained"
            >
                <h3 className='mp__btnChainBig'>Click here to connect wallet</h3>
            </Button>))
            }
        </div >
    )
}
