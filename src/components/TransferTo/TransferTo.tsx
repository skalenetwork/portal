import { useState } from 'react';
import { useParams, useLocation } from "react-router-dom";

import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';

import ChainCards from '../ChainCards';
import Search from '../Search';

import { getQueryVariable } from '../../core/helper';

import { getChainIcon, getChainName } from '../ActionCard/helper';
import { CHAINS_META, CHAINS } from '../../core/constants';


export default function TransferTo(props: any) {
    let { from } = useParams();
    const location = useLocation();
    const fromApp = getQueryVariable(location.search, 'from-app');

    const fromChain = from as string;
    const fromChainName = getChainName(CHAINS_META, fromChain as string, fromApp);

    const chains = CHAINS as any;

    const [searchValue, setSearchValue] = useState('');

    return (<Container maxWidth="md">
        <Stack spacing={2}>
            <div className='mp__flex mp__flexCenteredVert'>
                <div className='mp__flex'>
                    <h2 className="mp__flex mp__noMarg">Transfer from</h2>
                </div>
                <div className='mp__flex mp__margRi5 mp__margLeft10'>
                    {getChainIcon(fromChain, true, fromApp)}
                </div>
                <div className='mp__flex'>
                    <h2 className="mp__flex mp__noMarg">{fromChainName} to...</h2>
                </div>
            </div>
            <p className='mp__noMarg mp__p mp__p4'>
                Choose destination app below
            </p>
            <div className='mp__noMarg'>
                <Search
                    setSearchValue={setSearchValue}
                    searchValue={searchValue}
                />
            </div>
            <div className='mp__margTop10'>
                <ChainCards chains={chains[fromChain].chains} from={fromChain} fromApp={fromApp} searchValue={searchValue} />
            </div>

        </Stack>
    </Container>)
}