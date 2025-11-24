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
 * @file PageCard.tsx
 * @copyright SKALE Labs 2022-Present
 */

import { Link } from 'react-router-dom'
import { SkPaper } from '@skalenetwork/metaport'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'

export default function PageCard(props: {
  name: string
  icon: any
  description: string
  url?: string
}) {
  const isExternal = props.url?.startsWith('http') ?? false
  return (
    <Link
      to={props.url ?? props.name}
      {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      <SkPaper gray className="'br__tile'">
        <div className="flex items-center m-2.5">
          <div className="flex-grow">
            <div className="flex flex-grow items-center">
              <div className="styles.chainIcons mr-2.5 text-foreground">{props.icon}</div>
              <h3 className="capitalize m-0 text-foreground font-semibold">{props.name}</h3>
            </div>
            <p className="text-sm text-secondary-foreground mt-1.5">{props.description}</p>
          </div>
          <div className="ml-2.5 mr-1.5 flex items-center">
            <ArrowForwardRoundedIcon className="text-secondary-foreground h-4! w-4!" />
          </div>
        </div>
      </SkPaper>
    </Link>
  )
}
