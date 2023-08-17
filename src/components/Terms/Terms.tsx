import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';

import TermsOfService from './terms-of-service.mdx'


export default function Terms() {
    return (<Container maxWidth="md" className='textPage'>
        <Stack spacing={2}>
            <div className='mp__flex mp__flexCenteredVert mp__margTop20'>
                <div className='mp__flex'>
                    <h2 className="mp__flex mp__noMarg">Terms of Service</h2>
                </div>
            </div>
            <p className='mp__noMarg mp__p mp__p4'>
                SKALE Network Blockchain Bridge Terms of Service
            </p>
            <TermsOfService />
        </Stack>
    </Container>)
}