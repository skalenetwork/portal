import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import LanguageIcon from '@mui/icons-material/Language';
import TollIcon from '@mui/icons-material/Toll';

import BridgePaper from '../BridgePaper';
import { iconPath } from '../ActionCard/helper';
import { CHAINS_META, MAINNET_CHAIN_NAME, SUCCESS_EMOJIS } from '../../core/constants';
import { getRandom } from '../../core/helper';


export default function TransferDone(props: any) {

  const [emoji, setEmoji] = React.useState<string>();

  useEffect(() => {
    setEmoji(getRandom(SUCCESS_EMOJIS));
  }, []);

  const dAppUrl = CHAINS_META[props.to] && CHAINS_META[props.to]['url'] ? CHAINS_META[props.to]['url'] : undefined;
  return (
    <div className="mp__margTop20">
      <Grid container spacing={2} >
        <Grid item md={8} sm={12} xs={12}>
          <BridgePaper rounded gray fullHeight>
            <div className="mp__flex mp__flexCenteredVert">
              <h3 className="mp__flex  mp__noMarg">{emoji} You've successfully transferred</h3>
              <img
                className='mp__iconTokenTransferDone mp__flex mp__flexCenteredVert mp__margLeft10 mp__margRi5'
                src={iconPath(props.token)}
              />
              <h3 className="mp__flex  mp__noMarg">
                {props.amount} {props.token ? props.token.toUpperCase() : ''}
              </h3>
            </div>
            <p className='mp__margTop10 mp__p mp__p4'>
              Proceed to the dApp or go back to the transfer page.
            </p>
          </BridgePaper>
        </Grid>
        <Grid className='fl-centered' item md={4} sm={12} xs={12}>
          {props.balancesBlock}
        </Grid>
      </Grid>
      {dAppUrl ? <Button
        href={dAppUrl}
        target="_blank"
        rel="noopener noreferrer"
        variant="contained"
        startIcon={<LanguageIcon />}
        className='mp__margTop20 mp__margRi10 bridge__btn'
        size='large'
      >
        Go to {props.toChainName}
      </Button> : null}
      {(props.to === MAINNET_CHAIN_NAME && props.token === 'eth') ? null : <Button
        onClick={() => { }}
        variant="contained"
        startIcon={<TollIcon />}
        className='mp__margTop20 mp__margRi10 bridge__btn'
        size='large'
      >
        Add token
      </Button>}
      <Button
        onClick={() => { props.setActiveStep(0) }}
        startIcon={<RestartAltIcon />}
        variant={dAppUrl ? 'text' : 'contained'}
        className='mp__margTop20 bridge__btn'
        size='large'
      >
        Go back
      </Button>
    </div>
  );
}