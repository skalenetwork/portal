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
import { Chip, Box } from '@mui/material'

import { categories } from '../../core/ecosystem/categories'
import { cls, cmn } from '@skalenetwork/metaport'

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

    return Object.entries(app.categories)
      .flatMap(([categoryTag, subcategories]) => [
        <Chip
          key={categoryTag}
          label={getCategoryName(categoryTag)}
          size="small"
          className={cls(cmn.p, cmn.p600)}
        />,
        ...(Array.isArray(subcategories)
          ? subcategories.map((subTag) => (
              <Chip
                className={cls(cmn.p, cmn.p600)}
                key={`${categoryTag}-${subTag}`}
                label={getSubcategoryName(categoryTag, subTag)}
                size="small"
              />
            ))
          : [])
      ])
      .slice(0, 3) // Limit to 3 chips // todo: remove restriction!
  }, [app.categories])

  if (chips.length === 0) return null

  return (
    <Box
      sx={{
        display: 'flex',
        overflowX: 'auto',
        whiteSpace: 'nowrap',
        '&::-webkit-scrollbar': {
          display: 'none'
        },
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        '& > *': {
          flex: '0 0 auto'
        },
        gap: 1
      }}
      className={className}
    >
      {chips}
    </Box>
  )
}

export default AppCategoriesChips
