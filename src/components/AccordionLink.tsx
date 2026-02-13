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
 * @file AccordionLink.tsx
 * @copyright SKALE Labs 2023-Present
 */

import { type ReactElement } from 'react'

import ButtonBase from '@mui/material/ButtonBase'

import { Link } from 'react-router-dom'
import { CirclePlus } from 'lucide-react'

export default function AccordionLink(props: {
  title: string
  url: string
  icon?: ReactElement
  className?: string
}) {
  return (
    <div className={props.className}>
      <Link to={props.url} className="text-primary">
        <ButtonBase className="w-full flex pl-2.5 rounded">
          <div className="m-2.5 flex grow items-center">
            {props.icon ? (
              <div className="mr-2.5 items-center flex text-[17px]! text-secondary-foreground">
                {props.icon}
              </div>
            ) : null}
            <p className="text-base font-bold grow">{props.title}</p>
            <CirclePlus className="mr-1.5 text-[17px]! text-secondary-foreground" />
          </div>
        </ButtonBase>
      </Link>
    </div>
  )
}
