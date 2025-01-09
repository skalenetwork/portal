import { useState } from 'react'

import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Button from '@mui/material/Button'

import { cls, cmn, styles } from '../core/css'

import { ErrorMessage } from '../core/dataclasses'

import LinkOffRoundedIcon from '@mui/icons-material/LinkOffRounded'
import PublicOffRoundedIcon from '@mui/icons-material/PublicOffRounded'
import SentimentDissatisfiedRoundedIcon from '@mui/icons-material/SentimentDissatisfiedRounded'
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded'
import HourglassTopRoundedIcon from '@mui/icons-material/HourglassTopRounded'
import CrisisAlertRoundedIcon from '@mui/icons-material/CrisisAlertRounded'
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded'
import HourglassBottomRoundedIcon from '@mui/icons-material/HourglassBottomRounded'
import AvTimerRoundedIcon from '@mui/icons-material/AvTimerRounded'
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded'
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded'
import SortRoundedIcon from '@mui/icons-material/SortRounded'
import { DEFAULT_ERROR_MSG } from '../core/constants'

const ERROR_ICONS = {
  'link-off': <LinkOffRoundedIcon />,
  'public-off': <PublicOffRoundedIcon />,
  sentiment: <SentimentDissatisfiedRoundedIcon />,
  warning: <CrisisAlertRoundedIcon color="warning" />,
  error: <ErrorRoundedIcon />,
  time: <HourglassTopRoundedIcon />
}

export default function Error(props: { errorMessage: ErrorMessage }) {
  const [expanded, setExpanded] = useState<string | false>(false)

  const handleChange = (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false)
  }

  if (!props.errorMessage) return
  return (
    <div>
      <div className={cls(cmn.mtop20Pt, styles.infoIcon, cmn.pPrim)}>
        {ERROR_ICONS[props.errorMessage.icon]}
      </div>
      <p
        style={{ wordBreak: 'break-word' }}
        className={cls(cmn.p1, cmn.p, cmn.p600, cmn.pPrim, cmn.flexg, cmn.pCent, cmn.mtop10)}
      >
        {props.errorMessage.headline ?? DEFAULT_ERROR_MSG}
      </p>
      <p className={cls(cmn.p4, cmn.p, cmn.p500, cmn.pSec, cmn.flexg, cmn.pCent, cmn.mbott10)}>
        Logs are available in your browser's developer console
      </p>
      {props.errorMessage.showTips ? (
        <div>
          <div
            className={cls(
              cmn.flex,
              cmn.fullWidth,
              cmn.flexcv,
              cmn.mtop20,
              cmn.mbott10,
              cmn.mleft10
            )}
          >
            <div className={cls(cmn.flex, cmn.flexc, cmn.mri10)}>
              <HourglassBottomRoundedIcon color="info" />
            </div>
            <p className={cls(cmn.p, cmn.p3, cmn.p600, cmn.pPrim, cmn.mri10)}>
              Transfers might occasionally delay, but all tokens will be sent.
            </p>
          </div>
          <div
            className={cls(
              cmn.flex,
              cmn.fullWidth,
              cmn.flexcv,
              cmn.mtop20,
              cmn.mbott10,
              cmn.mleft10
            )}
          >
            <div className={cls(cmn.flex, cmn.flexc, cmn.mri10)}>
              <RestartAltRoundedIcon color="info" />
            </div>
            <p className={cls(cmn.p, cmn.p3, cmn.p600, cmn.pPrim, cmn.mri10)}>
              If a transfer is interrupted, you can continue from where you stopped.
            </p>
          </div>
          <div
            className={cls(
              cmn.flex,
              cmn.fullWidth,
              cmn.flexcv,
              cmn.mtop20,
              cmn.mbott10,
              cmn.mleft10
            )}
          >
            <div className={cls(cmn.flex, cmn.flexc, cmn.mri10)}>
              <AvTimerRoundedIcon color="info" />
            </div>
            <p className={cls(cmn.p, cmn.p3, cmn.p600, cmn.pPrim, cmn.mri10)}>
              Transfers from SKALE to Ethereum Mainnet have frequency limits.
            </p>
          </div>
          <div
            className={cls(
              cmn.flex,
              cmn.fullWidth,
              cmn.flexcv,
              cmn.mtop20,
              cmn.mbott10,
              cmn.mleft10
            )}
          >
            <div className={cls(cmn.flex, cmn.flexc, cmn.mri10)}>
              <HelpOutlineRoundedIcon color="info" />
            </div>
            <p className={cls(cmn.p, cmn.p3, cmn.p600, cmn.pPrim, cmn.mri10)}>
              If you still have questions, consult FAQ or contact the support team.
            </p>
          </div>
        </div>
      ) : null}
      <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
        <AccordionSummary
          className={cls(styles.accordionSummarySm, styles.accordionSm)}
          expandIcon={<ExpandMoreRoundedIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <div className={cls(cmn.flex, cmn.fullWidth, cmn.flexcv)}>
            <div className={cls(cmn.flex, cmn.flexc, cmn.mri10)}>
              <SortRoundedIcon />
            </div>
            <p className={cls(cmn.p, cmn.p3, cmn.p600, cmn.cap, cmn.pPrim, cmn.mri10)}>
              {expanded === 'panel1' ? 'Hide' : 'Show'} error details
            </p>
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <div className={cmn.mbott20}>
            <code
              style={{ wordBreak: 'break-all' }}
              className={cls(
                cmn.p4,
                cmn.p,
                cmn.pPrim,
                cmn.flexg,
                cmn.pCent,
                cmn.mleft10,
                cmn.mri10,
                cmn.mbott20
              )}
            >
              {props.errorMessage.text}
            </code>
          </div>
        </AccordionDetails>
      </Accordion>
      {props.errorMessage.fallback ? (
        <Button
          variant="contained"
          color="primary"
          size="medium"
          className={cls(styles.btnAction, cmn.mtop5)}
          onClick={() => {
            props.errorMessage.fallback()
          }}
        >
          {props.errorMessage.btnText}
        </Button>
      ) : null}
    </div>
  )
}
