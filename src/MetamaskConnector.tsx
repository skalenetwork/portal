import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import ButtonBase from '@mui/material/ButtonBase/ButtonBase';
import WalletIcon from '@mui/icons-material/Wallet';

export default function MetamaskConnector(props: any) {
    if (!props.address && !props.connect) return null;
    return (
        <div className=''>
            {(props.address ? (<ButtonBase
                onClick={props.connectMetamask}
                className='mp__btnConnect mp__btnConnected'
            >
                <Paper color='red' elevation={0} className='mp__flex mp__flexCentered'>
                    <h3 className='mp__btnChain mp__margRi10'>Connected </h3>
                    <WalletIcon />
                </Paper>
            </ButtonBase>) : (<Button
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
