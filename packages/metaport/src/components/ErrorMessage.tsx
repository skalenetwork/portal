/**
 * @license
 * SKALE Metaport
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
/**
 * @file ErrorMessage.ts
 * @copyright SKALE Labs 2025-Present
 */

import { useState } from 'react'
import { dc } from '@/core'

import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Button from '@mui/material/Button'

import { cls, cmn, styles } from '../core/css'

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

export default function Error(props: { errorMessage: dc.ErrorMessage }) {
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
        className={cls(cmn.p1, cmn.p, cmn.pPrim, 'font-semibold flex-grow text-center mt-2.5')}
      >
        {props.errorMessage.headline ?? DEFAULT_ERROR_MSG}
      </p>
      <p className={cls(text-xs, cmn.p, cmn.pSec, 'font-medium flex-grow text-center mb-2.5')}>
        Logs are available in your browser's developer console
      </p>
      {props.errorMessage.showTips ? (
        <div>
          <div className="flex w-full items-center mt-5 mb-2.5 ml-2.5">
            <div className="flex items-center justify-center mr-2.5">
              <HourglassBottomRoundedIcon color="info" />
            </div>
            <p className={cls(cmn.p, text-sm, cmn.pPrim, 'font-semibold mr-2.5')}>
              Transfers might occasionally delay, but all tokens will be sent.
            </p>
          </div>
          <div className="flex w-full items-center mt-5 mb-2.5 ml-2.5">
            <div className="flex items-center justify-center mr-2.5">
              <RestartAltRoundedIcon color="info" />
            </div>
            <p className={cls(cmn.p, text-sm, cmn.pPrim, 'font-semibold mr-2.5')}>
              If a transfer is interrupted, you can continue from where you stopped.
            </p>
          </div>
          <div className="flex w-full items-center mt-5 mb-2.5 ml-2.5">
            <div className="flex items-center justify-center mr-2.5">
              <AvTimerRoundedIcon color="info" />
            </div>
            <p className={cls(cmn.p, text-sm, cmn.pPrim, 'font-semibold mr-2.5')}>
              Transfers from SKALE to Ethereum Mainnet have frequency limits.
            </p>
          </div>
          <div className="flex w-full items-center mt-5 mb-2.5 ml-2.5">
            <div className="flex items-center justify-center mr-2.5">
              <HelpOutlineRoundedIcon color="info" />
            </div>
            <p className={cls(cmn.p, text-sm, cmn.pPrim, 'font-semibold mr-2.5')}>
              If you still have questions, consult FAQ or contact the support team.
            </p>
          </div>
        </div>
      ) : null}
      <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
        <AccordionSummary
          className="py-2.5 px-2.5"
          expandIcon={<ExpandMoreRoundedIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <div className="flex w-full items-center">
            <div className="flex items-center justify-center mr-2.5">
              <SortRoundedIcon />
            </div>
            <p className={cls(cmn.p, text-sm, cmn.pPrim, 'font-semibold capitalize mr-2.5')}>
              {expanded === 'panel1' ? 'Hide' : 'Show'} error details
            </p>
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <div className="mb-5">
            <code
              style={{ wordBreak: 'break-all' }}
              className={cls(
                text-xs,
                cmn.p,
                cmn.pPrim,
                'flex-grow text-center ml-2.5 mr-2.5 mb-5'
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
          className="w-full normal-case text-sm leading-6 tracking-wider font-semibold py-3.5 px-4 min-h-[44px] rounded shadow-none mt-1.5"
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
