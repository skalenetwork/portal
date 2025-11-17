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
 * @file Message.tsx
 * @copyright SKALE Labs 2023-Present
 */

import { type ReactElement, useState } from 'react'
import IconButton from '@mui/material/IconButton'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import Collapse from '@mui/material/Collapse'
import ArrowOutwardRoundedIcon from '@mui/icons-material/ArrowOutwardRounded'
import { SkPaper } from '@skalenetwork/metaport'
import { Link } from 'react-router-dom'

export default function Message(props: {
  text: string | null
  linkText?: string
  link?: string
  icon: ReactElement
  className?: string | undefined
  showOnLoad?: boolean | undefined
  type?: 'warning' | 'info' | 'error'
  closable?: boolean
  button?: ReactElement | null
  gray?: boolean
}) {
  const type = props.type ?? 'info'
  const [show, setShow] = useState<boolean>(true)
  const closable = props.closable ?? true
  const gray = props.gray ?? true
  return (
    <Collapse in={show}>
      <SkPaper
        gray={gray}
        className={`${props.className || ''} skMessage items-center flex ${type === 'warning' ? 'warningMsg' : ''} ${type === 'error' ? 'errorMsg' : ''}`}
      >
        <div className="w-full items-center mt-1.5 mb-1.5 ml-2.5 mr-2.5">
          <div className="flex items-center mr-4">{props.icon}</div>
          {props.text ? (
            <p className={`text-sm font-semibold mr-1.5 ${type !== 'warning' ? 'text-primary' : ''}`}>
              {props.text}
            </p>
          ) : null}
          {props.link ? (
            <div className="flex items-center flex-grow">
              <Link to={props.link}>
                <p className="text-sm font-semibold mr-1.5">{props.linkText}</p>
              </Link>
              <ArrowOutwardRoundedIcon
                className="flex items-center"
                style={{ height: '14px', width: '14px' }}
              />
            </div>
          ) : null}

          <div className="flex-grow"></div>
          {props.button}
          {closable ? (
            <IconButton
              onClick={() => {
                setShow(false)
              }}
              className="paperGrey ml-2.5"
            >
              <CloseRoundedIcon
                className={type !== 'warning' ? 'text-secondary-foreground/60' : ''}
                style={{ height: '16px', width: '16px' }}
              />
            </IconButton>
          ) : null}
        </div>
      </SkPaper>
    </Collapse>
  )
}
