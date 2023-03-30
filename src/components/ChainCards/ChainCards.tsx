import fuzzysort from 'fuzzysort'

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import ChainCard from '../ChainCard';

import { ICONS, CHAINS_META, CHAINS } from '../../core/constants';



export default function ChainCards(props: any) {
    let chains: any;
    let fromApp: string;

    if (props.chains) {
        chains = props.chains;
        fromApp = props.fromApp;
    } else {
        chains = CHAINS;
    }

    let keys = Object.keys(chains);
    if (props.searchValue && props.searchValue !== '') {
        keys = Object.keys(chains).filter((chainName: any, index: number) => {
            const chain = chains[chainName];
            const targets = [chainName, chain.app, chain.hub];
            if (CHAINS_META[chainName]) {
                targets.push(CHAINS_META[chainName].alias, CHAINS_META[chainName].category);
                if (CHAINS_META[chainName].apps) {
                    Object.keys(CHAINS_META[chainName].apps).map((appName: any) => {
                        targets.push(appName, CHAINS_META[chainName].apps[appName].alias);
                    })
                }
            }
            const results = fuzzysort.go(props.searchValue, targets, { all: true, threshold: -50000 });
            return results.length > 0
        });
    }
    return (<div className='mp__noMarg'>
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
                {keys.map((chain: any, index: number) => (
                    <Grid key={index} className='fl-centered dappCardd tile-container' item md={3} sm={6} xs={6}>
                        <ChainCard
                            icons={ICONS}
                            chain={chains[chain]}
                            toChain={props.chains ? chain : null}
                            from={props.chains ? props.from : chain}
                            fromApp={props.chains ? props.fromApp : chains[chain].app} // todo!
                        />
                    </Grid>
                ))}
            </Grid>
            {keys.length === 0 && <p className='mp__margTop40 mp__textCentered mp__p mp__p2'> No available chains</p>}
        </Box>
    </div>)
}