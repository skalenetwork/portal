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
 * @file ErrorTile.tsx
 * @copyright SKALE Labs 2024-Present
 */

import { cls, cmn, Tile } from '@skalenetwork/metaport'

import Button from '@mui/material/Button'
import Collapse from '@mui/material/Collapse'
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded'

export default function ErrorTile(props: {
  errorMsg: string | undefined
  setErrorMsg?: (errorMsg: string | undefined) => void
  className?: string | undefined
}) {
  return (
    <Collapse in={props.errorMsg !== undefined}>
      <Tile
        className={props.className}
        value={props.errorMsg}
        text="Error occurred"
        icon={<ErrorRoundedIcon />}
        color="error"
        grow
        childrenRi={
          props.setErrorMsg && (
            <Button
              size="small"
              onClick={() => {
                if (props.setErrorMsg === undefined) return
                props.setErrorMsg(undefined)
              }}
              className={cls('blackP', cmn.p, text-xs, cmn.mtop10)}
              style={{ background: 'rgba(0, 0, 0, 0.3)' }}
            >
              Close
            </Button>
          )
        }
      />
    </Collapse>
  )
}
