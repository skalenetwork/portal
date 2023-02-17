import React, { useEffect } from 'react';
import debug from 'debug';

import Web3 from 'web3';

import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';

import { getChainEndpoint, initChainWeb3 } from '../../core/tokens';
import { Collapse } from '@mui/material';
import { MAINNET_CHAIN_NAME } from '../../core/constants';
import { AnonymousPoW } from "@skaleproject/pow-ethers";
import { getFuncData, isFaucetAvailable } from '../../core/faucet';
import { FALSE } from 'sass';


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
    const [loadingSFUEL, setLoadingSFUEL] = React.useState<boolean>(false);
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
        if (!fromChainWeb3 || !props.fromChain || !isFaucetAvailable(props.fromChain) || !getChainEndpoint(props.fromChain)) return false;
        const anon = new AnonymousPoW({ rpcUrl: getChainEndpoint(props.fromChain) });
        log('Mining sFUEL fromChain');
        await (await anon.send(getFuncData(fromChainWeb3, props.fromChain, props.address))).wait();
        return true;
    }

    async function powToChain() {
        if (!toChainWeb3 || !props.toChain || !isFaucetAvailable(props.toChain) || !getChainEndpoint(props.toChain)) return false;
        const anon = new AnonymousPoW({ rpcUrl: getChainEndpoint(props.toChain) });
        log('Mining sFUEL toChain');
        await (await anon.send(getFuncData(toChainWeb3, props.toChain, props.address))).wait();
        return true;
    }

    async function powHubChain() {
        if (!hubChainWeb3 || !props.hubChain || !isFaucetAvailable(props.hubChain) || !getChainEndpoint(props.hubChain)) return false;
        const anon = new AnonymousPoW({ rpcUrl: getChainEndpoint(props.hubChain) });
        log('Mining sFUEL hubChain');
        await (await anon.send(getFuncData(hubChainWeb3, props.hubChain, props.address))).wait();
        return true;
    }

    async function pow() {
        let successFrom = true;
        let successHub = true;
        let successTo = true;
        setLoadingSFUEL(true);
        if (fromChainSFuel && fromChainSFuel === '0' && props.fromChain !== MAINNET_CHAIN_NAME) {
            try {
                successFrom = await powFromChain();
            } catch (e: any) {
                log('Mining sFUEL fromChain error', e);
                props.setMsgType('error');
                props.setMsg(e.message);
                successFrom = false;
            }
        }
        if (hubChainSFuel && hubChainSFuel === '0') {
            try {
                successHub = await powHubChain();
            } catch (e: any) {
                log('Mining sFUEL hubChain error', e);
                props.setMsgType('error');
                props.setMsg(e.message);
                successHub = false;
            }
        }
        if (toChainSFuel && toChainSFuel === '0' && props.toChain !== MAINNET_CHAIN_NAME) {
            try {
                successTo = await powToChain();
            } catch (e: any) {
                log('Mining sFUEL toChain error', e);
                props.setMsgType('error');
                props.setMsg(e.message);
                successTo = false;
            }
        }
        await updateBalances();
        setLoadingSFUEL(false);
        if (!(successFrom && successHub && successTo)) {
            window.open('https://sfuel.skale.network/', '_blank');
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
                    {loadingSFUEL ? 
                        (<LoadingButton
                            loading
                            loadingPosition="start"
                            size='small'
                            variant='contained'
                            className='bridge__btn bridge__btnLoading mp__margLeft10'
                        >
                            Mining...
                        </LoadingButton>)
                        : (<Button
                            onClick={pow}
                            size='small'
                            variant='contained'
                            className='bridge__btn mp__margLeft10'
                        >
                            Get SFUEL
                        </Button>)
                    }
                </div>) : null}

            </div>
        </Card >
    </Collapse>)
}