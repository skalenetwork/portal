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

import { useState, useEffect, type ReactElement } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { type types } from '@/core'

import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { Skeleton, Tooltip } from '@mui/material'
import LinearProgress from '@mui/material/LinearProgress'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'

export default function Tile(props: {
  text?: string
  value?: string | null | false
  textRi?: string
  icon?: ReactElement
  className?: string
  grow?: boolean
  color?: types.pm.DueDateStatus
  chipColor?: types.pm.ChipColor
  progressColor?: types.pm.DueDateStatus
  progress?: number
  children?: ReactElement | ReactElement[] | false
  childrenRi?: ReactElement | ReactElement[] | null | ''
  size?: 'lg' | 'md' | 'xl'
  textColor?: string
  disabled?: boolean | null
  ri?: boolean
  copy?: string | undefined
  transparent?: boolean
  tooltip?: string
}) {
  const theme = useTheme()
  let color = props.color ? theme.palette[props.color].main : 'rgba(0, 0, 0, 0.6)'
  color = props.transparent ? 'transparent' : color
  const size = props.size ?? 'lg'

  const chipClass = props.chipColor ? `chip_${props.chipColor}` : ''

  const [copied, setCopied] = useState(false)
  const isXs = useMediaQuery(theme.breakpoints.down('sm'))

  const handleClick = () => {
    setCopied(true)
  }

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => {
        setCopied(false)
      }, 1000)
      return () => {
        clearTimeout(timer)
      }
    }
  }, [copied])

  const value = (
    <p
      className={`
        ${size === 'xl' ? 'text-2xl' : ''}
        ${size === 'lg' ? 'text-xl' : ''}
        ${size === 'md' ? 'text-base' : ''}
        font-bold
        ${!props.color && !props.disabled ? 'text-foreground' : ''}
        ${props.disabled ? 'text-secondary-foreground' : ''}
        ${props.color ? 'text-black' : ''}
        ${props.copy ? 'cursor-pointer' : ''}
      `.replace(/\s+/g, ' ').trim()}
    >
      {props.value}
    </p>
  )

  return (
    <div
      className={`${props.className || ''} ${chipClass} h-full bg-background rounded-md p-4 titleSection_${size} ${props.grow ? 'grow' : ''}`}
    >
      <div className={`flex ${!isXs ? 'items-center' : ''}`}>
        <div className="grow">
          {props.text ? (
            <div
              className={`
                flex items-center mb-1.5
                ${!props.color && !props.textColor ? 'text-secondary-foreground' : ''}
                ${props.color ? 'text-black' : ''}
              `.replace(/\s+/g, ' ').trim()}
            >
              {props.ri ? <div className="grow"></div> : null}
              {props.icon ? (
                <div
                  className="mr-1.5 flex text-[17px]!"
                  style={{ color: props.textColor }}
                >
                  {copied ? <CheckCircleRoundedIcon color="success" /> : props.icon}
                </div>
              ) : null}
              <p
                className={`
                  flex font-medium
                  ${props.size === 'md' ? 'text-xs' : 'text-xs'}
                  ${!props.ri ? 'grow' : ''}
                  ${props.textColor ? 'font-semibold' : ''}`}
                style={{ color: props.textColor }}
              >
                {props.text}
              </p>
              {props.textRi ? (
                <p
                  className={`
                    ${props.size === 'md' ? 'text-xs' : 'text-sm'}
                    flex ml-1.5 font-medium
                  `}
                  style={{ color: props.textColor }}
                >
                  {props.textRi}
                </p>
              ) : null}
            </div>
          ) : null}
          <div className="flex items-center">
            {props.ri ? <div className="grow"></div> : null}
            {props.value && props.copy ? (
              <Tooltip arrow title={copied ? 'Copied' : 'Click to copy'}>
                <div>
                  <CopyToClipboard text={props.copy ?? ''} onCopy={handleClick}>
                    {value}
                  </CopyToClipboard>
                </div>
              </Tooltip>
            ) : null}
            {props.value && !props.copy ? (
              <Tooltip arrow title={props.tooltip}>
                {value}
              </Tooltip>
            ) : null}
            {props.children && <div className="grow">{props.children}</div>}
            {!props.value && !props.children ? (
              <Skeleton variant="rectangular" width={150} height={33} />
            ) : null}
            {props.progress ? (
              <LinearProgress
                variant="determinate"
                value={props.progress}
                color={props.progressColor}
                style={{ height: '20px' }}
                className="grow ml-2.5"
              />
            ) : null}
          </div>
        </div>
        {props.childrenRi}
      </div>
    </div>
  )
}
