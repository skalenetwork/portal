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
 * @file SkStack.tsx
 * @copyright SKALE Labs 2023-Present
 */

import { type ReactElement } from 'react'
import Stack from '@mui/material/Stack'

export default function SkStack(props: {
  className?: string
  children?: ReactElement | ReactElement[]
}) {
  return (
    <Stack
      style={{ alignItems: 'stretch' }}
      spacing={1}
      direction={{ xs: 'column', md: 'row' }}
      useFlexGap
      flexWrap="wrap"
      className={props.className}
    >
      {props.children}
    </Stack>
  )
}
