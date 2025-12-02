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
import Avatar from 'boring-avatars'
import { HOME_CARD_COLORS } from '../core/constants'

export default function PageCard(props: {
  name: string
  icon: any
  description: string
  bgKey: string
  url?: string
}) {
  const isExternal = props.url?.startsWith('http') ?? false
  return (
    <Link
      to={props.url ?? props.name}
      {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      <SkPaper
        gray
        className="ease-in-out transition-transform duration-150 active:scale-[0.97] hover:scale-[1.01]"
      >
        <div className="flex items-center m-1">
          <div className="grow">
            <div className="flex grow items-center">
              <div className="relative w-[65px] h-[65px] shrink-0 dark:opacity-90 dark:saturate-90 mr-3">
                <Avatar
                  size={65}
                  name={props.bgKey}
                  variant="marble"
                  colors={HOME_CARD_COLORS}
                  square={true}
                  className="border border-background! opacity-40 dark:opacity-90 rounded-2xl group-hover:scale-105 transition-all duration-300"
                />
                <div className="absolute inset-0 grid place-items-center">
                  <img
                    src={props.icon}
                    className="group-hover:scale-105 transition-all duration-300 h-10 w-10 iconHomeCard"
                  />
                </div>
              </div>
              <div>
                <h3 className="capitalize m-0 text-foreground font-semibold">{props.name}</h3>
                <p className="text-xs text-secondary-foreground mt-0.5">{props.description}</p>
              </div>
            </div>
          </div>
          <div className="ml-2.5 mr-1.5 flex items-center">
            <ArrowForwardRoundedIcon className="text-secondary-foreground h-4! w-4!" />
          </div>
        </div>
      </SkPaper>
    </Link>
  )
}
