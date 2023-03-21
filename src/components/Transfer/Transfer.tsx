/**
 * @license
 * SKALE bridge-ui
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

/**
 * @file Transfer.tsx
 * @copyright SKALE Labs 2023-Present
*/

import React, { useEffect } from 'react';
import { useParams, useLocation } from "react-router-dom";

import { Link } from "react-router-dom";

import debug from 'debug';
import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';

import CardContent from '@mui/material/CardContent';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CancelIcon from '@mui/icons-material/Cancel';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Collapse from '@mui/material/Collapse';
import Alert from '@mui/material/Alert';
import Tooltip from '@mui/material/Tooltip';

import HistoryIcon from '@mui/icons-material/History';

import './Transfer.scss';

import { interfaces, dataclasses } from '@skalenetwork/metaport';

import { getChainIcon, getChainName } from '../ActionCard/helper';
import TransferStepper from '../TransferStepper';
import TransferDone from '../TransferDone';
import Tokens from '../Tokens';
import AmountInput from '../AmountInput';
import CommunityPool from '../CommunityPool';
import SFuel from '../SFuel';
import BalanceBlock from '../BalanceBlock';
import BridgePaper from '../BridgePaper';
import TransactionData from '../TransactionData';

import { getBalance, initChainWeb3, initERC20Token } from '../../core/tokens';
import {
    CHAINS_META, DEFAULT_ERC20_DECIMALS, MAINNET_CHAIN_NAME, CHAINS
} from '../../core/constants';
import { fromWei } from '../../core/convertation';
import { getQueryVariable } from '../../core/helper';
import { addToTransferHistory } from '../../core/transferHistory';


debug.enable('*');
const log = debug('bridge:components:Transfer');


export default function Transfer(props: any) {
    let { from, to } = useParams();
    const location = useLocation();

    const fromChain = from as string;
    const toChain = to as string;

    const chainsData = CHAINS as any;

    const tokens = chainsData[fromChain].chains[toChain].tokens;

    const [loading, setLoading] = React.useState(false);
    const [amount, setAmount] = React.useState<string>('');
    const [tokenDecimals, setTokenDecimals] = React.useState<string>();

    const [token, setToken] = React.useState<string>();
    const [updateBalanceFlag, setUpdateBalanceFlag] = React.useState<boolean>(false);

    const [sFuelOk, setSFuelOk] = React.useState<boolean>(false);

    const [msg, setMsg] = React.useState<string>();
    const [msgType, setMsgType] = React.useState<'error' | 'info' | 'success'>('info');

    const [balance, setBalance] = React.useState<string>();
    const [web3, setWeb3] = React.useState<Web3>();
    const [tokenContract, setTokenContract] = React.useState<Contract>();

    const [web3Dest, setWeb3Dest] = React.useState<Web3>();
    const [tokenContractDest, setTokenContractDest] = React.useState<Contract>();
    const [balanceDest, setBalanceDest] = React.useState<string>();

    const [activeStep, setActiveStep] = React.useState<number>(0);
    const [recommendedRechargeAmount, setRecommendedRechargeAmount] = React.useState<string>();

    const [transactionsHistory, setTransactionsHistory] = React.useState<Array<any>>([]);
    const [transferRequest, setTransferRequest] = React.useState<interfaces.TransferParams>();

    const fromApp = getQueryVariable(location.search, 'from-app');
    const toApp = getQueryVariable(location.search, 'to-app');
    const externalAmount = getQueryVariable(location.search, 'amount');
    const externalToken = getQueryVariable(location.search, 'token');

    const fromChainName = getChainName(CHAINS_META, from as string, fromApp);
    const toChainName = getChainName(CHAINS_META, to as string, toApp);

    const fromChainIcon = getChainIcon(from as string, true, fromApp);
    const toChainIcon = getChainIcon(to as string, true, toApp);

    useEffect(() => {
        if (externalToken) setToken(externalToken);
        if (externalAmount) setAmount(externalAmount);
        setToken(Object.keys(tokens)[0]);
        window.addEventListener(
            "metaport_transferRequestCompleted",
            transferCompleted,
            false
        );
        window.addEventListener(
            "metaport_transactionCompleted",
            transactionCompleted,
            false
        );
        setWeb3(initChainWeb3(fromChain));
        setWeb3Dest(initChainWeb3(toChain));
        let balanceUpdateTimer = setInterval(() => setUpdateBalanceFlag(!updateBalanceFlag), 10 * 1000);
        return () => {
            clearInterval(balanceUpdateTimer);
            window.removeEventListener(
                "metaport_transactionCompleted",
                transactionCompleted
            );
        };
    }, []);

    useEffect(() => {
        window.addEventListener(
            "metaport_transferRequestCompleted",
            transferCompleted,
            false
        );
        window.addEventListener(
            "metaport_transactionCompleted",
            transactionCompleted,
            false
        );
        return () => {
            window.removeEventListener("metaport_transferRequestCompleted", transferCompleted);
            window.removeEventListener("metaport_transactionCompleted", transactionCompleted);
        }
    }, [transferRequest]);

    useEffect(() => {
        setAmount('');
        setBalance(undefined);
        setBalanceDest(undefined);
        if (token && web3) {
            const tokenInfo = tokens[token as string];
            log(tokenInfo);
            log(`Setting token contract: ${tokenInfo.address}`);
            setTokenContract(initERC20Token(web3, tokenInfo.address));
            // todo: handle
            const destAddress = chainsData[toChain].chains[fromChain].tokens[token].address;
            setTokenContractDest(initERC20Token(web3Dest, destAddress));
        }
    }, [token]);

    useEffect(() => {
        updateBalance();
    }, [tokenContract, tokenContractDest, activeStep, props.address, web3, updateBalanceFlag]);

    async function updateBalance() {
        if (props.address) {
            log('Updating balance...');
            const tokenInfo = tokens[token as string];
            const decimals = tokenInfo && tokenInfo.decimals ? tokenInfo.decimals : DEFAULT_ERC20_DECIMALS;
            setTokenDecimals(decimals);
            const balanceWei = await getBalance(web3, tokenContract, props.address, fromChain);
            const balanceEther = fromWei(balanceWei as string, decimals);

            const balanceWeiDest = await getBalance(web3Dest, tokenContractDest, props.address, toChain);
            const balanceEtherDest = fromWei(balanceWeiDest as string, decimals);

            if (balanceEther) {
                setBalance(balanceEther);
            } else {
                log('Balance request failed - source chain');
            }
            if (balanceEtherDest) {
                setBalanceDest(balanceEtherDest);
            } else {
                log('Balance request failed - dest chain');
            }
        }
    }

    async function transferCompleted(e: any) {
        setUpdateBalanceFlag(!updateBalanceFlag);
        setLoading(false);
        props.metaport.reset();
        props.metaport.close();
        setActiveStep(1);
        const transferData = {
            trReq: transferRequest,
            transactionsHistory: transactionsHistory,
            token: token,
            address: props.address
        }
        addToTransferHistory(transferData);
    }

    async function transactionCompleted(e: any) {
        transactionsHistory.push(e.detail); // todo: fix
        setTransactionsHistory([...transactionsHistory]);
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
        setTransferRequest(params);
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

    const balancesBlock = (
        <BridgePaper rounded gray fullHeight>
            <BalanceBlock
                icon={fromChainIcon}
                chainName={fromChainName}
                balance={balance}
                token={token}
                disabled={disabled}
            />
            <BalanceBlock
                icon={toChainIcon}
                chainName={toChainName}
                balance={balanceDest}
                token={token}
                disabled={disabled}
                margTop
            />
        </BridgePaper>
    );

    return (<Container maxWidth="md">
        <div className='mp__flex mp__flexCenteredVert mp__margBott10'>
            <div className='mp__flex'>
                <h2 className="mp__flex mp__noMarg">Transfer</h2>
            </div>
            <div className='mp__flex mp__margRi5 mp__margLeft10'>
                {fromChainIcon}
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
            <Card variant="outlined" className='topBannerNew mp__flex mp__flexCenteredVert br__paper'>
                <div className='mp__margRi5 mp__flex mp__flexCenteredVert'>
                    {getChainIcon(to as string, true)}
                </div>
                <div className='mp__margRi10 mp__flex mp__flexCenteredVert'>
                    {getChainIcon(to as string, true, toApp)}
                </div>
                <p className='fl-grow mp__noMarg'>{getChainName(CHAINS_META, to as string, toApp)} dApp is located on {getChainName(CHAINS_META, to as string)}</p>
            </Card>
        </div>) : null}

        {msg ? <Alert onClose={() => { setMsg(undefined); }} severity={msgType} className='mp__margBott20'>{msg}</Alert> : null}
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
        <Card variant="outlined" className='br__paper mp__margTop10'>
            <CardContent className='mp__noPadd'>
                <Stack >
                    <div className='mp__margTop10'>
                        <TransferStepper
                            to={to}
                            toApp={toApp}
                            activeStep={activeStep}
                            disabled={(recommendedRechargeAmount !== '0' && isTransferToMainnet) || !sFuelOk}
                        />
                    </div>
                    <Collapse in={activeStep === 0}>
                        <div className='mp__margTop20'>
                            <div className='br__paper br__paperRounded br__paperGrey'>
                                <p className={'mp__p mp__p3 mp__margTop20s ' + (disabled ? 'mp__disabledP' : '')}>Token</p>
                                <Tokens from={from} to={to} token={token} setToken={setToken} loading={disabled} />
                            </div>
                        </div>
                        <Grid container spacing={2} >
                            <Grid className='fl-centered' item md={8} sm={12} xs={12}>
                                <BridgePaper rounded gray margTop>
                                    <div className='mp__flex mp__flexCenteredVert mp__margTop20d mp__margBott5'>
                                        <p className={'mp__p mp__p3 mp__noMarg mp__flexGrow  ' + (disabled ? 'mp__disabledP' : '')}>
                                            Amount
                                        </p>
                                    </div>
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
                                </BridgePaper>
                            </Grid>
                            <Grid className='mp__margTop20' item md={4} sm={12} xs={12}>
                                {balancesBlock}
                            </Grid>
                        </Grid>

                        <div>
                            <Button
                                onClick={requestTransfer}
                                variant="contained"
                                disabled={disabled || !balance || Number(amount) > Number(balance) || amount === '' || amount === '0' || Number(amount) === 0}
                                className='mp__margTop20 bridge__btn'
                                size='large'
                            >
                                {getTransferButtonText()}
                            </Button>
                            {loading ?
                                <Tooltip title='Mined transactions can not be reverted'>
                                    <Button
                                        onClick={closeMetaport}
                                        variant="text"
                                        startIcon={<CancelIcon />}
                                        disabled={!loading}
                                        className='mp__margLeft10 mp__margTop20 bridge__btn'
                                        color='error'
                                        size='large'
                                    >
                                        Cancel transfer
                                    </Button>
                                </Tooltip> : null}
                        </div>
                    </Collapse>
                    <Collapse in={activeStep === 1}>
                        <TransferDone
                            to={to}
                            toApp={toApp}
                            toChainName={toChainName}
                            setActiveStep={setActiveStep}
                            amount={amount}
                            token={token}
                            balancesBlock={balancesBlock}
                            setTransactionsHistory={setTransactionsHistory}
                            chainsData={chainsData}
                            toChain={toChain}
                            fromChain={fromChain}
                            tokenDecimals={tokenDecimals}
                        />
                    </Collapse>
                </Stack>
            </CardContent>
        </Card>
        {transactionsHistory.length > 0 ? <Card variant="outlined" className='br__paper mp__margTop10'>
            <CardContent className='mp__noPadd'>
                <Stack >
                    <h4 className="mp__flex mp__margBott10 mp__noMargTop">Mined transactions</h4>
                    <BridgePaper rounded gray>
                        <div className='mp__margBottMin15'>
                            {transactionsHistory.map((transactionData: any) => (
                                <TransactionData key={transactionData.tx.transactionHash} transactionData={transactionData} />
                            ))}
                        </div>
                    </BridgePaper>
                    <Collapse in={!loading}>
                        <Link to="/bridge/history" className="undec fullWidth" >
                            <Button
                                startIcon={<HistoryIcon />}
                                variant='text'
                                className='mp__margTop20 bridge__btn'
                                size='large'
                            >
                                Go to Transfers history
                            </Button>
                        </Link>
                    </Collapse>
                </Stack>
            </CardContent>
        </Card> : null}
    </Container >)
}