import { useState, useEffect } from 'react'
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';

import CategorySection from '../CategorySection'

import { cmn, cls, MetaportCore, CHAINS_META, interfaces } from '@skalenetwork/metaport';

export default function Chains(props: {
    loadSchains: any,
    schains: any[],
    mpc: MetaportCore
}) {

    const [_, setIntervalId] = useState<NodeJS.Timeout>();

    useEffect(() => {
        props.loadSchains();
        let intervalId = setInterval(props.loadSchains, 10000);
        setIntervalId(intervalId);
    }, []);

    const chainsMeta: interfaces.ChainsMetadataMap = CHAINS_META[props.mpc.config.skaleNetwork]

    if (props.schains.length === 0) {
        return (
            <div className="fullscreen-msg">
                <div className={cls(cmn.flex)}>
                    <div className={cls(cmn.flex, cmn.flexcv)}>
                        <CircularProgress className='fullscreen-spin' />
                    </div>
                    <div className={cls(cmn.flex, cmn.flexcv)}>
                        <h3 className='fullscreen-msg-text'>
                            Loading SKALE Chains
                        </h3>
                    </div>
                </div>

            </div>
        );
    };

    return (<Container maxWidth="md">
        <Stack spacing={0}>
            <div className={cls(cmn.flex)}>
                <h2 className={cls(cmn.nom)}>Chains</h2>
            </div>
            <p className={cls(cmn.nom, cmn.p, cmn.p3, cmn.pSec)}>
                SKALE Chains overview - block explorer links, endpoints and more
            </p>
            <div className='categories'>
                <CategorySection
                    skaleNetwork={props.mpc.config.skaleNetwork}
                    category='Hubs'
                    schains={props.schains.filter(schain => chainsMeta[schain[0]] && chainsMeta[schain[0]].category === 'hub')}
                />
                <CategorySection
                    skaleNetwork={props.mpc.config.skaleNetwork}
                    category='Games'
                    schains={props.schains.filter(schain => chainsMeta[schain[0]] && chainsMeta[schain[0]].category === 'games')}
                />
                <CategorySection
                    skaleNetwork={props.mpc.config.skaleNetwork}
                    category='Apps'
                    schains={props.schains.filter(schain => chainsMeta[schain[0]] && chainsMeta[schain[0]].category === 'apps')}
                />
                <CategorySection
                    skaleNetwork={props.mpc.config.skaleNetwork}
                    category='Other chains'
                    schains={props.schains.filter(schain => !chainsMeta[schain[0]])}
                />
            </div>
        </Stack>
    </Container>)
}