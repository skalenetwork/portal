import React, { useEffect } from 'react';
import { useParams, useLocation } from "react-router-dom";


import debug from 'debug';
import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';

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
import CancelIcon from '@mui/icons-material/Cancel';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Collapse from '@mui/material/Collapse';
import Alert from '@mui/material/Alert';
import { Skeleton } from '@mui/material';

import './Transfer.scss';

import { interfaces, dataclasses } from '@skalenetwork/metaport';

import { getChainIcon, getChainName } from '../ActionCard/helper';
import TransferStepper from '../TransferStepper';
import TransferDone from '../TransferDone';
import Tokens from '../Tokens';
import AmountInput from '../AmountInput';
import CommunityPool from '../CommunityPool';
import SFuel from '../SFuel';

import { getBalance, initChainWeb3, initERC20Token } from '../../core/tokens';
import {
    CHAINS_META, DEFAULT_ERC20_DECIMALS, MAINNET_CHAIN_NAME, CHAINS
} from '../../core/constants';
import { fromWei } from '../../core/convertation';
import { getQueryVariable } from '../../core/helper';


debug.enable('*');
const log = debug('bridge:components:Transfer');


export default function Transfer(props: any) {
    let { from, to } = useParams();
    const location = useLocation();

    const fromChain = from as string;
    const toChain = to as string;

    const chainsData = CHAINS as any;

    const tokens = chainsData[fromChain].chains[toChain].tokens; // TODO: handle

    const [loading, setLoading] = React.useState(false);
    const [amount, setAmount] = React.useState<string>('');
    const [balance, setBalance] = React.useState<string>();
    const [token, setToken] = React.useState<string>();
    const [updateBalanceFlag, setUpdateBalanceFlag] = React.useState<boolean>(false);

    const [sFuelOk, setSFuelOk] = React.useState<boolean>(false);

    const [msg, setMsg] = React.useState<string>();
    const [msgType, setMsgType] = React.useState<'error' | 'info' | 'success'>('info');

    const [web3, setWeb3] = React.useState<Web3>();
    const [tokenContract, setTokenContract] = React.useState<Contract>();

    const fromApp = getQueryVariable(location.search, 'from-app');
    const toApp = getQueryVariable(location.search, 'to-app');
    const externalAmount = getQueryVariable(location.search, 'amount');
    const externalToken = getQueryVariable(location.search, 'token');

    const [activeStep, setActiveStep] = React.useState<number>(0);

    const [recommendedRechargeAmount, setRecommendedRechargeAmount] = React.useState<string>();

    const fromChainName = getChainName(CHAINS_META, from as string, fromApp);
    const toChainName = getChainName(CHAINS_META, to as string, toApp);

    useEffect(() => {
        if (externalToken) setToken(externalToken);
        if (externalAmount) setAmount(externalAmount);
        setToken(Object.keys(tokens)[0]);
        window.addEventListener(
            "metaport_transferRequestCompleted",
            transferComplete,
            false
        );
        setWeb3(initChainWeb3(fromChain));
        let balanceUpdateTimer = setInterval(() => setUpdateBalanceFlag(!updateBalanceFlag), 10 * 1000);
        return () => {
            clearInterval(balanceUpdateTimer);
        };
    }, []);

    useEffect(() => {
        setAmount('');
        setBalance(undefined);
        if (token && web3) {
            const tokenInfo = tokens[token as string];
            log(tokenInfo);
            log(`Setting token contract: ${tokenInfo.address}`);
            setTokenContract(initERC20Token(web3, tokenInfo.address));
        }
    }, [token]);

    useEffect(() => {
        updateBalance();
    }, [tokenContract, props.address, web3, updateBalanceFlag]);

    async function updateBalance() {
        if (props.address) {
            log('Updating balance...');
            const tokenInfo = tokens[token as string];
            const decimals = tokenInfo && tokenInfo.decimals ? tokenInfo.decimals : DEFAULT_ERC20_DECIMALS;
            const balanceWei = await getBalance(web3, tokenContract, props.address, fromChain);
            const balanceEther = fromWei(balanceWei as string, decimals);
            if (balanceEther) {
                setBalance(balanceEther);
            } else {
                log('Balance request failed!');
            }
        }
    }

    async function transferComplete(e: any) {
        setUpdateBalanceFlag(!updateBalanceFlag);
        setLoading(false);
        props.metaport.reset();
        props.metaport.close();
        setActiveStep(1);
    }

    function requestTransfer() {
        setLoading(true);
        const tokenInfo = tokens[token as string];
        const tokenKeyname = tokens[token as string].keyname;
        const tokenType = tokenKeyname === 'eth' ? dataclasses.TokenType.eth : dataclasses.TokenType.erc20;
        const params: interfaces.TransferParams = {
            amount: amount,
            chains: [fromChain, toChain],
            tokenKeyname: tokenKeyname,
            tokenType: tokenType,
            lockValue: true,
            route: tokenInfo.route,
            fromApp: fromApp,
            toApp: toApp
        };
        props.metaport.transfer(params);
    }

    function closeMetaport() {
        props.metaport.close();
        setLoading(false);
    }

    const isTransferToMainnet = toChain === MAINNET_CHAIN_NAME && activeStep === 0;
    const disabled = loading || (recommendedRechargeAmount !== '0' && isTransferToMainnet) || !sFuelOk;

    return (<Container maxWidth="md">
        <Stack spacing={3}>
            <div className='mp__flex mp__flexCenteredVert mp__margTop20'>
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
                <Card variant="outlined" className='topBannerNew mp__flex mp__flexCenteredVert bridgeUIPaper'>
                    <div className='mp__margLeft20 mp__margRi5 mp__flex mp__flexCenteredVert'>
                        {getChainIcon(to as string, true)}
                    </div>
                    <div className='mp__margRi10 mp__flex mp__flexCenteredVert'>
                        {getChainIcon(to as string, true, toApp)}
                    </div>
                    <p className='fl-grow'>{getChainName(CHAINS_META, to as string, toApp)} dApp is located on {getChainName(CHAINS_META, to as string)}</p>
                </Card>
            </div>) : null}

            {msg ? <Alert onClose={() => { setMsg(undefined); }} severity={msgType} className='mp__margTop20'>{msg}</Alert> : null}
            {isTransferToMainnet && token ? (
                <CommunityPool
                    address={props.address}
                    chainName={tokens[token].route ? tokens[token].route.hub : fromChain}
                    recommendedRechargeAmount={recommendedRechargeAmount}
                    setRecommendedRechargeAmount={setRecommendedRechargeAmount}

                    msg={msg}
                    setMsg={setMsg}

                    msgType={msgType}
                    setMsgType={setMsgType}

                />) : null}
            {
                token ? (<SFuel
                    address={props.address}
                    fromChain={fromChain}
                    toChain={toChain}
                    hubChain={tokens[token].route ? tokens[token].route.hub : null}

                    sFuelOk={sFuelOk}
                    setSFuelOk={setSFuelOk}

                    msg={msg}
                    setMsg={setMsg}
                    msgType={msgType}
                    setMsgType={setMsgType}
                />) : null
            }
            <Card variant="outlined" className='bridgeUIPaper'>
                <CardContent className='mp__margLeft20 mp__margRi20 mp__margTop20 mp__margBott20'>
                    <Stack >
                        <div className=''>
                            <TransferStepper
                                to={to}
                                toApp={toApp}
                                activeStep={activeStep}
                                disabled={(recommendedRechargeAmount !== '0' && isTransferToMainnet) || !sFuelOk}
                            />
                        </div>
                        <Collapse in={activeStep === 0}>
                            <div className='mp__margTop10'>
                                <p className={'mp__p2 mp__margTop20 ' + (disabled ? 'mp__disabledP' : '')}>Token</p>
                                <Tokens from={from} to={to} token={token} setToken={setToken} loading={disabled} />
                            </div>
                            <Collapse in={!!token}>
                                <Grid container className='mp__margTop10'>
                                    <Grid className='fl-centered' item md={6} sm={12} xs={12}>
                                        <div className='mp__flex mp__flexCenteredVert mp__margTop20 mp__margBott5'>
                                            <p className={'mp__p2 mp__noMarg mp__flexGrow  ' + (disabled ? 'mp__disabledP' : '')}>Amount</p>
                                            {balance ? <p className={'mp__noMarg mp__p mp__p3 ' + (disabled ? 'mp__disabledP' : '')}>
                                                Balance: {balance} {token ? token.toUpperCase() : ''}
                                            </p> : <Skeleton width='80px' />}
                                        </div>
                                        <AmountInput setAmount={setAmount} amount={amount} token={{}} loading={disabled} balance={balance} maxBtn={true} />
                                    </Grid>
                                </Grid>
                                <div className='mp__margTop10 mp__flex'>
                                    {token ? tokens[token].recommendedValues.map((value: any, index: number) => (
                                        <div key={value} className={'mp__margRi5 mp__flex ' + (amount === value ? 'selectedToken' : '')}>
                                            <Chip
                                                label={value + ' ' + token}
                                                onClick={() => { setAmount(value) }}
                                                variant="filled"
                                                clickable
                                                className='mp__margRi5 mp__chipAmount'
                                                size='small'
                                                disabled={disabled || !balance || Number(value) > Number(balance)}
                                            />
                                        </div>
                                    )) : null}
                                </div>
                                <div className='mp__margTop20'>
                                    <Button
                                        onClick={requestTransfer}
                                        variant="contained"
                                        startIcon={<SwipeRightIcon />}
                                        disabled={disabled || !balance || Number(amount) > Number(balance) || amount === '' || amount === '0'}
                                        className='mp__margTop20 bridge__btn'
                                        size='large'
                                    >
                                        {loading ? 'Complete transfer in Metaport popup' : 'Transfer'}
                                    </Button>
                                    {loading ? <Button
                                        onClick={closeMetaport}
                                        variant="contained"
                                        startIcon={<CancelIcon />}
                                        disabled={!loading}
                                        className='mp__margLeft10 mp__margTop20 bridge__btn'
                                        color='warning'
                                        size='large'
                                    >
                                        Cancel transfer
                                    </Button> : null}
                                </div>
                            </Collapse>
                        </Collapse>
                        <Collapse in={activeStep === 1}>
                            <TransferDone
                                to={to}
                                toApp={toApp}
                                toChainName={toChainName}
                                setActiveStep={setActiveStep}
                                amount={amount}
                                token={token}
                            />
                        </Collapse>
                    </Stack>
                </CardContent>
            </Card>
        </Stack>
    </Container>)
}