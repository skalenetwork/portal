import debug from 'debug';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';

import FaqAccordion from '../FaqAccordion';

debug.enable('*');
const log = debug('bridge:components:Faq');


export default function Faq(props: any) {
    return (<Container maxWidth="md">
        <Stack spacing={3}>
            <div className='mp__flex mp__flexCenteredVert mp__margTop20'>
                <div className='mp__flex'>
                    <h2 className="mp__flex mp__noMarg">FAQ</h2>
                </div>
            </div>
            <p className='mp__noMarg mp__p mp__p4'>
                Common questions about SKALE Bridge
            </p>
            <FaqAccordion />
        </Stack>
    </Container>)
}