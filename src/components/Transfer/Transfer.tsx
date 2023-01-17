import React, { useEffect } from 'react';
import './Transfer.scss';

import { useParams, useSearchParams, useLocation } from "react-router-dom";

import CardContent from '@mui/material/CardContent';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import { Link } from "react-router-dom";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SwipeRightIcon from '@mui/icons-material/SwipeRight';

import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Collapse from '@mui/material/Collapse';



import { interfaces, dataclasses } from '@skalenetwork/metaport';
import metaportConfig from '../../metaportConfig.json'


import { getChainIcon, getChainName } from '../ActionCard/helper';
import TransferStepper from '../TransferStepper';
import Tokens from '../Tokens';
import AmountInput from '../AmountInput';

import { CHAINS_META } from '../../core/constants';
import { getQueryVariable } from '../../core/helper';

import CHAINS from '../../chainsData.json';


export default function Transfer(props: any) {
    let { from, to } = useParams();
    const location = useLocation();

    const chainsData = CHAINS as any;
    const tokens = chainsData[from as string][to as string].tokens;

    const [loading, setLoading] = React.useState(false);
    const [amount, setAmount] = React.useState<string>('');
    const [balance, setBalance] = React.useState(null);
    const [token, setToken] = React.useState<string>();

    const fromApp = getQueryVariable(location.search, 'from-app');
    const toApp = getQueryVariable(location.search, 'to-app');
    const externalAmount = getQueryVariable(location.search, 'amount');
    const externalToken = getQueryVariable(location.search, 'token');

    const handleAmount = (event: any, newAmount: React.SetStateAction<string>) => {
        setAmount(newAmount);
    };

    useEffect(() => {
        if (externalToken) {
            setToken(externalToken);
        }
        if (externalAmount) {
            setAmount(externalAmount);
        }
    }, []);

    function requestTransfer() {
        setLoading(true);
        const tokenKeyname = tokens[token as string].keyname;
        const params: interfaces.TransferParams = {
            amount: amount,
            chains: [metaportConfig.chains[0], metaportConfig.chains[2]],
            tokenKeyname: tokenKeyname,
            tokenType: dataclasses.TokenType.eth,
            lockValue: true,
            route: {
                hub: 'staging-perfect-parallel-gacrux',
                tokenKeyname: '_wrETH_0xBA3f8192e28224790978794102C0D7aaa65B7d70'
            }
        };
        props.metaport.transfer(params);
    }

    return (<Container maxWidth="md">
        <Stack spacing={3}>
            <div className="fl-centered mp__margBott10">
                <Grid container spacing={2} className="flex-container fl-centered marg-bott-20">
                    <Grid item md={6} xs={12}>
                        <Breadcrumbs aria-label="breadcrumb" className="fl-grow">
                            <Link className='undec' to="/">
                                <ArrowBackIosIcon style={{ 'height': '12px', 'width': '15px' }} />
                                Go back
                            </Link>
                        </Breadcrumbs>
                    </Grid>
                </Grid>
            </div>
            <div className='mp__flex mp__flexCenteredVert mp__noMarg'>
                <div className='mp__flex'>
                    <h2 className="mp__flex mp__noMarg">Transfer</h2>
                </div>
                <div className='mp__flex mp__margRi5 mp__margLeft10'>
                    {getChainIcon(from as string, true, fromApp)}
                </div>
                <div className='mp__flex'>
                    <h2 className="mp__flex mp__noMarg">{getChainName(CHAINS_META, from as string, fromApp)}</h2>
                </div>
                <div className='mp__flex mp__margLeft10'>
                    <ArrowForwardIcon />
                </div>
                <div className='mp__flex mp__margRi5 mp__margLeft10'>
                    {getChainIcon(to as string, true, toApp)}
                </div>
                <div className='mp__flex'>
                    <h2 className="mp__flex mp__noMarg">{getChainName(CHAINS_META, to as string, toApp)}</h2>
                </div>
            </div>

            {toApp ? (<div className='marg-top-40'>
                <Card variant="outlined" className='topBannerNew mp__flex mp__flexCenteredVert'>
                    <div className='mp__margLeft10 mp__margRi5 mp__flex mp__flexCenteredVert'>
                        {getChainIcon(to as string, true)}
                    </div>
                    <div className='mp__margRi10 mp__flex mp__flexCenteredVert'>
                        {getChainIcon(to as string, true, toApp)}
                    </div>
                    <p className='fl-grow'>{getChainName(CHAINS_META, to as string, toApp)} dApp is located on {getChainName(CHAINS_META, to as string)} chain</p>
                </Card>
            </div>) : null}
            <Card variant="outlined">
                <CardContent className='mp__margLeft20 mp__margRi20 mp__margTop20 mp__margBott20'>
                    <Stack >
                        <div className=''>
                            <TransferStepper to={to} />
                        </div>
                        <div className='mp__margTop5'>
                            <p className='mp__p2 mp__margTop20'>Select a token</p>
                            <Tokens from={from} to={to} token={token} setToken={setToken} />
                        </div>
                        <Collapse in={!!token}>
                            <div>
                                <p className='mp__p2 mp__margTop20 mp__margBott5'>Amount</p>
                                <Grid container >
                                    <Grid className='fl-centered' item md={6} sm={12} xs={12}>
                                        <AmountInput setAmount={setAmount} amount={amount} token={{}} />
                                    </Grid>
                                </Grid>
                            </div>
                            <div className='mp__margTop20 mp__flex'>
                                {token ? tokens[token].recommendedValues.map((value: any, index: number) => (
                                    <div className={'mp__margRi5 mp__flex ' + (amount === value ? 'selectedToken' : '')}>
                                        <Chip
                                            label={value + ' ' + token}
                                            onClick={() => { setAmount(value) }}
                                            variant="filled"
                                            clickable
                                            className='mp__margRi5'
                                            size='small'
                                        />
                                    </div>
                                )) : null}
                            </div>
                            <div className='mp__margTop10'>
                                <Button
                                    onClick={requestTransfer}
                                    variant="contained"
                                    startIcon={<SwipeRightIcon />}
                                    disabled={loading}
                                    className='mp__margTop20 demoBtn'
                                    size='large'
                                >
                                    {loading ? 'Complete transfer in Metaport popup' : 'Transfer'}
                                </Button>

                            </div>
                        </Collapse>
                    </Stack>
                </CardContent>
            </Card>
        </Stack>
    </Container>)
}