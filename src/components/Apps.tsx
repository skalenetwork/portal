import { useState, useEffect } from 'react'
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';

import CategorySection from './CategorySection'

import { cmn, cls, MetaportCore, CHAINS_META, interfaces } from '@skalenetwork/metaport';

export default function Apps(props: { mpc: MetaportCore }) {
    return (<Container maxWidth="md">
        <Stack spacing={0}>
            <div className={cls(cmn.flex)}>
                <h2 className={cls(cmn.nom)}>Apps</h2>
            </div>
            <p className={cls(cmn.nom, cmn.p, cmn.p3, cmn.pSec)}>
                Apps on SKALE Network
            </p>
        </Stack>
    </Container>)
}