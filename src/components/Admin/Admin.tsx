import debug from 'debug';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';

import BridgePaper from '../BridgePaper';


debug.enable('*');
const log = debug('bridge:components:Admin');


export default function Admin(props: any) {
    return (<Container maxWidth="md">
        <Stack spacing={2}>
            <div className='mp__flex mp__flexCenteredVert'>
                <div className='mp__flex'>
                    <h2 className="mp__flex mp__noMarg">Admin</h2>
                </div>
            </div>
            <p className='mp__noMarg mp__p mp__p4'>
                SKALE IMA Admin dashboard
            </p>
            <BridgePaper rounded>
                <div>
                    <h4>Connect chains</h4>
                    test test test
                </div>
            </BridgePaper>
        </Stack>
    </Container>)
}