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
 * @file CategoriesShips.tsx
 * @copyright SKALE Labs 2024-Present
 */

import React, { useMemo } from 'react'
import { type types } from '@/core'
import { Box } from '@mui/material'
import { categories } from '../../core/ecosystem/categories'
import Ship from '../Ship'
import { CategoryIcons } from './CategoryIcons'

interface AppCategoriesChipsProps {
  app: types.AppMetadata
  className?: string
}

const AppCategoriesChips: React.FC<AppCategoriesChipsProps> = ({ app, className }) => {
  const chips = useMemo(() => {
    if (!app.categories) return []

    const getCategoryName = (tag: string) => categories[tag]?.name ?? tag
    const getSubcategoryName = (categoryTag: string, subcategoryTag: string): string => {
      const category = categories[categoryTag]
      if (!category) return subcategoryTag
      if (Array.isArray(category.subcategories)) {
        return category.subcategories.includes(subcategoryTag) ? subcategoryTag : subcategoryTag
      }
      return category.subcategories[subcategoryTag]?.name ?? subcategoryTag
    }

    return Object.entries(app.categories).flatMap(([categoryTag, subcategories]) => [
      <Ship
        key={categoryTag}
        label={getCategoryName(categoryTag)}
        icon={<CategoryIcons category={categoryTag} />}
      />,
      ...(Array.isArray(subcategories)
        ? subcategories.map((subTag) => (
            <Ship
              key={`${categoryTag}-${subTag}`}
              label={getSubcategoryName(categoryTag, subTag)}
              icon={<CategoryIcons category={subTag} />}
            />
          ))
        : [])
    ])
  }, [app.categories])

  if (chips.length === 0) return null

  return <Box className={`chipContainer ${className}`}>{chips}</Box>
}

export default AppCategoriesChips
