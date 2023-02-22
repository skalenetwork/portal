import { useState } from 'react';

import ChainCards from '../ChainCards';
import Search from '../Search';


export default function TransferFrom(props: any) {

    const [searchValue, setSearchValue] = useState('');

    return (<div>
        <div className='mp__flex mp__flexCenteredVert'>
            <div className='mp__flex'>
                <h2 className="mp__flex mp__noMarg">Transfer from...</h2>
            </div>
        </div>
        <p className='mp__noMarg mp__p mp__p4'>
            Choose source app below
        </p>
        <div className='mp__margBott10'>
            <Search
                setSearchValue={setSearchValue}
                searchValue={searchValue}
            />
        </div>
        <div className='mp__margTop30'>
            <ChainCards searchValue={searchValue} />
        </div>
    </div>)
}