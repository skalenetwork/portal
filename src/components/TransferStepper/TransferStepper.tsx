import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';

import { getChainName } from '../ActionCard/helper';

import { CHAINS_META } from '../../core/constants';

import './TransferStepper.scss';

export default function TransferStepper(props: any) {
  const dest = getChainName(CHAINS_META, props.to as string, props.toApp);
  const steps = ['Transfer tokens', 'Switch to ' + dest];
  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={props.disabled ? null : props.activeStep} className='mp__stepper'>
        {steps.map((label, index) => {
          const stepProps: { completed?: boolean } = {};
          const labelProps: {
            optional?: React.ReactNode;
          } = {};
          return (
            <Step key={label} {...stepProps} className='mp__labelStep'>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
    </Box>
  );
}