import debug from 'debug';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';

import { MDXProvider } from '@mdx-js/react'
import PrivacyPolicyMd from './privacy-policy.mdx'

debug.enable('*');
const log = debug('bridge:components:Terms');


export default function PrivacyPolicy(props: any) {
    return (<Container maxWidth="md" className='textPage'>
        <Stack spacing={2}>
            <div className='mp__flex mp__flexCenteredVert mp__margTop20'>
                <div className='mp__flex'>
                    <h2 className="mp__flex mp__noMarg">Privacy Policy</h2>
                </div>
            </div>
            <p className='mp__noMarg mp__p mp__p4'>
                This Privacy Policy describes how your personal information is collected, used, and shared
            </p>
            <MDXProvider >
                <PrivacyPolicyMd />
            </MDXProvider>
        </Stack>
    </Container>)
}