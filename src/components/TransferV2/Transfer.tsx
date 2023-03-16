import React, { useEffect } from 'react';
import { useParams, useLocation } from "react-router-dom";

import debug from 'debug';
import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';

import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import CancelIcon from '@mui/icons-material/Cancel';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Collapse from '@mui/material/Collapse';
import Alert from '@mui/material/Alert';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';
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
            transferCompleted,
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

    async function transferCompleted(e: any) {
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

    function getTransferButtonText() {
        if (loading) return 'Complete transfer in Metaport popup';
        if (!balance) return 'Loading balances...';
        if (Number(amount) > Number(balance)) return `Insufficient ${token} balance`;
        if (amount === '' || amount === '0' || Number(amount) === 0) return 'Enter an amount';
        return 'Transfer to ' + toChainName;
    }

    const isTransferToMainnet = toChain === MAINNET_CHAIN_NAME && activeStep === 0;
    const disabled = loading || (recommendedRechargeAmount !== '0' && isTransferToMainnet) || !sFuelOk;

    return (<Container maxWidth="sm" className=''>
        <Stack spacing={2}>
            <div className='mp__flex mp__flexCenteredVert mp__margTop20'>
                <div className='mp__flex'>
                    <h2 className="mp__flex mp__noMarg">Transfer</h2>
                </div>    
            </div>
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
            <div className='mp__margTop10 br__paper bridge__paperTop'>
                {/* <p className={'mp__flex  mp__p mp__p3 mp__margBott5 ' + (disabled ? 'mp__disabledP' : '')}>Transfer from</p> */}
                <div className='mp__flex mp__flexCenteredVert mp__margBott20'>
                    <div className='mp__flex mp__margRi10'>
                        {getChainIcon(from as string, true, fromApp)}
                    </div>
                    <div className='mp__flex mp__flexGrow'>
                        <h3 className="mp__flex mp__noMarg">{getChainName(CHAINS_META, from as string, fromApp)}</h3>
                    </div>
                    <div className='mp__margRi5 mp__flex br__balanceCard'>
                        <AccountBalanceWalletRoundedIcon className='chainIcon' style={{ color: 'rgb(112 112 112)' }} />
                    </div>
                    <p className={'mp__flex  mp__p mp__p3 mp__noMarg ' + (disabled ? 'mp__disabledP' : '')}>Balance: {balance} {token ? token.toUpperCase() : ''}</p>
                </div>
                <Tokens from={from} to={to} token={token} setToken={setToken} loading={disabled} />
            </div>

            <div className='mp__noMarg br__paper bridge__paperBott ' style={{ background: '#2a2a2a' }}>
                <AmountInput setAmount={setAmount} amount={amount} token={{}} loading={disabled} balance={balance} maxBtn={true} />
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
                    <div key='max' className={'mp__margRi5 mp__flex ' + (amount === balance ? 'selectedToken' : '')}>
                        <Chip
                            label='MAX'
                            onClick={() => { setAmount(balance as string) }}
                            variant="filled"
                            clickable
                            className='mp__margRi5 mp__chipAmount'
                            size='small'
                            disabled={disabled || !balance || Number(balance) > Number(balance) || balance === '0'}
                        />
                    </div>
                </div>
            </div>

            <div className='bridge__moveDownIcon mp__margTop10'>
                <div className='mp__flex' >
                    <div className='mp__flex mp__flexGrow'>
                    </div>
                    <KeyboardArrowDownRoundedIcon />
                    <div className='mp__flex mp__flexGrow'>
                    </div>
                </div>
            </div>

            <div className='br__paper br__paperRounded' style={{ marginTop: '-17px' }}>
                <div className='mp__flex mp__flexCenteredVert'>
                    <div className='mp__flex mp__margRi10'>
                        {getChainIcon(to as string, true, toApp)}
                    </div>
                    <div className='mp__flex mp__flexGrow'>
                        <h3 className="mp__flex mp__noMarg">{getChainName(CHAINS_META, to as string, toApp)}</h3>
                    </div>
                    <div className='mp__margRi5 mp__flex br__balanceCard'>
                        <AccountBalanceWalletRoundedIcon className='chainIcon' style={{ color: 'rgb(112 112 112)' }} />
                    </div>
                    <p className={'mp__flex  mp__p mp__p3 mp__noMarg ' + (disabled ? 'mp__disabledP' : '')}>Balance: {balance} {token ? token.toUpperCase() : ''}</p>
                </div>

                {toApp ? (
                    <div className='mp__flex mp__flexCenteredVert mp__margTop5'>
                        {/* <div className='mp__margRi5 mp__flex mp__flexCenteredVert'>
                            {getChainIcon(to as string, true)}
                        </div> */}
                        <p className='mp__flex  mp__p mp__p3'> {getChainName(CHAINS_META, to as string, toApp)} dApp is located on {getChainName(CHAINS_META, to as string)}</p>
                    </div>) : null}

                <div className='mp__margTop20'>
                    <Button
                        onClick={requestTransfer}
                        variant="contained"
                        // startIcon={<SwipeRightIcon />}
                        disabled={disabled || !balance || Number(amount) > Number(balance) || amount === '' || amount === '0' || Number(amount) === 0}
                        className=' bridge__btn bridge__transferBtn'
                        size='large'
                    >
                        {getTransferButtonText()}
                    </Button>

                    <Collapse in={loading}>
                        <Button
                            onClick={closeMetaport}
                            //variant=""
                            startIcon={<CancelIcon />}
                            disabled={!loading}
                            className='mp__margTop20 bridge__btn'
                            color='warning'
                            size='medium'
                            style={{
                                width: '100%',
                                textAlign: 'center'
                            }}
                        >
                            Cancel transfer
                        </Button>
                    </Collapse>
                </div>
            </div>

            {/* <Card variant="outlined" className='br__paper'>
                <CardContent className=''>
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
                            <div className='mp__margTop40'>
                                <p className={'mp__p2 mp__margTop20 ' + (disabled ? 'mp__disabledP' : '')}>Token</p>
                                <p className={'mp__p mp__p3 mp__margTop20 ' + (disabled ? 'mp__disabledP' : '')}>Token</p>
                                <Tokens from={from} to={to} token={token} setToken={setToken} loading={disabled} />
                            </div>
                            <Collapse in={!!token}>
                                <Grid container className='mp__margTop10'>
                                    <Grid className='fl-centered' item md={6} sm={12} xs={12}>

                                        <p className={'mp__p2 mp__margTop20 mp__flexGrow  ' + (disabled ? 'mp__disabledP' : '')}>56 SKL</p>
                                        <p className={' mp__p mp__p3 ' + (disabled ? 'mp__disabledP' : '')}>On {fromChainName}</p>


                                        <div className='mp__flex mp__flexCenteredVert mp__margTop20 mp__margBott5'>
                                            <p className={'mp__p2 mp__noMarg mp__flexGrow  ' + (disabled ? 'mp__disabledP' : '')}>Amount</p>
                                            {balance ? <p className={'mp__noMarg mp__p mp__p3 ' + (disabled ? 'mp__disabledP' : '')}>
                                                Balance: {balance} {token ? token.toUpperCase() : ''}
                                            </p> : <Skeleton width='80px' />}
                                        </div>
                                        <p className={'mp__p mp__p3 mp__margTop20 mp__margBott5 ' + (disabled ? 'mp__disabledP' : '')}>Amount</p>
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
            </Card> */}

        </Stack>
    </Container>)
}