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
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import { cmn, cls } from '@skalenetwork/metaport'

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
    return <p className=" cmn.p1, cmn.p700, cmn.mtop5">No topup periods available</p>
  }

  return (
    <div className="props.className, cmn.flexcv, cmn.flex">
      {monthRecommendations
        .filter((x) => x <= props.max)
        .map((month: any, i: number) => (
          <Button
            variant={props.topupPeriod === month ? 'contained' : 'text'}
            className="mr-2.5, 'roundBtn', ['outlined', props.topupPeriod !== month]"
            key={i}
            onClick={() => {
              props.setTopupPeriod(month)
            }}
          >
            <p className=" text-base">{month}</p>
          </Button>
        ))}
      {openCustom ? (
        <div className="'flexi', cmn.flexcv">
          <div className="'monthInputWrap', cmn.flex, cmn.flexcv">
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
              className="mr-2.5, 'monthInput'"
              placeholder="0"
            />
            <Button
              variant="text"
              startIcon={<CheckCircleRoundedIcon />}
              className="'roundBtn', 'outlined'"
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
              <p className=" text-base">Apply</p>
            </Button>
          </div>
          <Button
            startIcon={<CancelOutlinedIcon />}
            variant="text"
            className="'roundBtn', cmn.mleft5"
            onClick={() => {
              setOpenCustom(false)
            }}
          >
            <p className=" text-base">Close</p>
          </Button>
        </div>
      ) : (
        <Button
          variant={props.topupPeriod === customPeriod ? 'contained' : 'text'}
          className="mr-2.5, 'roundBtn', ['outlined', props.topupPeriod !== customPeriod]"
          onClick={() => {
            setOpenCustom(true)
          }}
        >
          <p className=" text-base">{customPeriod ? `${customPeriod} (Edit)` : 'Custom'}</p>
        </Button>
      )}
    </div>
  )
}
