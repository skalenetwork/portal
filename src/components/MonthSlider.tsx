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
 * @file LinkSurface.tsx
 * @copyright SKALE Labs 2023-Present
 */

import Box from '@mui/material/Box'
import Slider from '@mui/material/Slider'

const marks = [
  {
    value: 1,
    label: '1m'
  },
  {
    value: 3,
    label: '3m'
  },
  {
    value: 6,
    label: '6m'
  },
  {
    value: 9,
    label: '9m'
  },
  {
    value: 12,
    label: '12m'
  }
]

function valuetext(value: number) {
  return `${value}°C`
}

export default function DiscreteSliderMarks() {
  return (
    <Box>
      <Slider
        max={12}
        aria-label="Custom marks"
        defaultValue={3}
        getAriaValueText={valuetext}
        step={1}
        valueLabelDisplay="auto"
        marks={marks}
      />
    </Box>
  )
}
