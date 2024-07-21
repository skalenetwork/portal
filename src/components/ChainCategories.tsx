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

import { cmn, cls } from '@skalenetwork/metaport'
import CategoryBadge, { isString } from './CategoryBadge'

export default function ChainCategories(props: {
  category: string | string[] | undefined
  alias: string
  isXs: boolean
}) {
  if (!props.category) return
  return (
    <div className={cls(cmn.flex, cmn.flexw)}>
      {isString(props.category) ? (
        <CategoryBadge category={props.category} className={cmn.mleft5} isXs={props.isXs} />
      ) : (
        props.category.map((cat: string) => (
          <CategoryBadge category={cat} className={cmn.mleft5} key={cat} isXs={props.isXs} />
        ))
      )}
    </div>
  )
}
