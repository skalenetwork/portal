import debug from 'debug';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';


import { ICONS, CHAINS } from '../../core/constants';
import ChainOverview from '../ChainOverview';


debug.enable('*');
const log = debug('bridge:components:Overview');


export default function Overview(props: any) {

    let keys = Object.keys(CHAINS);

    return (<Container maxWidth="md">
        <Stack spacing={2}>
            <div className='mp__flex mp__flexCenteredVert'>
                <div className='mp__flex'>
                    <h2 className="mp__flex mp__noMarg">Overview</h2>
                </div>
            </div>
            <p className='mp__noMarg mp__p mp__p4'>
                Overview of your assets and balances across all chains
            </p>
            <Box className='mp__margTop20'>
                <Grid container spacing={2} >
                    {keys.map((chain: any, index: number) => (
                        <Grid key={index} className='fl-centered' item md={6} sm={12} xs={12}>
                            <ChainOverview chain={CHAINS[chain]} chainName={chain} icons={ICONS} address={props.address} />
                        </Grid>
                    ))}
                </Grid>
            </Box>

        </Stack>
    </Container>)
}