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

import Button from '@mui/material/Button'
import { cmn, cls } from '@skalenetwork/metaport'

const MONTH_RECOMENDATIONS = [1, 2, 3, 6, 12, 18, 24]

export default function MonthSelector(props: {
  max: number
  topupPeriod: number
  setTopupPeriod: any
  className?: string
}) {
  return (
    <div className={props.className}>
      {MONTH_RECOMENDATIONS.filter((x) => x <= props.max).map((month: any, i: number) => (
        <Button
          variant={props.topupPeriod === month ? 'contained' : 'text'}
          className={cls(cmn.mri10, 'roundBtn', ['outlined', props.topupPeriod !== month])}
          key={i}
          onClick={() => {
            props.setTopupPeriod(month)
          }}
        >
          <p className={cls(cmn.p, cmn.p2)}>{month}</p>
        </Button>
      ))}
      <Button
        variant={'text'}
        className={cls(cmn.mri10, 'roundBtn', 'outlined')}
        onClick={() => {
          props.setTopupPeriod(2)
        }}
      >
        <p className={cls(cmn.p, cmn.p2)}>Custom</p>
      </Button>
    </div>
  )
}
