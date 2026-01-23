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
 * @file SelectedCategories.tsx
 * @copyright SKALE Labs 2024-Present
 */

import React from 'react'
import { Box } from '@mui/material'
import { X } from 'lucide-react'
import { categories } from '../../core/ecosystem/categories'

interface SelectedCategoriesProps {
  checkedItems: string[]
  setCheckedItems: (items: string[]) => void
  filteredAppsCount: number
}

const SelectedCategories: React.FC<SelectedCategoriesProps> = ({
  checkedItems,
  setCheckedItems,
  filteredAppsCount
}) => {

  const handleDelete = (itemToDelete: string) => {
    setCheckedItems(checkedItems.filter((item) => item !== itemToDelete))
  }

  const clearAll = () => {
    setCheckedItems([])
  }

  const getCategoryName = (key: string): string => categories[key]?.name || key

  const getSubcategoryName = (categoryKey: string, subcategoryKey: string): string => {
    const category = categories[categoryKey]
    if (
      category &&
      typeof category.subcategories === 'object' &&
      !Array.isArray(category.subcategories)
    ) {
      return category.subcategories[subcategoryKey]?.name || subcategoryKey
    }
    return subcategoryKey
  }

  if (checkedItems.length === 0) return null

  return (
    <Box className="flex items-center flex-wrap mb-2.5">
      {checkedItems.map((item) => {
        const [category, subcategory] = item.split('_')
        const categoryName = getCategoryName(category)
        const subcategoryName = subcategory ? getSubcategoryName(category, subcategory) : undefined
        const displayText = subcategoryName ? `${categoryName} → ${subcategoryName}` : categoryName

        return (
          <div
            key={item}
            className="chipSm bg-card text-foreground border border-border rounded-md flex items-center mr-2 mb-2 pl-3 pr-2 py-1"
          >
            <span className="text-sm font-medium mr-2">{displayText}</span>
            <button
              onClick={() => handleDelete(item)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        )
      })}
      <div className="chipSm bg-transparent flex items-center mr-2 mb-2 pl-3 pr-2 py-1">
        <span className="text-xs text-foreground">
          {filteredAppsCount} project{filteredAppsCount !== 1 ? 's' : ''}
        </span>
      </div>
      <div className="chipSm bg-transparent flex items-center mr-2 mb-2 pl-3 pr-2 py-1">
        <button
          className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer font-medium"
          onClick={clearAll}
        >
          Clear all
        </button>
      </div>
    </Box>
  )
}

export default SelectedCategories
