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
 * @file CategoryCardsGrid.tsx
 * @copyright SKALE Labs 2024-Present
 */

import React, { useMemo } from 'react'

import { type types } from '@/core'

import { categories } from '../../core/ecosystem/categories'
import CategoryCard from './CategoryCard'

interface CategoryCardsGridProps {
  chainsMeta: types.ChainsMetadataMap
  maxCategories?: number
}

interface CategoryData {
  name: string
  fullName: string
  projectCount: number
}

const CategoryCardsGrid: React.FC<CategoryCardsGridProps> = ({ chainsMeta, maxCategories = 8 }) => {
  const topCategories = useMemo(() => {
    const getCategoryProjectCount = (categoryName: string): number => {
      let count = 0
      Object.values(chainsMeta).forEach((chain) => {
        if (chain.apps) {
          Object.values(chain.apps).forEach((app) => {
            if (app.categories && app.categories[categoryName] !== undefined) {
              count++
            }
          })
        }
      })
      return count
    }

    const categoryData: CategoryData[] = Object.entries(categories).map(([name, data]) => ({
      name,
      fullName: data.name,
      projectCount: getCategoryProjectCount(name)
    }))

    return categoryData.sort((a, b) => b.projectCount - a.projectCount).slice(0, maxCategories)
  }, [chainsMeta, maxCategories])

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
      {topCategories.map(({ name, fullName, projectCount }) => (
        <div className="col-span-1" key={name}>
          <CategoryCard categoryName={name} fullName={fullName} projectCount={projectCount} />
        </div>
      ))}
    </div>
  )
}

export default CategoryCardsGrid
