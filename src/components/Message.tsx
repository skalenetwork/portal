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

import { type ReactElement, useState, useEffect } from 'react'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import Collapse from '@mui/material/Collapse'
import ArrowOutwardRoundedIcon from '@mui/icons-material/ArrowOutwardRounded'
import { SkPaper } from '@skalenetwork/metaport'
import { Link } from 'react-router-dom'
import { cn } from '../core/ecosystem/utils'

export default function Message(props: {
  text: string | null
  textLong?: string
  linkText?: string
  link?: string
  icon: ReactElement
  className?: string | undefined
  showOnLoad?: boolean | undefined
  type?: 'warning' | 'info' | 'error'
  closable?: boolean
  onClose?: () => void
  button?: ReactElement | null
  gray?: boolean
}) {
  const type = props.type ?? 'info'
  const [show, setShow] = useState<boolean>(true)
  const closable = props.closable ?? true
  const gray = props.gray ?? true

  useEffect(() => {
    setShow(true)
  }, [props.text, props.type])

  const handleClose = () => {
    setShow(false)
    props.onClose?.()
  }
  return (
    <Collapse in={show}>
      <SkPaper
        gray={type === 'info' && gray}
        className={cn(
          'skMessage items-center flex',
          props.className,
          type === 'warning' &&
            'bg-yellow-50! dark:bg-yellow-300/20! text-yellow-700 dark:text-yellow-200',
          type === 'error' &&
            'bg-red-100! dark:bg-red-800/80! border-red-200! dark:border-red-600! border-2! text-red-800 dark:text-red-200'
        )}
      >
        <div className="w-full flex items-center mt-1.5 mb-1.5 ml-2.5 mr-2.5">
          <div className="flex items-center mr-2.5 ">{props.icon}</div>
          {props.text ? (
            <div className="flex items-center mr-1.5">
              <p
                className={cn(
                  'text-sm font-semibold',
                  type !== 'warning' && type !== 'error' && 'text-primary'
                )}
              >
                {!props.textLong ? (
                  <span>{props.text}</span>
                ) : (
                  <>
                    <span className="sm:hidden!">{props.text}</span>
                    <span className="hidden! sm:inline!">{props.textLong}</span>
                  </>
                )}
              </p>
              {props.link && props.linkText ? (
                <div
                  className={cn(
                    'flex items-center',
                    type === 'warning' && 'text-yellow-700 dark:text-yellow-400',
                    type === 'error' && 'text-red-800! dark:text-red-200!'
                  )}
                >
                  <Link to={props.link}>
                    <p className="text-sm font-semibold">{props.linkText}</p>
                  </Link>
                  <ArrowOutwardRoundedIcon
                    className="flex items-center ml-1"
                    style={{ height: '14px', width: '14px' }}
                  />
                </div>
              ) : null}
            </div>
          ) : null}

          <div className="grow"></div>
          {props.button}
          {closable ? (
            type === 'error' ? (
              <Button
                size="small"
                onClick={handleClose}
                className="btn btnSm text-foreground! bg-transparent! hover:bg-red-800/10! normal-case! ml-2.5"
              >
                Close
              </Button>
            ) : (
              <IconButton onClick={handleClose} className="paperGrey ml-2.5">
                <CloseRoundedIcon
                  className={cn(
                    'flex items-center',
                    type === 'warning' && 'text-yellow-700 dark:text-yellow-400'
                  )}
                  style={{ height: '16px', width: '16px' }}
                />
              </IconButton>
            )
          ) : null}
        </div>
      </SkPaper>
    </Collapse>
  )
}
