import React, { useEffect } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import ActionCard from '../ActionCard';

import { ICONS } from '../../core/constants';

import './PopularActions.scss';

const ACTIONS = [
    {
        from: 'mainnet',
        to: 'staging-perfect-parallel-gacrux',
        tokens: ['usdt', 'usdc', 'uni']
    },
    {
        from: 'mainnet',
        to: 'staging-severe-violet-wezen',
        tokens: ['skl', 'ada']
    },
    {
        from: 'staging-perfect-parallel-gacrux',
        to: 'staging-severe-violet-wezen',
        tokens: ['usdt', 'usdc', 'mkr']

    },
    {
        from: 'staging-severe-violet-wezen',
        to: 'mainnet',
        tokens: ['eth', 'usdc']
    }
]


export default function PopularActions(props: any) {
    return (<div>
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={3}>
                {ACTIONS.map((action, index) => (
                    <Grid key={index} className='fl-centered dappCard' item md={3} sm={6} xs={6}>
                        <ActionCard icons={ICONS} action={action} schain={{}}/>
                    </Grid>
                ))}
            </Grid>
        </Box>
    </div>)
}