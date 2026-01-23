/**
 * @license
 * SKALE portal
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
 * @file MonthSelector.tsx
 * @copyright SKALE Labs 2023-Present
 */

import { useState } from 'react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import { CircleCheck, CircleX } from 'lucide-react'

import { formatTimePeriod } from '../core/timeHelper'

const MONTH_RECOMMENDATIONS = [1, 2, 3, 6, 12, 18, 24]

export default function MonthSelector(props: {
  max: number
  topupPeriod: number
  setTopupPeriod: any
  setErrorMsg: (errorMsg: string | undefined) => void
  className?: string
}) {
  const [monthRecommendations, setMonthRecommendations] = useState<number[]>(MONTH_RECOMMENDATIONS)
  const [openCustom, setOpenCustom] = useState<boolean>(false)
  const [customPeriod, setCustomPeriod] = useState<number | undefined>()
  const [textPeriod, setTextPeriod] = useState<string | undefined>()

  if (!monthRecommendations.includes(props.max) && props.max > 0) {
    setMonthRecommendations([...monthRecommendations, props.max])
  }

  if (props.max <= 0) {
    return <p className="text-base font-bold mt-1.5">No topup periods available</p>
  }

  return (
    <div className={`${props.className} gap-1.5 items-center flex flex-wrap`}>
      {monthRecommendations
        .filter((x) => x <= props.max)
        .map((month: any, i: number) => (
          <Button
            variant={props.topupPeriod === month ? 'contained' : 'text'}
            className={`mr-2.5 roundBtn ${props.topupPeriod !== month ? 'bg-muted-foreground/10! hover:bg-muted-foreground/20! text-foreground!' : 'bg-foreground! text-accent!'}`}
            key={i}
            onClick={() => {
              props.setTopupPeriod(month)
            }}
          >
            {month}
          </Button>
        ))}
      {openCustom ? (
        <div className="flex items-center">
          <div className="monthInputWrap bg-muted-foreground/10 flex items-center">
            <TextField
              variant="standard"
              type="number"
              value={textPeriod}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                if (
                  parseFloat(event.target.value) < 0 ||
                  !Number.isInteger(Number(event.target.value))
                ) {
                  setTextPeriod('')
                  return
                }
                setTextPeriod(event.target.value)
              }}
              slotProps={{ htmlInput: { className: 'text-foreground!' } }}
              className="monthInput"
              placeholder="0"
            />
            <Button
              variant="text"
              startIcon={<CircleCheck size={17} />}
              className="roundBtn outlined text-foreground! normal-case! bg-muted-foreground/10! hover:bg-muted-foreground/20!"
              onClick={() => {
                if (
                  textPeriod === undefined ||
                  textPeriod === '' ||
                  !Number.isInteger(Number(textPeriod)) ||
                  Number(textPeriod) <= 0
                ) {
                  props.setErrorMsg('Incorrect top-up period')
                  return
                }
                if (props.max < Number(textPeriod)) {
                  props.setErrorMsg(`Max topup amount: ${formatTimePeriod(props.max, 'month')}`)
                  return
                }
                setOpenCustom(false)
                if (!monthRecommendations.includes(Number(textPeriod))) {
                  setCustomPeriod(Number(textPeriod))
                }
                props.setTopupPeriod(Number(textPeriod))
                props.setErrorMsg(undefined)
              }}
            >
              <p className=" text-foreground! ml-1.5">Apply</p>
            </Button>
          </div>
          <Button
            startIcon={<CircleX size={17} />}
            variant="text"
            className="roundBtn ml-1! text-muted-foreground! normal-case! bg-muted-foreground/10! hover:bg-muted-foreground/20!"
            onClick={() => {
              setOpenCustom(false)
            }}
          >
            <p>Close</p>
          </Button>
        </div>
      ) : (
        <Button
          variant={props.topupPeriod === customPeriod ? 'contained' : 'text'}
          className={`mr-2.5 roundBtn! ${props.topupPeriod !== customPeriod ? 'normal-case! py-2! bg-muted-foreground/10! hover:bg-muted-foreground/20! text-foreground!' : 'bg-foreground! text-accent!'}`}
          onClick={() => {
            setOpenCustom(true)
          }}
        >
          {customPeriod ? `${customPeriod} (Edit)` : 'Custom'}
        </Button>
      )}
    </div>
  )
}
