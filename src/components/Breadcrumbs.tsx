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

import { ReactElement } from 'react'
import Button from '@mui/material/Button'
import { Link } from 'react-router-dom'
export interface BreadcrumbSection {
  icon: ReactElement
  text: string
  url?: string
}

export default function Breadcrumbs(props: { sections: BreadcrumbSection[]; className?: string }) {
  return (
    <div className={`flex items-center bg-card! p-1 rounded-full ${props.className || ''}`}>
      {props.sections.map((section: BreadcrumbSection, index) => (
        <div className="flex items-center" key={index}>
          {section.url ? (
            <Link to={section.url} className="undec w-full text-foreground">
              <Button className={index === 0 ? 'text-muted-foreground' : 'text-foreground!'}>
                {section.icon}
                <p
                  className={`text-xs capitalize! ml-1.5 ${index === 0 ? 'text-muted-foreground!' : 'text-foreground'}`}
                >
                  {section.text}
                </p>
              </Button>
            </Link>
          ) : (
            <Button
              className={index === 0 ? 'text-foreground' : 'text-muted-foreground! capitalize!'}
            >
              {section.icon}
              <p
                className={`text-xs ml-1.5 ${index === 0 ? 'text-foreground' : 'text-muted-foreground'}`}
              >
                {section.text}
              </p>
            </Button>
          )}
          {index + 1 !== props.sections.length ? (
            <p className="text-xs text-muted-foreground">|</p>
          ) : null}
        </div>
      ))}
    </div>
  )
}
