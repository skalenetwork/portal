import { useState, useEffect } from 'react'
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';

import CategorySection from './CategorySection'

import { cmn, cls, MetaportCore, CHAINS_META, interfaces } from '@skalenetwork/metaport';

export default function App(props: { mpc: MetaportCore }) {
    return (<Container maxWidth="lg">
        <Stack spacing={0}>
            <div className={cls(cmn.flex)}>
                <h2 className={cls(cmn.nom)}>App</h2>
            </div>
            <p className={cls(cmn.nom, cmn.p, cmn.p3, cmn.pSec)}>
                Test app
            </p>
        </Stack>
    </Container>)
}