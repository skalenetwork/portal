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
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import CancelIcon from '@mui/icons-material/Cancel';

import MoveUpIcon from '@mui/icons-material/MoveUp';
import MoveDownIcon from '@mui/icons-material/MoveDown';

import { interfaces, dataclasses } from '@skalenetwork/metaport';
import metaportConfig from './metaportConfig.json'

import PopularActions from './components/PopularActions';
import ChainCards from './components/ChainCards';

import { getChainIcon } from './components/ActionCard/helper';

import CHAINS from './chainsData.json';


export default function Main(props: any) {
  function openSandbox() {
    props.metaport.open();
  }

  function closeMetaport() {
    props.metaport.close();
  }

  function resetMetaport() {
    props.metaport.reset();
  }

  useEffect(() => {
    props.metaport.close();
  }, []);

  return (
    <Container maxWidth="md">
      <Stack spacing={3}>
        <div className='mp__flex mp__flexCenteredVert'>
          <div className='mp__flex'>
            <h2 className="mp__flex mp__noMarg">Transfer from</h2>
          </div>
          <div className='mp__flex mp__margRi5 mp__margLeft10'>
            {getChainIcon('mainnet', true)}
          </div>
          <div className='mp__flex'>
            <h2 className="mp__flex mp__noMarg">Ethereum Mainnet</h2>
          </div>
        </div>
        <Typography color="text.secondary" className='mp__noMarg'>
          Choose destination app below:
        </Typography>

        <ChainCards chains={CHAINS['mainnet']} from={'mainnet'} />

        <div className='mp__flex mp__flexCenteredVert'>
          <div className='mp__flex'>
            <h2 className="mp__flex mp__noMarg">Transfer from</h2>
          </div>
          <div className='mp__flex mp__margRi5 mp__margLeft10'>
            {getChainIcon('staging-perfect-parallel-gacrux', true, 'ruby')}
          </div>
          <div className='mp__flex'>
            <h2 className="mp__flex mp__noMarg">Ruby Exchange</h2>
          </div>
        </div>
        <Typography sx={{ mb: 1.5 }} color="text.secondary" className='mp__margBott10 mp__noMargTop'>
          Choose destination app below:
        </Typography>

        <ChainCards
          chains={CHAINS['staging-perfect-parallel-gacrux']}
          from={'staging-perfect-parallel-gacrux'}
          fromApp='ruby'
        />

        <div className='mp__flex mp__flexCenteredVert'>
          <div className='mp__flex'>
            <h2 className="mp__flex mp__noMarg">Transfer from</h2>
          </div>
          <div className='mp__flex mp__margRi5 mp__margLeft10'>
            {getChainIcon('staging-severe-violet-wezen', true, 'nftrade')}
          </div>
          <div className='mp__flex'>
            <h2 className="mp__flex mp__noMarg">NFTrade</h2>
          </div>
        </div>
        <Typography sx={{ mb: 1.5 }} color="text.secondary" className='mp__margBott10 mp__noMargTop'>
          Choose destination app below:
        </Typography>

        <ChainCards
          chains={CHAINS['staging-severe-violet-wezen']}
          from={'staging-severe-violet-wezen'}
          fromApp='nftrade'
        />

        <div className='mp__margTop20'>
          <div className='mp__margTop20'>
            <Typography sx={{ mb: 1.5 }} color="text.secondary" className='mp__margBott10 mp__noMargTop'>
              Bridge tokens between SKALE Chains and Ethereum Mainnet. <br />
              You can also open Metaport Sandbox by clicking on the button in the bottom right corner.
            </Typography>
          </div>
        </div>

        {/* <h2 className="mp__noMargBott">Other popular actions</h2>
        <Typography sx={{ mb: 1.5 }} color="text.secondary" className='mp__margBott10 mp__noMargTop'>
          Choose from some of the most popular transfer actions
        </Typography>
        <PopularActions /> */}

        {/* <Typography sx={{ mb: 1.5 }} color="text.secondary" className='mp__margBott10 mp__textCentered'>
          OR
        </Typography>
        <Button
          onClick={openSandbox}
          variant="contained"
          startIcon={<OpenInNewIcon />}
          className='mp__margTop10 demoBtn'
        >
          Open Metaport
        </Button> */}
      </Stack>
    </Container>)
}