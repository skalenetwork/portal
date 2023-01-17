import React, { useEffect } from 'react';

import logoEth from './img/eth.png';
import dogLogo from './img/dog_face_3d.png';
import catLogo from './img/cat_face_3d.png';

import Container from '@mui/material/Container';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

import Button from '@mui/material/Button';
import SwipeRightIcon from '@mui/icons-material/SwipeRight';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import CancelIcon from '@mui/icons-material/Cancel';

import MoveUpIcon from '@mui/icons-material/MoveUp';
import MoveDownIcon from '@mui/icons-material/MoveDown';

import { interfaces, dataclasses } from '@skalenetwork/metaport';
import metaportConfig from './metaportConfig.json'


export default function TransferRequests(props: any) {
  const [connected, setConnected] = React.useState(false);

  const [loading, setLoading] = React.useState(false);
  const [loading2, setLoading2] = React.useState(false);
  const [loading3, setLoading3] = React.useState(false);
  const [loading4, setLoading4] = React.useState(false);

  const [amount, setAmount] = React.useState('0.02');
  const [amount2, setAmount2] = React.useState('0.01');
  const [amount3, setAmount3] = React.useState('0.01');
  const [amount4, setAmount4] = React.useState('0.01');

  const [balance, setBalance] = React.useState(null);
  const [balance2, setBalance2] = React.useState(null);
  const [balance3, setBalance3] = React.useState(null);

  useEffect(() => {
    window.addEventListener(
      "metaport_transferComplete",
      transferComplete,
      false
    );

    window.addEventListener(
      "metaport_unwrapComplete",
      transferComplete,
      false
    );

    window.addEventListener(
      "metaport_connected",
      widgetConnected,
      false
    );

    // const interval = setInterval(() => requestBalances(), 5000);
    // return () => {
    //   clearInterval(interval);
    // };
  }, []);


  function widgetConnected() {
    setConnected(true);
  }

  const handleAmount = (event: any, newAmount: React.SetStateAction<string>) => {
    setAmount(newAmount);
  };

  const handleAmount2 = (event: any, newAmount: React.SetStateAction<string>) => {
    setAmount2(newAmount);
  };

  const handleAmount3 = (event: any, newAmount: React.SetStateAction<string>) => {
    setAmount3(newAmount);
  };

  const handleAmount4 = (event: any, newAmount: React.SetStateAction<string>) => {
    setAmount4(newAmount);
  };

  function requestTransfer() {
    const params: interfaces.TransferParams = {
      amount: amount,
      chains: [metaportConfig.chains[0], metaportConfig.chains[2]],
      tokenKeyname: 'eth',
      tokenType: dataclasses.TokenType.eth,
      lockValue: true,
      route: {
        hub: 'staging-perfect-parallel-gacrux',
        tokenKeyname: '_wrETH_0xBA3f8192e28224790978794102C0D7aaa65B7d70'
      }
    };
    props.metaport.transfer(params);
  }

  function transferComplete(e: any) {
    if (!e.detail.unwrap) {
      setLoading(false);
      setLoading2(false);
      setLoading3(false);
      props.metaport.reset();
      props.metaport.close();
      props.setOpen(true); // TODO: fix!
    }
  }

  function requestTransfer2() {
    const params: interfaces.TransferParams = {
      amount: amount,
      chains: [metaportConfig.chains[2], metaportConfig.chains[0]],
      tokenKeyname: '_WRETH_0xBA3f8192e28224790978794102C0D7aaa65B7d70',
      tokenType: dataclasses.TokenType.erc20,
      lockValue: true,
      route: {
        hub: 'staging-perfect-parallel-gacrux',
        tokenKeyname: 'eth'
      }
    };
    props.metaport.transfer(params);
  }

  function requestTransfer3() {
    const params: interfaces.TransferParams = {
      amount: amount,
      chains: [metaportConfig.chains[0], metaportConfig.chains[1]],
      tokenKeyname: '_TST_0x2868716b3B4AEa43E8387922AFE71a77D101854e',
      tokenType: dataclasses.TokenType.erc20,
      lockValue: true
    };
    props.metaport.transfer(params);
  }

  function requestTransfer4() {
    const params: interfaces.TransferParams = {
      amount: amount,
      chains: [metaportConfig.chains[1], metaportConfig.chains[0]],
      tokenKeyname: '_TST_0x2868716b3B4AEa43E8387922AFE71a77D101854e',
      tokenType: dataclasses.TokenType.erc20,
      lockValue: true
    };
    props.metaport.transfer(params);
  }

  function requestTransfer5() {
    const params: interfaces.TransferParams = {
      amount: amount,
      chains: [metaportConfig.chains[1], metaportConfig.chains[2]],
      tokenKeyname: '_USDC_0x099A46F35b627CABee27dc917eDA253fFbC55Be6',
      tokenType: dataclasses.TokenType.erc20,
      lockValue: true
    };
    props.metaport.transfer(params);
  }

  function cancelTransferRequest() {
    setLoading(false);
    props.metaport.close();
  }

  function cancelTransferRequest2() {
    setLoading2(false);
    props.metaport.close();
  }

  function cancelTransferRequest3() {
    setLoading3(false);
    props.metaport.close();
  }

  function cancelTransferRequest4() {
    setLoading4(false);
    props.metaport.close();
  }

  return (
    <Container maxWidth="md">
      <Stack spacing={3}>
        <h1 className="mp__noMarg">Transfer Requests Demo</h1>
        <Typography sx={{ mb: 1.5 }} color="text.secondary" className='mp__margBott10 mp__noMargTop'>
          This demo demonstrates transfer requests demo.
        </Typography>
        <Stack spacing={3}>
          <Card variant="outlined">
            <CardContent>
              <Stack spacing={3}>
                <Button
                  onClick={requestTransfer}
                  variant="contained"
                  startIcon={<SwipeRightIcon />}
                  disabled={loading3 || loading2 || loading || amount === null || loading3}
                  className='mp__margTop10 demoBtn'
                >
                  Transfer ETH from Mainnet to Cat chain
                </Button>
                <Button
                  onClick={requestTransfer2}
                  variant="contained"
                  startIcon={<SwipeRightIcon />}
                  disabled={loading3 || loading2 || loading || amount === null || loading3}
                  className='mp__margTop10 demoBtn'
                >
                  Transfer ETH from Cat chain to Mainnet
                </Button>
                <Button
                  onClick={requestTransfer3}
                  variant="contained"
                  startIcon={<SwipeRightIcon />}
                  disabled={loading3 || loading2 || loading || amount === null || loading3}
                  className='mp__margTop10 demoBtn'
                >
                  Transfer SKL from Mainnet to Dog chain
                </Button>
                <Button
                  onClick={requestTransfer4}
                  variant="contained"
                  startIcon={<SwipeRightIcon />}
                  disabled={loading3 || loading2 || loading || amount === null || loading3}
                  className='mp__margTop10 demoBtn'
                >
                  Transfer SKL from Dog chain to Mainnet
                </Button>
                <Button
                  onClick={requestTransfer5}
                  variant="contained"
                  startIcon={<SwipeRightIcon />}
                  disabled={loading3 || loading2 || loading || amount === null || loading3}
                  className='mp__margTop10 demoBtn'
                >
                  Transfer USDC from Dog chain to Cat chain
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </Stack>
    </Container>)
}