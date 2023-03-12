import debug from 'debug';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';

import CommunityPool from '../CommunityPool';

debug.enable('*');
const log = debug('bridge:components:ExitGasWallet');


export default function ExitGasWallet(props: any) {
    return (<Container maxWidth="md">
        <Stack spacing={2}>
            <div className='mp__flex mp__flexCenteredVert mp__margTop20'>
                <div className='mp__flex'>
                    <h2 className="mp__flex mp__noMarg">Exit Gas Wallet</h2>
                </div>
            </div>
            <p className='mp__noMarg mp__p mp__p4'>
                Manage your Exit Gas Wallet
            </p>

            <p className='mp__margTop40 mp__textCentered mp__p mp__p2'>
                🏗️ Work in progress <br />
                Exit gas wallet functionality is available on the transfer page when transferring to Ethereum
            </p>
        </Stack>
    </Container>)
}