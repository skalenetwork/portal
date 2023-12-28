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

import { ReactElement } from 'react'
import { useTheme } from '@mui/material/styles'
import LinearProgress from '@mui/material/LinearProgress'
import { cmn, cls, styles } from '@skalenetwork/metaport'

import { DueDateStatus } from '../core/paymaster'

export default function Tile(props: {
  text?: string
  value?: string
  textRi?: string
  icon?: ReactElement
  className?: string
  grow?: boolean
  color?: DueDateStatus
  progressColor?: DueDateStatus
  progress?: number
  children?: ReactElement | ReactElement[]
}) {
  const theme = useTheme()
  const color = props.color ? theme.palette[props.color].main : 'rgba(0, 0, 0, 0.6)'
  return (
    <div
      className={cls(props.className, styles.fullHefight, 'titleSection', [cmn.flexg, props.grow])}
      style={{ background: color }}
    >
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
          {props.icon ? (
            <div className={cls(cmn.mri5, cmn.flex, styles.chainIconxs)}>{props.icon}</div>
          ) : null}
          <p className={cls(cmn.p, cmn.p4, cmn.flex, cmn.flexg)}>{props.text}</p>
          <p className={cls(cmn.p, cmn.p4, cmn.flex, cmn.mleft5)}>{props.textRi}</p>
        </div>
      ) : null}
      <div className={cls(cmn.flex, cmn.flexcv)}>
        {props.value ? (
          <p
            className={cls(
              cmn.p,
              cmn.p1,
              cmn.p700,
              [cmn.pPrim, !props.color],
              ['blackP', props.color]
            )}
          >
            {props.value}
          </p>
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
      {props.children}
    </div>
  )
}
