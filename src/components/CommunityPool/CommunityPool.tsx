import React, { useEffect } from 'react';
import { MainnetChain } from '@skalenetwork/ima-js';
import debug from 'debug';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Collapse from '@mui/material/Collapse';
import Skeleton from '@mui/material/Skeleton';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

import AmountInput from '../AmountInput';


import { MAINNET_CHAIN_NAME, DEFAULT_ERC20_DECIMALS, METAPORT_CONFIG } from '../../core/constants';
import { initChainWeb3 } from '../../core/tokens';
import { fromWei, toWei } from '../../core/convertation';
import { initMainnetMetamask, initMainnet } from '../../core/network';

debug.enable('*');
const log = debug('bridge:components:CommunityPool');


export default function CommunityPool(props: any) {
    const [open, setOpen] = React.useState<boolean>(false);
    const [view, setView] = React.useState<string>();

    const [accountBalance, setAccountBalance] = React.useState<string>();
    const [balance, setBalance] = React.useState<string>();

    const [loading, setLoading] = React.useState(false);
    const [amount, setAmount] = React.useState<string>();

    const [mainnet, setMainnet] = React.useState<MainnetChain>();

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
        if (mainnet && props.address) {
            updateBalance();
        }
    }, [mainnet, props.address, props.chainName]);

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
        log('updating balance for community pool');
        if (!mainnet) return;
        const balanceWei = await mainnet.communityPool.balance(props.address, props.chainName);
        const balanceEther = fromWei(balanceWei as string, DEFAULT_ERC20_DECIMALS);
        setBalance(balanceEther);

        const accountBalanceWei = await mainnet.ethBalance(props.address);
        const accountBalanceEther = fromWei(accountBalanceWei as string, DEFAULT_ERC20_DECIMALS);
        setAccountBalance(accountBalanceEther);

        const recommendedRechargeAmountWei = await mainnet.communityPool.contract.methods.getRecommendedRechargeAmount(
            mainnet.web3.utils.soliditySha3(props.chainName),
            props.address
        ).call();
        const recommendedRechargeAmountEther = fromWei(recommendedRechargeAmountWei as string, DEFAULT_ERC20_DECIMALS);
        props.setRecommendedRechargeAmount(recommendedRechargeAmountEther);

        let recommendedAmount = parseFloat(recommendedRechargeAmountEther as string) * 10;
        if (recommendedAmount < 0.01) recommendedAmount = 0.01;

        if (recommendedRechargeAmountWei !== '0') {
            setAmount(recommendedAmount.toFixed(2).toString());
        }
    }

    return (<div className='marg-top-40'>
        <Card variant="outlined" className='topBannerNew bridgeUIPaper'>
            <div className='mp__flex mp__flexCenteredVert mp__margRi10 mp__margLeft10'>
                <div className='mp__margLeft10 mp__margRi10 mp__flex mp__flexCenteredVert'>
                    {props.recommendedRechargeAmount && balance ? <div className='mp__flex mp__flexCenteredVert'>
                        {props.recommendedRechargeAmount === '0' ? <CheckCircleIcon color='success' /> : <ErrorIcon color='warning' />}
                        <p className='mp__flex mp__margLeft10'>
                            {props.recommendedRechargeAmount === '0' ? 'Exit gas wallet OK' : 'You need to recharge exit gas wallet first'}
                        </p>
                    </div> : <Skeleton className='mp__flex' width='180px' height='47px' />}
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
                <CardContent className='mp__margLeft20 mp__margRi20 mp__margTop20 mp__margBott20'>

                    {view === 'recharge' ? (<div>
                        <h2 className='mp__noMarg'>Recharge</h2>
                        <p className={'mp__margTop5 mp__margBott20 mp__p mp__p4 '}>
                            You need a balance in this wallet to transfer to Ethereum. This wallet is used to pay for gas fees when your transaction is presented to Ethereum. You may withdraw from the wallet at anytime.
                        </p>

                        <p className={'mp__margTop5 mp__margBott20 mp__p mp__p4 '}>
                            ⚠️ You may need to wait for some time (5-10 min) after the first Exit gas wallet recharge before you will be able to move funds to Ethereum.
                        </p>
                        <p className={'mp__noMarg mp__p mp__p3 '}>
                            Mainnet ETH balance
                        </p>
                        <p className={'mp__margBott10 mp__p mp__p4 whiteText'}>
                            {accountBalance} ETH
                        </p>

                        <p className={'mp__noMarg mp__p mp__p3 '}>
                            Exit gas wallet balance
                        </p>
                        <p className={'mp__margBott10 mp__p mp__p4 whiteText'}>
                            {balance} ETH
                        </p>

                        <Grid container className=''>
                            <Grid className='fl-centered' item md={6} sm={12} xs={12}>
                                <div className='mp__flex mp__flexCenteredVert mp__margTop10 mp__margBott5'>
                                    <p className={'mp__p2 mp__noMarg mp__flexGrow  ' + (loading ? 'mp__disabledP' : '')}>Amount</p>
                                </div>
                                <AmountInput setAmount={setAmount} amount={amount} token={{}} loading={loading} balance={accountBalance} maxBtn={false} />
                                <Button
                                    onClick={recharge}
                                    variant="contained"
                                    disabled={loading || !balance || !accountBalance || Number(amount) > Number(accountBalance) || amount === '' || amount === '0' || !amount}
                                    className='mp__margTop20 bridge__btn'
                                    size='large'
                                >
                                    {loading ? 'Recharging...' : 'Recharge'}
                                </Button>
                            </Grid>
                        </Grid>
                    </div>) : null}
                    {view === 'withdraw' ? (<div className=''>
                        <h2 className='mp__noMarg'>Withdraw {balance} ETH</h2>
                        <p className={'mp__margTop5 mp__p mp__p4 '}>
                            Withdraw all ETH from exit gas wallet. You will be unable to perform transfers until you refill again.
                        </p>
                        <Button
                            onClick={withdraw}
                            variant="contained"
                            disabled={loading || !balance || balance === '0'}
                            className='mp__margTop20 bridge__btn'
                            size='large'
                        >
                            {loading ? 'Withdrawing...' : 'Withdraw'}
                        </Button>
                    </div>) : null}

                </CardContent >
            </Collapse>
        </Card >
    </div>)
}