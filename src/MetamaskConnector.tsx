import React from "react";
import TextField from '@mui/material/TextField';

import Paper from '@mui/material/Paper';
import ButtonBase from '@mui/material/ButtonBase/ButtonBase';

import ElectricalServicesIcon from '@mui/icons-material/ElectricalServices';
import WalletIcon from '@mui/icons-material/Wallet';

export default function MetamaskConnector(props: any) {
    return (
        <div className=''>
            {(props.address ? (<ButtonBase
                onClick={props.connectMetamask}
                className='mp__btnConnect mp__btnConnected'
            >
                <Paper color='red' elevation={0} className='mp__flex mp__flexCentered'>
                    <h3 className='mp__btnChain mp__margRi10'>Connected </h3>
                    {/* <h3 className='mp__btnChain mp__margRi10'>Connected {props.address}</h3> */}
                    <WalletIcon/>
                </Paper>
            </ButtonBase>) : (<ButtonBase
                onClick={props.connectMetamask}
                className='mp__btnConnect'
            >
                <Paper elevation={0} className='mp__flex mp__flexCentered'>
                    <h3 className='mp__btnChain mp__margRi10'>Connect wallet</h3>
                    <ElectricalServicesIcon/>
                </Paper>
            </ButtonBase>))
            }
        </div >
    )
}
