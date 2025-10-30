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
import { cmn, cls, SkPaper, styles } from '@skalenetwork/metaport'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'

export default function PageCard(props: {
  name: string
  icon: any
  description: string
  url?: string
}) {
  const isExternal = props.url === 'https://www.sushi.com/skale-europa/swap'
  return (
    <Link
      to={props.url ?? props.name}
      {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      <SkPaper gray className="'br__tile'">
        <div className="cmn.flex, cmn.flexcv, cmn.m10">
          <div className="cmn.flexg">
            <div className="cmn.flex, cmn.flexg, cmn.flexcv">
              <div className="styles.chainIcons, mr-2.5, cmn.pPrim">{props.icon}</div>
              <h3 className="cmn.cap, cmn.nom, cmn.pPrim,  cmn.p600">{props.name}</h3>
            </div>
            <p className=" text-sm, cmn.pSec, cmn.mtop5">{props.description}</p>
          </div>
          <div className="cmn.mleft10, cmn.mri5, cmn.flex, cmn.flexcv">
            <ArrowForwardRoundedIcon className="cmn.pSec, styles.chainIconxs" />
          </div>
        </div>
      </SkPaper>
    </Link>
  )
}
