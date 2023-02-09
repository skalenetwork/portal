import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import LanguageIcon from '@mui/icons-material/Language';
import { iconPath } from '../ActionCard/helper';

import { CHAINS_META } from '../../core/constants';


export default function TransferDone(props: any) {
  const dAppUrl = CHAINS_META[props.to] && CHAINS_META[props.to]['url'] ? CHAINS_META[props.to]['url'] : undefined;
  return (
    <div className="">
      <div className="mp__flex mp__margTop40 mp__flexCenteredVert">
        <h2 className="mp__flex  mp__noMarg">🎉 You've successfully transferred</h2>
        <img
          className='mp__iconTokenBtn mp__flex mp__flexCenteredVert mp__margLeft10 mp__margRi5'
          src={iconPath(props.token)}
        />
        <h2 className="mp__flex  mp__noMarg">
          {props.amount} {props.token ? props.token.toUpperCase() : ''}
        </h2>

      </div>

      <p className={'mp__margTop10 mp__margBott20 mp__p mp__p4 '}>
        Proceed to the dApp or go back to the transfer page.
      </p>

      {dAppUrl ? <Button
        href={dAppUrl}
        target="_blank"
        rel="noopener noreferrer"
        variant="contained"
        startIcon={<LanguageIcon />}
        className='mp__margTop20 mp__margRi20 bridge__btn'
        size='large'
      >
        Go to {props.toChainName}
      </Button> : null}
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