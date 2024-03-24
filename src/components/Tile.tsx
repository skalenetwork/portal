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

import { type ReactElement } from 'react'
import { useTheme } from '@mui/material/styles'
import LinearProgress from '@mui/material/LinearProgress'
import { cmn, cls, styles } from '@skalenetwork/metaport'

import { type DueDateStatus } from '../core/paymaster'
import { Skeleton } from '@mui/material'

export default function Tile(props: {
  text?: string
  value?: string | null
  textRi?: string
  icon?: ReactElement
  className?: string
  grow?: boolean
  color?: DueDateStatus
  progressColor?: DueDateStatus
  progress?: number
  children?: ReactElement | ReactElement[]
  childrenRi?: ReactElement | ReactElement[]
  size?: 'lg' | 'md'
  textColor?: string
  disabled?: boolean | null
  ri?: boolean
}) {
  const theme = useTheme()
  const color = props.color ? theme.palette[props.color].main : 'rgba(0, 0, 0, 0.6)'
  const size = props.size ?? 'lg'
  return (
    <div
      className={cls(props.className, styles.fullHefight, 'titleSection', `titleSection_${size}`, [
        cmn.flexg,
        props.grow
      ])}
      style={{ background: color }}
    >
      <div className={cls(cmn.flex, cmn.flexcv)}>
        <div className={cls(cmn.flexg)}>
          {props.text ? (
            <div
              className={cls(
                cmn.flex,
                cmn.flexcv,
                cmn.mbott5,
                [cmn.pSec, !props.color],
                ['blackP', props.color]
              )}
            >
              {props.ri ? <div className={cls(cmn.flexg)}></div> : null}
              {props.icon ? (
                <div
                  className={cls(cmn.mri5, cmn.flex, styles.chainIconxs)}
                  style={{ color: props.textColor }}
                >
                  {props.icon}
                </div>
              ) : null}
              <p
                className={cls(
                  cmn.p,
                  cmn.p4,
                  cmn.flex,
                  [cmn.flexg, !props.ri],
                  [cmn.p600, props.textColor]
                )}
                style={{ color: props.textColor }}
              >
                {props.text}
              </p>
              {props.textRi ? (
                <p
                  className={cls(cmn.p, cmn.p4, cmn.flex, cmn.mleft5)}
                  style={{ color: props.textColor }}
                >
                  {props.textRi}
                </p>
              ) : null}
            </div>
          ) : null}
          <div className={cls(cmn.flex, cmn.flexcv)}>
            {props.ri ? <div className={cls(cmn.flexg)}></div> : null}
            {props.value ? (
              <p
                className={cls(
                  cmn.p,
                  [cmn.p1, size == 'lg'],
                  [cmn.p2, size == 'md'],
                  cmn.p700,
                  [cmn.pPrim, !props.color && !props.disabled],
                  [cmn.pSec, props.disabled],
                  ['blackP', props.color]
                )}
              >
                {props.value}
              </p>
            ) : null}
            {!props.value && !props.children ? (
              <Skeleton variant="rectangular" width={150} height={33} />
            ) : null}
            {props.progress ? (
              <LinearProgress
                variant="determinate"
                value={props.progress}
                color={props.progressColor}
                style={{ height: '20px' }}
                className={cls(cmn.flexg, cmn.mleft10)}
              />
            ) : null}
          </div>
        </div>
        {props.childrenRi}
      </div>
      {props.children}
    </div>
  )
}
