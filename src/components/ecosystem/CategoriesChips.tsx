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
 * @file CategoriesChips.tsx
 * @copyright SKALE Labs 2024-Present
 */

import React, { useMemo } from 'react'
import { Box } from '@mui/material'
import { type types } from '@/core'
import { categories as categoriesData } from '../../core/ecosystem/categories'
import Chip from '../Chip'
import { CategoryIcons } from './CategoryIcons'
import { cls } from '@skalenetwork/metaport'

interface CategoriesChipsProps {
  categories: string[] | types.CategoriesMap
  all?: boolean
  className?: string
}

const CategoriesChips: React.FC<CategoriesChipsProps> = ({ categories, all, className }) => {
  const chips = useMemo(() => {
    if (!categories) return []

    const getCategoryName = (tag: string) => categoriesData[tag]?.name ?? tag
    const getSubcategoryName = (categoryTag: string, subcategoryTag: string): string => {
      const category = categoriesData[categoryTag]
      if (!category) return subcategoryTag
      if (Array.isArray(category.subcategories)) {
        return category.subcategories.includes(subcategoryTag) ? subcategoryTag : subcategoryTag
      }
      return category.subcategories && typeof category.subcategories === 'object'
        ? (category.subcategories[subcategoryTag]?.name ?? subcategoryTag)
        : subcategoryTag
    }

    if (Array.isArray(categories)) {
      return categories.map((categoryTag) => (
        <Chip
          key={categoryTag}
          label={getCategoryName(categoryTag)}
          icon={<CategoryIcons category={categoryTag} />}
        />
      ))
    } else {
      return Object.entries(categories).flatMap(([categoryTag, subcategories]) => [
        <Chip
          key={categoryTag}
          label={getCategoryName(categoryTag)}
          icon={<CategoryIcons category={categoryTag} />}
        />,
        ...(Array.isArray(subcategories)
          ? subcategories.map((subTag) => (
            <Chip
              key={`${categoryTag}-${subTag}`}
              label={getSubcategoryName(categoryTag, subTag)}
              icon={<CategoryIcons category={subTag} />}
            />
          ))
          : [])
      ])
    }
  }, [categories])

  if (chips.length === 0) return null

  const maxChips = 2
  const visibleChips = all ? chips : chips.slice(0, maxChips)
  const remainingChips = chips.length - maxChips

  return (
    <Box className="`chipContainer ${className}`, ['flex-w', all]">
      {visibleChips}
      {remainingChips > 0 && !all && <Chip label={`+${remainingChips}`} />}
    </Box>
  )
}

export default CategoriesChips
