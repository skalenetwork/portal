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

import Tooltip from '@mui/material/Tooltip'
import ButtonBase from '@mui/material/ButtonBase'
import { ArrowUpRight } from 'lucide-react'

export default function LinkSurface(props: {
  title: string
  value: string | undefined
  url: string
  className?: string
}) {
  if (!props.value) return
  return (
    <div className={props.className}>
      <a target="_blank" rel="noreferrer" href={props.url} className="'undec', text-primary">
        <Tooltip title={'Click to see contract'}>
          <ButtonBase className="bg-background! p-5! rounded-3xl!" style={{ width: '100%' }}>
            <div style={{ textAlign: 'left', overflow: 'auto' }} className="grow">
              <div className="flex">
                <p className="text-xs text-secondary-foreground mb-1.5">{props.title}</p>
              </div>
              <p className="text-base font-semibold shortP text-foreground">{props.value}</p>
            </div>
            <ArrowUpRight className="text-secondary-foreground space-y-2 ml-5 text-[17px]!" />
          </ButtonBase>
        </Tooltip>
      </a>
    </div>
  )
}
