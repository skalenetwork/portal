/**
 * @license
 * SKALE bridge-ui
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

import { SkPaper, cls, cmn } from '@skalenetwork/metaport'

export default function Message(props: {
  text: string
  icon: ReactElement
  className?: string | undefined
  showOnLoad?: boolean | undefined
}) {
  const [show, setShow] = useState<boolean>(true)
  return (
    <Collapse in={show}>
      <SkPaper gray className={props.className}>
        <div
          className={cls(cmn.flex, cmn.fullWidth, cmn.flexcv, cmn.mtop10, cmn.mbott10, cmn.mleft10)}
        >
          <div className={cls(cmn.flex, cmn.flexc, cmn.mri10)}>{props.icon}</div>
          <p className={cls(cmn.p, cmn.p3, cmn.p600, cmn.pPrim, cmn.mri10, cmn.flexg)}>
            {props.text}
          </p>
          <div className={cls(cmn.mri20)}>
            <IconButton
              onClick={() => {
                setShow(false)
              }}
              className={cls(cmn.paperGrey, cmn.pPrim, cmn.mleft10)}
            >
              <CloseRoundedIcon
                className={cls(cmn.pSec)}
                style={{ height: '16px', width: '16px' }}
              />
            </IconButton>
          </div>
        </div>
      </SkPaper>
    </Collapse>
  )
}
