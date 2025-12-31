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

import { Ban, ChevronDown, CircleParkingOff, CircleQuestionMark, CopySlash, Frown, Hourglass, Link2Off, RotateCcw, Siren, TimerReset } from 'lucide-react'

import { DEFAULT_ERROR_MSG } from '../core/constants'

const ERROR_ICONS = {
  'link-off': <Link2Off />,
  'public-off': <CircleParkingOff />,
  sentiment: <Frown />,
  warning: <Siren />,
  error: <Ban />,
  time: <Hourglass />
}

export default function Error(props: { errorMessage: dc.ErrorMessage }) {
  const [expanded, setExpanded] = useState<string | false>(false)

  const handleChange = (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false)
  }

  if (!props.errorMessage) return
  return (
    <div>
      <div className="mt-5 text-2xl flex justify-center text-orange-600">
        {ERROR_ICONS[props.errorMessage.icon]}
      </div>
      <p
        style={{ wordBreak: 'break-word' }}
        className="text-base text-orange-600 font-semibold grow text-center mt-2.5"
      >
        {props.errorMessage.headline ?? DEFAULT_ERROR_MSG}
      </p>
      <p className="text-xs text-secondary-foreground font-medium grow text-center mb-2.5">
        Logs are available in your browser's developer console
      </p>
      {props.errorMessage.showTips ? (
        <div>
          <div className="flex w-full items-center text-foreground mt-5 mb-2.5 ml-2.5">
            <div className="flex items-center text-foreground justify-center mr-2.5">
              <Hourglass size={17} />
            </div>
            <p className="text-sm text-foreground font-semibold mr-2.5">
              Transfers might occasionally delay, but all tokens will be sent.
            </p>
          </div>
          <div className="flex w-full items-center text-foreground mt-5 mb-2.5 ml-2.5">
            <div className="flex items-center text-foreground justify-center mr-2.5">
              <RotateCcw size={17}  />
            </div>
            <p className="text-sm text-foreground font-semibold mr-2.5">
              If a transfer is interrupted, you can continue from where you stopped.
            </p>
          </div>
          <div className="flex w-full items-center text-foreground mt-5 mb-2.5 ml-2.5">
            <div className="flex items-center text-foreground justify-center mr-2.5">
              <TimerReset size={17} />
            </div>
            <p className="text-sm text-foreground font-semibold mr-2.5">
              Transfers from SKALE to Ethereum Mainnet have frequency limits.
            </p>
          </div>
          <div className="flex w-full items-center text-foreground mt-5 mb-2.5 ml-2.5">
            <div className="flex items-center text-foreground justify-center mr-2.5">
              <CircleQuestionMark size={17} />
            </div>
            <p className="text-sm text-foreground! font-semibold mr-2.5">
              If you still have questions, consult FAQ or contact the support team.
            </p>
          </div>
        </div>
      ) : null}
      <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
        <AccordionSummary
          className="py-2.5 px-2.5"
          expandIcon={<ChevronDown />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <div className="flex w-full items-center">
            <div className="flex items-center justify-center mr-2.5">
              <CopySlash size={17} className='text-secondary-foreground' />
            </div>
            <p className="text-sm text-secondary-foreground font-semibold capitalize mr-2.5">
              {expanded === 'panel1' ? 'Hide' : 'Show'} error details
            </p>
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <div className="mb-5">
            <code
              style={{ wordBreak: 'break-all' }}
              className="text-xs text-muted-foreground grow text-center ml-2.5 mr-2.5 mb-5"
            >
              {props.errorMessage.text}
            </code>
          </div>
        </AccordionDetails>
      </Accordion>
      {props.errorMessage.fallback ? (
        <Button
          onClick={() => {
            props.errorMessage.fallback()
          }}
          variant="contained"
          className={`w-full mt-3! md:mt-4! mb-12! md:mb-0! capitalize! text-[13px]! md:text-sm! font-semibold! py-3.5! md:py-4! bg-accent-foreground! text-accent! ease-in-out transition-transform duration-150 active:scale-[0.97]`}
          size="large"
        >
          {props.errorMessage.btnText}
        </Button>
      ) : null}
    </div>
  )
}
