import React, { useEffect } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import ChainCard from '../ChainCard';

import { ICONS } from '../../core/constants';


export default function ChainCards(props: any) {
    return (<div>
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={3}>
                {Object.keys(props.chains).map((toChain: any, index: number) => (
                    <Grid key={index} className='fl-centered dappCard' item md={3} sm={6} xs={6}>
                        <ChainCard
                            icons={ICONS}
                            chain={props.chains[toChain]}
                            toChain={toChain}
                            from={props.from}
                            fromApp={props.fromApp}
                        />
                    </Grid>
                ))}
            </Grid>
        </Box>
    </div>)
}