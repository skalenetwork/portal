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
 * @file CategoryCard.tsx
 * @copyright SKALE Labs 2024-Present
 */

import React from 'react'
import { Link } from 'react-router-dom'
import { SkPaper } from '@skalenetwork/metaport'

interface CategoryCardProps {
  categoryName: string
  fullName: string
  projectCount: number
}

const CategoryCard: React.FC<CategoryCardProps> = ({ categoryName, fullName, projectCount }) => {
  return (
    <Link to={`/ecosystem?categories=${categoryName}`}>
      <SkPaper gray className="'br__tile'">
        <div className="flex items-center m-2.5">
          <div className="grow">
            <div className="flex grow items-center">
              <h4 className="capitalize m-0 text-foreground font-semibold truncate">{fullName}</h4>
            </div>
            <p className="text-sm text-secondary-foreground mt-1.5">
              {projectCount} project{projectCount !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </SkPaper>
    </Link>
  )
}

export default CategoryCard
