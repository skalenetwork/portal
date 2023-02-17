import React, { useEffect } from 'react';
import debug from 'debug';

import Web3 from 'web3';

import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';

import { initChainWeb3 } from '../../core/tokens';
import { Collapse } from '@mui/material';
import { MAINNET_CHAIN_NAME } from '../../core/constants';
import { AnonymousPoW } from "@skaleproject/pow-ethers";
import { getFuncData } from '../../core/faucet';


debug.enable('*');
const log = debug('bridge:components:SFuel');


const SFUEL_TEXT = {
    'sfuel': {
        'action': '',
        'warning': 'You may need sFUEL on the destination chain',
        'error': 'You need sFUEL to perform this transfer'
    },
    'gas': {
        'action': '',
        'warning': 'You may need ETH on the destination chain',
        'error': 'You need ETH to perform this transfer'
    }
}


export default function SFuel(props: any) {
    const [loading, setLoading] = React.useState<boolean>(true);
    const [fromChainWeb3, setFromChainWeb3] = React.useState<Web3>();
    const [toChainWeb3, setToChainWeb3] = React.useState<Web3>();
    const [hubChainWeb3, setHubChainWeb3] = React.useState<Web3>();

    const [updateBalanceTime, setUpdateBalanceTime] = React.useState<number>(Date.now());

    const [fromChainSFuel, setFromChainSFuel] = React.useState<string>();
    const [toChainSFuel, setToChainSFuel] = React.useState<string>();
    const [hubChainSFuel, setHubChainSFuel] = React.useState<string>();

    const [sFuelStatus, setSFuelStatus] = React.useState<'action' | 'warning' | 'error'>('action');

    useEffect(() => {
        if (!props.fromChain || !props.toChain) return;
        setFromChainWeb3(initChainWeb3(props.fromChain));
        setToChainWeb3(initChainWeb3(props.toChain));
        if (props.hubChain) {
            setHubChainWeb3(initChainWeb3(props.hubChain));
        }
        const interval = setInterval(() => setUpdateBalanceTime(Date.now()), 8 * 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        getFromChainBalance();
    }, [fromChainWeb3]);

    useEffect(() => {
        getToChainBalance();
    }, [toChainWeb3]);

    useEffect(() => {
        getHubChainBalance();
    }, [hubChainWeb3]);

    useEffect(() => {
        updateBalances();
    }, [updateBalanceTime, props.address]);

    useEffect(() => {
        if (!fromChainSFuel || !toChainSFuel) return;
        setLoading(true);
        if (fromChainSFuel === '0' || (hubChainSFuel && hubChainSFuel === '0')) {
            setSFuelStatus('error');
            props.setSFuelOk(false);
        } else {
            if (toChainSFuel === '0') {
                setSFuelStatus('warning');
            } else {
                setSFuelStatus('action');
            }
            props.setSFuelOk(true);
        }
        setLoading(false);
    }, [fromChainSFuel, toChainSFuel, hubChainSFuel]);

    function updateBalances() {
        getFromChainBalance();
        getToChainBalance();
        getHubChainBalance();
    }

    async function getFromChainBalance() {
        if (!fromChainWeb3) return;
        const balance = await fromChainWeb3.eth.getBalance(props.address);
        log('fromChain sFUEL balance:', balance);
        setFromChainSFuel(balance);
    }

    async function getToChainBalance() {
        if (!toChainWeb3) return;
        const balance = await toChainWeb3.eth.getBalance(props.address);
        log('toChain sFUEL balance:', balance);
        setToChainSFuel(balance);
    }

    async function getHubChainBalance() {
        if (!hubChainWeb3) return;
        const balance = await hubChainWeb3.eth.getBalance(props.address);
        log('hubChain sFUEL balance:', balance);
        setHubChainSFuel(balance);
    }

    async function powFromChain() {
        if (!fromChainWeb3 || !fromChainWeb3.currentProvider || !props.fromChain) return false;
        const anon = new AnonymousPoW({ rpcUrl: fromChainWeb3.currentProvider.toString() });
        log('Mining sFUEL fromChain');
        await anon.send(getFuncData(fromChainWeb3, props.fromChain, props.address));
        return true;
    }

    async function powToChain() {
        if (!toChainWeb3 || !toChainWeb3.currentProvider || !props.toChain) return false;
        const anon = new AnonymousPoW({ rpcUrl: toChainWeb3.currentProvider.toString() });
        log('Mining sFUEL toChain');
        await anon.send(getFuncData(toChainWeb3, props.toChain, props.address));
        return true;
    }

    async function powHubChain() {
        if (!hubChainWeb3 || !hubChainWeb3.currentProvider || !props.hubChain) return false;
        const anon = new AnonymousPoW({ rpcUrl: hubChainWeb3.currentProvider.toString() });
        log('Mining sFUEL hubChain');
        await anon.send(getFuncData(hubChainWeb3, props.hubChain, props.address));
        return true;
    }

    async function pow() {
        if (fromChainSFuel === '0' && props.fromChain !== MAINNET_CHAIN_NAME) {
            let success = false;
            setLoading(true);
            try {
                success = await powFromChain();
            } catch (e: any) {
                log('Mining sFUEL error', e);
                props.setMsgType('error');
                props.setMsg(e.message);
            }
            await updateBalances();
            setLoading(false);
            if (!success) {
                window.open('https://sfuel.skale.network/', '_blank');
            }
            return;
        }
        if (hubChainSFuel && hubChainSFuel === '0') {
            let success = false;
            setLoading(true);
            try {
                success = await powHubChain();
            } catch (e: any) {
                log('Mining sFUEL error', e);
                props.setMsgType('error');
                props.setMsg(e.message);
            }
            await updateBalances();
            setLoading(false);
            if (!success) {
                window.open('https://sfuel.skale.network/', '_blank');
            }
            return;
        }
        if (toChainSFuel && toChainSFuel === '0') {
            let success = false;
            setLoading(true);
            try {
                success = await powToChain();
            } catch (e: any) {
                log('Mining sFUEL error', e);
                props.setMsgType('error');
                props.setMsg(e.message);
            }
            await updateBalances();
            setLoading(false);
            if (!success) {
                window.open('https://sfuel.skale.network/', '_blank');
            }
            return;
        }
    }


    const noEth = (fromChainSFuel === '0' && props.fromChain === MAINNET_CHAIN_NAME);

    return (<Collapse in={!loading && sFuelStatus !== 'action'} className='mp__noMarg'>
        <Card variant="outlined" className='topBannerNew bridgeUIPaper mp__margTop20'>
            <div className='mp__flex mp__flexCenteredVert mp__margRi10 mp__margLeft10'>
                <div className='mp__margLeft10 mp__margRi10 mp__flex mp__flexCenteredVert'>
                    <div className='mp__flex mp__flexCenteredVert'>
                        <LocalGasStationIcon color={sFuelStatus} />
                        <p className='mp__flex mp__margLeft10'>
                            {noEth ? SFUEL_TEXT['gas'][sFuelStatus] : SFUEL_TEXT['sfuel'][sFuelStatus]}
                        </p>
                    </div>
                </div>
                <div className='mp__flex mp__flexGrow mp__flexCenteredVert mp__margLeft10'>
                    {/* <HelpIcon fontSize='small' className='mp__iconGray'/> */}
                </div>

                {!noEth ? (<div className='mp__flex'>
                    <Button
                        onClick={pow}
                        size='small'
                        variant='contained'
                        className='bridge__btn mp__margLeft10'
                        disabled={loading}
                    >
                        {loading ? 'Mining...' : 'Get sFUEL'}
                    </Button>
                </div>) : null}

            </div>
        </Card >
    </Collapse>)
}