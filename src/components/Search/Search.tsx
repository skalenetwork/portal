import React from 'react';
import { TextField, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Link from '@mui/material/Link';
import ClearIcon from '@mui/icons-material/Clear';

import { SEARCH_SUGGESTIONS } from '../../core/constants';


const SearchComponent = (props: any) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        props.setSearchValue(event.target.value);
    };
    return (
        <div className='mp__margBott20'>
            <div className={'mp__flex mp__inputAmount mp__inputAmountDark mp__margTop20 ' + (props.disabled ? 'mp__inputAmountDisabled' : null)}>
                <div className='mp__flex mp__flexCenteredVert mp__margLeft20'>
                    <SearchIcon />
                </div>
                <div className='mp__flex mp__flexGrow'>
                    <TextField
                        type="text"
                        variant="standard"
                        placeholder="Search by dApp name, SKALE Chain name, Hub name or app type"
                        value={props.searchValue}
                        onChange={handleChange}
                        disabled={props.disabled}
                        size='small'
                    />
                </div>
                <div className='mp__flex mp__flexCenteredVert mp__margRi10' onClick={() => { props.setSearchValue(''); }}>
                    <IconButton>
                        <ClearIcon />
                    </IconButton>
                </div>
            </div>
            <div className='mp__flex mp__flexCenteredVert mp__margTop5'>
                <p className='mp__margRi5 mp__p mp__p4'>
                    Try searching for:
                </p>
                {SEARCH_SUGGESTIONS.map((item: any, index: number) => (
                    <Link
                        component="button"
                        variant="body2"
                        className='mp__margRi10 mp__p mp__p4'
                        onClick={() => { props.setSearchValue(item.search) }}
                        color="inherit"
                        key={index}
                    >
                        {item.label}
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default SearchComponent;
