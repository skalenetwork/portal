import React, { useEffect } from 'react';
import { MainnetChain, SChain } from '@skalenetwork/ima-js';
import debug from 'debug';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Collapse from '@mui/material/Collapse';
import Skeleton from '@mui/material/Skeleton';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';

import AmountInput from '../AmountInput';

import { getChainIcon } from '../ActionCard/helper';
import { MAINNET_CHAIN_NAME, DEFAULT_ERC20_DECIMALS, METAPORT_CONFIG } from '../../core/constants';
import { initChainWeb3 } from '../../core/tokens';
import { fromWei, toWei } from '../../core/convertation';
import { capitalize } from '../../core/helper';
import { initMainnetMetamask, initMainnet, initSChain } from '../../core/network';
import BridgePaper from '../BridgePaper';
import BalanceBlock from '../BalanceBlock';

debug.enable('*');
const log = debug('bridge:components:CommunityPool');


export default function CommunityPool(props: any) {
    const [open, setOpen] = React.useState<boolean>(false);
    const [view, setView] = React.useState<string>();

    const [accountBalance, setAccountBalance] = React.useState<string>();
    const [balance, setBalance] = React.useState<string>();

    const [loading, setLoading] = React.useState(false);
    const [activeUserSchain, setActiveUserSchain] = React.useState(false);
    const [activeUserMainnet, setActiveUserMainnet] = React.useState(false);
    const [amount, setAmount] = React.useState<string>();

    const [mainnet, setMainnet] = React.useState<MainnetChain>();
    const [schain, setSchain] = React.useState<SChain>();

    const [updateBalanceTime, setUpdateBalanceTime] = React.useState<number>(Date.now());

    function toggleOpen() {
        setOpen(!open);
    }

    function setWithdrawView() {
        setView('withdraw');
        toggleOpen();
    }

    function setRechargeView() {
        setView('recharge');
        toggleOpen();
    }

    useEffect(() => {
        if (props.web3) {
            // todo!
        }
    }, [props.web3]);

    useEffect(() => {
        log('init mainnet chain for community pool');
        const mainnet = initMainnet(
            METAPORT_CONFIG.skaleNetwork,
            METAPORT_CONFIG.mainnetEndpoint
        );
        setMainnet(mainnet);
    }, []);

    useEffect(() => {
        log('init schain for community locker');
        const schain = initSChain(
            METAPORT_CONFIG.skaleNetwork,
            props.chainName
        );
        setSchain(schain);
    }, []);

    useEffect(() => {
        if (mainnet && schain && props.address) {
            updateBalance();
        }
        const interval = setInterval(() => setUpdateBalanceTime(Date.now()), 10 * 1000);
        return () => clearInterval(interval);
    }, [updateBalanceTime, mainnet, props.address, props.chainName]);

    async function mainnetMetamask() {
        log('setMainnetMetamask');
        return await initMainnetMetamask(
            METAPORT_CONFIG.skaleNetwork,
            METAPORT_CONFIG.mainnetEndpoint
        );
    }

    async function recharge() {
        if (!mainnet || !amount) return;
        setLoading(true);
        const mm = await mainnetMetamask();
        const amountWei = toWei(amount, DEFAULT_ERC20_DECIMALS);
        log(`recharge - ${props.address} - ${amountWei}`);
        try {
            await mm.communityPool.recharge(props.chainName, props.address, {
                address: props.address,
                value: amountWei
            });
            // props.setMsgType('success');
            // props.setMsg('Exit gas wallet recharged');
            setOpen(false);
        } catch (e: any) {
            log('recharge error', e);
            props.setMsgType('error');
            props.setMsg(e.message);
        } finally {
            await updateBalance();
            setLoading(false);
        }
    }

    async function withdraw() {
        if (!mainnet) return;
        setLoading(true);
        const mm = await mainnetMetamask();
        const amountWei = toWei(balance as string, DEFAULT_ERC20_DECIMALS);
        log(`withdraw - ${props.address} - ${amountWei}`);
        try {
            await mm.communityPool.withdraw(props.chainName, amountWei, {
                address: props.address
            });
            props.setMsgType('success');
            props.setMsg('ETH withdrawn from exit gas wallet');
            setOpen(false);
        } catch (e: any) {
            log('withdraw error', e);
            props.setMsgType('error');
            props.setMsg(e.message);
        } finally {
            await updateBalance();
            setLoading(false);
        }
    }

    async function updateBalance() {
        log('updating balance for community pool and community locker');
        if (!mainnet || !schain) return;
        const balanceWei = await mainnet.communityPool.balance(props.address, props.chainName);
        const balanceEther = fromWei(balanceWei as string, DEFAULT_ERC20_DECIMALS);
        setBalance(balanceEther);

        const activeS = await schain.communityLocker.contract.methods.activeUsers(props.address).call();
        setActiveUserSchain(activeS);
        log('User is active on Schain:', activeS);

        const chainHash = mainnet.web3.utils.soliditySha3(props.chainName);

        const activeM = await mainnet.communityPool.contract.methods.activeUsers(props.address, chainHash).call(); //.contract.methods.activeUserSchains(props.address).call();
        setActiveUserMainnet(activeM);
        log('User is active on Mainnet:', activeM);

        const accountBalanceWei = await mainnet.ethBalance(props.address);
        const accountBalanceEther = fromWei(accountBalanceWei as string, DEFAULT_ERC20_DECIMALS);
        setAccountBalance(accountBalanceEther);

        const recommendedRechargeAmountWei = await mainnet.communityPool.contract.methods.getRecommendedRechargeAmount(
            mainnet.web3.utils.soliditySha3(props.chainName),
            props.address
        ).call();
        const recommendedRechargeAmountEther = fromWei(recommendedRechargeAmountWei as string, DEFAULT_ERC20_DECIMALS);
        props.setRecommendedRechargeAmount(recommendedRechargeAmountEther);

        let recommendedAmount = parseFloat(recommendedRechargeAmountEther as string) * 1.2;
        if (recommendedAmount < 0.01) recommendedAmount = 0.01;

        if (recommendedRechargeAmountWei !== '0') {
            setAmount(recommendedAmount.toFixed(4).toString());
        }
    }


    function getTitleText() {
        if (open) return capitalize(view as string);
        return props.recommendedRechargeAmount === '0' ? 'Exit gas wallet OK' : 'You need to recharge exit gas wallet first'
    }

    function getRechargeBtnText() {
        if (loading) return 'Recharging...'
        if (!balance || !accountBalance) return 'Loading balance...';
        if (Number(amount) > Number(accountBalance)) return 'Insufficient ETH balance'
        if (amount === '' || amount === '0' || !amount) return 'Enter an amount';
        return 'Recharge exit gas wallet';
    }

    return (<div>
        <Card variant="outlined" className='topBannerNew br__paper'>
            <div className='mp__flex mp__flexCenteredVert'>
                <div className='mp__margRi10 mp__flex mp__flexCenteredVert'>
                    {props.recommendedRechargeAmount && balance ? <div className='mp__flex mp__flexCenteredVert'>
                        {props.recommendedRechargeAmount === '0' ? <CheckCircleIcon color='success' className='mp__margRi10' /> : <ErrorIcon color='warning' className='mp__margRi10' />}
                        <p className={'mp__flex mp__noMarg ' + (open ? 'mp__p mp__p2 whiteText' : null)}>
                            {getTitleText()}
                        </p>
                    </div> : <Skeleton className='mp__flex' width='180px' height='20px' />}
                </div>
                <div className='mp__flex mp__flexGrow mp__flexCenteredVert mp__margLeft10'>
                    {/* <HelpIcon fontSize='small' className='mp__iconGray'/> */}
                </div>
                {open ? <Button size='small' className='bridge__btn' disabled={loading} onClick={toggleOpen} >
                    Close
                </Button> : <div className='mp__flex'>
                    {props.recommendedRechargeAmount && balance && balance !== '0' ? <Button size='small' className='bridge__btn' onClick={setWithdrawView} disabled={!balance} >
                        Withdraw
                    </Button> : null}
                    <Button size='small' variant='contained' className='bridge__btn mp__margLeft10' onClick={setRechargeView} disabled={!balance}>
                        Recharge
                    </Button>
                </div>}
            </div>
            <Collapse in={open}>
                <CardContent className='mp__noPadd'>
                    {view === 'recharge' ? (<div>
                        {/* <h2 className='mp__margTop20'>Recharge</h2> */}
                        <BridgePaper gray rounded margTop>
                            <p className={'mp__p mp__p4 whiteText'}>
                                You need a balance in this wallet to transfer to Ethereum. This wallet is used to pay for gas fees when your transaction is presented to Ethereum. You may withdraw from the wallet at anytime.
                            </p>
                        </BridgePaper>

                        <Grid container spacing={2} >
                            <Grid className='fl-centered' item md={6} sm={12} xs={12}>
                                <div className='mp__margTop20 br__paper br__paperRounded ' style={{ background: '#2a2a2a' }}>
                                    <p className={'mp__noMarg mp__p mp__p3 '}>
                                        Recharge amount
                                    </p>
                                    <AmountInput setAmount={setAmount} amount={amount} token={{}} loading={loading} balance={accountBalance} maxBtn={false} />
                                </div>
                            </Grid>
                            <Grid className='mp__margTop20' item md={3} sm={12} xs={12}>
                                <BridgePaper rounded gray fullHeight>
                                    <BalanceBlock
                                        icon={getChainIcon('mainnet', true)}
                                        chainName='Ethereum'
                                        balance={accountBalance}
                                        token='eth'
                                    />
                                </BridgePaper>
                            </Grid>
                            <Grid className='mp__margTop20' item md={3} sm={12} xs={12}>
                                <BridgePaper rounded gray fullHeight>
                                    <BalanceBlock
                                        icon={<AccountBalanceWalletRoundedIcon className='chainIcon' style={{ color: '#b5b5b5' }} />}
                                        chainName='exit wallet'
                                        balance={balance}
                                        token='eth'
                                    />
                                </BridgePaper>
                            </Grid>
                        </Grid>
                        <Button
                            onClick={recharge}
                            variant="contained"
                            disabled={loading || !balance || !accountBalance || Number(amount) > Number(accountBalance) || amount === '' || amount === '0' || !amount}
                            className='mp__margTop20 bridge__btn'
                            size='large'
                        >
                            {getRechargeBtnText()}
                        </Button>


                    </div>) : null}
                    {view === 'withdraw' ? (<div className=''>
                        <Grid container spacing={2}>
                            <Grid className='fl-centered mp__margTop20' item md={9} sm={12} xs={12}>
                                <div className='br__paper br__paperRounded br__paperGrey'>
                                    <p className={'mp__p mp__p4 whiteText'}>
                                        Withdraw all ETH from exit gas wallet. You will be unable to perform transfers until you refill again.
                                    </p>
                                </div>
                            </Grid>
                            <Grid className='mp__margTop20' item md={3} sm={12} xs={12}>
                                <BridgePaper rounded gray fullHeight>
                                    <BalanceBlock
                                        icon={<AccountBalanceWalletRoundedIcon className='chainIcon' style={{ color: '#b5b5b5' }} />}
                                        chainName='exit wallet'
                                        balance={balance}
                                        token='eth'
                                    />
                                </BridgePaper>
                            </Grid>
                        </Grid>
                        <Button
                            onClick={withdraw}
                            variant="contained"
                            disabled={loading || !balance || balance === '0'}
                            className='mp__margTop20 bridge__btn'
                            size='large'
                        >
                            {loading ? 'Withdrawing...' : `Withdraw ${balance ? balance.substring(0, 8) : null} ETH`}
                        </Button>
                    </div>) : null}
                </CardContent >
            </Collapse>
        </Card >
    </div >)
}