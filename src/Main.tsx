import { useEffect } from 'react';

import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import ChainCards from './components/ChainCards';
import { getChainIcon } from './components/ActionCard/helper';
import CHAINS from './chainsData.json';


export default function Main(props: any) {
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
      </Stack>
    </Container>)
}