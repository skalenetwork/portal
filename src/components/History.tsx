import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import { cmn, cls, TransactionsHistory, useCollapseStore, useMetaportStore } from '@skalenetwork/metaport';
import { useEffect } from 'react';


export default function History() {

    const expandedTH = useCollapseStore((state) => state.expandedTH)
    const setExpandedTH = useCollapseStore((state) => state.setExpandedTH)

    const transfersHistory = useMetaportStore((state) => state.transfersHistory)

    useEffect(() => {
        setExpandedTH(true)
    }, []);

    return (<Container maxWidth="md">
        <Stack spacing={0}>
            <div className={cls(cmn.flex)}>
                <h2 className={cls(cmn.nom)}>History ({transfersHistory.length})</h2>
            </div>
            <p className={cls(cmn.nom, cmn.p, cmn.p3, cmn.pSec)}>
                SKALE Bridge transfers history
            </p>
            <TransactionsHistory />
        </Stack>
    </Container>)
}