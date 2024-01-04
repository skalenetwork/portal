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
 * @file CategoryBadge.tsx
 * @copyright SKALE Labs 2023-Present
 */

import Button from '@mui/material/Button'
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded'
import { cmn, cls } from '@skalenetwork/metaport'
import CategoryBadge, { isString } from './CategoryBadge'
import { Link } from 'react-router-dom'

export default function ChainCategories(props: {
  category: string | string[] | undefined
  alias: string
}) {
  if (!props.category) return
  return (
    <div className={cls(cmn.flex, cmn.flexw)}>
      <div className={cls(cmn.flex, 'titleBadge', cmn.flexcv, cmn.mbott10)}>
        <div className={cmn.flex}>
          <Link to={'/chains/'} className="undec fullWidth">
            <Button>
              <ArrowBackIosNewRoundedIcon className={cls(cmn.pPdrim)} />
              <p className={cls(cmn.p, cmn.p4, cmn.mleft5)}>All chains</p>
            </Button>
          </Link>
        </div>
        <p className={cls(cmn.p, cmn.p4)}>|</p>
        <div className={cmn.flex}>
          <div className={cls(cmn.flex, cmn.flexcv, cmn.mleft5, cmn.mri10)}>
            <p className={cls(cmn.p, cmn.p4, cmn.mleft5)}>{props.alias}</p>
          </div>
        </div>
      </div>
      <div className={cmn.flexg}></div>
      <div className={cls(cmn.flex, cmn.mbott10)}>
        {isString(props.category) ? (
          <CategoryBadge category={props.category} className={cmn.mleft5} />
        ) : (
          props.category.map((cat: string) => (
            <CategoryBadge category={cat} className={cmn.mleft5} />
          ))
        )}
      </div>
    </div>
  )
}
