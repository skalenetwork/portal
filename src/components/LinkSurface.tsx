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
import ArrowOutwardRoundedIcon from '@mui/icons-material/ArrowOutwardRounded'

import { cmn, cls, styles } from '@skalenetwork/metaport'

export default function LinkSurface(props: {
  title: string
  value: string | null | undefined
  url: string
  className?: string
}) {
  if (!props.value) return
  return (
    <div className={props.className}>
      <a target="_blank" rel="noreferrer" href={props.url} className={cls('undec', cmn.pPrim)}>
        <Tooltip title={'Clicl to see contract'}>
          <ButtonBase className="titleSection" style={{ width: '100%' }}>
            <div style={{ textAlign: 'left', overflow: 'auto' }} className={cmn.flexg}>
              <div className={cls(cmn.flex)}>
                <p className={cls(cmn.p, cmn.pPrim, cmn.p4, cmn.pSec, cmn.mbott5)}>{props.title}</p>
              </div>
              <p className={cls(cmn.p, cmn.p2, cmn.p600, 'shortP')}>{props.value}</p>
            </div>
            <ArrowOutwardRoundedIcon className={cls(cmn.pSec, cmn.mleft20, styles.chainIconxs)} />
          </ButtonBase>
        </Tooltip>
      </a>
    </div>
  )
}
