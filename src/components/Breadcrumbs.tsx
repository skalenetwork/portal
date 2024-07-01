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
 * @file Breadcrumbs.tsx
 * @copyright SKALE Labs 2024-Present
 */

import Button from '@mui/material/Button'
import { Link } from 'react-router-dom'
import { cmn, cls } from '@skalenetwork/metaport'
import { BreadcrumbSection } from '../core/types'

export default function Breadcrumbs(props: { sections: BreadcrumbSection[]; className?: string }) {
  return (
    <div className={cls(cmn.flex, cmn.flexcv, 'titleBadge', props.className)}>
      {props.sections.map((section: BreadcrumbSection, index) => (
        <div className={cls(cmn.flex, cmn.flexcv)} key={index}>
          {section.url ? (
            <Link to={section.url} className="undec fullWidth">
              <Button>
                {section.icon}
                <p className={cls(cmn.p, cmn.p4, cmn.mleft5)}>{section.text}</p>
              </Button>
            </Link>
          ) : (
            <Button className={cls(cmn.pPrim)}>
              {section.icon}
              <p className={cls(cmn.p, cmn.p4, cmn.mleft5)}>{section.text}</p>
            </Button>
          )}
          {index + 1 !== props.sections.length ? <p className={cls(cmn.p, cmn.p4)}>|</p> : null}
        </div>
      ))}
    </div>
  )
}
