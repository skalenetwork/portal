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
 * @file AccordionSection.tsx
 * @copyright SKALE Labs 2023-Present
 */

import { type ReactElement, useState } from 'react'

import Collapse from '@mui/material/Collapse'
import ButtonBase from '@mui/material/ButtonBase'
import { CircleMinus, CirclePlus } from 'lucide-react'

export default function AccordionSection(props: {
  title: string
  handleChange?: (panel: string | false) => void
  expanded?: string | false
  panel?: string
  subtitle?: string
  children?: ReactElement | ReactElement[] | null
  icon?: ReactElement
  className?: string
  expandedByDefault?: boolean
  marg?: boolean
}) {
  const [expandedInternal, setExpandedInternal] = useState<string | false>(
    props.expandedByDefault ? 'panel1' : false
  )

  function handleChangeInternal(panel: string | false) {
    setExpandedInternal(expanded && panel === expanded ? false : panel)
  }

  const handleChange = props.handleChange ?? handleChangeInternal
  const expanded = props.expanded ?? expandedInternal
  const panel = props.panel ?? 'panel1'

  return (
    <div className={props.className}>
      <ButtonBase
        onClick={() => {
          handleChange(panel)
        }}
        className="w-full flex pl-2.5 rounded-2xl!"
      >
        <div className="m-2 flex grow items-center">
          {props.icon ? (
            <div className="mr-2.5 items-center flex text-[17px]! font-semibold text-foreground/80 ">
              {props.icon}
            </div>
          ) : null}
          <p className="text-sm font-semibold grow text-foreground/80! text-left">{props.title}</p>
          <p className="text-xs font-semibold text-secondary-foreground mr-5">{props.subtitle}</p>
          {expanded === panel ? (
            <CircleMinus size={17} className="mr-1.5 text-secondary-foreground" />
          ) : (
            <CirclePlus size={17} className="mr-1.5 text-secondary-foreground" />
          )}
        </div>
      </ButtonBase>
      <Collapse in={expanded === panel}>
        <div className="mt-1">{props.children}</div>
      </Collapse>
    </div>
  )
}
