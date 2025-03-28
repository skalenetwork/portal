/**
 * @license
 * SKALE Metaport
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
 * @file SkPaper.ts
 * @copyright SKALE Labs 2023-Present
 */

import { ReactElement } from 'react'
import { cls, cmn, styles } from '../core/css'

import { useUIStore } from '../store/Store'

export default function SkPaper(props: {
  className?: string
  children?: ReactElement | ReactElement[] | undefined | null
  background?: string
  gray?: boolean
  rounded?: boolean
  fullHeight?: boolean
  margTop?: boolean
}) {
  const metaportTheme = useUIStore((state) => state.theme)
  const localStyle = {
    background: props.background ?? metaportTheme.background
  }
  return (
    <div
      style={localStyle}
      className={cls(
        props.className,
        styles.paper,
        [styles.paperGrey, props.gray],
        [styles.fullHeight, props.fullHeight],
        [cmn.mtop20, props.margTop]
      )}
    >
      {props.children}
    </div>
  )
}
